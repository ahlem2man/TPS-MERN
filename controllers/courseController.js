const Course = require('../models/Course');
const User = require('../models/User');

exports.createCourse = async (req, res) => {
  try {
    const { title, description, instructor } = req.body;
    const course = await Course.create({ title, description, instructor });
    res.status(201).json({
      success: true,
      course
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ 
      success: false,
      message: err.message 
    });
  }
};

exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('students', 'username email');

    if (!course)
      return res.status(404).json({ 
        success: false,
        message: 'Cours non trouvé' 
      });

    res.json({
      success: true,
      course
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};

exports.enrollUserInCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    // OPTION 1: userId vient du middleware protect (recommandé)
    const userId = req.userId;
    
    // OPTION 2: userId vient du body (si vous préférez)
    // const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ 
        success: false,
        message: 'ID utilisateur manquant' 
      });
    }

    const course = await Course.findById(courseId);
    const user = await User.findById(userId);

    if (!course || !user)
      return res.status(404).json({ 
        success: false,
        message: 'Cours ou utilisateur non trouvé' 
      });

    // Vérifier si déjà inscrit
    if (course.students.includes(userId)) {
      return res.status(400).json({ 
        success: false,
        message: 'Déjà inscrit à ce cours' 
      });
    }

    // Ajouter l'utilisateur au cours
    course.students.push(userId);
    await course.save();

    // Ajouter le cours à l'utilisateur
    if (!user.courses.includes(courseId)) {
      user.courses.push(courseId);
      await user.save();
    }

    res.json({ 
      success: true,
      message: '✅ Inscription réussie',
      course: {
        id: course._id,
        title: course.title
      }
    });
  } catch (err) {
    console.error('Erreur inscription:', err);
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};

exports.getCourseStudents = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId)
      .populate('students', 'username email');

    if (!course)
      return res.status(404).json({ 
        success: false,
        message: 'Cours non trouvé' 
      });

    res.json({
      success: true,
      students: course.students
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};