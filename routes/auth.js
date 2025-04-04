require("dotenv").config()
const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const router = express.Router();
const User = require("../models/UserSchema");
const session = require('express-session');

// User.deleteMany({}).then((done)=>{
//   console.log(done)
// })
const crypto = require("crypto");

const {generateRateLimitPage} = require('../utilities/htmlUtils')
const {generateUserEmail, sendAccountCreateEmail, sendTokenEmail, sendForgotPasswordEmail, sendExceededLoginEmail} = require('../utilities/gmailUtils')


router.get("/login", (req, res) => {
    res.render("auth/login",{
    });
});

router.get("/signup", (req, res) => {
  res.render("auth/log",{
  });
});

router.post('/login', (req, res, next)=>{

  passport.authenticate('local', {
    successRedirect: '/customerSupport',
    failureRedirect: '/auth/login',
    failureFlash: true
  })(req, res, next);

});
router.get("/incorrect_credentials", (req, res)=>{

    res.render("auth/login",{
    });

})


router.get("/forgotPassword", (req, res) => {
  
    res.render("auth/forgotPassword",{
    });
  });

router.get("/logout", (req, res) => {
    // Destroy the user session to log them out
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        // Handle error as needed
        res.status(500).send("Internal Server Error");
      } else {
        // Redirect the user to the login or home page
        res.redirect("/auth/login"); // You can replace '/' with the desired destination
      }
    });
  });

router.post("/signup", async (req,res)=>{

    const { userName, emailAddress , password } = req.body;
  try {
 
    // Register the user and save to the database
    const user = await registerUser( userName, emailAddress ,password);
  req.login(user,async (err) => {
    if (err) {
      console.error(`Error logging in after registration: ${err.message}`);
      return res.render('auth/login',{

      });
    }

    console.log(`Username: ${userName}, Password: ${password}`);
    // return res.render('auth/login',{
    //   user
    // });
    sendAccountCreateEmail({email:emailAddress,userName})
    res.redirect('/customerSupport');

  });
  }
  catch (error) {
    console.error(`Error registering user: ${error.message}`);
    // Handle registration error (e.g., display an error message)
    res.render('auth/register', {
      errorMessage: 'Registration failed. Please try again.',
 
      // Other template variables as needed
    });
  }
})


router.get("/error_404", (req, res) => {
  res.render("error/error-404",{

  });
})

// Register user over here...

router.post("/forgotPassword", async (req, res) => {
  const {email} = req.body;
  // console.log(email)
  // Find the user with the provided email (replace this with your actual user lookup logic)
  const user = await User.findOne({emailAddress:email})
console.log(user)
  if (!user) {
    // Handle case when user is not found
    return res.render('auth/forgotPassword', { error: 'User not found' });
  }

   // Generate a random verification code
  //  const verificationCode = crypto.randomBytes(6).toString('hex');
   const verificationCode = Math.floor(100000 + Math.random() * 900000);
console.log(verificationCode)
user.verificationToken = verificationCode;
user.save();
sendForgotPasswordEmail({email,code:verificationCode})
   // Update the user record in the database with the verification code (replace this with your database update logic)
  res.render("auth/verifyCode", {email});
});

// Route to handle verification code submission
router.post('/verifyCode', async(req, res) => {
  const { email, code } = req.body;
    
  console.log(email)
  // Find the user with the provided email (replace this with your actual user lookup logic)
  const user = await User.findOne({emailAddress:email})
  
  console.log(user)
  if (!user || user.verificationToken !== code) {
    // Handle incorrect verification code
    return res.render('auth/verifyCode', { email, error: 'Invalid verification code' });
  }

  // Password reset successful, update the password logic here (replace this with your actual password update logic)
  // For demonstration purposes, let's just update the password in the simulated database

  // Redirect to a page indicating successful password reset
  res.render('auth/updatePassword',{code,email});
});



// Route to handle verification code submission
router.get('/verifyCode/:email/:code', async(req, res) => {
  const { email, code } = req.params;

  // Find the user with the provided email (replace this with your actual user lookup logic)
  const user = await User.findOne({email:email})

  if (!user || user.verificationCode !== code) {
    // Handle incorrect verification code
    return res.render('auth/verifyCode', { email, error: 'Invalid verification code' });
  }

  // Password reset successful, update the password logic here (replace this with your actual password update logic)
  // For demonstration purposes, let's just update the password in the simulated database

  // Redirect to a page indicating successful password reset
  res.render('auth/updatePassword',{code,email});
});

// Route to handle verification code submission
router.post('/updatePassword', async(req, res) => {
  const { email, password, code } = req.body;

  // Find the user with the provided email (replace this with your actual user lookup logic)
  const user = await User.findOne({emailAddress:email})

  if (!user || user.verificationToken !== code) {
    // Handle incorrect verification code
    return res.render('auth/verifyCode', { email, error: 'Invalid verification code' });
  }
  const salt = await bcrypt.genSalt(10);

  // Hash the password using the salt
  const hashedPassword = await bcrypt.hash(password, salt);
 
  // Password reset successful, update the password logic here (replace this with your actual password update logic)
  // For demonstration purposes, let's just update the password in the simulated database
  user.password = hashedPassword;
  user.verificationToken = ''
  
  user.save();
  // Redirect to a page indicating successful password reset
  res.render('auth/passwordResetSuccess');
});




async function registerUser( userName, emailAddress , password) {
  try {
    // Generate a salt to use for hashing the password
    const salt = await bcrypt.genSalt(10);

    // Hash the password using the salt
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const existingUser = await User.findOne({ emailAddress });

    if (existingUser) {
      // If a user with the same email exists, throw an error
      throw new Error('Email already exists');
    }
    // Create a new user document with the hashed password
    password = hashedPassword;
    const user = new User({
        userName, 
        emailAddress, 
        password
    });

    await user.save();
    // Save the user document to the database
    console.log(`User ${userName} registered successfully`);

    return user;
    

  } catch (error) {
    console.error(`Error registering user: ${error.message}`);
  }
}

module.exports = router;
