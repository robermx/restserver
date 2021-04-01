const path = require('path');
const { v4: uuidv4 } = require('uuid');

const uploadFiles = (finalFolder, extension, file) => {
  return new Promise((resolve, reject) => {
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
