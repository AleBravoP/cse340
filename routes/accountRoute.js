// Needed Resources 
const express = require("express")
const router = new express.Router()
const accountController = require ("../controllers/accountController")
const utilities = require("../utilities")

// Route for the My Account view
// router.get("/", utilities.handleErrors(accountController.myAccount));

router.get(["/", "/login"], (req, res, next) => {
    console.log("Reached /account route");
    next();
  }, utilities.handleErrors(accountController.buildLogin));

module.exports = router;
