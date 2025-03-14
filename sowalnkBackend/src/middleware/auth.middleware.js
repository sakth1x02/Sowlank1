import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    console.log("Token from auth headers", token);
    if (!token) {
      throw new ApiError(401, "Unauthorized request - No token provided");
    }
    try {
      const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decodedToken?.userId).select(
        "-password"
      );

      if (!user) {
        throw new ApiError(401, "Invalid Access Token - User not found");
      }
      req.user = user;
      next();
    } catch (error) {
      console.error("Token verification error:", error); // Debug log
      throw new ApiError(401, "Invalid access token");
    }
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});
