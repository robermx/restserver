const { Router } = require('express');
const { check } = require('express-validator');

const { validateInputs } = require('../middlewares/validate-inputs');
const { loadFile } = require('../controllers/uploads.controller');

const router = Router();

router.post('/', loadFile);

module.exports = router;
