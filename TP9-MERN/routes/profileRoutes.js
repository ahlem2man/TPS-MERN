const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Profile = require('../models/Profile');
const User = require('../models/User');

// ✅ Obtenir son profil
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select('-password')
      .populate('courses', 'title instructor');

    if (!user) return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ Mettre à jour son profil
router.put('/:id', protect, async (req, res) => {
  try {
    if (req.params.id !== req.userId) {
      return res.status(403).json({ success: false, message: 'Non autorisé à modifier ce profil' });
    }

    const allowedUpdates = ['bio', 'website', 'avatar'];
    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) updates[key] = req.body[key];
    });

    const profile = await Profile.findOneAndUpdate(
      { user: req.userId },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!profile) return res.status(404).json({ success: false, message: 'Profil non trouvé' });

    res.json({ success: true, message: 'Profil mis à jour', profile });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ Obtenir le profil d’un utilisateur par ID
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
