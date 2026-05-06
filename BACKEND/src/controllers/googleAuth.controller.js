
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js"); 
const { GoogleClientID } = require("../config/env.config.js");
const client = new OAuth2Client(GoogleClientID)

const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ error: "Google token is required" });
    }

    // 1. Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name } = payload;

    // 2. Check if the user already exists in your database
    let user = await User.findOne({ email });

    // 🔥 MAIN CHANGE: Agar user nahi mila, toh error de do (Create mat karo)
    if (!user) {
      return res.status(404).json({ 
        message: "Account not found!" 
      });
    }

    // 3. Agar user mil gaya, aur usne pehle email/password se account banaya tha, 
    // toh bas uska Google ID link kar do
    if (!user.googleId) {
      user.googleId = googleId;
      // user.authProvider = "google"; // Optional, depend karta hai aap track karna chahte ho ya nahi
      await user.save();
    }

    // 4. Generate your ERP's standard JWT token
    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 5. Send the response
    res.status(200).json({
      message: "Google login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("Google Auth Error in Controller:", error);
    res.status(500).json({ message: "Google Authentication failed. Invalid token." });
  }
};

module.exports = googleAuth;