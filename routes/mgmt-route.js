// Needed Resources 
const express = require("express")
const router = new express.Router()
const mgmtController = require ("../controllers/mgmtController")
const utilities = require("../utilities")
// const mgmtValidate = require('../utilities/mgmt-validation')

// Route to build management view
router.get("/", utilities.handleErrors(mgmtController.buildMgmt));

module.exports = router;