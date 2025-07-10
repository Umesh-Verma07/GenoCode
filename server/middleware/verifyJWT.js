const jwt = require('jsonwebtoken');

module.exports = function verifyJWT(req, res, next) {
  
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Token missing or malformed' });
  }

  const token = authHeader.split(' ')[1];
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
