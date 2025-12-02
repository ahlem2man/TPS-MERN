const Profile = require('../models/Profile');
const User = require('../models/User');

exports.createProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { bio, website } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const existing = await Profile.findOne({ user: userId });
    if (existing) {
      return res.status(400).json({ message: "Profil déjà existant" });
    }

    const profile = await Profile.create({ user: userId, bio, website });
    res.status(201).json(profile);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

// ✅ Récupérer un profil
exports.getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.userId })
      .populate('user', 'username email');

    if (!profile) {
      return res.status(404).json({ message: "Profil non trouvé" });
    }

    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Modifier un profil
exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;

    const profile = await Profile.findOneAndUpdate(
      { user: req.params.userId },
      updates,
      { new: true }
    );

    if (!profile) {
      return res.status(404).json({ message: "Profil non trouvé" });
    }

    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};
