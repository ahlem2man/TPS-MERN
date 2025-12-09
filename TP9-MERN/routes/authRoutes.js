const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Register
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    console.log("=== REGISTER REQUEST ===");
    console.log("Email:", email);
    console.log("Username:", username);
    console.log("JWT_SECRET:", process.env.JWT_SECRET);

    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log("Email already exists:", email);
      return res.status(400).json({ success: false, message: "Email déjà utilisé" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ 
      username, 
      email, 
      password: hashedPassword 
    });

    console.log("User created with ID:", user._id);

    const token = jwt.sign({ 
      userId: user._id.toString(),
      email: user.email 
    }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      success: true,
      token,
      user: { 
        id: user._id, 
        username: user.username, 
        email: user.email 
      }
    });
  } catch (error) {
    console.error("Register error:", error);
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Email déjà utilisé" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("=== LOGIN REQUEST ===");
    console.log("Email:", email);

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "Email ou mot de passe incorrect" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Email ou mot de passe incorrect" });
    }

    const token = jwt.sign({ 
      userId: user._id.toString(),
      email: user.email 
    }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      success: true,
      token,
      user: { 
        id: user._id, 
        username: user.username, 
        email: user.email 
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
