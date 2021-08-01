const router = require("express").Router();
const bcrypt = require("bcrypt");
const { checkAuth, checkNoAuth } = require("../utils");
const passport = require("passport");

router.get("/", checkAuth, (req, res) => {
  res.render("index.ejs", {
    name: req.user.name,
    id: req.user.id,
  });
});

router.get("/login", checkNoAuth, (req, res) => {
  res.render("login.ejs");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

router.get("/register", checkNoAuth, (req, res) => {
  res.render("register.ejs");
});

router.post("/register", async (req, res) => {
  if(!validData(req.body)) {
    res.redirect("/register");
  }
  else {
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
      console.log(err);
      res.redirect("/register");
    }
  }
});

router.get("/logout", (req, res) => {
  req.logOut();
  res.redirect("/login");
});

router.get("/terms_and_conditions", (req, res) => {
  res.render("terms.ejs");
});

module.exports = router;