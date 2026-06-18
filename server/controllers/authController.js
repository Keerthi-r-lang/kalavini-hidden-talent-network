const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// ---------------------------------------------------------------
// formatUserResponse
// ---------------------------------------------------------------
// Small helper used by both register and login so the shape of
// the user object we send back to the frontend is always
// identical. Never includes the password, even though our schema
// already excludes it by default (select: false) - this is a
// second safety net in case that ever changes.
// ---------------------------------------------------------------
const formatUserResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  department: user.department,
  year: user.year,
  bio: user.bio,
  skillsToTeach: user.skillsToTeach,
  skillsToLearn: user.skillsToLearn,
  location: user.location,
  availability: user.availability,
  profilePicture: user.profilePicture,
  createdAt: user.createdAt,
});

// ---------------------------------------------------------------
// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
// ---------------------------------------------------------------
// Flow:
//   1. registerValidationRules (middleware) already confirmed
//      name/email/password are present and well-formed before
//      this function runs.
//   2. Check if a user with this email already exists.
//   3. Create the user - the password gets hashed automatically
//      by the pre("save") hook defined in models/User.js.
//   4. Generate a JWT and send it back along with the user's
//      public profile data.
// ---------------------------------------------------------------
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, department, year, bio } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      department,
      year,
      bio,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      message: "Account created successfully",
      token,
      user: formatUserResponse(user),
    });
  } catch (error) {
    // Pass to the centralized error handler (middleware/errorMiddleware.js)
    // rather than handling it here, so error formatting stays
    // consistent across the whole API.
    next(error);
  }
};

// ---------------------------------------------------------------
// @desc    Authenticate a user and return a token
// @route   POST /api/auth/login
// @access  Public
// ---------------------------------------------------------------
// Flow:
//   1. loginValidationRules already confirmed email/password are
//      present.
//   2. Find the user by email. We explicitly request the password
//      field with .select("+password") because the schema hides
//      it by default.
//   3. Compare the submitted password against the stored hash
//      using the matchPassword instance method (bcrypt.compare).
//   4. On success, issue a new JWT.
//
// We deliberately return the SAME error message whether the email
// doesn't exist or the password is wrong ("Invalid email or
// password"). This stops an attacker from using the login
// endpoint to figure out which emails are registered.
// ---------------------------------------------------------------
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      message: "Logged in successfully",
      token,
      user: formatUserResponse(user),
    });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------------
// @desc    Get the logged-in user's own profile
// @route   GET /api/auth/profile
// @access  Private (requires `protect` middleware)
// ---------------------------------------------------------------
// By the time this runs, `protect` has already verified the JWT
// and attached the user document to req.user. We don't need to
// query the database again - we just format and return it.
// ---------------------------------------------------------------
const getProfile = async (req, res, next) => {
  try {
    res.status(200).json({
      user: formatUserResponse(req.user),
    });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------------
// @desc    Update the logged-in user's profile
// @route   PUT /api/auth/profile
// @access  Private (requires `protect` middleware)
// ---------------------------------------------------------------
// Only updates fields that were actually sent in the request body
// (so a partial update like { bio: "new bio" } doesn't wipe out
// other fields). Password updates are intentionally NOT handled
// here - that deserves its own endpoint later (e.g.
// /api/auth/change-password) with extra checks like confirming
// the current password first.
// ---------------------------------------------------------------
const updateProfile = async (req, res, next) => {
  try {
    const user = req.user;

    const updatableFields = [
      "name",
      "department",
      "year",
      "bio",
      "skillsToTeach",
      "skillsToLearn",
      "location",
      "availability",
      "profilePicture",
    ];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    const updatedUser = await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: formatUserResponse(updatedUser),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
};
