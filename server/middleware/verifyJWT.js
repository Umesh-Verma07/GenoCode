const jwt = require('jsonwebtoken');

module.exports = function verifyJWT(req, res, next) {
  
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ success: false, error: 'Token missing or malformed' });
  }

  try {
    // Verify and decode token
    const decoded = jwt.verify(token, process.env.JWTSECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('JWT verification failed:', err);
    return res.status(401).json({ success: false, error: 'Token invalid or expired' });
  }
};
