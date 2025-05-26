const mongoose = require('mongoose');
const Joi = require('joi');

const productsSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 100
    },

    category: {
        type: String,
        enum: ["Men" , "Women" , "Kids" , "ladies"]
    },

    price: {
        type: Number,
        required: true,
        min: 0
    },

    description: {
        type: String,
        trim: true,
        minlength: 5,
        maxlength: 1000
    },

    reviews:{
        type: Number,
        required: true
    },

    brand:{
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    rating:{
        type: Number,
        required: true
    },
    quantity:{
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    }
},{timestamps: true});

function validateCreateProduct(obj){
    const schema = Joi.object({
        name: Joi.string().trim().min(5).max(100).required(),
        category: Joi.string().valid("Men" , "Women" , "Kids" , "ladies").required(),
        image: Joi.string().trim().min(5).max(100).required(),
        description: Joi.string().trim().min(5).max(1000).required(),
        reviews: Joi.number().required(),
        rating: Joi.number().required(),
        brand: Joi.string().trim().min(3).max(50).required(),
        quantity: Joi.number().required(),
        price: Joi.number().required()
    })
    return schema.validate(obj)
}

function validateUpdateProduct(obj){
    const schema = Joi.object({
        name: Joi.string().trim().min(5).max(100),
        category: Joi.string().trim().min(5).max(100).valid("Men" , "Women" , "Kids"),
        image: Joi.string().trim().min(5).max(100),
        description: Joi.string().trim().min(5).max(1000),
        reviews: Joi.number(),
        rating: Joi.number(),
        brand: Joi.string().trim().min(3).max(50),
        quantity: Joi.number(),
        price: Joi.number()
    })
    return schema.validate(obj)
}

const Product = mongoose.model("Products" , productsSchema);
module.exports = { Product , validateCreateProduct , validateUpdateProduct };