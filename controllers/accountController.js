const utilities = require("../utilities/")
const accountModel = require("../models/account-model.js")
const jwt = require("jsonwebtoken")
const bcrypt = require('bcryptjs');
require("dotenv").config()

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


/* ****************************************
*  Deliver accountManagement view
* *************************************** */
async function buildAccountManagement(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/accountManagement", {
    title: "Your Account",
    nav,
    flash: req.flash(),
  })
}


/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    console.error("Error was", error);
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("../views/account/login", {
      title: "Login",
      nav,
      flash: req.flash(),
    })
  } else {
    req.flash("error", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors:req.flash("error"),
    })
  }
}


/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  console.log('Account Data: ', accountData);
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  }

  try {
    console.log('Before the bcrypt, accController line 99');
    console.log('Entered Password:', account_password);
    const hashedPassword = await bcrypt.hash(account_password, 10); // Use the same salt rounds as your registration
    console.log('Generated Hash:', hashedPassword);
    const passwordMatch = await bcrypt.compare(account_password, hashedPassword);
    console.log('Result of bcrypt.compare:', passwordMatch);


    // const passwordMatch = await bcrypt.compare(account_password, accountData.account_password);
    // console.log('Result of bcrypt.compare:', passwordMatch);

    if (passwordMatch) {
      console.log('Inside bcrypt compare if block');
      // rest of the code
      delete accountData.account_password;
      console.log('After deleting account data');
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 });
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      return res.redirect("accountManagement");
    } else {
      console.log('Password comparison failed');
      req.flash("notice", "Wrong email or password");  // Update flash message
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: req.flash(),
        account_email,
      });
      return;
    }
  } catch (error) {
    console.error('Error during bcrypt.compare:', error);
    req.flash("error", "Error during password comparison");  // Update flash message
    res.status(500).render("account/login", {
      title: "Login",
      nav,
      errors: req.flash(),
      account_email,
    });
    return;
  }
}



module.exports = { buildLogin, buildRegister, buildAccountManagement, registerAccount, accountLogin}