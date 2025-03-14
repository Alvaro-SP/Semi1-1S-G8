const express = require('express')
const router = express.Router()
const control = require('../Controllers/indexControllers')


router.get("/", control.prueba)
router.post("/registro", control.registro)
router.post("/login", control.login)
router.post("/crearPublicacion", control.crearPublicacion)
router.get("/obtenerUsuario/:usuario", control.obtenerUsuario)
router.get("/obtenerPublicaciones/:usuario", control.obtenerPublicaciones)
router.post("/crearComentario", control.crearComentario)
router.get("/obtenerComentarios/:publicacion", control.obtenerComentarios)
router.post("/traducir", control.traducir)
router.get("/obtenerUsuario2/:usuario", control.obtenerUsuario2)
router.put("/actualizarPerfil", control.EditarUsuario)

router.post("/addfriend", control.addfriend)
router.get("/getfriends/:usuario", control.getfriends)
router.get("/getallusers/:usuario", control.getallusers)
router.post("/aceptarAmigo", control.updatestateFriend)
router.post("/sendmessageBot/:message", control.sendmessage)
router.post("/sendmessageBot", control.sendmessage)
router.get("/getsolicitudes/:usuario", control.getsolicitudes)
module.exports = router