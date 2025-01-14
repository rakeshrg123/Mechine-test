const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/UserModel'); // Adjust the path as needed
const bcrypt = require('bcryptjs');

// Load environment variables
dotenv.config();

const initializeAdmin = () => {
    const adminEmail = 'admin@example.com'; // Default admin email
    const adminPassword = 'admin123'; // Default admin password

    // Check if the admin user already exists
    return User.findOne({ email: adminEmail })
        .then((existingAdmin) => {
            if (existingAdmin) {
                console.log('Admin user already exists');
                return; // Exit if admin exists
            }

            // Hash the admin password
                    // Create the admin user
                    const adminUser = new User({
                        name: 'Admin',
                        email: adminEmail,
                        password: adminPassword,
                        role: 'admin',
                    });

                    // Save the admin user
                    return adminUser.save()
                        .then(() => {
                            console.log('Default admin user created');
                        });
                })
  
        .catch((error) => {
            console.error('Error initializing admin user:', error.message);
        });
};

// MongoDB connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        return initializeAdmin(); // Initialize the default admin after connection
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });
