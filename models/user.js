const { Schema, model } = require('mongoose');

const userSchema = Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
  },
  email: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'El password es obligatorio'],
  },
  rol: {
    type: String,
    required: true,
    // emun: ['ADMIN_ROLE', 'USER_ROLE'],
  },
  img: {
    type: String,
  },
  estado: {
    type: Boolean,
    default: true,
  },
  google: {
    type: Boolean,
    default: false,
  },
});

userSchema.methods.toJSON = function () {
  const { __v, password, _id, ...user } = this.toObject();
  user.uid = _id;
  return user;
};

module.exports = model('User', userSchema);
