const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  bio: {
    type: String,
    default: '',
    maxlength: 500
  },
  website: {
    type: String,
    default: '',
    validate: {
      validator: function(v) {
        return v === '' || /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(v);
      },
      message: props => `${props.value} n'est pas une URL valide!`
    }
  },
  avatar: {
    type: String,
    default: ''
  },
  courses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  role: {
    type: String,
    enum: ['student', 'instructor', 'admin'],
    default: 'student'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);