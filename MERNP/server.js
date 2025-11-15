const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const profileRoutes = require('./routes/profileRoutes');

const connectDB = require('./config/db');

const app = express();


app.use(express.json());
app.use(cors());


app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/profiles', profileRoutes);

app.get('/', (req, res) => res.send('API EduPlatform Running '));

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error(' Failed to connect to MongoDB:', err);
    process.exit(1);
  });
