const path = require('path');
const fs = require('fs');

const { uploadFiles } = require('../helpers');
const { User, Product } = require('../models');

const loadFile = async (req, res) => {
  // Extensiones validas
  const validExt = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
  const folder = 'img';
  try {
    // Subir imágenes
    const finalFile = await uploadFiles(req.files, validExt, folder);

    res.json({
      finalFile,
    });
  } catch (msg) {
    return res.status(400).json({
      msg,
    });
  }
};

const userImg = async (req, res) => {
  // Ahora se extrae de los params
  const { collection, id } = req.params;

  let model;

  switch (collection) {
    case 'users':
      model = await User.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `No existe un usuario con el id: ${id}`,
        });
      }
      break;
    case 'products':
      model = await Product.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `No existe un producto con el id: ${id}`,
        });
      }
      break;
    default:
      return res
        .status(500)
        .json({ msg: 'Asignar otra coleccions a validar - Administrador' });
  }

  // Limpiar imágenes previas
  if (model.img) {
    const pathImage = path.join(__dirname, '../uploads', collection, model.img);
    if (fs.existsSync(pathImage)) {
      fs.unlinkSync(pathImage);
    }
  }

  // Extensiones validas
  const validExt = ['jpg', 'jpeg', 'png', 'webp', 'gif'];

  const finalFile = await uploadFiles(req.files, validExt, collection);

  model.img = finalFile;
  await model.save();

  res.json({ model });
};

module.exports = {
  loadFile,
  userImg,
};
