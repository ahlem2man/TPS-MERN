const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware'); // ← IMPORT AJOUTÉ
const User = require('../models/User');

// Route pour obtenir le profil de l'utilisateur connecté
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select('-password')
      .populate('courses', 'title instructor');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }
    
    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Erreur récupération profil:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Route pour mettre à jour le profil
router.put('/:id', protect, async (req, res) => {
  try {
    // Vérifier que l'utilisateur met à jour son propre profil
    if (req.params.id !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à modifier ce profil'
      });
    }
    
    const { bio, website, ...otherFields } = req.body;
    
    // Liste des champs autorisés à être mis à jour
    const allowedUpdates = ['bio', 'website', 'avatar'];
    const updates = {};
    
    // Filtrer les champs autorisés
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }
    
    res.json({
      success: true,
      message: 'Profil mis à jour',
      user
    });
  } catch (error) {
    console.error('Erreur mise à jour profil:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Route pour obtenir le profil d'un utilisateur par ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('username email bio website courses createdAt')
      .populate('courses', 'title instructor');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }
    
    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Erreur récupération profil public:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Route pour obtenir les cours d'un utilisateur
router.get('/:id/courses', protect, async (req, res) => {
  try {
    // Vérifier que l'utilisateur demande ses propres cours ou autoriser l'accès
    const user = await User.findById(req.params.id)
      .populate('courses', 'title description instructor students');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }
    
    res.json({
      success: true,
      courses: user.courses,
      count: user.courses.length
    });
  } catch (error) {
    console.error('Erreur récupération cours utilisateur:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;