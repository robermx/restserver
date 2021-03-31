const { ObjectId } = require('mongoose').Types;
const { User, Category, Product } = require('../models');

// Colecciones permitidas dentro del url
const allowedCollections = ['users', 'categories', 'products'];

// búsqueda de usuarios
const searchUsers = async (term, res) => {
  // búsqueda por uid
  const isMongoID = ObjectId.isValid(term);
  if (isMongoID) {
    const user = await User.findById(term);
    return res.json({
      results: user ? [user] : [],
    });
  }

  // búsqueda por nombre
  const regEx = new RegExp(term, 'i');
  const users = await User.find({
    $or: [{ nombre: regEx }, { email: regEx }],
    $and: [{ estado: true }],
  });

  res.json({
    results: users,
  });
};

// búsqueda de categorías
const searchCategories = async (term, res) => {
  // búsqueda por id
  const isMongoID = ObjectId.isValid(term);
  if (isMongoID) {
    const category = await Category.findById(term).populate(
      'usuario',
      'nombre'
    );
    return res.json({
      results: category ? [category] : [],
    });
  }

  // búsqueda por nombre
  const regEx = new RegExp(term, 'i');
  const categories = await Category.find({
    nombre: regEx,
    estado: true,
  }).populate('usuario', 'nombre');

  res.json({
    results: categories,
  });
};

// búsqueda de productos
const searchProducts = async (term, res) => {
  // búsqueda por id
  const isMongoID = ObjectId.isValid(term);
  if (isMongoID) {
    const products = await Product.findById(term)
      .populate('category', 'nombre')
      .populate('usuario', 'nombre');
    return res.json({
      results: products ? [products] : [],
    });
  }

  // búsqueda por nombre
  const regEx = new RegExp(term, 'i');
  const products = await Product.find({
    nombre: regEx,
    estado: true,
  })
    .populate('category', 'nombre')
    .populate('usuario', 'nombre');

  res.json({
    results: products,
  });
};

// search colecciones y términos
const search = (req, res) => {
  const { collection, term } = req.params;

  if (!allowedCollections.includes(collection)) {
    return res.status(400).json({
      msg: `Las colecciones permitidas son: ${allowedCollections}`,
    });
  }
  // Que hacer en cada uno de los casos
  switch (collection) {
    case 'users':
      searchUsers(term, res);
      break;
    case 'categories':
      searchCategories(term, res);
      break;
    case 'products':
      searchProducts(term, res);
      break;
    default:
      res.status(500).json({
        msg: 'implementar nuevos criterios de búsqueda - administrador',
      });
  }
};

module.exports = {
  search,
};
