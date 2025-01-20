const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../model/User');
const { jwtAuthMiddleware, generateToken } = require('../middleware/jwt');

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const data = req.body;
    if (!data.name || !data.password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }
    const newUser = new User(data);
    const response = await newUser.save();

    console.log(response);
    res.status(201).json({ message: 'Signup successful', user: response });
} catch (error) {
    if (error.name === 'ValidationError') {
        res.status(400).json({ error: 'Validation Error', details: error.message });
    } 
    else if (error.code === 11000) {
        res.status(400).json({ error: 'Username already exists' });
    } 
    else {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Incorrect email.' });
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      return res.status(401).json({ message: 'Incorrect password.' });
    }

    const payLoad = {
      id: User._id,
      role: User.role
    };

    const token = generateToken(payLoad);
    console.log("Generated Token:", token);

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/users/profile', jwtAuthMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/FYP', jwtAuthMiddleware, (req, res) => {
 return res.send("Hi, This is FYP Management System!");
});

module.exports = router;
