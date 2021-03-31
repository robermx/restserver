const { body } = require('express-validator');
const { Product } = require('../models');

// get Productos - paginado - total -populate
const getProducts = async (req, res) => {
  const { limit = 5, since = 0 } = req.query;
  const query = { estado: true };

  const [totalProducts, products] = await Promise.all([
    Product.countDocuments(query),
    Product.find(query)
      .populate('usuario', 'nombre')
      .populate('category', 'nombre')
      .limit(Number(limit))
      .skip(Number(since)),
  ]);
  res.json({
    totalProducts,
    products,
  });
};

const getProduct = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id)
    .populate('usuario', 'nombre')
    .populate('category', 'nombre');
  res.json(product);
};

// Create Product
const createProduct = async (req, res) => {
  const { estado, usuario, ...body } = req.body;
  const productDB = await Product.findOne({
    nombre: body.nombre.toUpperCase(),
  });

  // Validar si la producto ya existe en base de datos
  if (productDB) {
    return res.status(400).json({
      msg: `El producto ${productDB.nombre} ya existe`,
    });
  }
  // Generar la Data a guardar
  const data = {
    ...body,
    nombre: body.nombre.toUpperCase(),
    usuario: req.user._id,
  };
  const product = new Product(data);

  // Guardar db
  await product.save();

  res.status(201).json(product);
};

// uppDate product
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { estado, usuario, ...data } = req.body;
  if (data.nombre) {
    data.nombre = data.nombre.toUpperCase();
  }

  data.usuario = req.user._id;

  const product = await Product.findByIdAndUpdate(id, data, { new: true });

  res.json(product);
};

// Delate product
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const productDeleted = await Product.findByIdAndUpdate(
    id,
    {
      estado: false,
    },
    { new: true }
  );
  res.json({
    productDeleted,
    msg: 'El registro se ha deshabilitado correctamente',
  });
};

module.exports = {
  createProduct,
  deleteProduct,
  getProducts,
  getProduct,
  updateProduct,
};
