const Course = require('../models/Course');
const User = require('../models/User');

exports.createCourse = async (req, res) => {
  try {
    const { title, description, instructor } = req.body;
    const course = await Course.create({ title, description, instructor });
    res.status(201).json(course);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('students', 'username email');

    if (!course)
      return res.status(404).json({ message: 'Cours non trouvé' });

    res.json(course);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.enrollUserInCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { userId } = req.body;

    const course = await Course.findById(courseId);
    const user = await User.findById(userId);

    if (!course || !user)
      return res.status(404).json({ message: 'Cours ou utilisateur non trouvé' });

    if (!course.students.includes(userId)) {
      course.students.push(userId);
      await course.save();
    }

    if (!user.courses.includes(courseId)) {
      user.courses.push(courseId);
      await user.save();
    }

    res.json({ message: '✅ Inscription réussie' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

exports.getCourseStudents = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId)
      .populate('students', 'username email');

    if (!course)
      return res.status(404).json({ message: 'Cours non trouvé' });

    res.json(course.students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
