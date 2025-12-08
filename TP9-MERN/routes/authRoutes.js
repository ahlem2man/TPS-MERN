// routes/authRoutes.js
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

    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log("Email already exists:", email);
      return res.status(400).json({ 
        success: false,
        message: "Email déjà utilisé" 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ 
      username, 
      email, 
      password: hashedPassword 
    });

    console.log("User created with ID:", user._id);
    console.log("User ID type:", typeof user._id);
    console.log("User ID as string:", user._id.toString());

    // CONVERTIR user._id en string
    const token = jwt.sign({ 
      userId: user._id.toString(), // <-- ICI: .toString() important!
      email: user.email 
    }, process.env.JWT_SECRET, { expiresIn: "7d" });

    console.log("Token created with userId (string):", user._id.toString());

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
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
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
      console.log("User not found with email:", email);
      return res.status(401).json({ 
        success: false,
        message: "Email ou mot de passe incorrect" 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password mismatch for user:", email);
      return res.status(401).json({ 
        success: false,
        message: "Email ou mot de passe incorrect" 
      });
    }

    console.log("User found with ID:", user._id);
    console.log("User ID as string:", user._id.toString());

    // CONVERTIR user._id en string
    const token = jwt.sign({ 
      userId: user._id.toString(), // <-- ICI: .toString() important!
      email: user.email 
    }, process.env.JWT_SECRET, { expiresIn: "7d" });

    console.log("Login token created with userId (string):", user._id.toString());
    console.log("Token:", token.substring(0, 30) + "...");

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
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

// Route pour vérifier le token (optionnelle)
router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: "Pas de token" 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token decoded in /me:", decoded);
    
    const user = await User.findById(decoded.userId).select("-password");
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "Utilisateur non trouvé" 
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error("Me route error:", error);
    res.status(401).json({ 
      success: false,
      message: "Token invalide" 
    });
  }
});

module.exports = router;