function validData(reqBody) {
  const {password: pass1, password2: pass2, email, username} = reqBody;
  if(pass1 !== pass2) return false;
  if(pass1.search(/\$|\^|#|_|@|!|%|&/g) === -1) return false;
  if(pass1.search(/[0-9]+/g) === -1) return false;
  if(pass1.search(/[A-Z]+/g) === -1) return false;
  if(pass1.search(/[a-z]+/g) === -1) return false;
  if(email.search(/[a-zA-Z0-9_]+\.*[a-zA-Z0-9_]+@[a-zA-Z0-9_]+\.+[a-zA-Z0-9_]+/g) === -1) false;
  if(username.length < 5) return false;
  return true;
}
  
function escapeBadHTML(str) {
  const clean = str.replace(/<\s*script\s*\s*>/gi, (i) => {
          return i.replace("<", "&lt;").replace(">", "&gt;");
      }).replace(/<\s*\/\s*script[^>]*>/gi, (i) => {
          return i.replace("<", "&lt;").replace(">", "&gt;");
      });
  return clean;
}

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

module.exports = {
  validData,
  escapeBadHTML,
  checkAuth,
  checkNoAuth
};