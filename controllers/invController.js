const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

invCont.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.inv_id
  const data = await invModel.getCarByInventoryId(inv_id)
  if (data) {
    console.log(typeof data); // Add this line to log the data
    const item_view = await utilities.buildItemDetails(data)
    let nav = await utilities.getNav()
    const itemName = data.inv_make + ' ' + data.inv_model
    res.render("./inventory/item", {
      title: data.inv_year + ' ' + itemName,
      nav,
      item_view,
    });
  } else {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
  }
}

module.exports = invCont