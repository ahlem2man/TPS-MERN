const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const User = require("../models/User");

// Route publique
router.get("/", async (req, res) => {
  res.send("Accessible sans authentification");
});

// Route protégée
router.get("/profile", protect, async (req, res) => {
  const user = await User.findById(req.userId).select("-password");
  res.json(user);
});

module.exports = router;
