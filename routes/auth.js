
/*
 Rutas: /api/login
*/

const { Router } = require('express');
const { loginUser } = require('../controllers/auth'); 
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.post( '/', 
  [
    check('email', 'El correo es obligatorio').isEmail(),
    check('password', 'La clave es obligatoria').not().isEmpty(),    
    validarCampos
  ], 
  loginUser
  )

module.exports = router;