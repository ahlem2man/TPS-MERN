const Review = require('../models/Review');
const Course = require('../models/Course');

exports.addReview = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { rating, comment, userId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Cours non trouvé" });
    }

    const review = await Review.create({
      rating,
      comment,
      course: courseId,
      user: userId
    });

    res.status(201).json(review);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

// Récupérer les reviews d’un cours
exports.getCourseReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ course: req.params.courseId })
      .populate('user', 'username');

    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
