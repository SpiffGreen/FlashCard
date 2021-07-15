const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const path = require("path");
const express = require("express");
const app = express();

require("./config/db");
const { SESSION_SECRET } = require("./config/secret");

// DB Models
const User = require("./models/User");
const Card = require("./models/Card");

// Passport setup
const initializePassport = require("./passport-config");
initializePassport(passport);

app.set("view eengine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(flash());
app.use(
    session({
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    })
);
app.use(passport.initialize());
app.use(passport.session());

// API Routes
app.get("/", checkAuth, (req, res) => {
  res.render("index.ejs", {
    name: req.user.name,
    id: req.user.id,
  });
});

app.get("/login", checkNoAuth, (req, res) => {
  res.render("login.ejs");
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

app.get("/register", checkNoAuth, (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
        name: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        role: "basic"
    });
    await user.save();
    res.redirect("/login");
  } catch(err) {
    // console.log(err);
    res.redirect("/register");
  }
});

app.post("/logout", (req, res) => {
  req.logOut();
  res.redirect("/login");
});

app.get("/terms_and_conditions", (req, res) => {
  res.render("terms.ejs");
})

// Utility Functions
function checkAuth(req, res, next) {
  if (req.isAuthenticated()) {
      return next();
  }
  res.redirect("/login");
}

function checkNoAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}

// Special functions and routes
app.post("/add", checkAuth, async (req, res) => {
  const {question: q, answer: a} = req.body;
  const id = String(req.user["_id"]);
  console.log("Id: ", id);
  console.log("Type: ", typeof id);
  const card = new Card({
    question: q,
    answer: a,
    userId: id,
  });
  await card.save();
  res.redirect("/");
});

app.get("/cards", checkAuth, async (req, res) => {
  const {_id: userID} = req.user;
  const id = String(userID);
  // console.log(_id);
  // {$project: {_v: 1, userId: 1}},
  // , {$sort: {"_id": -1}}, {$skip: Number(offset)}, {$limit: Number(limit)}
  const {offset, limit} = req.query;
  const result = await Card.aggregate([{$match: {"userId": id}}]);
  res.json(result);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.dir(`Server running on port ${PORT}`));