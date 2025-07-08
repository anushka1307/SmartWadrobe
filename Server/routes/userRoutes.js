const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/UserInfo');
const { OAuth2Client } = require('google-auth-library');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

const cors = require('cors');
router.use(cors());


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/auth/google', async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    let user = await User.findOne({ email });
    
    if (!user) {
      user = new User({
        email,
        googleId,
      });
      await user.save();
    }

    // Generate JWT token
    const jwtToken = jwt.sign(
      { id: user._id, email: user.email }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    res.json({ 
      token: jwtToken, 
      user: { 
        id: user._id, 
        email: user.email, 
        username: user.username 
      } 
    });

  } catch (error) {
    console.error('Google authentication error:', error);
    res.status(400).json({ error: 'Google authentication failed' });
  }
});

router.use('/auth/google/callback', (req, res, next) => {
  res.removeHeader('Cross-Origin-Opener-Policy');
  res.removeHeader('Cross-Origin-Embedder-Policy');
  next();
});


// Registration endpoint
router.post('/register', async (req, res) => {
  const { username, password, email } = req.body;

  try {

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }


    const hashedPassword = await bcrypt.hash(password, 10);


    const user = new User({
      username,
      password: hashedPassword,
      email
    });

    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error registering user', details: err.message });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }


    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }


    const token = jwt.sign(
  { id: user._id.toString(), username: user.username },
  process.env.JWT_SECRET,  // safer and dynamic!
  { expiresIn: '1h' }
);


    res.json({ message: 'Login successful', token, userid: user._id });
  } catch (err) {
    res.status(500).json({ error: 'Error logging in', details: err.message });
  }
});

module.exports = router;