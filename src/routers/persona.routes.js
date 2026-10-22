const router = require('express').Router()
const c = require('../controllers/persona.controller')



//Recuerda
//Las rutas requieren las funcionalidades de los controladores

router.get('/')
router.get('/:id')
router.post('/')
router.put('/:id')
router.delete('/:id')

module.exports = router