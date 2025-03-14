import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    let token = await req.cookies?.token;

    // Check Authorization header if no cookie token
    const authHeader = await req.header("Authorization");
    if (!token && authHeader) {
      token = await authHeader.replace("Bearer ", "");
    }

    if (!token) {
      throw new ApiError(401, "Unauthorized request - No token provided");
    }
    console.log("Token from auth middleware", token);
    try {
      const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decodedToken?.userId).select(
        "-password"
      );

      if (!user) {
        throw new ApiError(401, "Invalid Access Token - User not found");
      }
      console.log("User from auth middleware", user);
      req.user = user;
      console.log("Request User from auth middleware", req.user);
      next();
    } catch (error) {
      console.error("Token verification error:", error); // Debug log
      throw new ApiError(401, "Invalid access token");
    }
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});
