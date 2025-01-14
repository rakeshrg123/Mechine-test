const express = require('express');
const router = express.Router();
const Product = require('../models/ProductModel'); // Import the Product model

// Create a new product
router.post('/create', function(req, res, next) {
    const { name, description, price, variants } = req.body;

    // Create a new product instance using the data from the request body
    const newProduct = new Product({
        name,
        description,
        price,
        variants,
    });

    // Validate the product instance synchronously
    const validationError = newProduct.validateSync();
    if (validationError) {
        // If validation fails, respond with the validation errors
        return res.status(400).json({ message: 'Validation failed', errors: validationError.errors });
    }

    // Save the product to the database and handle the promise
    newProduct.save()
        .then((savedProduct) => {
            // Respond with the newly created product
            res.status(201).json({
                message: 'Product created successfully',
                product: savedProduct,
            });
        })
        .catch((error) => {
            // Handle errors if product creation fails
            console.error('Error creating product:', error);
            res.status(500).json({ message: 'Internal Server Error', error: error.message });
        });
});


// Get all products (without filtering or search) - Using promises
router.get('/products', (req, res) => {
    Product.find() // Returns a promise
        .then((products) => {
            res.json({ products });
        })
        .catch((error) => {
            res.status(500).json({ error: error.message });
        });
});


// Update an existing product
router.put('/update/:id', function (req, res, next) {
    const { name, description, price, variants } = req.body;
    const productId = req.params.id;

    // Find the product by ID
    Product.findById(productId)
        .then((product) => {
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            // Update the product with the new data
            product.name = name || product.name;
            product.description = description || product.description;
            product.price = price || product.price;
            product.variants = variants || product.variants;

            // Validate the updated product
            const validationError = product.validateSync();
            if (validationError) {
                return res.status(400).json({ message: 'Validation failed', errors: validationError.errors });
            }

            // Save the updated product to the database
            return product.save();
        })
        .then((updatedProduct) => {
            res.status(200).json({
                message: 'Product updated successfully',
                product: updatedProduct,
            });
        })
        .catch((error) => {
            console.error('Error updating product:', error);
            res.status(500).json({ message: 'Internal Server Error', error: error.message });
        });
});


router.get('/filter', function (req, res) {
    const { name } = req.query;

    let filter = {};
    
    if (name) {
        filter.name = { $regex: `^${name}`, $options: 'i' };
    }

    Product.find(filter)
        .then((products) => {
            res.json({ products });
        })
        .catch((error) => {
            res.status(500).json({ error: error.message });
        });
});



router.delete('/delete/:id', function (req, res) {
    const productId = req.params.id;

    Product.findByIdAndDelete(productId)
        .then((deletedProduct) => {
            if (!deletedProduct) {
                return res.status(404).json({ message: 'Product not found' });
            }
            res.status(200).json({ message: 'Product deleted successfully', product: deletedProduct });
        })
        .catch((error) => {
            res.status(500).json({ message: 'Error deleting product', error: error.message });
        });
});



// Create a new variant for a product
router.post('/:productId/variants', (req, res) => {
    const { productId } = req.params;
    const { color, stock } = req.body;
    let newVariant;

    // Find the product by ID
    Product.findById(productId)
        .then((product) => {
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            // Create a new variant
            newVariant = { color, stock };

            // Add the variant to the product's variants array
            product.variants.push(newVariant);

            // Save the product with the new variant
            return product.save();
        })
        .then((savedProduct) => {
            res.status(201).json({ message: 'Variant created successfully', variant: newVariant });
        })
        .catch((error) => {
            console.log(error);
            
            res.status(500).json({ message: 'Error creating variant', error: error.message });
        });
});

// Get all variants for a specific product
router.get('/:productId/variants', (req, res) => {
    const { productId } = req.params;

    // Find the product by ID
    Product.findById(productId)
        .then((product) => {
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            // Return all variants
            res.json({ variants: product.variants });
        })
        .catch((error) => {
            res.status(500).json({ message: 'Error fetching variants', error: error.message });
        });
});


// Update a variant by its ID
router.put('/:productId/variants/:variantId', (req, res) => {
    const { productId, variantId } = req.params;
    const { color, stock } = req.body;

    // Find the product by ID
    Product.findById(productId)
        .then((product) => {
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            // Find the variant by its ID
            const variant = product.variants.id(variantId);

            if (!variant) {
                return res.status(404).json({ message: 'Variant not found' });
            }

            // Update the variant's attributes
            if (color) variant.color = color;
            if (stock) variant.stock = stock;

            // Save the updated product
            return product.save();
        })
        .then((updatedProduct) => {
            res.status(200).json({ message: 'Variant updated successfully', variant: updatedProduct.variants.id(variantId) });
        })
        .catch((error) => {
            res.status(500).json({ message: 'Error updating variant', error: error.message });
        });
});


// Delete a variant from a product by product ID and variant ID
router.delete('/:productId/variants/:variantId', (req, res) => {
    const { productId, variantId } = req.params;

    // Find the product by ID
    Product.findById(productId)
        .then((product) => {
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            // Remove the variant from the variants array
            product.variants.pull({ _id: variantId });

            // Save the updated product
            return product.save();
        })
        .then(() => {
            res.status(200).json({ message: 'Variant deleted successfully' });
        })
        .catch((error) => {
            res.status(500).json({ message: 'Error deleting variant', error: error.message });
        });
});


module.exports = router;
