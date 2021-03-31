const { Schema, model } = require('mongoose');

const RollSchema = Schema({
  rol: {
    type: String,
    required: [true, 'El rol es obligatorio'],
  },
});

module.exports = model('Roll', RollSchema);
