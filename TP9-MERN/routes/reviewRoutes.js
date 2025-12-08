const express = require('express');
const router = express.Router();
const { getUserReviews, deleteReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');


router.get('/users/:userId/reviews', protect, getUserReviews);
router.delete('/:reviewId', protect, deleteReview);


module.exports = router;