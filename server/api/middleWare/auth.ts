import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const JWT_SECRET = "dev-secret";

export function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: "missing token" });

  const token = header.split(" ")[1];

  try {
    //throw error if invalid
    const decode = jwt.verify(token, JWT_SECRET);
    console.log("verified token:", decode);
    req.user = decode;
    next();
  } catch(err) {
    console.log("invalid: ",err);
    res.status(401).json({ error: "invalid token" });
  }
}
