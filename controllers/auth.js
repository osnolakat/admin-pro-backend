
const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { generateJWT } = require('../helpers/jwt');


const loginUser = async ( req, res = response ) => {

  const { email, password } = req.body; 
  try {

    
    const userDB = await User.findOne({ email });

    // verificar email
    if ( !userDB) {
      return  res.status(404).json({
        ok: false,
        msg: 'email no valido'
      });
    }
    
    // verificar contraseña
    const validPassword = bcrypt.compareSync(password, userDB.password );

    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: 'contraseña no encontra'
      });
    }

    // Generar el token - JWT
    const token = await generateJWT( userDB.id );

    res.json({
      ok: true,
      token
    })

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'hable con el administrador...'
    });

  }
}

module.exports = {
  loginUser
}