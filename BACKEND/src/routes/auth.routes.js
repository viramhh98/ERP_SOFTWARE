//user routes
const express=require('express');
const router=express.Router();



// Create a new user
const signup=require('../controllers/signup.controller.js');
const validateSignup=require('../middleware/validateSignup.middleware.js');
router.post('/signup',validateSignup,signup);



// Login user
const validateLogin=require('../middleware/validateLogin.middleware.js');
const login=require('../controllers/login.controller.js');
router.post('/login',validateLogin,login);



//test route to verify auth middleware
const authMiddleware = require("../middleware/auth.middleware.js");
router.get("/test", authMiddleware, (req, res) => {
  res.json({
    message: "You are authorized",
    user: req.user
  });
});

module.exports = router;


module.exports=router;
