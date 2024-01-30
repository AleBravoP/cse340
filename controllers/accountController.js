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


  /* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    flash: req.flash(),
  })
}

module.exports = { buildLogin, buildRegister }