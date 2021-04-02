const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { uploadFiles } = require('../helpers');
const { User, Product } = require('../models');

// Cargar un archivo
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

// Actualizar una imagen de usuario o producto
const uploadImg = async (req, res) => {
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
        .json({ msg: 'Asignar otra colección a validar - Administrador' });
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

// Subir imagen a Cloudinary
const uploadImgCloudinary = async (req, res) => {
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
        .json({ msg: 'Asignar otra colección a validar - Administrador' });
  }

  // Limpiar imágenes previas
  if (model.img) {
    // Limpiar imágenes dentro de Cloudinary
    const nameArr = model.img.split('/');
    const name = nameArr[nameArr.length - 1];
    const [public_id] = name.split('.');
    cloudinary.uploader.destroy(public_id);
  }
  const { tempFilePath } = req.files.file;
  const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

  model.img = secure_url;

  // Se guarda en base de datos
  await model.save();

  res.json({ model });
};

// Obtener la imagen del usuario o producto
const getImage = async (req, res) => {
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
        .json({ msg: 'Asignar otra colección a validar - Administrador' });
  }

  // Obtener Imagen de cada producto o usuario
  if (model.img) {
    return res.send(model.img);
  }
  // Mostrar imagen por defecto an caso de que el registro no cuente con una
  const pathDefaultImg = path.join(__dirname, '../assets/no-image.jpg');
  res.sendFile(pathDefaultImg);
};

module.exports = {
  loadFile,
  uploadImg,
  uploadImgCloudinary,
  getImage,
};
