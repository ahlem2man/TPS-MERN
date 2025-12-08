const User = require('../models/User');
const asyncHandler = require('express-async-handler');

const createUser = asyncHandler(async (req, res) => {
const { username, email } = req.body;
const user = await User.create({ username, email });
res.status(201).json(user);
});

const getUsers = asyncHandler(async (req, res) => {
const users = await User.find();
res.json(users);
});

const getUser = asyncHandler(async (req, res) => {
const user = await User.findById(req.params.id).populate('courses', 'title instructor');
if(!user) { res.status(404); throw new Error('Utilisateur non trouvé'); }
res.json(user);
});


module.exports = { createUser, getUsers, getUser };