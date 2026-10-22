const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../config/db')


const { httpError, requireFields } = require('../utils')

//Configuracion de cookies
const cookiesOpts = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production'

}

//HASH Temporal para evaluar la contraseña
const DUMMY_HASH = bcrypt.hashSync('dummy-password', 10)



//exports.metodo = async () => {}
exports.login = async (req, res) => {
  //Validacion
  requireFields(req.body, ['nombre_usuario', 'clave_acceso'])
  //Deserealizacion
  const { nombre_usuario, clave_acceso } = req.body


  //Validar el tipo de datos
  if (typeof nombre_usuario !== 'string' || typeof clave_acceso !== 'string'){
    throw httpError(400, 'Datos no son correctos')
  }

  //Buscamos al usuario con el nombre...
  const user = await db('usuarios').where({ nombre_usuario }).first()

  //EVALUAMOS SI LA CLAVE ES CORRECTA
  const valid = await bcrypt.compare(clave_acceso, user ? user.clave_acceso : DUMMY_HASH)

  //Sino existe el usuario OR si existe un estado (false) OR si la clave es incorrecta
  if (!user || !user.estado || !valid){
    //401 => no autorizado
    throw httpError(401, 'usuario o contraseña incorrecta')
  }

  //Si llegaste hasta aqui - WELCOME
  //Habilitamos un permiso JWT
  const token = jwt.sign({
    id: user.id,
    nombre_usuario: user.nombre_usuario,
    nivel_acceso: user.nivel_acceso
  }, process.env.JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: process.env.JWT_EXPIRES_IN || '8h'
  })

  res.cookie('token', token, cookiesOpts).json({message: 'Bienvenido'})
}