require("dotenv").config()

//Modulos de aplicacion
const path = require('path')//Gestion de rutas
const express = require('express')//Framework backend
const helmet = require('helmet')//Seguridad - JWT (Json Web Token)
const cookieParser= require('cookie-parser')//

//Gestion de rutas
const routes= require('./routers')


const { apiLimiter } = require('./middlewares/rateLimit')
const { notFound, errorHandler } = require('./middlewares/errorHandler')


const app = express()
const isProd = process.env.NODE_ENV === 'produccion'// se evalua el tipo de entorno


//Proxys son mascaras de navegacion (Ngnix)
if (process.env.TRUST_PROXY)app.set('trust_proxy', Number(process.env.TRUST_PROXY))

//Configuracion de seguridad
//Cross-Site Scripting(XSS)
app.use(helmet({
  contentSecurityPolicy:{
    useDefaults: true,
    directives:{
      'defaultSrc': ["'self'"],
      'styleSrc': ["'self'", "https://cdn.jsdelivr.net/npm/bootstrap@6.0.0-alpha.1/dist/css/"],
      'scriptSrc': ["'self'", "https://cdn.jsdelivr.net/npm/bootstrap@6.0.0-alpha.1/dist/js/"],
      'connect-src': ["'self'", "https://cdn.jsdelivr.net/npm/bootstrap@6.0.0-alpha.1/dist/" ],
      'upgrade-insecure-request': isProd ? [] : null
    }
  }
}))


//CONFIGURANDO EXPRESS
app.use(express.json({limit: '10kb'})) //Tamaño maximo JSON
app.use(cookieParser())//leer cookie (configuracion)
app.use(express.static(path.join(__dirname, '..', 'public')))//Ruta frontend

app.use('/api', apiLimiter, routes)

//Ruta Raiza '/' localhost:3000
app.get('/', (req, res) => res.redirect('/index.html'))

//Manejamos rutas inexistentes
app.use('/api', notFound)
app.use(errorHandler)



//Exportamos el modulo
module.exports = app