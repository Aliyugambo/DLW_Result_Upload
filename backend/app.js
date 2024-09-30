const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const fileRoutes = require('./routes/files');
const authRoutes = require('./routes/auth');

dotenv.config();

const app = express();

app.use(cors());
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB Atlas connected'))
    .catch((error) => console.error('MongoDB connection error:', error));

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use('/api/files', fileRoutes);
app.use('/api/auth', authRoutes);

module.exports = app;
