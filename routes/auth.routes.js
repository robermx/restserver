const { Router } = require('express');
const { check } = require('express-validator');
const { login } = require('../controllers/auth.controller');
const { validateInputs } = require('../middlewares/validate-inputs');

const router = Router();

router.post(
  '/login',
  [
    check('email', 'el correo es obligatorio').isEmail(),
    check('password', 'la contraseña es obligatoria').not().isEmpty(),
    validateInputs,
  ],
  login
);

module.exports = router;
