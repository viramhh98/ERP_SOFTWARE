const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function loginService({ email, password }) {

  // 1. find user
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  // 2. compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  // 3. generate token
  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET || "SECRET_KEY",
    { expiresIn: "1d" }
  );

  return { user, token };
}

module.exports = loginService;