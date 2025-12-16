const jwt = require("jsonwebtoken");

function adminAuth(req, res, next) {
  const token = req.cookies.token;

  // No token → not logged in
  if (!token) {
    return res.redirect("/admin-login");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded; // store admin info if needed
    next();
  } catch (error) {
    // Invalid or expired token
    res.clearCookie("token");
    return res.redirect("/admin-login");
  }
}

module.exports = adminAuth;
