const utilities = require("../utilities/")
const mgmtModel = require("../models/mgmt-model.js")

/* ****************************************
*  Deliver management view
* *************************************** */
async function buildMgmt(req, res, next) {
    let nav = await utilities.getNav()

    console.log("Flash messages:", req.flash());
    
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
// async function addClassification(req, res) {
//     let nav = await utilities.getNav()
//     const { classification_name } = req.body
  
//     const regResult = await mgmtModel.addClassification(classification_name)
  
//     if (regResult) {
//       req.flash(
//         "notice",
//         `Congratulations, you\'ve registered new ${classification_name} car classification.`
//       )
//       res.status(201).render("inventory/management", {
//         title: "Management",
//         nav,
//         flash: req.flash(),
//       })
//     } else {
//       req.flash("error", "Sorry, adding the new classification failed.")
//       res.status(501).render("inventory/add-classification", {
//         title: "Add New Classification",
//         nav,
//         errors:req.flash("error"),
//       })
//     }
//   }

async function addClassification(req, res) {
  const { classification_name } = req.body;

  try {
      const regResult = await mgmtModel.addClassification(classification_name);

      if (regResult instanceof Error) {
          req.flash("error", "Sorry, adding the new classification failed.");
          console.error("Error adding classification:", regResult);
          res.status(501).render("inventory/add-classification", {
              title: "Add New Classification",
              nav: await utilities.getNav(),
              errors: req.flash("error"),
              classification_name,
          });
      } else {
          req.flash(
              "notice",
              `Congratulations, you\'ve registered new ${classification_name} car classification.`
          );
          res.redirect("/mgmt"); // Redirect to the management view
      }
  } catch (error) {
      console.error("Error in addClassification:", error);
      req.flash("error", "Sorry, something went wrong.");
      res.status(500).render("inventory/add-classification", {
          title: "Add New Classification",
          nav: await utilities.getNav(),
          errors: req.flash("error"),
          classification_name,
      });
  }
}




module.exports = {buildMgmt, buildAddClassification, addClassification}