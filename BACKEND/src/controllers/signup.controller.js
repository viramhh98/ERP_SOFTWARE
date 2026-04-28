const signupService  = require("../services/signup.service.js");

const signup = async (req, res) => {
  try {
    const user = await signupService(req.body);

    res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        error: "Email already exists",
      });
    }

    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = signup;
