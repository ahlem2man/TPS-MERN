const Course = require('../models/Course');

// ================= GET COURSES ===================
exports.getCourses = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalCourses = await Course.countDocuments();
    const totalPages = Math.ceil(totalCourses / limit);

    const courses = await Course.find().skip(skip).limit(limit);

    res.json({
      success: true,
      courses,
      pagination: { totalPages, currentPage: page, total: totalCourses }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= GET COURSE ===================
exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('students', 'username email');
    if (!course) return res.status(404).json({ message: 'Cours introuvable' });

    res.json({ success: true, course });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= ENROLL ===================
exports.enroll = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Cours introuvable' });

    // Vérifier si l'utilisateur est déjà inscrit
    const alreadyEnrolled = course.students.some(
      studentId => studentId.toString() === req.userId
    );
    if (alreadyEnrolled)
      return res.status(400).json({ message: 'Déjà inscrit' });

    // Ajouter l'utilisateur au cours
    course.students.push(req.userId);
    await course.save();

    res.json({ success: true, message: 'Inscription réussie 🎉', course });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
