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

// invCont.buildByInventoryId = async function (req, res, next) {
//   const inv_id = req.params.inv_id;
//   const data = await invModel.getCarByInventoryId(inv_id);
//   if (data) {
//       console.log(typeof data); // Add this line to log the data
//       const item_view = await utilities.buildItemDetails(data);

//       // Fetch nav using the middleware function
//       let nav = await utilities.getNav();

//       // You need to fetch comments_view using a suitable function, let's assume it's buildCommentsView
//       let comments_view = await utilities.buildCommentsView(inv_id);

//       // Add the following line to pass data to the view
//       res.render("./inventory/item", {
//           title: data.inv_year + ' ' + data.inv_make + ' ' + data.inv_model,
//           nav,
//           item_view,
//           comments_view, // Pass the comments_view to the view
//           data,
//       });
//   } else {
//       const err = new Error("Not Found");
//       err.status = 404;
//       next(err);
//   }
// }

invCont.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.inv_id;

  try {
    const data = await invModel.getCarByInventoryId(inv_id);

    if (data) {
      console.log("Retrieved data from database:", data);

      const item_view = await utilities.buildItemDetails(data);
      const comments_view = await utilities.buildCommentsView(inv_id);

      let nav = await utilities.getNav();
      const itemName = data.inv_make + ' ' + data.inv_model;

      res.render("./inventory/item", {
        title: data.inv_year + ' ' + itemName,
        nav,
        item_view,
        comments_view,
      });
    } else {
      const err = new Error("Not Found");
      err.status = 404;
      next(err);
    }
  } catch (error) {
    console.error("Error in buildByInventoryId:", error);
    next(error);
  }
}



invCont.addComment = async function (req, res, next) {
  const inv_id = req.params.inv_id;
  const { comment } = req.body;
  const account_id = res.locals.accountData.account_id;

  try {
      await invModel.addComment(inv_id, comment, account_id);
      req.flash("success", "Comment added successfully!");
      res.redirect(`/inv/detail/${inv_id}`);
  } catch (error) {
      console.error("addComment error: " + error);
      req.flash("error", "Failed to add comment");
      res.redirect(`/inv/detail/${inv_id}`);
  }
}

module.exports = invCont