// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController.js")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build item view
router.get("/detail/:inv_id", invController.buildByInventoryId);

module.exports = router;