const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Admin login route
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // For demo purposes, we assume there's one admin with a hardcoded username and password
    const adminCredentials = {
        username: 'admin',
        password: 'adminpassword'
    };

    if (username === adminCredentials.username && password === adminCredentials.password) {
        // Create JWT token for admin
        const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.json({ token });
    } else {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
});

module.exports = router;
