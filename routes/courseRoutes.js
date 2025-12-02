const express = require('express');
const router = express.Router();
const Course = require('../models/Course'); // ← IMPORT AJOUTÉ

const {
  createCourse,
  getCourses,
  getCourse,
  enrollUserInCourse,
  getCourseStudents
} = require('../controllers/courseController');

// === ROUTES EXISTANTES ===
router.post('/', createCourse);
router.get('/:id', getCourse);
router.post('/:courseId/enroll', enrollUserInCourse);
router.get('/:courseId/students', getCourseStudents);

// === ROUTE AMÉLIORÉE POUR PAGINATION ET RECHERCHE ===
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Construction de la query
    let query = {};
    
    // Recherche par titre
    if (req.query.search) {
      query.title = { $regex: req.query.search, $options: 'i' };
    }
    
    // Filtre par instructeur (optionnel)
    if (req.query.instructor) {
      query.instructor = { $regex: req.query.instructor, $options: 'i' };
    }
    
    // Récupération des cours avec pagination
    const courses = await Course.find(query)
      .skip(skip)
      .limit(limit)
      .populate('students', 'username email')
      .sort({ createdAt: -1 });
    
    // Comptage total
    const total = await Course.countDocuments(query);
    
    // Calcul du nombre total de pages
    const totalPages = Math.ceil(total / limit);
    
    res.json({
      success: true,
      courses,
      pagination: {
        currentPage: page,
        totalPages,
        totalCourses: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Erreur récupération cours:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
});

// === ROUTE SUPPRIMÉE ===
// Supprimez l'ancien router.get('/', getCourses) car il est remplacé

module.exports = router;