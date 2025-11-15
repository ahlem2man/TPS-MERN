const express = require('express');
const router = express.Router();

const {
  createCourse,
  getCourses,
  getCourse,
  enrollUserInCourse,
  getCourseStudents
} = require('../controllers/courseController');

router.post('/', createCourse);
router.get('/', getCourses);
router.get('/:id', getCourse);
router.post('/:courseId/enroll', enrollUserInCourse);
router.get('/:courseId/students', getCourseStudents);

module.exports = router;
