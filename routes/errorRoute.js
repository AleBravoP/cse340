// Needed Resources 
const express = require("express")
const router = new express.Router() 
const errController = ("../controllers/errorController.js")

// Route to trigger 500 intentional Error
router.get("/trigger-error", (req, res, next) => {
    next(new Error("Intentional 500-type error"));
});

module.exports = router