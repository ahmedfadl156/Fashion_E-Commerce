const mongoose = require('mongoose');
const Joi = require('joi');


const orderSchema = new mongoose.Schema({
    orderId: {
        type: String
    },
    orderItems: {
        type: []
    },
    orderTotal:{
        type: Number
    },
    orderDate: {
        type: Date
    }
})