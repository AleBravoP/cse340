const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const mgmtModel = require("../models/mgmt-model")

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

module.exports = validate;