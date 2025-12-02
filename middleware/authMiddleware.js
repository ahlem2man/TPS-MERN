// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  let token;

  // Vérifier si le header Authorization existe et commence par "Bearer"
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  // Si aucun token n'a été trouvé
  if (!token) {
    return res.status(401).json({ message: "Pas de token, accès refusé" });
  }

  try {
    // Vérifier et décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Ajouter l'ID utilisateur à la requête pour usage ultérieur
    req.userId = decoded.userId;
    
    // Passer au prochain middleware ou à la route
    next();
  } catch (error) {
    console.error("JWT verification error:", error.message);
    return res.status(401).json({ message: "Token invalide ou expiré" });
  }
};

module.exports = { protect };