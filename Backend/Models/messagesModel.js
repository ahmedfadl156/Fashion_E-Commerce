const mongoose = require('mongoose');
const Joi = require('joi');


const messagesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 50,
        minlength: 3
    },
    email: {
        type:String,
        required: true,
        maxlength: 250,
        minlength: 10
    },
    message: {
        type: String,
        required: true,
        maxlength: 500,
        minlength: 3
    },
    phone: {
        type: String,
        required: true
    }
},{timestamps: true})

const Message = mongoose.model("message" , messagesSchema)
module.exports = Message;