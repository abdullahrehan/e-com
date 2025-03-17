require('dotenv').config({path:"./.env"});
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRouter');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', adminRoutes);
app.use('/api', authRoutes);
app.use('/api', userRoutes); 

// Basic error handling
app.use((err, req, res, next) => { 
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = 80;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
