const express = require('express');
const router = express.Router();
const { getCourses, getCourse, enroll } = require('../controllers/courseController');
const { addReview, getCourseReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

// ================= COURSES ===================
router.get('/', getCourses);           // GET /api/courses
router.get('/:id', getCourse);         // GET /api/courses/:id
router.post('/:id/enroll', protect, enroll);  // POST /api/courses/:id/enroll

// ================= REVIEWS ===================
// Récupérer les avis d'un cours
router.get('/:id/reviews', getCourseReviews); // GET /api/courses/:id/reviews
// Ajouter un avis (protection via auth)
router.post('/:id/reviews', protect, addReview); // POST /api/courses/:id/reviews

module.exports = router;
