//TODO: ver qué tan necesaria es esta linea de código.
// const { request, response } = require('express');

// Encriptar password
const bcryptjs = require('bcryptjs');
// Require user model
const User = require('../models/user');

// Crear usuario
const usersPost = async (req, res) => {
  // Desestructurar las variables que son requeridas
  const { nombre, email, password, rol } = req.body;
  const user = new User({ nombre, email, password, rol });

  // Encriptar la contraseña
  const salt = bcryptjs.genSaltSync();
  user.password = bcryptjs.hashSync(password, salt);

  // Guardar en base de datos
  await user.save();

  // Enviar una respuesta de tipo JSON a user
  res.json({
    user,
  });
};

// Actualizar Usuario
const usersPut = async (req, res) => {
  const { id } = req.params;
  const { _id, password, google, email, ...rest } = req.body;
  // TODO: validar contra base de datos
  if (password) {
    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    rest.password = bcryptjs.hashSync(password, salt);
  }
  const user = await User.findByIdAndUpdate(id, rest, { new: true });
  res.json(user);
};

// Obtener Usuario
const usersGet = async (req, res) => {
  const { limit = 5, since = 0 } = req.query;
  const query = { estado: true };

  const [totalUsers, getUsers] = await Promise.all([
    User.countDocuments(query),
    User.find(query).limit(Number(limit)).skip(Number(since)),
  ]);
  res.json({
    totalUsers,
    getUsers,
  });
};

// Borrar Usuario
const usersDelete = async (req, res) => {
  const { id } = req.params;

  // Borrarlo definitivamente de la base de datos
  // const userDelete = await User.findByIdAndDelete(id);

  // Usuario no Activo
  const userInactive = await User.findByIdAndUpdate(id, {
    estado: false,
  });

  res.json(userInactive);
};

const usersPatch = (req, res) => {
  res.json({
    msg: 'patch API - controller',
  });
};

module.exports = {
  usersGet,
  usersPost,
  usersPut,
  usersPatch,
  usersDelete,
};
