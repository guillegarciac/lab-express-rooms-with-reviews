// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require('dotenv/config');

// ℹ️ Connects to the database
require('./db');

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require('express');

// connect-mongo and express-session
const session = require('express-session');
const MongoStore = require('connect-mongo');

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require('hbs');
const app = express();
const path = require('path');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials'); 

// For deployment
app.set('trust proxy', 1);
app.use(
  session({
    name: 'lab-express-rooms-with-reviews',
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: {
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 2592000000 // 30 days in milliseconds
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL
    })
  })
)

// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require('./config')(app);

// default value for title local
const projectName = "rooms-app";
const capitalized = string => string[0].toUpperCase() + string.slice(1).toLowerCase();
app.locals.appTitle = `${capitalized(projectName)} created by guillegarciac`;

// 👇 Routes here
const indexRoutes = require("./routes/index.routes");
const usersRoutes = require("./routes/users.routes");
const authRoutes = require("./routes/auth.routes");


app.use("/", indexRoutes);
app.use("/", usersRoutes);
app.use("/auth", authRoutes);



// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
