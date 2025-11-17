import jwt from "jsonwebtoken";
import {  RequestHandler } from 'express';
import { InferSelectModel } from "drizzle-orm";
import { user } from "../config/schema";
import { getUserById } from "../controllers/auth";

const verifyToken = (token:string, secretKey:string) => {
  return jwt.verify(token, secretKey);
};

const authenticate:RequestHandler = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "User is not authenticated",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = verifyToken(token, process.env.JWT_ACCESS_SECRET!);
    if(typeof payload === 'string'){
      throw new Error('Invalid');
    }

    
    req.user = await getUserById(payload.id);

    next();
  } catch (e) {
    return res.status(401).json({
      success: false,
      message: "invalid token",
    });
  }
};

module.exports = authenticate;