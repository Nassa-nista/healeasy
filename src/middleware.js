const { verify } = require('./utils/jwt'); 

function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const [type, token] = header.split(' ');
  if (type !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'No token' });
  }
  try {
    const payload = verify(token);
    req.user = payload; // { id, email }
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = { auth };
