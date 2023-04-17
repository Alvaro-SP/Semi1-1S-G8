const AWS = require('aws-sdk')

const s3 = new AWS.S3({
    accessKeyId: '',
    secretAccessKey: '',
    region: ''
})


exports.prueba = async (req, res) => {
    res.send({ "Saludos": "Funciona la api" })
}
