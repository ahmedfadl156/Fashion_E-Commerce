const express = require('express');
const router = express.Router();
const {Cart, validateCart} = require('../Models/cartModel');

router.get('/:userId', async (req, res) => {
    try {
        const cart = await Cart.findOne({userId: req.params.userId});
        if(!cart){
            return res.status(404).json({message: "Cart not found"});
        }
        res.json(cart);
    } catch(error) {
        console.error(error);
        res.status(500).json({message: "Internal server error"});
    }
});

router.post('/:userId', async (req, res) => {
    try {
        const cartData = {
            userId: req.params.userId,
            products: req.body.products
        };

        const {error} = validateCart(cartData);
        if(error){
            return res.status(400).json({message: error.details[0].message});
        }

        const cart = new Cart(cartData);
        const result = await cart.save();
        res.status(201).json(result);
    } catch(error) {
        console.error(error);
        res.status(500).json({message: "Internal server error"});
    }
});

router.put('/:userId', async (req, res) => {
    try {
        const {error} = validateCart(req.body);
        if(error){
            return res.status(400).json({message: error.details[0].message});
        }
        
        const cart = await Cart.findOneAndUpdate(
            {userId: req.params.userId},
            {products: req.body.products},
            {new: true}
        );
        
        if(!cart){
            return res.status(404).json({message: "Cart not found"});
        }
        
        res.json(cart);
    } catch(error) {
        console.error(error);
        res.status(500).json({message: "Internal server error"});
    }
});


router.post('/:userId/products', async (req, res) => {
    try {
        const { productId, quantity, name, price, image } = req.body;
        
        if(!productId || !quantity) {
            return res.status(400).json({message: "Product ID and quantity are required"});
        }
        
        let cart = await Cart.findOne({userId: req.params.userId});
        
        if(!cart) {
            // إنشاء سلة جديدة إذا لم تكن موجودة
            cart = new Cart({
                userId: req.params.userId,
                products: [{
                    productId,
                    quantity,
                    name,
                    price,
                    image
                }]
            });
        } else {
            const productIndex = cart.products.findIndex(p => p.productId == productId);
            
            if(productIndex > -1) {
                cart.products[productIndex].quantity += quantity;
            } else {
                cart.products.push({
                    productId,
                    quantity,
                    name,
                    price,
                    image
                });
            }
        }
        
        const result = await cart.save();
        res.json(result);
    } catch(error) {
        console.error(error);
        res.status(500).json({message: "Internal server error"});
    }
});

router.delete('/:userId/products/:productId', async (req, res) => {
    try {
        const cart = await Cart.findOne({userId: req.params.userId});
        
        if(!cart) {
            return res.status(404).json({message: "Cart not found"});
        }
        
        cart.products = cart.products.filter(p => p.productId != req.params.productId);
        
        const result = await cart.save();
        res.json(result);
    } catch(error) {
        console.error(error);
        res.status(500).json({message: "Internal server error"});
    }
});

router.delete('/:userId', async (req, res) => {
    try {
        const result = await Cart.findOneAndDelete({userId: req.params.userId});
        
        if(!result) {
            return res.status(404).json({message: "Cart not found"});
        }
        
        res.json({message: "Cart deleted successfully"});
    } catch(error) {
        console.error(error);
        res.status(500).json({message: "Internal server error"});
    }
});

module.exports = router;