import { NextFunction, Request, Response } from "express";
import User from "../models/User.js";

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = await req.auth();

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized",
      });
    }

    let user = await User.findOne({ clerkId: userId });
    req.user = user;

    next();
  } catch (error) {
    console.error("Auth Error:", error);
    return res.status(500).json({
      success: false,
      message: "Authentication Failed",
    });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "User role is not authorized to access this route",
      });
    }
    next();
  };
};
