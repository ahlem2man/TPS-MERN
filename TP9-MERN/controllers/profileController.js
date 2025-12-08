const Profile = require('../models/Profile');
const User = require('../models/User');

// Modifier un profil
exports.updateProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    // Vérifier que le profil existe
    const profile = await Profile.findOneAndUpdate(
      { user: userId },
      updates,
      { new: true, runValidators: true }
    );

    if (!profile) {
      return res.status(404).json({ message: "Profil non trouvé" });
    }

    // Mettre à jour aussi l'utilisateur si nécessaire (bio, website, avatar)
    const allowedUserUpdates = ['bio', 'website', 'avatar'];
    const userUpdates = {};
    allowedUserUpdates.forEach(field => {
      if (updates[field] !== undefined) {
        userUpdates[field] = updates[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: userUpdates },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      profile,
      user
    });

  } catch (err) {
    console.error('Erreur mise à jour profil:', err);
    res.status(400).json({ message: err.message });
  }
};
