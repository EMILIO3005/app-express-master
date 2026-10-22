const router = require('express').Router()
const c = require('../controllers/auth.controller')//Controlador controla permisos
const {verifyToken} = require('../middlewares')
const { loginLimiter } = require('../middlewares/rateLimit')


//¿En un login que verbo usar?
//POST (enviamos un paquete, proteccion)
router.post('/login', loginLimiter, c)
