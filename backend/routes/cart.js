const express = require('express');
const router = express.Router();
const Product = require('../models/ProductModel'); // Import the Product model
const Cart = require('../models/CartModel'); // Cart model
const Order = require('../models/OrderModel'); // Order model

// Add product with specific variant to cart
router.post('/addtocart', (req, res) => {
    const { userId, productId, variantId, quantity } = req.body;

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

            // Check if the variant has enough stock
            if (variant.stockQuantity < quantity) {
                return res.status(400).json({ message: 'Not enough stock available' });
            }

            // Find or create the user's cart
            return Cart.findOne({ userId })
                .then((cart) => {
                    if (!cart) {
                        cart = new Cart({ userId, items: [] });
                    }

                    // Check if the product is already in the cart
                    const existingItem = cart.items.find(
                        (item) => item.productId.toString() === productId && item.variantId.toString() === variantId
                    );

                    if (existingItem) {
                        // Update the quantity if product already exists in the cart
                        existingItem.quantity += quantity;
                    } else {
                        // Add new item to the cart
                        cart.items.push({
                            productId,
                            variantId,
                            quantity,
                            price: product.price,
                        });
                    }

                    // Save the cart
                    return cart.save();
                })
                .then((updatedCart) => {
                    res.status(200).json({ message: 'Product added to cart', cart: updatedCart });
                });
        })
        .catch((error) => {
            res.status(500).json({ message: 'Error adding product to cart', error: error.message });
        });
});

// Get the user's shopping cart count
router.get('/count/:userId', (req, res) => {
    const { userId } = req.params;

    Cart.findOne({ userId })
        .then(cart => {
            if (!cart) {
                return res.json({ count: 0 });
            }

            const itemCount = cart.items.length;
            res.json({ count: itemCount });
        })
        .catch(err => {
            console.error('Error fetching cart item count:', err);
            res.status(500).json({ error: 'Failed to fetch cart item count' });
        });
});

// Update the quantity of a product in the cart
router.put('/cart/:userId', (req, res) => {
    const { userId } = req.params;
    const { productId, variantId, quantity } = req.body;

    if (quantity <= 0) {
        return res.status(400).json({ message: 'Quantity must be greater than zero' });
    }

    Cart.findOne({ userId })
        .then((cart) => {
            if (!cart) {
                return res.status(404).json({ message: 'Cart not found' });
            }

            const item = cart.items.find(
                (item) => item.productId.toString() === productId && item.variantId.toString() === variantId
            );

            if (!item) {
                return res.status(404).json({ message: 'Item not found in cart' });
            }

            item.quantity = quantity;

            return cart.save();
        })
        .then((updatedCart) => {
            res.status(200).json({ message: 'Cart updated', cart: updatedCart });
        })
        .catch((error) => {
            res.status(500).json({ message: 'Error updating cart', error: error.message });
        });
});

// Clear the user's shopping cart
router.delete('/cart/:userId', (req, res) => {
    const { userId } = req.params;

    Cart.findOneAndDelete({ userId })
        .then((deletedCart) => {
            if (!deletedCart) {
                return res.status(404).json({ message: 'Cart not found' });
            }

            res.status(200).json({ message: 'Cart cleared' });
        })
        .catch((error) => {
            res.status(500).json({ message: 'Error clearing cart', error: error.message });
        });
});

// Get the user's cart with product and variant details
router.get("/:userId", (req, res) => {
    const { userId } = req.params;

    Cart.findOne({ userId })
        .then((cart) => {
            if (!cart || cart.items.length === 0) {
                return res.status(404).json({ message: "Cart is empty.", cart: { items: [] } });
            }

            const enrichItemsPromises = cart.items.map((item) =>
                Product.findById(item.productId).then((product) => {
                    const variant = product?.variants?.find((variant) => variant._id.toString() === item.variantId.toString());

                    return {
                        productId: item.productId,
                        variantId: item.variantId,
                        quantity: item.quantity,
                        price: item.price,
                        productName: product ? product.name : "Unknown Product",
                        variantName: variant ? variant.color : "Unknown Variant",
                    };
                })
            );

            Promise.all(enrichItemsPromises)
                .then((enrichedItems) => {
                    console.log(enrichedItems);
                    res.json({ cart: { items: enrichedItems } });
                })
                .catch((err) => {
                    console.error("Error enriching cart items:", err);
                    res.status(500).json({ error: "Failed to enrich cart items." });
                });
        })
        .catch((err) => {
            console.error("Failed to fetch cart:", err);
            res.status(500).json({ error: "Failed to fetch cart details." });
        });
});

// Checkout and create an order
router.post('/checkout/:userId', (req, res) => {
    const { userId } = req.params;

    Cart.findOne({ userId })
        .then((cart) => {
            if (!cart || cart.items.length === 0) {
                return res.status(400).json({ message: 'Cart is empty' });
            }

            const order = new Order({
                userId,
                items: cart.items.map((item) => ({
                    productId: item.productId,
                    variantId: item.variantId,
                    quantity: item.quantity,
                    price: item.price,
                })),
                totalAmount: cart.items.reduce((total, item) => total + item.price * item.quantity, 0),
                status: 'Pending',
            });

            return order.save().then(() => {
                cart.items.forEach((item) => {
                    Product.findById(item.productId).then((product) => {
                        const variant = product.variants.id(item.variantId);
                        if (variant) {
                            variant.stockQuantity -= item.quantity;
                            product.save();
                        }
                    });
                });
            });
        })
        .then(() => {
            return Cart.findOneAndDelete({ userId });
        })
        .then(() => {
            res.status(200).json({ message: 'Order placed successfully' });
        })
        .catch((error) => {
            res.status(500).json({ message: 'Error processing checkout', error: error.message });
        });
});

// Remove a product variant from the cart
router.delete('/removefromcart/:userId', (req, res) => {
    const { userId } = req.params;
    const { productId, variantId } = req.body;

    if (!productId || !variantId) {
        return res.status(400).json({ message: 'Product ID and Variant ID are required' });
    }

    Cart.findOne({ userId })
        .then((cart) => {
            if (!cart) {
                return res.status(404).json({ message: 'Cart not found' });
            }

            const itemIndex = cart.items.findIndex(
                (item) => item.productId.toString() === productId && item.variantId.toString() === variantId
            );

            if (itemIndex === -1) {
                return res.status(404).json({ message: 'Item not found in cart' });
            }

            cart.items.splice(itemIndex, 1);

            return cart.save();
        })
        .then((updatedCart) => {
            res.status(200).json({ message: 'Item removed from cart', cart: updatedCart });
        })
        .catch((error) => {
            console.error('Error removing item from cart:', error);
            res.status(500).json({ message: 'Error removing item from cart', error: error.message });
        });
});

module.exports = router;
