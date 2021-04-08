const { Router } = require('express');
const { check } = require('express-validator');

const {
  validateInputs,
  validateJWT,
  isAdminRoll,
  hasRoll,
} = require('../middlewares');

const {
  isRollValid,
  emailExist,
  existUserById,
} = require('../helpers/db-validators');

const {
  usersGet,
  usersPost,
  usersPut,
  usersPatch,
  usersDelete,
} = require('../controllers/users.controller');

const router = Router();

router.get('/', usersGet);
router.post(
  '/',
  [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'Este correo no es valido').isEmail(),
    check('email').custom(emailExist),
    check(
      'password',
      'El password debe ser al menos de 8 carácteres'
    ).isLength({ min: 8 }),
    check('rol').custom(isRollValid),
    validateInputs,
  ],
  usersPost
);
router.put(
  '/:id',
  [
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existUserById),
    check('rol').custom(isRollValid),
    validateInputs,
  ],
  usersPut
);

router.delete(
  '/:id',
  [
    validateJWT,
    // Solo si es ADMIN ROL
    // isAdminRoll,
    hasRoll('ADMIN_ROL', 'VENTAS_ROL'),
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existUserById),
    validateInputs,
  ],
  usersDelete
);

module.exports = router;
