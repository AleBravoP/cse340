// Import the database connection file
const pool = require("../database/")

/* *****************************
*   Add new car classification
* *************************** */
async function addClassification(classification_name){
    try {
      const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
      return await pool.query(sql, [classification_name])
    } catch (error) {
      return error.message
    }
  }

/* **********************
 *   Check for existing classification
 * ********************* */
  async function checkExistingClassification(classification_name){
    try {
      const sql = "SELECT * FROM classification WHERE classification_name = $1"
      const email = await pool.query(sql, [classification_name])
      return email.rowCount
    } catch (error) {
      return error.message
    }
  }


/* *****************************
*   Add new item
* *************************** */
async function addInventory(classification_name, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color){
  try {
    // Get classification_id based on classification_name
    const classificationResult = await pool.query(
      "SELECT classification_id FROM classification WHERE classification_name = $1",
      [classification_name]
    );

    if (classificationResult.rows.length === 0) {
        throw new Error("Invalid classification_name");
    }

    const classification_id = classificationResult.rows[0].classification_id;

    const sql = "INSERT INTO inventory (classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"
    return await pool.query(sql, [classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color])
  } catch (error) {
    return error.message
  }
}

module.exports = {addClassification, checkExistingClassification, addInventory};