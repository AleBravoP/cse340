const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}
 
/* ************************
* Constructs the nav HTML unordered list
************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

Util.buildItemDetails = async function(data){
  const vehicle = data
  let info = '<div id="car-view">'
  info += '<img id="car-pic" src="'+ vehicle.inv_image + '" alt="Image of '
  + vehicle.inv_make + ' ' + vehicle.inv_model + ' on CSE Motors">'
  info += '<div id="car-info">' + '<h2>'+ vehicle.inv_make + ' ' + vehicle.inv_model + ' Details</h2>'
  info += '<p class="details-category" id="price"><b>Price:</b> ' + '<span>$' 
  + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>' + '</p>'
  info += '<p class="details-category" id="desc"><b>Description:</b> ' + vehicle.inv_description + '</p>'
  info += '<p class="details-category" id="color"><b>Color:</b> ' + vehicle.inv_color + '</p>'
  info += '<p class="details-category" id="miles"><b>Miles:</b> ' + vehicle.inv_miles + '</p>'
  info += '</div> </div>'
  return info
}


/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }


/* ****************************************
* Authorize Activity
**************************************** */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  }else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}


module.exports = Util