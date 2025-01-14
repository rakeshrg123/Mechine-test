const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            minlength: [3, 'Name must be at least 3 characters long'],
            maxlength: [50, 'Name cannot exceed 50 characters long'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
            trim: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters long'],
            maxlength: [100, 'Password cannot exceed 100 characters'],
        },
        role: { type: String, required: true, enum: ['admin', 'user'], default: 'user' },
    }
);

// Hash password before saving
userSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified('password')) return next();

    bcrypt
        .hash(user.password, 10)
        .then((hashedPassword) => {
            user.password = hashedPassword;
            next();
        })
        .catch((err) => next(err));
});

// Compare password
userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
