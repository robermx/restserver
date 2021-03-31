const { Category } = require('../models');

// getCategories - paginado - total -populate
const getCategories = async (req, res) => {
  const { limit = 5, since = 0 } = req.query;
  const query = { estado: true };

  const [totalCategories, categories] = await Promise.all([
    Category.countDocuments(query),
    Category.find(query)
      .populate('usuario', 'nombre')
      .limit(Number(limit))
      .skip(Number(since)),
  ]);
  res.json({
    totalCategories,
    categories,
  });
};

// get one category
const getCategory = async (req, res) => {
  const { id } = req.params;
  const category = await Category.findById(id).populate('usuario', 'nombre');
  res.json(category);
};

// Create category
const createCategory = async (req, res) => {
  const nombre = req.body.nombre.toUpperCase();
  const categoryDB = await Category.findOne({ nombre });

  // Validar si la categoría ya existe en base de datos
  if (categoryDB) {
    return res.status(400).json({
      msg: `La categoría ${categoryDB.nombre}, ya existe`,
    });
  }
  // Generar la Data a guardar
  const data = {
    nombre,
    usuario: req.user._id,
  };
  const category = new Category(data);

  // Guardar db
  await category.save();

  res.status(201).json(category);
};

// UpDate category
const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { estado, usuario, ...data } = req.body;

  data.nombre = data.nombre.toUpperCase();

  data.usuario = req.user._id;

  const category = await Category.findByIdAndUpdate(id, data, { new: true });

  res.json(category);
};

// delete Category
const deleteCategory = async (req, res) => {
  const { id } = req.params;
  const categoryDeleted = await Category.findByIdAndUpdate(
    id,
    {
      estado: false,
    },
    { new: true }
  );
  res.json({
    categoryDeleted,
    msg: 'El registro se ha deshabilitado correctamente',
  });
};

module.exports = {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
