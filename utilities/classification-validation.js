const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const mgmtModel = require("../models/mgmt-model")
const invModel = require("../models/inventory-model")


/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.classificationRules = () => {
    return [
      // classification name is required and must be string
      body("classification_name")
        .trim()
        .isLength({ min: 1 })
        .withMessage("A valid classification name is required.") // on error this message is sent.
        .custom(async (classification_name) => {
            const classificationExists = await mgmtModel.checkExistingClassification(classification_name)
            if (classificationExists){
            throw new Error("Classification exists. Please use different classification")
            }
        })
        .matches(/^[a-zA-Z]+$/, "i")
        .withMessage("Classification name does not meet requirements."),
    ]
  }

/* ******************************
 * Check data and return errors or continue to add classification
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  const errors = validationResult(req).array();

  if (errors.length > 0) {
    let nav = await utilities.getNav()
    console.log(errors)
    res.render("inventory/add-classification", {
      errors,
      title: "Add New Classification",
      nav,
      classification_name,
    })
    return
  }
  next()
}

/* ************************
* Constructs the select HTML options
************************** */
validate.getClassInput = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let select = '<select id="classification_name" name="classification_name" required>'
  select += '<option value="" disabled selected>Choose a classification</option>'
  data.rows.forEach((row) => {
    select += "<option "
    select +=
      'value="' +
      row.classification_name +
      '">' +
      row.classification_name 
    select += "</option>"
  })
  select += "</select>"
  return select
}

module.exports = validate;