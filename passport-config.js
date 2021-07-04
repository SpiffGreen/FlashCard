const LocalStrategy = require("passport-local").Strategy
const bcrypt = require("bcrypt");

// Specials
const mongoose = require("mongoose");
const User = require("./models/User");

async function idUser(id) {
    const user = await User.findById(id);
    return user;
}

function initialize(passport) {
  const authenticateUser = async (email, password, done) => {
    const user = await User.findOne({ email });
    // console.log("Login: ", user);
    if(user == null) {
      return done(null, false, { message: "No user with that email" });
    }
    try {
      if(await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Password incorrect" })
      }
    } catch(e) {
      return done(e)
    }
  }
  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser ));
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
      const user = await idUser(id);
      return done(null, user)
  });
}

module.exports = initialize;