import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

export const loginUser = async ({ email, password }) => {
    const user = await User.findOne({ email });
    const ok = user && user.isActive && (await user.isPasswordCorrect(password));

    // same message for every failure, so nobody can guess which emails exist
    if (!ok) throw new ApiError(401, "Invalid email or password");

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken; // saved, so logout can cancel it
    await user.save({ validateBeforeSave: false });

    return { user, accessToken, refreshToken };
};

export const refreshSession = async (incomingToken) => {
    if (!incomingToken) throw new ApiError(401, "Unauthorized request");

    let decoded;
    try {
        decoded = jwt.verify(incomingToken, process.env.REFRESH_TOKEN_SECRET);
    } catch {
        throw new ApiError(401, "Invalid or expired refresh token");
    }

    const user = await User.findById(decoded._id);

    // must match the saved token (fails after logout or deactivation)
    if (!user || !user.isActive || user.refreshToken !== incomingToken) {
        throw new ApiError(401, "Session ended. Please log in again");
    }

    return { accessToken: user.generateAccessToken() };
};

export const logoutUser = async (incomingToken) => {
    if (!incomingToken) return;
    try {
        const decoded = jwt.verify(incomingToken, process.env.REFRESH_TOKEN_SECRET);
        await User.updateOne(
            { _id: decoded._id, refreshToken: incomingToken },
            { $unset: { refreshToken: 1 } }
        );
    } catch {
        // token already invalid: nothing to cancel
    }
};

export const changeOwnPassword = async (userId, { currentPassword, newPassword }) => {
    const user = await User.findById(userId);
    if (!(await user.isPasswordCorrect(currentPassword))) {
        throw new ApiError(400, "Current password is wrong");
    }
    user.passwordHash = await bcrypt.hash(newPassword, 12);
    user.mustChangePassword = false;
    await user.save();
};