/*
 Rutas: /api/users
*/
const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');

const { getUsers, createUser, updateUser, deleteUser } = require('../controllers/users');
const { validarJWT } = require('../middlewares/validar-jwt');


const router = Router();

router.get('/', validarJWT ,getUsers);

router.post('/',
  [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('apellidos', 'los apellidos son obligatorio').not().isEmpty(),
    check('password', 'La clave es obligatoria').not().isEmpty(),
    check('email', 'El correo es obligatorio').isEmail(),
    validarCampos
  ],
  createUser
);

router.put('/:id',
  [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('apellidos', 'los apellidos son obligatorio').not().isEmpty(),    
    check('email', 'El correo es obligatorio').isEmail(),
    check('role', 'El rol es obligatorio').not().isEmpty(),
    validarCampos,    
  ],
   updateUser
   );

router.delete('/:id',
    validarJWT, 
    deleteUser
    );

module.exports = router;