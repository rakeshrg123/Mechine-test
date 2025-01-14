// routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

const router = express.Router();

router.post('/register', (req, res) => {
    const { name, email, password, confirmPassword } = req.body;

    // Check if all required fields are provided
    if (!name && !email && !password && !confirmPassword) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if password and confirm password match
    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Password and confirm password do not match' });
    }

    // Check if email already exists
    User.findOne({ email })
        .then((existingUser) => {
            if (existingUser) {
                return res.status(400).json({ message: 'Email is already in use' });
            }

            // Create new user without an `id` in the request body
            const user = new User({ name, email, password });

            // Validate before saving
            const validationError = user.validateSync();
            if (validationError) {
                return res.status(400).json({ errors: validationError.errors });
            }

            // Save user to the database
            return user.save();
        })
        .then(() => {
            res.status(201).json({ message: 'User registered successfully' });
        })
        .catch((error) => {
            if (!res.headersSent) {
                console.error(error);
                res.status(500).json({ message: 'Internal Server Error' });
            }
        });
});


// Login Route
router.post('/login', (req, res) => {   
    const { email, password } = req.body;

    if (!email && !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }



    User.findOne({ email })
        .then((user) => {
            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            user.comparePassword(password)
                .then((isMatch) => {
                    console.log(isMatch)
                    if (!isMatch) {
                        return res.status(401).json({ error: 'Invalid credentials' });
                    }

                    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
                    res.json({ token, user });
                })
                .catch((err) => res.status(400).json({ error: err.message }));
        })
        .catch((err) => res.status(400).json({ error: err.message }));
});


module.exports = router;
