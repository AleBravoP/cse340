const utilities = require("../utilities/")
const mgmtModel = require("../models/mgmt-model.js")
const invModel = require ("../models/inventory-model.js")
const utilClassifications = require("../utilities/classification-validation.js")

/* ****************************************
*  Deliver management view
* *************************************** */
async function buildMgmt(req, res, next) {
    let nav = await utilities.getNav()
    // console.log("buildMgmt Flash messages:", req.flash()); // added this console.log to check flash mssgs

    const selectList = await utilClassifications.getClassInput(req, res, next)
    
    res.render("inventory/management", { // path is relative to the views folder
      title: "Management",
      nav,
      selectList,
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
*  Deliver add-inventory view
* *************************************** */
async function buildAddInventory(req, res, next) {
  try {
    const nav = await utilities.getNav();
    
    // Get select options
    let select = await utilClassifications.getClassInput(req, res, next);

    // Render the add-inventory view with select options
    res.render("inventory/add-inventory", {
      title: "Add New Inventory Item",
      nav,
      select,
      flash: req.flash(),
    });
  } catch (error) {
    console.error("Error in buildAddInventory:", error);
    res.status(500).send("Internal Server Error");
  }
}



/* ****************************************
*  Process Add-Classification
* *************************************** */
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
            console.log("addClassification Flash messages:", req.flash()); // added this console.log to check flash mssgs
            req.flash(
                "notice",
                `Congratulations, you\'ve registered the new ${classification_name} car classification.`
            );
            let nav = await utilities.getNav();
            res.render("inventory/management", {
                title: "Management",
                nav,
                flash: req.flash(),
            });
      }} catch (error) {
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
  


/* ****************************************
*  Process Add-Inventory
* *************************************** */
async function addInventory(req, res) {
  let nav = await utilities.getNav();
  let select = await utilClassifications.getClassInput();

  const {
      classification_name,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
  } = req.body;

  try {
      const regResult = await mgmtModel.addInventory(
          classification_name,
          inv_make,
          inv_model,
          inv_description,
          inv_image,
          inv_thumbnail,
          inv_price,
          inv_year,
          inv_miles,
          inv_color
      );

      if (regResult instanceof Error) {
          req.flash("error", "Sorry, the registration failed.");
          console.error("Error adding item:", regResult);
          res.status(501).render("../views/inventory/add-inventory", {
              title: "Add New Inventory Item",
              nav,
              select,
              flash: req.flash(),
          });
      } else {
          console.log("addInventory Flash messages:", req.flash()); // added this console.log to check flash mssgs
          req.flash(
              "notice",
              `Congratulations, you\'ve registered the new ${inv_model} to the inventory.`
          );
          res.status(201).render("../views/inventory/add-inventory", {
              title: "Add New Inventory Item",
              nav,
              select,
              flash: req.flash(),
          });
      }
  } catch (error) {
      console.error("Error in addInventory:", error);
      req.flash("error", "Sorry, something went wrong.");
      res.status(500).render("../views/inventory/add-inventory", {
          title: "Add New Inventory Item",
          nav,
          select,
          flash: req.flash(),
      });
  }
}


/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
async function getInventoryJSON(req, res, next) {
    const classification_id = parseInt(req.params.classification_id)
    console.log("Classification id: ", classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    if (invData[0].inv_id) {
      return res.json(invData)
    } else {
      next(new Error("No data returned"))
    }
  }


module.exports = {
    buildMgmt, 
    buildAddClassification, 
    addClassification, 
    buildAddInventory, 
    addInventory, 
    getInventoryJSON
}