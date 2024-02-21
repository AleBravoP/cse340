// Import the database connection file
const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}


/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Get item by inv_id
 * ************************** */
async function getCarByInventoryId(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory 
      WHERE inv_id = $1`,
      [inv_id]
    )
    return data.rows[0]
  } catch (error) {
    console.error("getcarbyid error " + error)
  }
}


/* ***************************
 *  Get comments by inv_id
 * ************************** */
async function getCommentsByInventoryId(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.comments 
       WHERE inv_id = $1`,
      [inv_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getCommentsByInventoryId error", error);
    throw error;
  }
}

/* ***************************
 *  Add a new comment
 * ************************** */
async function addComment(inv_id, comment, account_id) {
  try {
    const sql =
      "INSERT INTO public.comments (inv_id, comment, account_id) VALUES ($1, $2, $3) RETURNING *";
    return await pool.query(sql, [inv_id, comment, account_id]);
  } catch (error) {
    return error.message;
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getCarByInventoryId,
  getCommentsByInventoryId,
  addComment
};
