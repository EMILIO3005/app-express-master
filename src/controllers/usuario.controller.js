const bcrypt = require("bcryptjs")
const db = require("../config/db")
const { httpError, requireFields, checkCredentials } = require("../utils")


//Perfiles o roles de usuarios
const NIVELES = ["ADMIN", "USUARIO"]

const baseQuery = () => {
  db("usuarios as u").join("personas as p", "p.id", "u.idpersona").select(
    "u.id",
    "u.idpersona",
    "u.nombre_usuario",
    "u.nivle_acceso",
    "u.estado",
    "p.apellidos",
    "p.nombres"
  )
}

//Verificar nivel (asegurar que solo sea un perfil de la lista)
const checkNivel = (nivel) => {
  
  //Si la variable no esta definida AND no encontre en el arreglo
  if (nivel !== undefined && !NIVELES.includes(nivel)){
    throw httpError(400, `Nivel de acceso incorrecto`)
  }
}
//Listar
exports.list = async (req, res) => {
  res.json(await baseQuery().orderBy("u.id"))
}

//Buscar
exports.get = async (req, res) => {
  const row = await baseQuery().where("ud.id", req.params.id).first()
  if (!row) throw httpError(404, "Usuario no existe")
    res.json(row)
}

//Registrar
exports.create = async (req, res) => {
  requireFields(req.body, ["idpersona", "nombre_usuario", "clave_acceso"])

  const {idpersona, nombre_usuario, clave_acceso, nivel_acceso, estado} = req.body

  //Verificar que el nivel sea correcto
  checkNivel(nivel_acceso)


  //Verificar credencial
  checkCredentials(req.body, { claveObligatoria: true })

  await db("usuarios").insert({
    idpersona,
    nombre_usuario,
    nivel_acceso,
    estado,
    clave_acceso: await bcrypt.hash(clave_acceso, 10)
  })
  res.status(201).json({ id, message: 'Usuario creado'})
}

//Actualizar
exports.update = async (req, res) => {
  requireFields(req.body, ["idpersona", "nombre_usuario"])

  //Deserializacion
  const { idpersona, nombre_usuario, clave_acceso, nivel_acceso, estado} = req.body


  //Validacion nivle de acceso
  checkNivel(nivel_acceso)
  checkCredentials(req.body, { claveObligatoria: false})

  //idpersona FK .... los otros campos se validan en la sigiente linea
  const data = { idpersona, nombre_usuario}

  //Actualizando el objeto data con el nivel de acceso que ingresa
  if (nivel_acceso){ data.nivel_acceso = nivel_acceso}
  if (estado !== undefined) {data.estado = estado}
  if (clave_acceso) { data .clave_acceso = await bcrypt.hash(clave_acceso, 10) }

  //Por que req.params??
  //El ID viene en la URL => http://localhost:300/api/usuarios/5
  const num = await db("usuarios").where({ id: req.params.id}).update(data)

  if (!num) { throw httpError(404, 'Usuario no existe')}
  res.json({ message: 'Usuario actualizado' })
}


//NOTA: Verifique las politicas de seguridad y reglas de negocio
//Eliminar
exports.remove = async (req, res) => {
  //Esposible eliminar tu usuario?
  // SI - NO[X]

  if (Number(req.params.id) === req.user.id){
    throw httpError(400, "No puedes eliminar tu propio usuario")
  }

  const num =await db("usuarios")
    .where({ id: req.params.id })
    .del()
  
  if (!num) throw httpError(404, "Usuario no existe")
    res.json({ message: 'Usuario eliminado'})
}