const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const userModel = require('../models/userModel');

/**
 * Registers a new user.  Only admin users should call this to create
 * student accounts or additional admins.  The request body should
 * include username, password, role, full_name, email and optionally
 * department_id.  Responds with the created user (without the
 * password).  If username already exists, returns a 400 error.
 */
async function register(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { username, password, role, full_name, email, department_id } = req.body;
    // Check for existing user
    const existingUser = await userModel.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const newUser = await userModel.createUser({
      username,
      password: hash,
      role,
      full_name,
      email,
      department_id,
    });
    // Remove password before sending response
    delete newUser.password;
    res.status(201).json({ user: newUser });
  } catch (err) {
    next(err);
  }
}

/**
 * Logs a user in.  Verifies credentials and returns a signed JWT
 * containing the user’s ID, username and role.  The token expires
 * according to TOKEN_EXPIRY defined in .env.  If the credentials are
 * invalid, returns a 401 error.
 */
async function login(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { username, password } = req.body;
    const user = await userModel.findByUsername(username);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const payload = {
      id: user.id,
      username: user.username,
      role: user.role,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.TOKEN_EXPIRY || '1h' });
    res.json({ token, user: { id: user.id, username: user.username, role: user.role, full_name: user.full_name, email: user.email } });
  } catch (err) {
    next(err);
  }
}

/**
 * Returns the authenticated user’s details.  Requires authentication.
 */
async function getMe(req, res, next) {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    delete user.password;
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  register,
  login,
  getMe,
};