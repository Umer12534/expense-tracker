import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken;
    if (!token) throw new ApiError(401, "Unauthorized request");

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch {
        throw new ApiError(401, "Invalid or expired token");
    }

    // checked on every request, so a deactivated user is blocked at once
    const user = await User.findById(decoded._id);
    if (!user || !user.isActive) throw new ApiError(401, "Unauthorized request");

    req.user = user;
    next();
});

// use on every route except me, logout and change-password
export const requirePasswordChanged = (req, res, next) => {
    if (req.user.mustChangePassword) {
        throw new ApiError(403, "You must change your password first");
    }
    next();
};