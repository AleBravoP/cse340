const utilities = require("../utilities/")
const mgmtModel = require("../models/mgmt-model.js")

/* ****************************************
*  Deliver management view
* *************************************** */
async function buildMgmt(req, res, next) {
    let nav = await utilities.getNav()
    res.render("inventory/management", { // path is relative to the views folder
      title: "Management",
      nav,
      flash: req.flash(),
    })
}


/* ****************************************
*  Deliver add-classification view
* *************************************** */
async function buildAddClassification(req, res, next) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", { // path is relative to the views folder
      title: "Add New Classification",
      nav,
      flash: req.flash(),
    })
}


/* ****************************************
*  Process Add-Classification
* *************************************** */
async function addClassification(req, res) {
    let nav = await utilities.getNav()
    const { classification_name } = req.body
  
    const regResult = await mgmtModel.addClassification(
        classification_name
    )
  
    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you\'va registered new ${classification_name} car classification.`
      )
      res.status(201).render("inventory/management", {
        title: "Management",
        nav,
        flash: req.flash(),
      })
    } else {
      req.flash("error", "Sorry, adding the new classification failed.")
      res.status(501).render("inventory/add-classification", {
        title: "Registration",
        nav,
        errors:req.flash("error"),
      })
    }
  }


module.exports = {buildMgmt, buildAddClassification, addClassification}