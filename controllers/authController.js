const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

function formatUserResponse(user) {
  return {
    id: user.id,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    phone_number: user.phone_number,
    role: user.role,
    business_name: user.business_name,
    location: user.location,
    is_verified: user.is_verified
  };
}

const register = async (req, res, next) => {
  try {
    const { email, password, first_name, last_name, phone_number, role } = req.body;
    const existingUser = await User.findByEmail(email);
    if (existingUser) return res.status(409).json({ error: 'User already exists' });

    const password_hash = await bcrypt.hash(password, 12);

    const user = await User.create({
      email,
      password_hash,
      first_name,
      last_name,
      phone_number,
      role: role || 'buyer'
    });

    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });

    res.status(201).json({
      message: 'User created successfully',
      user: formatUserResponse(user),
      token
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    await User.updateLastLogin(user.id);

    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });

    res.json({
      message: 'Login successful',
      user: formatUserResponse(user),
      token
    });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ user: formatUserResponse(user) });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const allowedFields = ['first_name', 'last_name', 'phone_number', 'business_name', 'location'];
    const updates = {};

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.update(req.user.id, updates);

    res.json({
      message: 'Profile updated successfully',
      user: formatUserResponse(user)
    });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { current_password, new_password } = req.body;
    if (!current_password || !new_password) {
      return res.status(400).json({ error: 'Both current and new passwords are required' });
    }

    const user = await User.findById(req.user.id);
    const isValid = await bcrypt.compare(current_password, user.password_hash);

    if (!isValid) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    const newPasswordHash = await bcrypt.hash(new_password, 12);
    await User.update(req.user.id, { password_hash: newPasswordHash });

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
};

const getSellerProfile = async (req, res, next) => {
  try {
    const seller = await User.findById(req.params.id);
    if (!seller || seller.role !== 'seller') {
      return res.status(404).json({ error: 'Seller not found' });
    }

    const { password_hash, verification_document_url, national_id_number, ...publicProfile } = seller;
    res.json(publicProfile);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  getSellerProfile
};
