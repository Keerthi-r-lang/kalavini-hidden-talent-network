const { body, validationResult } = require("express-validator");

// ---------------------------------------------------------------
// handleValidationErrors
// ---------------------------------------------------------------
// Generic middleware that checks if any of the validation rules
// below failed. If they did, it responds with 400 and a list of
// readable error messages instead of letting the request reach
// the controller. Reused by every validator array in this file.
// ---------------------------------------------------------------
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }

  next();
};

// ---------------------------------------------------------------
// registerValidationRules
// ---------------------------------------------------------------
// Attached to POST /api/auth/register before registerUser runs.
// Each .custom()/.isX() call adds one rule; express-validator
// collects failures and handleValidationErrors turns them into
// a response.
// ---------------------------------------------------------------
const registerValidationRules = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 60 })
    .withMessage("Name must be between 2 and 60 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  handleValidationErrors,
];

// ---------------------------------------------------------------
// loginValidationRules
// ---------------------------------------------------------------
// Attached to POST /api/auth/login. Intentionally lighter than
// registration - we just need a well-formed email and a
// non-empty password; the actual credential check happens in the
// controller against the hashed password.
// ---------------------------------------------------------------
const loginValidationRules = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  body("password").notEmpty().withMessage("Password is required"),

  handleValidationErrors,
];

// ---------------------------------------------------------------
// updateProfileValidationRules
// ---------------------------------------------------------------
// Attached to PUT /api/auth/profile. All fields are optional here
// since this is an update (the user might only want to change
// their bio, for example) - but if a field IS provided, it must be
// valid.
// ---------------------------------------------------------------
const updateProfileValidationRules = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 60 })
    .withMessage("Name must be between 2 and 60 characters"),

  body("bio")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Bio cannot exceed 500 characters"),

  body("skillsToTeach")
    .optional()
    .isArray()
    .withMessage("skillsToTeach must be an array of strings"),

  body("skillsToLearn")
    .optional()
    .isArray()
    .withMessage("skillsToLearn must be an array of strings"),

  handleValidationErrors,
];

module.exports = {
  registerValidationRules,
  loginValidationRules,
  updateProfileValidationRules,
};
