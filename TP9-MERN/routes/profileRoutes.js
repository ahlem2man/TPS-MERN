const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Profile = require('../models/Profile');
const User = require('../models/User');

// ✅ Obtenir son profil (utilisateur connecté)
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select('-password')
      .populate('courses', 'title instructor');

    if (!user) return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });

    const profile = await Profile.findOne({ user: req.userId });
    
    res.json({ 
      success: true, 
      user, 
      profile 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ Mettre à jour son profil (utilisateur connecté)
router.put('/', protect, async (req, res) => {
  try {
    const allowedUpdates = ['bio', 'website', 'avatar'];
    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) updates[key] = req.body[key];
    });

    // Recherche du profil existant
    let profile = await Profile.findOne({ user: req.userId });
    
    // 🔥 Si inexistant, création automatique
    if (!profile) {
      profile = await Profile.create({ user: req.userId });
    }

    // Appliquer les mises à jour
    Object.assign(profile, updates);
    await profile.save();

    res.json({ success: true, message: 'Profil mis à jour', profile });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ Obtenir le profil d’un utilisateur par ID (public)
router.get('/:id', async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.id }).populate('user', 'username email');

    if (!profile) return res.status(404).json({ success: false, message: 'Profil non trouvé' });

    res.json({ success: true, profile });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
