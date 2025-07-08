require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/UserInfo');
const { OAuth2Client } = require('google-auth-library');
const AWS = require('aws-sdk');
const ClothingAll = require('../models/ClothingAllCollection');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
  });
  
const s3 = new AWS.S3();

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

const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT error:", error.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};


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


router.post('/addClothing', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const { clothing_name, category } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Image is required.' });
    }

    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ error: 'Unsupported file type.' });
    }

    const s3Params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `images/${Date.now()}-${req.file.originalname}`,
      Body: req.file.buffer,
      ContentType: req.file.mimetype
    };

    const s3Data = await s3.upload(s3Params).promise();

    const newClothing = new ClothingAll({
      owner_id: user._id,
      clothing_name,
      category,
      image: s3Data.Location
    });

    await newClothing.save();

    res.status(201).json({ message: 'Clothing item added successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error adding clothing item', details: err.message });
  }
});

router.get('/getClothing', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const clothingItems = await ClothingAll.find({ owner_id: user._id });

    res.json(clothingItems);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching clothing items', details: err.message });
  }
});

module.exports = router;