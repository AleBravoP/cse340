// Needed Resources 
const express = require("express")
const router = new express.Router()
const mgmtController = require ("../controllers/mgmtController")
const utilities = require("../utilities")
const mgmtValidate = require('../utilities/classification-validation')

// Route to build management view
router.get("/", utilities.handleErrors(mgmtController.buildMgmt));

// Route to build add-classification view
router.get("/add-classification", utilities.handleErrors(mgmtController.buildAddClassification));
router.get("/add-inventory", utilities.handleErrors(mgmtController.buildAddInventory));

// Process the new classification data
router.post(
    "/add-classification",
    mgmtValidate.classificationRules(), // Use classification validation rules
    mgmtValidate.checkClassificationData, // Check classification data
    utilities.handleErrors(mgmtController.addClassification)
  );

// Process the new item data
router.post(
  "/add-inventory",
  mgmtValidate.inventoryRules(), 
  mgmtValidate.checkInventoryData, 
  utilities.handleErrors(mgmtController.addInventory)
);

//route to get inventory list for management view
router.get("/getInventory/:classification_id", utilities.handleErrors(mgmtController.getInventoryJSON));

module.exports = router;