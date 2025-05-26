const express = require('express');
const { Product, validateCreateProduct, validateUpdateProduct } = require('../Models/allProducts.Model');
const { $where } = require('../Models/userModel');
const router = express.Router();

router.post('/add', async (req, res) => {
    try {
        const { error } = validateCreateProduct(req.body);
        if (error) {
            return res.status.json({ message: error.details[0].message });
        }
        
        const product = new Product({
            name: req.body.name,
            category: req.body.category,
            image: req.body.image,
            description: req.body.description,
            reviews: req.body.reviews,
            brand: req.body.brand,
            rating: req.body.rating,
            quantity: req.body.quantity,
            price: req.body.price
        });
        
        const result = await product.save();
        res.json(result);
    } catch (error) {
        res.status.json({ message: error.message });
    }
});

router.get('/all', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status.json({ message: error.message, status: "Products Not Found" });
    }
});


router.get('/', async (req, res) => {
    try {
        const { priceMin, priceMax, category, brand, size , filters , q } = req.query;
        let searchQuery = {};
        
        if (q) {
            searchQuery.$or = [
                { name: { $regex: q, $options: 'i' } }, 
                { description: { $regex: q, $options: 'i' } }, 
            ];
        }

        if (filters) {
            const filterTerms = filters.split(',');
            const filterConditions = [];
            
            for (const term of filterTerms) {
                filterConditions.push({ name: { $regex: term, $options: 'i' } });
                filterConditions.push({ description: { $regex: term, $options: 'i' } });    
            }
            
            if (filterConditions.length > 0) {
                if (!searchQuery.$or) {
                    searchQuery.$or = filterConditions;
                } else {
                    searchQuery.$or = [...searchQuery.$or, ...filterConditions];
                }
            }
        }
        if (priceMin || priceMax) {
            searchQuery.price = {};
            if (priceMin) searchQuery.price.$gte = Number(priceMin);
            if (priceMax) searchQuery.price.$lte = Number(priceMax);
        }
        
        if (category) {
            const categories = category.split(',');
            searchQuery.category = { $in: categories };
        }
        
        if (brand) {
            const brands = brand.split(',');
            searchQuery.brand = { $in: brands };
        }
        
        // if (size) {
        //     const sizes = size.split(',');
        //     searchQuery.size = { $in: sizes };
        // }
        
        const products = await Product.find(searchQuery);
        res.json(products);
    } catch (error) {
        res.status.json({ message: "Error fetching products", error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status.json({ message: "Product Not Found!" });
        }
        res.json(product);
    } catch (error) {
        res.status.json({ message: error.message, status: "Product Not Found" });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { error } = validateUpdateProduct(req.body);
        if (error) {
            return res.status.json({ message: error.details.message });
        }
        
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status.json({ message: 'Product not found' });
        }
        
        product.name = req.body.name;
        product.category = req.body.category;
        product.quantity = req.body.quantity;
        product.brand = req.body.brand;
        product.reviews = req.body.reviews;
        product.rating = req.body.rating;
        product.image = req.body.image;
        product.description = req.body.description;
        product.price = req.body.price;
        
        await product.save();
        res.json(product);
    } catch (error) {
        res.status.json({ message: error.message });
    }
});


router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status.json({ message: 'Product not found' });
        }
        
        const rproduct = await Product.find();
        res.json({ 'The Deleted Product is': product, 'The Remains Products After Delete': rproduct });
    } catch (error) {
        res.status.json({ message: error.message });
    }
});




router.put('/update-quantity/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { quantity } = req.body;
  
      if (!id) {
        return res.status(400).json({ message: 'Product ID is required' });
      }
      
      if (typeof quantity !== 'number' || quantity < 0) {
        return res.status(400).json({ message: 'Quantity must be a non-negative number' });
      }
  
      console.log(`Updating product ${id} quantity by ${quantity}`);
  
      const product = await Product.findById(id);
      
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      if (product.quantity < quantity) {
        return res.status(400).json({ 
          message: 'Insufficient stock',
          available: product.quantity,
          requested: quantity
        });
      }
  
      const oldQuantity = product.quantity;
      product.quantity = oldQuantity - quantity;
      
      const updatedProduct = await product.save();
  
      return res.status(200).json({
        message: 'Product quantity updated successfully',
        productId: id,
        oldQuantity: oldQuantity,
        reducedBy: quantity,
        remainingQuantity: updatedProduct.quantity
      });
  
    } catch (error) {
      console.error('Error updating product quantity:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  });


module.exports = router;