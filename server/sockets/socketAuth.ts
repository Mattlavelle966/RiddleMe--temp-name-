const jwt = require("jsonwebtoken");

const JWT_SECRET = "dev-secret";

function socketAuth(socket, next) {
  const token = socket.handshake.auth?.token;

  if (!token) {
    return next(new Error("missing token"));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    socket.user = decoded;
    next();
  } catch {
    next(new Error("invalid token"));
  }
}

module.exports = { socketAuth };
