const mongoose = require('mongoose');
const Joi = require('joi');

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    name: String,
    price: Number,
    image: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

cartSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Cart = mongoose.model('Cart', cartSchema);

function validateCart(cart) {
  const schema = Joi.object({
    userId: Joi.string().required(),
    products: Joi.array().items(
      Joi.object({
        productId: Joi.string().required(),
        quantity: Joi.number().integer().min(1).required(),
        name: Joi.string(),
        price: Joi.number().min(0),
        image: Joi.string()
      })
    ).required()
  });

  return schema.validate(cart);
}

module.exports = {
  Cart,
  validateCart
};