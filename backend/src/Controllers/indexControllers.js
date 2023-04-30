const AWS = require('aws-sdk')
const mysql = require('mysql')
const md5 = require('blueimp-md5')
const CognitoUserAttribute = require('amazon-cognito-identity-js').CognitoUserAttribute
const CognitoUserPool = require('amazon-cognito-identity-js').CognitoUserPool
const AuthenticationDetails = require('amazon-cognito-identity-js').AuthenticationDetails
const CognitoUser = require('amazon-cognito-identity-js').CognitoUser

const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

const moment = require('moment-timezone');

const axios = require('axios')
const jwt = require('jsonwebtoken');

var dotenv = require("dotenv");
dotenv.config();

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
    host: process.env.MYSQL_HOSTNAME,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT,
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

exports.obtenerUsuario = async (req, res) => {
    const data = req.params;
    let correo_usr = "";

    jwt.verify(data.usuario, 'clave-secreta', (err, decodedToken) => {
        if (err) { //Verificando que no haya errores
            return res.jsonp({ Res: false })
        }
        // Obtener información del usuario del payload del token
        correo_usr = decodedToken.Correo;
    });

    try {
        let c = mysql.createConnection(config)
        c.connect(function (err) {
            if (err) {
                console.log(err)
                c.end()
                return res.jsonp({ Res: false })
            }
            c.query(`SELECT * FROM usuarios WHERE correo='${correo_usr}'`, async function (err, result, field) {
                if (err) {
                    console.log(err)
                    c.end()
                    return res.jsonp({ Res: false })
                }

                return res.jsonp({ Res: true, nombre_completo: result[0].nombre_completo, foto: result[0].foto })
            })

        })
    } catch (e) {
        console.log("e")
        console.log(e)
        res.jsonp({ Res: false })
    }
}

exports.crearPublicacion = async (req, res) => {
    const { descripcion, foto, usuario } = req.body
    let correo_usr = "";
    const datetime = moment().tz('America/Guatemala').format('YYYY-MM-DD HH:mm:ss');

    jwt.verify(usuario, 'clave-secreta', (err, decodedToken) => {
        if (err) { //Verificando que no haya errores
            return res.jsonp({ Res: false })
        }
        // Obtener información del usuario del payload del token
        correo_usr = decodedToken.Correo;
    });

    try {
        let c = mysql.createConnection(config)
        c.connect(function (err) {
            if (err) {
                console.log(err)
                c.end()
                return res.jsonp({ Res: false })
            }
            c.query(`SELECT id FROM usuarios WHERE correo='${correo_usr}'`, async function (err, result, field) {
                if (err) {
                    console.log(err)
                    c.end()
                    return res.jsonp({ Res: false })
                }

                let id_usuario = result[0].id //Obteniendo id del usuario que está haciendo la petición

                // subiendo la foto al bucket
                const nameFoto = `Publicaciones_${correo_usr}/${datetime}.jpg`
                const buf = new Buffer.from(foto, "base64")


                const params = {
                    Bucket: 'semi1proyecto-g8',
                    Key: nameFoto,
                    Body: buf,
                    ContentType: "image/jpeg",
                }
                await s3.upload(params).promise();


                // insertando informacion a la base de datos
                c.query(`INSERT INTO publicaciones (descripcion, foto, fechahora, usuarios_id)
                VALUES('${descripcion}', 'https://semi1proyecto-g8.s3.amazonaws.com/${nameFoto}',
                '${datetime}','${id_usuario}');`, function (err, result, field) {
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

exports.crearComentario = async (req, res) => {
    const { id, descripcion, nombre, foto } = req.body
    const datetime = moment().tz('America/Guatemala').format('YYYY-MM-DD HH:mm:ss');

    try {
        let c = mysql.createConnection(config)
        c.connect(function (err) {
            if (err) {
                console.log(err)
                c.end()
                return res.jsonp({ Res: false })
            }
            console.log("¡A");
            // insertando informacion a la base de datos
            c.query(`INSERT INTO comentarios (nombre_usuario, publicaciones_id, descripcion, fechahora, foto)
            VALUES('${nombre}', '${id}', '${descripcion}','${datetime}','${foto}')`, function (err, result, field) {
                if (err) {
                    console.log(err)
                    c.end()
                    return res.jsonp({ Res: false })
                }
                c.end()
                return res.jsonp({ Res: true })
            })

        })
    } catch (e) {
        console.log("e")
        console.log(e)
        res.jsonp({ Res: false })
    }

}

exports.obtenerPublicaciones = async (req, res) => {
    const data = req.params;
    let correo_usr = "";

    jwt.verify(data.usuario, 'clave-secreta', (err, decodedToken) => {
        if (err) { //Verificando que no haya errores
            return res.jsonp({ Res: false })
        }
        // Obtener información del usuario del payload del token
        correo_usr = decodedToken.Correo;
    });

    try {
        let c = mysql.createConnection(config)
        c.connect(function (err) {
            if (err) {
                console.log(err)
                c.end()
                return res.jsonp({ Res: false })
            }

            c.query(`SELECT p.id as pub_id, descripcion, p.foto as pub_foto, fechahora, usuarios_id, u.id as usr_id, nombre_completo, u.foto as usr_foto FROM publicaciones p INNER JOIN usuarios u on p.usuarios_id = u.id`, async function (err, result, field) {
                if (err) {
                    console.log(err)
                    c.end()
                    return res.jsonp({ Res: false })
                }

                publicaciones = []

                result.forEach(element => {
                    publicacion = {
                        id_pub: element.pub_id,
                        foto_pub: element.pub_foto,
                        descripcion: element.descripcion,
                        fechahora: element.fechahora,
                        nombre_usr: element.nombre_completo,
                        id_usr: element.usr_id,
                        foto_usr: element.usr_foto,
                        coment: "",
                    }

                    publicaciones.push(publicacion)
                });
                return res.jsonp({ Res: true, publicaciones: publicaciones })
            })

        })
    } catch (e) {
        console.log("e")
        console.log(e)
        res.jsonp({ Res: false })
    }

}

exports.obtenerComentarios = async (req, res) => {
    const data = req.params;

    try {
        let c = mysql.createConnection(config)
        c.connect(function (err) {
            if (err) {
                console.log(err)
                c.end()
                return res.jsonp({ Res: false })
            }

            comentarios = []
            c.query(`SELECT * FROM comentarios WHERE publicaciones_id = ${data.publicacion}`, async function (err, result, field) {
                if (err) {
                    console.log(err)
                    c.end()
                    return res.jsonp({ Res: false })
                }

                return res.jsonp({ Res: true, comentarios: result })
            })

        })
    } catch (e) {
        console.log("e")
        console.log(e)
        res.jsonp({ Res: false })
    }

}

exports.traducir = async (req, res) => {
    const { descripcion, id, idioma } = req.body

    try {
        const params2 = {
            SourceLanguageCode: 'auto',
            TargetLanguageCode: idioma,
            Text: descripcion
        }
        translate.translateText(params2, (err2, data2) => {
            cadena = ""
            if (err2) {
                cadena += `${descripcion}`;
            } else {
                cadena += `${data2.TranslatedText}`;
            }
            console.log(cadena)
            res.jsonp({ Res: true, descripcion: cadena })
        })
    } catch (e) {
        console.log("e")
        console.log(e)
        res.jsonp({ Res: false })
    }

}


exports.obtenerUsuario2 = async (req, res) => {
    const data = req.params;
    let correo_usr = "";

    jwt.verify(data.usuario, 'clave-secreta', (err, decodedToken) => {
        if (err) { //Verificando que no haya errores
            return res.jsonp({ Res: false })
        }
        // Obtener información del usuario del payload del token
        correo_usr = decodedToken.Correo;
    });

    try {
        let c = mysql.createConnection(config)
        c.connect(function (err) {
            if (err) {
                console.log(err)
                c.end()
                return res.jsonp({ Res: false })
            }
            c.query(`SELECT * FROM usuarios WHERE correo='${correo_usr}'`, async function (err, result, field) {
                if (err) {
                    console.log(err)
                    c.end()
                    return res.jsonp({ Res: false })
                }

                return res.jsonp({ Res: true, correo: result[0].correo, nombre: result[0].nombre_completo, dpi: result[0].dpi, foto: result[0].foto })
            })

        })
    } catch (e) {
        console.log("e")
        console.log(e)
        res.jsonp({ Res: false })
    }


}

exports.EditarUsuario = async (req, res) => {
    const { Correo, Pass, Nombre, Dpi, Foto } = req.body
    let correo_usr = "";

    jwt.verify(Correo, 'clave-secreta', (err, decodedToken) => {
        if (err) { //Verificando que no haya errores
            return res.jsonp({ Res: false })
        }
        // Obtener información del usuario del payload del token
        correo_usr = decodedToken.Correo;
    });

    try {
        //verificamos la password
        let c = mysql.createConnection(config)
        c.connect(function (err) {
            if (err) {
                console.log(err)
                c.end()
                return res.jsonp({ Res: false })
            }
            c.query(`SELECT * FROM usuarios WHERE correo='${correo_usr}' AND password='${md5(Pass)}'`, async function (err, result, field) {
                if (err) {
                    console.log(err)
                    c.end()
                    return res.jsonp({ Res: false })
                }
                if (result.length != 1) {
                    console.log("Invalid Password")
                    c.end()
                    return res.jsonp({ Res: false })
                }

                // actualizamos primero en cognito
                // loggeamos primero al usuario y luego actualizamos sus datos

                const loginData = {
                    Username: correo_usr,
                    Pool: cognito
                }
                const cognitoUserLogin = new CognitoUser(loginData)
                const detalleAutenticacion = new AuthenticationDetails({
                    Username: correo_usr,
                    Password: md5(Pass)
                })

                await cognitoUserLogin.authenticateUser(detalleAutenticacion, {
                    onFailure: (err) => {
                        console.log("autenticacion")
                        console.log(err)
                        c.end()
                        return res.jsonp({ Res: false })
                    },
                    onSuccess: async (result) => {
                        const accessToken = result.getAccessToken();

                        const attributeList = []

                        const dataName = {
                            Name: 'name',
                            Value: Nombre
                        }
                        attributeList.push(new CognitoUserAttribute(dataName))

                        const newDPI = {
                            Name: 'custom:dpi',
                            Value: Dpi
                        }
                        attributeList.push(new CognitoUserAttribute(newDPI))
                        const params = {
                            AccessToken: accessToken,
                            UserAttributes: attributeList,
                        }

                        await cognitoUserLogin.updateAttributes(attributeList, async function (err, data) {
                            if (err) {
                                console.log("actualizacion")
                                console.log(err)
                                c.end()
                                return res.jsonp({ Res: false })
                            }
                            console.log("data")
                            console.log(data)
                            // actualizacion s3
                            if (!Foto.includes("http")) {
                                const nameFoto = `Fotos_Perfil/${correo_usr}.jpg`
                                const buf = new Buffer.from(Foto, "base64")

                                const params2 = {
                                    Bucket: 'semi1proyecto-g8',
                                    Key: nameFoto,
                                    Body: buf,
                                    ContentType: "image/jpeg",
                                }
                                await s3.upload(params2).promise();
                            }


                            // actualizar db
                            c.query(`UPDATE usuarios SET nombre_completo='${Nombre}', dpi='${Dpi}' WHERE correo='${correo_usr}';`, async function (err, result, field) {
                                if (err) {
                                    console.log(err)
                                    c.end()
                                    return res.jsonp({ Res: false })
                                }
                                return res.jsonp({ Res: true })
                            }
                            )
                        })
                    }
                }
                )




            })

        })

    } catch (e) {
        console.log("e")
        console.log(e)
        res.jsonp({ Res: false })
    }
}

exports.addfriend = async (req, res) => {
    const data = req.body;
    let correo_usr = "";
    let correo_amigo_usr = "";

    jwt.verify(data.usuario, 'clave-secreta', (err, decodedToken) => {
        if (err) { //Verificando que no haya errores
            console.log("hubo un error en la decodificacion")
            return res.jsonp({ Res: false })
        }
        // Obtener información del usuario del payload del token
        correo_usr = decodedToken.Correo;
        correo_amigo_usr = decodedToken.Correo_amigo;
    });
    console.log(correo_usr, correo_amigo_usr)
    try {
        let c = mysql.createConnection(config)
        c.connect(function (err) {
            if (err) {
                console.log(err)
                c.end()
                return res.jsonp({ Res: false })
            }
            c.query(`SELECT * from usuarios WHERE correo ='${correo_usr}' OR correo ='${correo_amigo_usr}';`, async function (err, result, field) {
            
                if (err) {
                    console.log(err)
                    c.end()
                    return res.jsonp({ Res: false })
                }

                console.log(result)

                if (result.length != 2) {
                    console.log("no existe alguno de los usuarios")
                    c.end()
                    return res.jsonp({ Res: false })
                }else{
                    let id_usr;
                    let id_amigo_usr;
                    for (let i = 0; i < result.length; i++) {
                        const element = result[i];
                        if(element.correo == correo_usr){
                            id_usr = element.id;
                        }
                        if(element.correo == correo_amigo_usr){
                            id_amigo_usr = element.id;
                        }
                    }
                
                    c.query(`SELECT * FROM amigos WHERE (id = ${id_usr} AND usuarios_id = ${id_amigo_usr}) OR (id = ${id_amigo_usr} AND usuarios_id =  ${id_usr});`, async function (err, result, field) {
                        if (err) {
                            console.log(err)
                            c.end()
                            return res.jsonp({ Res: false })
                        }
                        if (result.length != 0) {
                            console.log("ya son amigos")
                            c.end()
                            return res.jsonp({ Res: false })
                        }else{
                            console.log(result)
                            c.query(`INSERT INTO amigos(id, state, usuarios_id) VALUES('${id_usr}',0,'${id_amigo_usr}');`, async function (err, result, field) {
                                if (err) {
                                    console.log(err)
                                    c.end()
                                    return res.jsonp({ Res: false })
                                }
                
                                return res.jsonp({ Res: true })
                            })
                        }
                    })
                }
            }) 
        })
    } catch (e) {
        console.log("e")
        console.log(e)
        res.jsonp({ Res: false })
    }
}

exports.getfriends = async (req, res) => {
    const data = req.params;
    let correo_usr = "";    

    jwt.verify(data.usuario, 'clave-secreta', (err, decodedToken) => {
        if (err) { //Verificando que no haya errores
            console.log("hubo un error en la decodificacion")
            return res.jsonp({ Res: false })
        }
        // Obtener información del usuario del payload del token
        correo_usr = decodedToken.Correo;
    });
    try {
        let c = mysql.createConnection(config)
        c.connect(function (err) {
            if (err) {
                console.log(err)
                c.end()
                return res.jsonp({ Res: false })
            }
            c.query(`SELECT * from usuarios WHERE correo ='${correo_usr}';`, async function (err, result, field) {
            
                if (err) {
                    console.log(err)
                    c.end()
                    return res.jsonp({ Res: false })
                }

                
                let id_usr = result[0].id;

                
                c.query(`SELECT amigos.id as id1, us.nombre_completo as nombre1, u.dpi as dpi1, u.foto as foto1, u.correo as correo1, amigos.state, amigos.usuarios_id as id2, u.nombre_completo as nombre2, u.dpi as dpi2, u.foto as foto2, u.correo as correo2 
                FROM ((amigos inner join usuarios as us on us.id = amigos.id ) inner join usuarios as u on u.id = amigos.usuarios_id)
                WHERE amigos.usuarios_id = ${id_usr} OR amigos.id = ${id_usr} `, async function (err, result, field) {
                    if (err) {
                        console.log(err)
                        c.end()
                        return res.jsonp({ Res: false })
                    }

                    //console.log(result)
                    lista = []
                    for (let i = 0; i < result.length; i++) {
                        const element = result[i];
                        if(element.id1 == id_usr){
                            lista.push({id: element.id1, nombre: element.nombre1, dpi: element.dpi1, foto: element.foto1, correo: element.correo1, state: element.state})
                        }else if(element.id2 == id_usr){
                            lista.push({id: element.id2, nombre: element.nombre2, dpi: element.dpi2, foto: element.foto2, correo: element.correo2, state: element.state})
                        }
                    }

                    return res.jsonp({ Res: true, amigos: lista })
                })
                
            })
        })
    } catch (e) {
        console.log("e")
        console.log(e)
        res.jsonp({ Res: false })
    }
}

exports.getallusers = async (req, res) => {
    const data = req.params;
    let correo = "";

    jwt.verify(data.usuario, 'clave-secreta', (err, decodedToken) => {
        if (err) { //Verificando que no haya errores
            console.log("hubo un error en la decodificacion")
            return res.jsonp({ Res: false })
        }
        // Obtener información del usuario del payload del token
        correo = decodedToken.Correo;
    });

    try {
        let c = mysql.createConnection(config)
        c.connect(function (err) {
            if (err) {
                console.log(err)
                c.end()
                return res.jsonp({ Res: false })
            }
            c.query(`SELECT id, nombre_completo, dpi, foto, correo FROM usuarios WHERE correo != '${correo}'`, async function (err, result, field) {
                if (err) {
                    console.log(err)
                    c.end()
                    return res.jsonp({ Res: false })
                }
                
                return res.jsonp({ Res: true, usuarios: result })
            })

        })
    } catch (e) {
        console.log("e")
        console.log(e)
        res.jsonp({ Res: false })
    }
}

exports.updatestateFriend = async (req, res) => {
    const data = req.params;
    let correo_usr = "";
    let correo_amigo_usr = "";

    jwt.verify(data.usuario, 'clave-secreta', (err, decodedToken) => {
        if (err) { //Verificando que no haya errores
            console.log("hubo un error en la decodificacion")
            return res.jsonp({ Res: false })
        }
        // Obtener información del usuario del payload del token
        correo_usr = decodedToken.Correo_amigo;
        correo_amigo_usr = decodedToken.Correo;
    });

    try {
        let c = mysql.createConnection(config)
        c.connect(function (err) {
            if (err) {
                console.log(err)
                c.end()
                return res.jsonp({ Res: false })
            }
            c.query(`SELECT * from usuarios WHERE correo ='${correo_usr}' OR correo ='${correo_amigo_usr}';`, async function (err, result, field) {
            
                if (err) {
                    console.log(err)
                    c.end()
                    return res.jsonp({ Res: false })
                }

                console.log(result)

                if (result.length != 2) {
                    console.log("no existe alguno de los usuarios")
                    c.end()
                    return res.jsonp({ Res: false })
                }else{
                    let id_usr;
                    let id_amigo_usr;
                    for (let i = 0; i < result.length; i++) {
                        const element = result[i];
                        if(element.correo == correo_usr){
                            id_usr = element.id;
                        }
                        if(element.correo == correo_amigo_usr){
                            id_amigo_usr = element.id;
                        }
                    }
    
                    
                    c.query(`UPDATE amigos
                    SET state = 1
                    WHERE amigos.id = ${id_usr} and amigos.usuarios_id = ${id_amigo_usr};`, async function (err, result, field) {
                        if (err) {
                            console.log(err)
                            c.end()
                            return res.jsonp({ Res: false })
                        }
    
                        //console.log(result)
    
                        return res.jsonp({ Res: true })
                    })
                }
                            
                
            })
        })
    } catch (e) {
        console.log("e")
        console.log(e)
        res.jsonp({ Res: false })
    }
}
