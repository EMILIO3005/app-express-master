const rateLimit = require('express-rate-limit')

//Estas funciones controlaran la cantidad de intentos y trafico en nuestra app
//En loclahost siempre funciona
//"con 1 usuario nunca hubo problemas"


//Flujo de login
exports.loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, //Tiempo en milisegundos
  limit: 10, //intentos por IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Demasiados intentos, verifique en unos minutos'}
})


//Flujo de solicitudes (usuarios que se conectan a la app)
exports.apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Demasiados solicitudes, '}
})