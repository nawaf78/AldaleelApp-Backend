const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.sub) {
      return res.status(401).json({ error: "Invalid token" });
    }

    req.user = { id: decoded.sub }; // user id is in `sub`
    next();
  } catch (err) {
    res.status(401).json({ error: "Failed to authenticate token" });
  }
};

module.exports = authenticate;
