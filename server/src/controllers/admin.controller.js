import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import * as userService from "../services/user.service.js";

export const listUsers = asyncHandler(async (req, res) => {
    const users = await userService.listUsers(req.user);
    res.status(200).json(new ApiResponse(200, { users }));
});

export const createUser = asyncHandler(async (req, res) => {
    const user = await userService.createUser(req.user, req.body);
    res.status(201).json(new ApiResponse(201, { user }, "User created"));
});

export const updateUser = asyncHandler(async (req, res) => {
    const user = await userService.updateUser(req.user, req.params.id, req.body);
    res.status(200).json(new ApiResponse(200, { user }, "User updated"));
});