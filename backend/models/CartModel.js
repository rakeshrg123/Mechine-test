const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            variantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Variant', required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
        },
    ],
});

module.exports = mongoose.model('Cart', cartSchema);
