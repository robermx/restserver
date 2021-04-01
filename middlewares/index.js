const validateInputs = require('../middlewares/validate-inputs');
const validateJWT = require('../middlewares/validate-jwt');
const validateRolls = require('../middlewares/validate-rolls');
const vlidateFlileUpload = require('../middlewares/validate-file');

module.exports = {
  ...vlidateFlileUpload,
  ...validateInputs,
  ...validateJWT,
  ...validateRolls,
};
