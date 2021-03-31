const { Router } = require('express');
const { check } = require('express-validator');

const { validateJWT, validateInputs, hasRoll } = require('../middlewares');
const { categoryExistById } = require('../helpers/db-validators');
const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categories.controller');

const router = Router();

// Obtener todas las categorías - public
router.get('/', getCategories);

// Obtener una categoría por id - public categoryExist
router.get(
  '/:id',
  [
    check('id', 'no existe este id en la base de datos').isMongoId(),
    check('id').custom(categoryExistById),
    validateInputs,
  ],
  getCategory
);

// Crear categoría - private - persona con token válido
router.post(
  '/',
  [
    validateJWT,
    hasRoll('ADMIN_ROL'),
    check('nombre', 'El nombre e requerido').not().isEmpty(),
    validateInputs,
  ],
  createCategory
);

// Actualizar categoría - private - token válido
router.put(
  '/:id',
  [
    validateJWT,
    hasRoll('ADMIN_ROL'),
    check('nombre', 'el nombre es obligatorio').not().isEmpty(),
    validateInputs,
    check('id').custom(categoryExistById),
    validateInputs,
  ],
  updateCategory
);

// Delete Category
router.delete(
  '/:id',
  [
    validateJWT,
    hasRoll('ADMIN_ROL'),
    check('id', 'no existe este id en la base de datos').isMongoId(),
    validateInputs,
    check('id').custom(categoryExistById),
    validateInputs,
  ],
  deleteCategory
);

module.exports = router;
