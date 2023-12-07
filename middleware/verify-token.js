const jwt = require("jsonwebtoken");

function generateToken(user) {
    const payload = {
      // Informasi pada token
      userId: user.user_id,
      username: user.username,

    };
  
    const options = {
      expiresIn: '1h', // Durasi token berlaku
    };
  
    return jwt.sign(payload, 'nutrifacts', options);
  }
  
  // Middleware untuk verifikasi token
  function authenticateToken(req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'Access denied' });
  
    jwt.verify(token, 'nutrifacts', (err, user) => {
      if (err) return res.status(403).json({ message: 'Invalid token' });
  
      req.user = user;
      next();
    });
  }

  module.exports = { generateToken, authenticateToken };