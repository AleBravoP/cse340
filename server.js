/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const utilities = require("./utilities/")

// bring the base controller into scope
const baseController = require("./controllers/baseController")

const app = express()
const static = require("./routes/static")

const inventoryRoute = require("./routes/inventoryRoute")
const errorRoute = require("./routes/errorRoute")

// Apply express-session package and DB connection
const session = require("express-session")

const flash = require('connect-flash');

const pool = require('./database/')

// Require the account route file
const accountRoute = require("./routes/accountRoute")

const bodyParser = require("body-parser")

// Require the /mgmt (management) route file
const mgmtRoute = require("./routes/mgmt-route")

// Require cookie-parser (this is for login)
const cookieParser = require("cookie-parser")

/* ***********************
 * Middleware
 * ************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

app.use(flash());

// Express Messages Middleware
// app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// allow the cookie parser to be implemented throughout the project
app.use(cookieParser())

// If a token is present, we will validate it. If there is no token, we simply move on.
app.use(utilities.checkJWTToken)

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") //not at views root

/* ***********************
 * Routes
 *************************/
app.use(static)

// Index route
app.get("/", utilities.handleErrors(baseController.buildHome))

// Inventory routes
app.use("/inv", inventoryRoute)

// Add account route
app.use("/account", accountRoute)

// Add management route
app.use("/mgmt", mgmtRoute)

// Error routes
app.use("/error", errorRoute)

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page :('})
})

// app.use(flash());

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
// Use the Express function app.use
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 404){ message = err.message} else {message = 'Oh no! There was a crash. Maybe try a different route?'}
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})

app.use(async (err, req, res, next) => {
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message: 'Oh no! There was a crash. Maybe try a different route?',
    nav: await utilities.getNav()
  });
});

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
