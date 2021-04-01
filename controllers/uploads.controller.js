const { uploadFiles } = require('../helpers/upload-file');

const loadFile = async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      msg: 'No existen archivos para subirlos',
    });
  }

  // Extensiones validas
  const validExt = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
  const folder = 'img';
  try {
    // Imágenes
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

module.exports = {
  loadFile,
};
