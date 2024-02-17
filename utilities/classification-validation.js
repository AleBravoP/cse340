const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const mgmtModel = require("../models/mgmt-model")
const invModel = require("../models/inventory-model")


/*  **********************************
 *  Classification Data Validation Rules
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


/* **********************************
 * Inventory Data Validation Rules
 ********************************** */
validate.inventoryRules = () => {
  return [
      // classification_name must exist in the classification table
      body("classification_name")
          .trim()
          .isLength({ min: 1 })
          .withMessage("A valid classification name is required.")
          .custom(async (classification_name) => {
              const classificationExists = await mgmtModel.checkExistingClassification(classification_name);
              if (!classificationExists) {
                  throw new Error("Invalid classification name. Please choose a valid classification.");
              }
          }),

      // inv_make and inv_model must follow this pattern: [a-zA-Z]{3,}$
      body("inv_make")
          .trim()
          .matches(/^[a-zA-Z]{3,}$/, "i")
          .withMessage("Make must have a minimum of 3 alphabetical characters."),

      body("inv_model")
          .trim()
          .matches(/^[a-zA-Z]{3,}$/, "i")
          .withMessage("Model must have a minimum of 3 alphabetical characters."),

      // inv_description can't be empty
      body("inv_description")
          .trim()
          .notEmpty()
          .withMessage("Description can't be empty."),

      // inv_image and inv_thumbnail must follow this pattern ^[a-zA-Z0-9\/\-_.]+$
      body("inv_image")
          .trim()
          .matches(/^[a-zA-Z0-9\/\-_.]+$/)
          .withMessage("Invalid image path format."),

      body("inv_thumbnail")
          .trim()
          .matches(/^[a-zA-Z0-9\/\-_.]+$/)
          .withMessage("Invalid thumbnail path format."),

      // inv_price must be either an integer or a decimal
      body("inv_price")
          .trim()
          .isNumeric()
          .withMessage("Price must be a valid number."),

      // inv_year must be a 4-digit integer
      body("inv_year")
          .trim()
          .isInt({ min: 1000, max: 9999 })
          .withMessage("Year must be a 4-digit integer."),

      // inv_miles must be either an integer or a decimal
      body("inv_miles")
          .trim()
          .isNumeric()
          .withMessage("Miles must be a valid number."),

      // inv_color must follow this pattern ^[a-zA-Z]{3,}$
      body("inv_color")
          .trim()
          .matches(/^[a-zA-Z]{3,}$/)
          .withMessage("Invalid color format."),
  ];
};



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

/* ******************************
 * Check data and return errors or continue to add classification
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
  const { 
    classification_name,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
   } = req.body
  const errors = validationResult(req).array();

  if (errors.length > 0) {
    let nav = await utilities.getNav()
    console.log(errors)
    res.render("inventory/add-inventory", {
      errors,
      title: "Add New Inventory Item",
      nav,
      classification_name,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
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
  // let select = '<select id="classification_name" name="classification_name" required>'
  // select += '<option value="" disabled selected>Choose a classification</option>'
  let select ='<option value="" disabled selected>Choose a classification</option>'
  data.rows.forEach((row) => {
    select += "<option "
    select +=
      'value="' +
      row.classification_name +
      '">' +
      row.classification_name 
    select += "</option>"
  })
  // select += "</select>"
  return select
}



module.exports = validate;