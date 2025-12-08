const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Course = require("../models/Course");
const { protect } = require("../middleware/authMiddleware");

// Récupérer les infos de l’utilisateur connecté
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔥 Route manquante → récupérer les cours de l’utilisateur !
router.get("/:userId/courses", protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate("courses", "title description instructor");

    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    res.json({
      success: true,
      courses: user.courses,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
