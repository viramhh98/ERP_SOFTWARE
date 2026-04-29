// //user routes
// const express=require('express');
// const router=express.Router();



// // Create a new user
// const signup=require('../controllers/signup.controller.js');
// const validateSignup=require('../middleware/validateSignup.middleware.js');
// router.post('/signup',validateSignup,signup);



// // Login user
// const validateLogin=require('../middleware/validateLogin.middleware.js');
// const login=require('../controllers/login.controller.js');
// router.post('/login',validateLogin,login);






// module.exports=router;




//user routes
const express = require('express');
const router = express.Router();

// Create a new user
const signup = require('../controllers/signup.controller.js');
const validateSignup = require('../middleware/validateSignup.middleware.js');
router.post('/signup', validateSignup, signup);

// Login user
const validateLogin = require('../middleware/validateLogin.middleware.js');
const login = require('../controllers/login.controller.js');
router.post('/login', validateLogin, login);

// ----------------------------------------
// Google OAuth Route
// ----------------------------------------
const googleAuth = require('../controllers/googleAuth.controller.js');
// (Optional: You can add a simple middleware here later if you want to validate that req.body.credential exists)
router.post('/google', googleAuth);

module.exports = router;