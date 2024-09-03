const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const router = express.Router();
const JWT_SECRET = 'your_jwt_secret_key';

router.get('/', async (req, res) => {
    try {
        const users = await User.find({}, 'username profile');
        res.json(users);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id, 'username profile');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
