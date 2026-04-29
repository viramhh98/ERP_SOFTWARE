// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       lowercase: true,
//     },
//     password: {
//       type: String,
//       required: true,
//     },
//   },
//   { timestamps: true }
// );

// userSchema.index({ email: 1 }, { unique: true });
// const User = mongoose.model("User", userSchema);

// module.exports = User;



const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    password: {
      type: String,
      // REMOVED: required: true
      // Passwords are no longer strictly required because Google users won't have one.
    },
    googleId: {
      type: String,
      // Keep track of Google users. It's optional because traditional users won't have it.
    },
    authProvider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local'
    }
  },
  { timestamps: true }
);

userSchema.index({ email: 1 }, { unique: true });
const User = mongoose.model("User", userSchema);

module.exports = User;