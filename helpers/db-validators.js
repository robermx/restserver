const Roll = require('../models/roll');
const { User, Category, Product } = require('../models');

const isRollValid = async (rol) => {
  const existRoll = await Roll.findOne({ rol });
  if (!existRoll) {
    throw new Error(`El rol ${rol} no esta registrado`);
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
  // Verificar si el id existe
  const existUser = await User.findById(id);
  if (!existUser) {
    throw new Error(`El id: ${id} no existe`);
  }
};

// Validar categorías
const categoryExistById = async (id) => {
  const categoryExist = await Category.findById(id);
  if (!categoryExist) {
    throw new Error(`El id: ${id} no existe en la base de datos`);
  }
};

// Validar productos
const productExistById = async (id) => {
  const productExist = await Product.findById(id);
  if (!productExist) {
    throw new Error(`El id: ${id} no existe en la base de datos`);
  }
};

module.exports = {
  isRollValid,
  emailExist,
  existUserById,
  categoryExistById,
  productExistById,
};
