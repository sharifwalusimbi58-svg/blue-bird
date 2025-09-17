// Simple user controller for now
const updateProfile = async (req, res) => {
  try {
    res.json({
      message: 'Profile updated successfully!',
      user: req.body
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    res.json({
      message: 'Password changed successfully!'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSellerProfile = async (req, res) => {
  try {
    res.json({
      id: req.params.id,
      name: 'Sample Seller',
      rating: 4.5,
      business_name: 'Sample Business'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  updateProfile,
  changePassword,
  getSellerProfile
};