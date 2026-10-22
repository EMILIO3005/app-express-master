//Validacion 1. ARAMETROS DE ENV
//Validacion por seguridad
const required = ['DB_HOST', 'DB_USER', 'DB_NAME', 'JWT_SECRET']


//Verificamos si una de las claves no existe o esta vacia
const missing = required.filter((key) => !process.env[key])

//Si no encontre una de las claves..
if (missing.length){
  console.error(`Faltan variables de entorno: ${ missing.join(',')}`)
  process.exit(1)
}


//Validacion 2. JWT SEGURO
//Para encriptar la comunicacion
const secret = process.env.JWT_SECRET

if (secret.length < 32 ){
  console.error('JSON_SECRET requiere una clave de 32 caracteres')
  process.exit(1)
}