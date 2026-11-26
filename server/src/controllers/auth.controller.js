import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
    loginUser,
    refreshSession,
    logoutUser,
    changeOwnPassword,
} from "../services/auth.service.js";

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
};
// the cookie lives longer than the token; the token's own expiry decides
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

export const login = asyncHandler(async (req, res) => {
    const { user, accessToken, refreshToken } = await loginUser(req.body);
    res
        .status(200)
        .cookie("accessToken", accessToken, { ...cookieOptions, maxAge: COOKIE_MAX_AGE })
        .cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: COOKIE_MAX_AGE })
        .json(new ApiResponse(200, { user }, "Logged in"));
});

export const refreshToken = asyncHandler(async (req, res) => {
    const { accessToken } = await refreshSession(req.cookies?.refreshToken);
    res
        .status(200)
        .cookie("accessToken", accessToken, { ...cookieOptions, maxAge: COOKIE_MAX_AGE })
        .json(new ApiResponse(200, null, "Token refreshed"));
});

export const logout = asyncHandler(async (req, res) => {
    await logoutUser(req.cookies?.refreshToken);
    res
        .status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json(new ApiResponse(200, null, "Logged out"));
});

export const me = asyncHandler(async (req, res) => {
    res.status(200).json(new ApiResponse(200, { user: req.user }));
});

export const changePassword = asyncHandler(async (req, res) => {
    await changeOwnPassword(req.user._id, req.body);
    res.status(200).json(new ApiResponse(200, null, "Password changed"));
});