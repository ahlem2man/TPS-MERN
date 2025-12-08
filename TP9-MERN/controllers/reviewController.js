const Review = require('../models/Review');
const Course = require('../models/Course');

// ================= ADD REVIEW ===================
exports.addReview = async (req, res) => {
  try {
    const courseId = req.params.id;
    const { rating, comment } = req.body;
    const userId = req.userId;

    // Vérifier si le cours existe
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Cours non trouvé' });

    // Vérifier si l'utilisateur est inscrit
    const isEnrolled = course.students.some(
      studentId => studentId.toString() === userId
    );
    if (!isEnrolled)
      return res.status(403).json({ message: 'Inscription requise pour laisser un avis' });

    // Vérifier si l'utilisateur a déjà posté un avis
    const existing = await Review.findOne({ user: userId, course: courseId });
    if (existing)
      return res.status(400).json({ message: 'Vous avez déjà laissé un avis' });

    // Créer le review
    const review = await Review.create({ user: userId, course: courseId, rating, comment });
    res.status(201).json({ success: true, review });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= GET COURSE REVIEWS ===================
exports.getCourseReviews = async (req, res) => {
  try {
    const courseId = req.params.id;
    const reviews = await Review.find({ course: courseId }).populate('user', 'username');
    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= GET USER REVIEWS ===================
exports.getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.params.userId }).populate(
      'course',
      'title instructor'
    );
    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= DELETE REVIEW ===================
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) return res.status(404).json({ message: 'Avis non trouvé' });

    if (review.user.toString() !== req.userId)
      return res.status(403).json({ message: 'Non autorisé' });

    await review.remove();
    res.json({ success: true, message: 'Avis supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
