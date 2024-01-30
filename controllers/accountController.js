const utilities = require("../utilities/")

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("../views/account/login", {
      title: "Login",
      nav,
      flash: req.flash(),
    })
  }
  
  module.exports = { buildLogin }