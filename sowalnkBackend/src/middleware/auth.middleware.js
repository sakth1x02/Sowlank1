import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    let token = req.cookies?.token;

    // Check Authorization header if no cookie token
    const authHeader = req.header("Authorization");
    if (!token && authHeader) {
      token = authHeader.replace("Bearer ", "");
    }

    if (!token) {
      throw new ApiError(401, "Unauthorized request - No token provided");
    }

    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

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
