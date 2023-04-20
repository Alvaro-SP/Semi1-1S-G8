const AWS = require('aws-sdk')
const mysql = require('mysql')
const md5 = require('blueimp-md5')
const CognitoUserAttribute = require('amazon-cognito-identity-js').CognitoUserAttribute
const CognitoUserPool = require('amazon-cognito-identity-js').CognitoUserPool


const s3 = new AWS.S3({
    accessKeyId: 'AKIA3YXREBXTHSMUIZHY',
    secretAccessKey: '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',
    region: 'us-east-1'
})

const config = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mydb'
}

const cognito = new CognitoUserPool({ UserPoolId: 'us-east-1_O4WomaE8L', ClientId: '7otvscg8nquuu00dee223vvlvg' })

exports.prueba = async (req, res) => {
    res.send({ "Saludos": "Funciona la api" })
}

exports.registro = async (req, res) => {
    const { Usuario, Nombre, Correo, Dpi, Password, Foto } = req.body
    try {
        let c = mysql.createConnection(config)
        c.connect(function (err) {
            if (err) {
                console.log(err)
                c.end()
                return res.jsonp({ Res: false })
            }
            c.query(`SELECT * FROM usuarios WHERE usuario='${Usuario}'`, async function (err, result, field) {
                if (err || result.length >= 1) {
                    console.log(err)
                    console.log(result)
                    c.end()
                    return res.jsonp({ Res: false })
                }

                // subiendo la foto al bucket
                const nameFoto = `Fotos_Perfil/${Usuario}.jpg`
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

                cognito.signUp(
                    Usuario,
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
                c.query(`INSERT INTO usuarios (usuario, nombre_completo, dpi, foto, password, correo)
                VALUES('${Usuario}', '${Nombre}', '${Dpi}', 'https://semi1proyecto-g8.s3.amazonaws.com/${nameFoto}',
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
        console.log(e)
        res.jsonp({ Res: false })
    }

}