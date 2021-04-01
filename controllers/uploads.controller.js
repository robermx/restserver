const { uploadFiles } = require('../helpers/upload-file');

const loadFile = async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      msg: 'No existen archivos para subirlos',
    });
  }

  //Extraer file de req.files
  const { file } = req.files;

  // Extraer la extensión
  const cutName = file.name.split('.');
  const extension = cutName[cutName.length - 1];

  // Extensiones validas
  const validExt = ['jpg', 'jpeg', 'png', 'webp'];
  const folder = 'img';

  //validar extensiones
  if (!validExt.includes(extension)) {
    return res.status(400).json({
      msg: `${extension} no es válida - utiliza ${validExt}`,
    });
  }

  // Imágenes
  const finalFile = await uploadFiles(folder, extension, file);

  res.json({
    finalFile,
  });
};

module.exports = {
  loadFile,
};
