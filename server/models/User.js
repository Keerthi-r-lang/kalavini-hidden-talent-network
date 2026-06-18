const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// ---------------------------------------------------------------
// USER MODEL
// ---------------------------------------------------------------
// This schema was originally created with just the basics
// (name, email, password, department, year, bio). Those fields
// are kept exactly as they were - we are only ADDING fields that
// the skill-exchange and matching features depend on, plus a
// password-hashing hook so passwords are never stored in plain
// text in the database.
// ---------------------------------------------------------------

const userSchema = new mongoose.Schema(
  {
    // --- Original fields (unchanged) ---
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      // Basic email shape check at the schema level. The
      // express-validator middleware does a stricter check before
      // this ever runs, but this is a second line of defense.
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      // select: false means this field is excluded from query
      // results by default (e.g. User.find()) so we never
      // accidentally send a password hash back to the client.
      // We explicitly re-include it with .select("+password")
      // only in the login controller, where we need it to compare.
      select: false,
    },

    department: {
      type: String,
      default: "",
    },

    year: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
      maxlength: [500, "Bio cannot exceed 500 characters"],
    },

    // --- New fields needed for skill exchange + matching ---

    // Skills this user can teach others. Kept as an array of
    // plain strings for now (e.g. ["Guitar", "Photography"]).
    // The dedicated Skill model (built in a later module) will
    // reference users by id; this array is what the MATCHING
    // algorithm scans quickly without needing a join.
    skillsToTeach: {
      type: [String],
      default: [],
    },

    // Skills this user wants to learn from someone else.
    skillsToLearn: {
      type: [String],
      default: [],
    },

    // Optional location string (e.g. "Hyderabad, India"). Used as
    // an optional signal in matching - never required, since the
    // platform should work for people who don't want to share it.
    location: {
      type: String,
      default: "",
    },

    // Free-text availability (e.g. "Weekday evenings",
    // "Weekends only"). Kept simple on purpose; can be upgraded to
    // a structured schedule object later without breaking existing
    // data, since Mongoose just ignores fields it doesn't recognize
    // on read.
    availability: {
      type: String,
      default: "",
    },

    // Profile photo URL. Defaults to empty string; the frontend
    // falls back to an initials avatar when this is empty.
    profilePicture: {
      type: String,
      default: "",
    },

    // Used by the Notifications/Requests modules to mark a user
    // active/inactive without deleting their account.
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // adds createdAt / updatedAt automatically
  }
);

// ---------------------------------------------------------------
// INDEXES
// ---------------------------------------------------------------
// Speeds up the matching algorithm's queries that filter by what
// people teach/want to learn (e.g. "find users who teach Guitar").
userSchema.index({ skillsToTeach: 1 });
userSchema.index({ skillsToLearn: 1 });

// ---------------------------------------------------------------
// PASSWORD HASHING HOOK
// ---------------------------------------------------------------
// Runs automatically before any User document is saved.
// We only re-hash the password if it was actually changed -
// otherwise, calling user.save() after e.g. updating a bio would
// re-hash an already-hashed password and break login.


  userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// ---------------------------------------------------------------
// INSTANCE METHOD: matchPassword
// ---------------------------------------------------------------
// Compares a plain-text password (typed at login) against the
// hashed password stored in the database. Returns true/false.
// Used by authController.loginUser.
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
