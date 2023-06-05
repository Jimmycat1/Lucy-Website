const config = require("config");
const jwt = require("jsonwebtoken");
const { StandardAnswers } = require('../routes/StandardAnswers');

// Get token from frontend request
function authAdmin(req, res, next) {
  const token = req.cookies.token;

  // Check for token
  if (!token) {
    let {status, answer} = StandardAnswers['not_logged_in']
    return res.status(status).json(answer);
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    // Add user from payload
    req.user = decoded;
    next();
  } catch (e) {
    let {status, answer} = StandardAnswers['not_logged_in']
    return res.status(status).json(answer);
  }
}

module.exports = authAdmin;
