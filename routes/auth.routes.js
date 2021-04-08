const { Router } = require('express');
const { check } = require('express-validator');
const {
  login,
  googleSingIn,
  renovateJWT,
} = require('../controllers/auth.controller');
const { validateInputs, validateJWT } = require('../middlewares');

const router = Router();

router.get('/', validateJWT, renovateJWT);

router.post(
  '/login',
  [
    check('email', 'el correo es obligatorio').isEmail(),
    check('password', 'la contraseña es obligatoria').not().isEmpty(),
    validateInputs,
  ],
  login
);

router.post(
  '/google',
  [
    check('id_token', 'El id_token es necesario').not().isEmpty(),
    validateInputs,
  ],
  googleSingIn
);

module.exports = router;
