const express = require('express');
const router = express.Router();
const { addReview, getCourseReviews } = require('../controllers/reviewController');

router.post('/:courseId', addReview);
router.get('/:courseId', getCourseReviews);

module.exports = router;
