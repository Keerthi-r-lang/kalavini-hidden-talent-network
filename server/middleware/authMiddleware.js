const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    next();
  } catch (error) {
    res.status(401).json({
      message: "Token failed",
    });
  }
};

module.exports = { protect };