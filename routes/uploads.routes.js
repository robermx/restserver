const { Router } = require('express');
const { check } = require('express-validator');

const { validateInputs, vlidateFlileUpload } = require('../middlewares');
const { loadFile, userImg } = require('../controllers/uploads.controller');
const { allowedCollections } = require('../helpers');

const router = Router();

// subir imágenes en carpeta IMG
router.post('/', vlidateFlileUpload, loadFile);

// subir imágenes de usuarios
router.put(
  '/:collection/:id',
  [
    vlidateFlileUpload,
    check('id', 'El id debe ser de Mongo').isMongoId(),
    check('collection').custom((c) =>
      allowedCollections(c, ['users', 'products'])
    ),
    validateInputs,
  ],
  userImg
);

module.exports = router;
