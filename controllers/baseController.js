const utilities = require("../utilities/")
const baseController = {}

// Create an anonymous, asynchronous function as a method 
// of the baseController object. Take  the request and response 
// objects as parameters.
baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  req.flash("notice", "This is a flash message.")
  res.render("index", {title: "Home", nav})
}

module.exports = baseController