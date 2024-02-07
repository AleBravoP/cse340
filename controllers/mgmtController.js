const utilities = require("../utilities/")
const mgmtModel = require("../models/mgmt-model.js")

/* ****************************************
*  Deliver management view
* *************************************** */
// async function buildMgmt(req, res, next) {
//     console.log("Management route hit")
//     let nav = await utilities.getNav()
//     res.render("inventory/management", { // path is relative to the views folder
//       title: "Management",
//       nav,
//       flash: req.flash(),
//     })
// }

async function buildMgmt(req, res, next) {
    try {
        let nav = await utilities.getNav();
        res.render("inventory/management", {
            title: "Management",
            nav,
            flash: req.flash(),
        });
    } catch (error) {
        console.error("Error in buildMgmt handler:", error);
        next(error);
    }
}


module.exports = {buildMgmt}