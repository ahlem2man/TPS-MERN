const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require("cors");

// Import des routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const profileRoutes = require('./routes/profileRoutes');

const connectDB = require('./config/db');

const app = express();

// =======================
//  🔥 FIX CORS DEFINITIF 🔥
// =======================
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET","POST","PUT","DELETE","PATCH","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
  credentials: true
}));

// Obligatoire AVANT routes !
app.use(express.json());

// =======================
//  ROUTES API
// =======================
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/profiles', profileRoutes);

app.get('/api/health', (req, res) => res.json({ status:"OK" }));
app.get('/', (req, res) => res.json({ message:'API Running' }));

const PORT = process.env.PORT || 5000;

// =======================
//  START SERVER
// =======================
connectDB().then(() => {
    app.listen(PORT, () =>
      console.log(`🚀 Server Running on http://localhost:${PORT}`)
    );
}).catch(err => {
    console.error("❌ MongoDB Error", err);
    process.exit(1);
});
