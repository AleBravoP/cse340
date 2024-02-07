// Needed Resources 
const express = require("express")
const router = new express.Router()
const accountController = require ("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')

// Route for the My Account view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route for the Regsitration
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(), // Use registration validation rules
  regValidate.checkRegData, // Check registration data
  utilities.handleErrors(accountController.registerAccount)
);

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(), // Use login validation rules
  regValidate.checkLoginData, // Check login data
  utilities.handleErrors(accountController.login)
);

module.exports = router;
