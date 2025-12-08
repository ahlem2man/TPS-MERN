const jwt = require('jsonwebtoken');


exports.protect = (req, res, next) => {
let token;
if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
token = req.headers.authorization.split(' ')[1];
}


if (!token) return res.status(401).json({ message: 'Pas de token, accès refusé' });


try {
const decoded = jwt.verify(token, process.env.JWT_SECRET);
// assume token payload contains id
req.userId = decoded.userId || decoded.id || decoded._id;
if (!req.userId) return res.status(401).json({ message: 'Token invalide' });
next();
} catch (err) {
console.error('JWT error:', err.message);
res.status(401).json({ message: 'Token invalide ou expiré' });
}
};