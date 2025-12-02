const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

// Import des routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');
const reviewRoutes = require('./routes/reviewRoutes'); // ← Doit exister
const profileRoutes = require('./routes/profileRoutes');

const connectDB = require('./config/db');

const app = express();

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/reviews', reviewRoutes); // ← Doit être présent
app.use('/api/profiles', profileRoutes);

// Test route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    routes: ['auth', 'users', 'courses', 'reviews', 'profiles']
  });
});

app.get('/', (req, res) => {
  res.json({ 
    message: 'API EduPlatform Running',
    version: '1.0.0'
  });
});

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`
╔══════════════════════════════════════╗
║     SERVEUR BACKEND DÉMARRÉ         ║
╠══════════════════════════════════════╣
║ Port: ${PORT}                          ║
║ URL: http://localhost:${PORT}         ║
║ Routes: /api/auth, /api/users,      ║
║        /api/courses, /api/reviews,  ║
║        /api/profiles                ║
║ Test: http://localhost:${PORT}/api/health
╚══════════════════════════════════════╝
      `);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB error:', err);
    process.exit(1);
  });