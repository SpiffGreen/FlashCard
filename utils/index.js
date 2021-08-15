function validData(reqBody) {
  const {password: pass1, password2: pass2, email, username} = reqBody;
  if((pass1 === pass2) && (pass1.length > 6)) return true;
  return false;
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