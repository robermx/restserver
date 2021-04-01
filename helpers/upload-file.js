const path = require('path');
const { v4: uuidv4 } = require('uuid');

const uploadFiles = (files, validExt, finalFolder) => {
  return new Promise((resolve, reject) => {
    //Extraer file de req.files
    const { file } = files;

    // Extraer la extensión
    const cutName = file.name.split('.');
    const extension = cutName[cutName.length - 1];

    //validar extensiones
    if (!validExt.includes(extension)) {
      return reject(`${extension} no es válido - utiliza ${validExt}`);
    }
    const tempName = uuidv4() + '.' + extension;
    const uploadPath = path.join(
      __dirname,
      '../uploads/',
      finalFolder,
      tempName
    );

    file.mv(uploadPath, (err) => {
      if (err) {
        return reject(err);
      }
      resolve(tempName);
    });
  });
};

module.exports = {
  uploadFiles,
};
