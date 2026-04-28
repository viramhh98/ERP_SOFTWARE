const User = require("../models/user.model.js");
const bcrypt = require("bcrypt");

async function signupService(data) {
  const { name, email, password } = data;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword
  });

  return user;
}

module.exports =  signupService;