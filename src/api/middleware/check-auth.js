const jwt = require('jsonwebtoken');

const verify = (req, res, next) => {
  const authHeader = req.header('Authorization');
  let token;
  if (!authHeader || !authHeader.startsWith('Bearer: ')) {
    token = authHeader.slice(`Bearer: `.length);
    if (token.length === 0) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid token'
      });
    }
  }


  if (process.env.PRODUCTION) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_KEY);
      console.log({decoded});
      req.userData = decoded;
      next();
    } catch (error) {
      return res.status(401).json({message: 'Auth Failed'})
    }
  } else {
    if (token.length > 0) {
      next();
    } else {
      return res.status(401).json({message: 'Auth Failed'})
    }
  }
};

module.exports = verify;

