const express = require('express')
const router = express.Router()
const control = require('../Controllers/indexControllers')


router.get("/", control.prueba)
router.post("/registro", control.registro)
module.exports = router