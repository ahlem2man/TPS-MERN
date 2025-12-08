require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();


app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());


// routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));


const PORT = process.env.PORT || 5000;


mongoose.connect(process.env.MONGO_URI)
.then(() => {
console.log('MongoDB connected');
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch(err => console.error(err));