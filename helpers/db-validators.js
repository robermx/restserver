const Role = require('../models/role');
const User = require('../models/user');

const isRolValid = async (rol) => {
  const existRol = await Role.findOne({ rol });
  if (!existRol) {
    throw new Error(`El roll ${rol} no esta registrado`);
  }
};

const emailExist = async (email) => {
  // Verificar si el correo existe
  const existEmail = await User.findOne({ email });
  if (existEmail) {
    throw new Error(`El email: ${email} ya esta registrado`);
  }
};

const existUserById = async (id) => {
  // Verificar si el correo existe
  const existUser = await User.findById(id);
  if (!existUser) {
    throw new Error(`El id: ${id} no existe`);
  }
};

module.exports = {
  isRolValid,
  emailExist,
  existUserById,
};
