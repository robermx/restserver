const { Router } = require('express');
const { check } = require('express-validator');

const { validateJWT, validateInputs, hasRoll } = require('../middlewares');
const {
  categoryExistById,
  productExistById,
} = require('../helpers/db-validators');
const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/products.controller');

const router = Router();

// Obtener todas las categorías - public
router.get('/', getProducts);

// Obtener una categoría por id - public categoryExist
router.get(
  '/:id',
  [
    check('id', 'no existe este id en la base de datos').isMongoId(),
    validateInputs,
    check('id').custom(productExistById),
    validateInputs,
  ],
  getProduct
);

// Crear categoría - private - persona con token válido
router.post(
  '/',
  [
    validateJWT,
    hasRoll('ADMIN_ROL'),
    check('nombre', 'El nombre e requerido').not().isEmpty(),
    check('category', 'no existe este id en la base de datos').isMongoId(),
    validateInputs,
    check('category').custom(categoryExistById),
    validateInputs,
  ],
  createProduct
);

// Actualizar categoría - private - token válido
router.put(
  '/:id',
  [
    validateJWT,
    hasRoll('ADMIN_ROL'),
    check('id', 'no existe este id en la base de datos').isMongoId(),
    validateInputs,
    check('id').custom(productExistById),
    validateInputs,
  ],
  updateProduct
);

// Delete Category
router.delete(
  '/:id',
  [
    validateJWT,
    hasRoll('ADMIN_ROL'),
    check('id', 'no existe este id en la base de datos').isMongoId(),
    // TODO: validateInputs, es necesario?
    check('id').custom(productExistById),
    validateInputs,
  ],
  deleteProduct
);

module.exports = router;
