const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { generateToken } = require('../utils/generateToken');

// @desc    Register new user
// @route   POST /api/auth/signup
// @access  Public
const signup = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Validation
  if (!name || !email || !password || !role) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  // Validate role
  const validRoles = ['user', 'artisan', 'ngo', 'admin'];
  if (!validRoles.includes(role)) {
    res.status(400);
    throw new Error('Invalid role. Must be user, artisan, ngo, or admin');
  }

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists with this email');
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  if (user) {
    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      },
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Authenticate user
// @route   POST /api/auth/signin
// @access  Public
const signin = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;

  // Validation
  if (!email || !password || !role) {
    res.status(400);
    throw new Error('Please provide email, password, and role');
  }

  // Validate role
  const validRoles = ['user', 'artisan', 'ngo', 'admin'];
  if (!validRoles.includes(role)) {
    res.status(400);
    throw new Error('Invalid role. Must be user, artisan, ngo, or admin');
  }

  // Check for user with matching email and role
  const user = await User.findOne({ email, role }).select('+password');

  if (user && (await user.matchPassword(password))) {
    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      },
    });
  } else {
    res.status(401);
    throw new Error('Invalid email, password, or role');
  }
});

module.exports = {
  signup,
  signin,
};
