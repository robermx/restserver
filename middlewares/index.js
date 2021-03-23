const validateInputs = require('../middlewares/validate-inputs');
const validateJWT = require('../middlewares/validate-jwt');
const validateRolls = require('../middlewares/validate-rolls');

module.exports = {
  ...validateInputs,
  ...validateJWT,
  ...validateRolls,
};
