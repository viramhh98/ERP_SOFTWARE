const loginService = require("../services/login.service");

const login = async (req, res) => {
  try {
    const { user, token } = await loginService(req.body);
    // remove password before sending
    const { password, ...safeUser } = user.toObject();

    res.status(200).json({
      message: "Login successful",
      user: safeUser,
      token
    });

  } catch (error) {

    if (error.message === "Invalid credentials") {
      return res.status(401).json({
        error: "Invalid email or password"
      });
    }

    res.status(500).json({
      error: error.message
    });
  }
};

module.exports = login;