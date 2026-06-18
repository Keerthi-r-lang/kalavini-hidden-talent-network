const registerUser = async (req, res) => {
  res.json({
    message: "Register User Working",
  });
};

const loginUser = async (req, res) => {
  res.json({
    message: "Login User Working",
  });
};

const getProfile = async (req, res) => {
  res.json({
    message: "Get Profile Working",
  });
};

const updateProfile = async (req, res) => {
  res.json({
    message: "Update Profile Working",
  });
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
};