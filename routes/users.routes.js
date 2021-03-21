const { Router } = require('express');
const { check } = require('express-validator');

const { validateInputs } = require('../middlewares/validate-inputs');
const {
  isRolValid,
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
    // check('rol', 'No es un rol permitido').isIn(['ADMIN_ROL', 'USER_ROL']),
    check('rol').custom(isRolValid),
    validateInputs,
  ],
  usersPost
);
router.put(
  '/:id',
  [
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existUserById),
    check('rol').custom(isRolValid),
    validateInputs,
  ],
  usersPut
);
router.patch('/', usersPatch);
router.delete(
  '/:id',
  [
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existUserById),
    validateInputs,
  ],
  usersDelete
);

module.exports = router;
