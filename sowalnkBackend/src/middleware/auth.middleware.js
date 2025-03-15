import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
const JWT_SECRET =
  "/Bg49ZwwW+ofRjU52ymGs/wg6wH5M948Egs18JpxklOsKaQ+oG0Px46S97gI2TL6oDGgnvrtNjDMlwu/SX/pfg==";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      console.error("No token provided");
      return res.status(401).json({
        success: false,
        message: "Unauthorized request - No token provided",
      });
    }

    try {
      const decodedToken = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decodedToken?.userId).select(
        "-password"
      );

      if (!user) {
        console.error("User not found for token:", token);
        return res.status(401).json({
          success: false,
          message: "Invalid Access Token - User not found",
        });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error("Token verification error:", error);
      return res.status(401).json({
        success: false,
        message: "Invalid access token User is not authenticated",
      });
    }
  } catch (e) {
    console.error("Token not found!", e);
    return res
      .status(401)
      .json({ success: false, message: "Token not found!" });
  }
});
