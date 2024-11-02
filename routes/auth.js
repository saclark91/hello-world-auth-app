const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

// Register route
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Error registering user:", error.message);  // Log specific error message
        res.status(400).json({
            error: "Error registering user",
            details: error.message  // Optionally include detailed error in the response
        });
    }
});


// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.error("Login failed: User not found");
            return res.status(400).json({ error: "Invalid credentials: User not found" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            console.error("Login failed: Incorrect password");
            return res.status(400).json({ error: "Invalid credentials: Incorrect password" });
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        console.error("Server error during login:", error.message);  // Log specific error message
        res.status(500).json({
            error: "Server error",
            details: error.message  // Optionally include detailed error in the response
        });
    }
});


module.exports = router;
