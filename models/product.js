const { Schema, model } = require('mongoose');

const ProductSchema = Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    // unique: true,
  },
  estado: {
    type: Boolean,
    default: true,
    required: true,
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  precio: {
    type: Number,
    default: 0,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  description: {
    type: String,
    default: 'Agregue una descripción del producto',
  },
  disponible: {
    type: Boolean,
    default: true,
  },
});

ProductSchema.methods.toJSON = function () {
  const { __v, estado, ...data } = this.toObject();
  return data;
};

module.exports = model('Product', ProductSchema);
