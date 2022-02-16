
const { response } = require('express');

const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { generateJWT } = require('../helpers/jwt');

const getUsers = async (req, res) => {

  const users = await User.find({}, 'nombre apellidos email role google');

  res.json({
    ok: true,
    users
  })
}


const createUser = async (req, res = response) => {

  const { email, password, nombre, apellidos } = req.body;



  try {

    const existeEmail = await User.findOne({ email });

    if (existeEmail) {
      return res.status(400).json({
        ok: false,
        msg: 'El correo ya está registrado'
      })
    }
    const user = new User(req.body);

    //encriptar contraseña
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    // guardar usuario
    await user.save();
    // Generar el token - JWT
    const token = await generateJWT(user.id);

    res.json({
      ok: true,
      user,
      token
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado... revisar logs'
    })
  }
}


const updateUser = async (req, res = response) => {

  const uid = req.params.id;

  try {
    const userDB = await User.findById(uid);

    if (!userDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No existe un usuario por ese ID'
      });
    }

    const { password, google, email, ...campos } = req.body;

    if (userDB.email !== email) {
      const existeEmail = await User.findOne({ email });
      if (existeEmail) {
        return res.status(404).json({
          ok: false,
          msg: 'Ya existe un usuario con ese email'
        });
      }
    }

    campos.email = email;

    const userUpdated = await User.findByIdAndUpdate(uid, campos, { new: true });


    res.json({
      ok: true,
      userUpdated
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado... revisar logs'
    })
  }
}


const deleteUser = async (req, res = response) => {

  const uid = req.params.id;

  try {
    const userDB = await User.findById(uid);

    if (!userDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No existe un usuario por ese ID'
      });
    }

    await User.findByIdAndDelete(uid)
    res.json({
      ok: true,
      msg: 'Usuario eliminado'
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado... revisar logs'
    })
  }
}

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser
}