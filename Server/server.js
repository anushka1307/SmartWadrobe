const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({
  origin: '*', 
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Routes
app.use('/api/users', userRoutes);

const PORT = 3000;
const uri = process.env.Mongo_URI;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection failed:', error);
  });
