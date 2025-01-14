const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
    color: {
        type: String,
        required: [true, 'Color is required'],
        trim: true, // Trim spaces
    },
    stock: {
        type: Number,
        required: [true, 'Stock quantity is required'],
        min: [0, 'Stock quantity cannot be negative'],
        default: 0,
    },
});

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Product name is required'],
            minlength: [3, 'Product name must be at least 3 characters long'],
            maxlength: [100, 'Product name cannot exceed 100 characters'],
            trim: true, // Trim spaces
        },
        description: {
            type: String,
            required: [true, 'Product description is required'],
            maxlength: [500, 'Product description cannot exceed 500 characters'],
            trim: true, // Trim spaces
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: [0, 'Price cannot be negative'],
            validate: {
                validator: (value) => value >= 0,
                message: 'Price must be a positive number',
            },
        },
        variants: {
            type: [variantSchema],
            validate: {
                validator: (value) => value.length > 0,
                message: 'There must be at least one variant for the product',
            },
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
