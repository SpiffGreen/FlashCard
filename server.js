const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const path = require("path");
const express = require("express");
const app = express();

require("./config/db");
// const { SESSION_SECRET } = require("./config/secret");

// Passport setup
const initializePassport = require("./utils/passport-config");
initializePassport(passport);

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(flash());
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    })
);
app.use(passport.initialize());
app.use(passport.session());

// API Routes
app.use("/api", require("./routes/api"));

// Pages Route
app.use("/", require("./routes/pages"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.dir(`Server running on port ${PORT}`));