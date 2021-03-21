const { validationResult } = require('express-validator');

const validateInputs = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors);
  }
  // si todo sale bien sigue con el siguiente middleware
  next();
};

module.exports = {
  validateInputs,
};
