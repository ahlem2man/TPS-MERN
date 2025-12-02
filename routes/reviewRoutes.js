const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware'); // ← IMPORT AJOUTÉ
const Review = require('../models/Review');
const Course = require('../models/Course');

// Route pour obtenir les reviews d'un utilisateur
router.get('/users/:userId/reviews', protect, async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.params.userId })
      .populate('course', 'title instructor')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: reviews.length,
      reviews
    });
  } catch (error) {
    console.error('Erreur récupération reviews:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Route pour créer une review
router.post('/courses/:courseId/reviews', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const courseId = req.params.courseId;
    const userId = req.userId; // Vient du middleware protect
    
    // Vérifier si l'utilisateur est inscrit au cours
    const course = await Course.findById(courseId);
    if (!course.students.includes(userId)) {
      return res.status(403).json({
        success: false,
        message: 'Vous devez être inscrit au cours pour laisser un avis'
      });
    }
    
    // Vérifier si l'utilisateur a déjà laissé un avis
    const existingReview = await Review.findOne({
      user: userId,
      course: courseId
    });
    
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'Vous avez déjà laissé un avis sur ce cours'
      });
    }
    
    // Créer la review
    const review = await Review.create({
      user: userId,
      course: courseId,
      rating,
      comment
    });
    
    // Mettre à jour la moyenne des notes du cours
    const courseReviews = await Review.find({ course: courseId });
    const averageRating = courseReviews.reduce((acc, rev) => acc + rev.rating, 0) / courseReviews.length;
    
    course.averageRating = averageRating;
    course.reviewCount = courseReviews.length;
    await course.save();
    
    res.status(201).json({
      success: true,
      review: {
        ...review.toObject(),
        user: { id: userId },
        course: { id: courseId, title: course.title }
      }
    });
  } catch (error) {
    console.error('Erreur création review:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Route pour obtenir les reviews d'un cours
router.get('/courses/:courseId/reviews', async (req, res) => {
  try {
    const reviews = await Review.find({ course: req.params.courseId })
      .populate('user', 'username')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      reviews
    });
  } catch (error) {
    console.error('Erreur récupération reviews cours:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Route pour mettre à jour une review
router.put('/:reviewId', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const review = await Review.findById(req.params.reviewId);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review non trouvée'
      });
    }
    
    // Vérifier que l'utilisateur est le propriétaire de la review
    if (review.user.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé'
      });
    }
    
    review.rating = rating;
    review.comment = comment;
    await review.save();
    
    res.json({
      success: true,
      review
    });
  } catch (error) {
    console.error('Erreur mise à jour review:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Route pour supprimer une review
router.delete('/:reviewId', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review non trouvée'
      });
    }
    
    // Vérifier que l'utilisateur est le propriétaire de la review
    if (review.user.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé'
      });
    }
    
    await review.deleteOne();
    
    res.json({
      success: true,
      message: 'Review supprimée'
    });
  } catch (error) {
    console.error('Erreur suppression review:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;