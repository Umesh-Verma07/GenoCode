const jwt = require('jsonwebtoken')

function verifyJWT(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: "Token missing" });

  try {
    const decoded = jwt.verify(token, process.env.JWTSECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ error: "Token invalid/expired" });
  }
}

module.exports = verifyJWT;
