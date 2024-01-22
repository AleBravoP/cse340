// import the "Pool" functionality from the "pg" package
const { Pool } = require("pg")

// import the "dotenv" package.
require("dotenv").config()



/* ***************
 * Connection Pool
 * SSL Object needed for local testing of app
 * But will cause problems in production environment
 * If - else will make determination which to use
 * *************** */

// Create a local pool variable to hold the functionality 
// of the "Pool" connection.
let pool

// Test to see if the code exists in a developent environment, 
// as declared in the .env file.
if (process.env.NODE_ENV == "development") {

  // Create a new pool instance from the imported Pool class.
  pool = new Pool({

    // the pool will connect to the database and the value of 
    // the string is stored in a name - value pair.
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
})

// Added for troubleshooting queries
// during development
module.exports = {
  async query(text, params) {
    try {
      const res = await pool.query(text, params)
      console.log("executed query", { text })
      return res
    } catch (error) {
      console.error("error in query", { text })
      throw error
    }
  },
}
} else {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  })
  module.exports = pool
}