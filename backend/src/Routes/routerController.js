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
module.exports = router