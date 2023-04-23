const AWS = require('aws-sdk')
const mysql = require('mysql')
const md5 = require('blueimp-md5')
const CognitoUserAttribute = require('amazon-cognito-identity-js').CognitoUserAttribute
const CognitoUserPool = require('amazon-cognito-identity-js').CognitoUserPool
const AuthenticationDetails = require('amazon-cognito-identity-js').AuthenticationDetails
const CognitoUser = require('amazon-cognito-identity-js').CognitoUser

const axios = require('axios')
const jwt = require('jsonwebtoken');

const s3 = new AWS.S3({
    accessKeyId: 'AKIA3YXREBXTHSMUIZHY',
    secretAccessKey: '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',
    region: 'us-east-1'
})

var rekognition = new AWS.Rekognition({
    region: 'us-east-1',
    accessKeyId: 'AKIA3YXREBXTFXXW4WX6',
    secretAccessKey: '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'
})

var translate = new AWS.Translate({
    region: 'us-east-1',
    accessKeyId: 'AKIA3YXREBXTAZHZZNWQ',
    secretAccessKey: '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'
})

const config = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mydb'
}

const cognito = new CognitoUserPool({ UserPoolId: 'us-east-1_TTQyzQZ4r', ClientId: '2eijqb5qm6eu3m9bu2ui3rt944' })

exports.prueba = async (req, res) => {
    res.send({ "Saludos": "Funciona la api" })
}

exports.registro = async (req, res) => {
    const { Nombre, Correo, Dpi, Password, Foto } = req.body
    try {
        let c = mysql.createConnection(config)
        c.connect(function (err) {
            if (err) {
                console.log(err)
                c.end()
                return res.jsonp({ Res: false })
            }
            c.query(`SELECT * FROM usuarios WHERE correo='${Correo}'`, async function (err, result, field) {
                if (err || result.length >= 1) {
                    console.log(err)
                    console.log(result)
                    c.end()
                    return res.jsonp({ Res: false })
                }

                // subiendo la foto al bucket
                const nameFoto = `Fotos_Perfil/${Correo}.jpg`
                const buf = new Buffer.from(Foto, "base64")

                const params = {
                    Bucket: 'semi1proyecto-g8',
                    Key: nameFoto,
                    Body: buf,
                    ContentType: "image/jpeg",
                }
                await s3.upload(params).promise();

                // insertando informacion a cognito
                const attributeList = []

                const dataName = {
                    Name: 'name',
                    Value: Nombre
                }
                attributeList.push(new CognitoUserAttribute(dataName))

                const dataEmail = {
                    Name: 'email',
                    Value: Correo
                }
                attributeList.push(new CognitoUserAttribute(dataEmail))

                const dataDpi = {
                    Name: 'custom:dpi',
                    Value: Dpi
                }
                attributeList.push(new CognitoUserAttribute(dataDpi))

                const username = Correo

                cognito.signUp(
                    username,
                    md5(Password),
                    attributeList,
                    null,
                    (err, data) => {
                        if (err) {
                            console.log(err)
                            c.end()
                            return res.jsonp({ Res: false })
                        }

                    }
                )

                // insertando informacion a la base de datos
                c.query(`INSERT INTO usuarios (nombre_completo, dpi, foto, password, correo)
                VALUES('${Nombre}', '${Dpi}', 'https://semi1proyecto-g8.s3.amazonaws.com/${nameFoto}',
                '${md5(Password)}','${Correo}');`, function (err, result, field) {
                    if (err) {
                        console.log(err)
                        c.end()
                        return res.jsonp({ Res: false })
                    }
                    c.end()
                    return res.jsonp({ Res: true })
                })
            })

        })
    } catch (e) {
        console.log("e")
        console.log(e)
        res.jsonp({ Res: false })
    }

}

exports.login = async (req, res) => {
    const { Correo, Password, Foto } = req.body
    //console.log(req.body)
    try {
        let c = mysql.createConnection(config)

        //loggeo con foto
        if (Foto != '') {
            c.connect(function (err) {
                if (err) {
                    console.log(err)
                    c.end()
                    return res.jsonp({ Res: false })
                }
                c.query(`SELECT foto FROM usuarios WHERE correo='${Correo}';`, async function (err, result, field) {
                    console.log("result")
                    console.log(result)
                    if (err || result.length != 1) {
                        console.log(err)
                        c.end()
                        return res.jsonp({ Res: false })
                    }


                    const r = await axios.get(result[0].foto, {
                        responseType: 'arraybuffer'
                    })


                    const params = {
                        SourceImage: {
                            Bytes: Buffer.from(r.data, 'base64')
                        },
                        TargetImage: {
                            Bytes: Buffer.from(Foto, 'base64')
                        },
                        SimilarityThreshold: 80,
                    }

                    rekognition.compareFaces(params, (err, data) => {

                        if (err) {
                            console.log(err)
                            c.end()
                            return res.jsonp({ Res: false })
                        }
                        if (!data.FaceMatches.length > 0) {
                            c.end()
                            return res.jsonp({ Res: false })
                        }
                        const token = jwt.sign({ Correo }, 'clave-secreta', { expiresIn: '1h' })
                        c.end()
                        return res.jsonp({ Res: true, token: token })
                    })
                })
            })



        }
        // por usuario y contraseña con cognito
        else {
            const userData = {
                Username: Correo,
                Pool: cognito
            }

            const cognitoUser = new CognitoUser(userData)

            const authenticationDetails = new AuthenticationDetails({
                Username: Correo,
                Password: md5(Password)
            })
            console.log(authenticationDetails)

            cognitoUser.authenticateUser(authenticationDetails, {
                onSuccess: (result) => {
                    const token = jwt.sign({ Correo }, 'clave-secreta', { expiresIn: '1h' })
                    c.end()
                    return res.jsonp({ Res: true, token: token })
                },
                onFailure: (err) => {
                    console.log("on failure")
                    console.log(err)
                    c.end()
                    return res.jsonp({ Res: false })
                }
            })
        }


    } catch (e) {
        console.log(e)
        res.jsonp({ Res: false })
    }


}