const db = require('../config/db')
const { httpError, requireFields, isEmail } = require('../utils')


//Crear una lista de campos obligatorios
//omitir los campos que son null
const camposRequeridos = ['apellidos', 'nombres', 'telefono','email', 'direccion']

//Evaluamos que el contenido de cada campo sea de tipo cadena
//map() : recorre toda la estructura o objeto

//(1) arreglo > (2)filter > (3)map > (4) operador ternario
//filter() :  retorna un arreglo que cumpla una condicion
const pick = (body) =>{
  Object.fromEntries(
    camposRequeridos.filter((key) => key in body).map(
      (key) => [key, typeof body[key] === 'string' ? body[key].trim() : body[key]] 
    )
  )
}

//Lista completa de personas
//SELECT * FROM Tablas
//GET BUSQUEDA  + WHERE condicion
exports.list = async(req,res) =>{
  res.json(
    await db('personas')
    .select("id", ...camposRequeridos)
    .orderBy("apellidos")
  )
}

//Buscar
exports.get = async(req,res) =>{
  const row = await db("personas").where({ id: req.params.id}).first()
  if(!row) throw httpError(404, 'Persona no encontrada')
  res.json(row)
}

//Registrar
exports.create = async(req,res) =>{
  requireFields(req.body, ["apellidos", "nombres", "email"])

  //Solo es posible vaildar el email si es obligatorio

  if (!isEmail(req.body.email)){
    throw httpError(400, "Email incorrecto")
  }


  //Insertar (validando que solo envias cadenas)
  const [id] = await db("personas").insert(pick(req.body))

  //Server code 201 - save OK
  res.status(201).json({ id, message: 'personas registradas'})
}

//Actualizar
exports.update = async(req,res) =>{
  requireFields(req.body, ["apellidos", "nombres", "email"])

  if (!isEmail(req.body.email)){
    throw httpError(400, "Email incorrecto")
  }

  //Actualizando

  const num =await db("personas")
    .where({ id: req.params.id})
    .update(pick(req.body))

  if (!num) throw httpError(404, "Persona no encontrada")

  res.json({ message: "Persona actualizada"})
}

//Eliminar
exports.remove = async(req,res) =>{
  const num = await db("personas")
    .where({ id: req.params.id})
    .del()
  if (!num) throw httpError(404, "Persona no encontrada")

  res.json({ message: "Persona eliminada"})
}


