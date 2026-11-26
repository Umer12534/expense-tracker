import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

export const createUser = async (admin, { name, email, password, role }) => {
    try {
        return await User.create({
            groupId: admin.groupId, // new user joins the admin's group
            name,
            email,
            passwordHash: await bcrypt.hash(password, 12),
            role: role || "user",
            mustChangePassword: true, // must set own password at first login
        });
    } catch (error) {
        if (error.code === 11000) throw new ApiError(409, "Email already in use");
        throw error;
    }
};

export const listUsers = (admin) =>
    User.find({ groupId: admin.groupId }).sort({ createdAt: 1 });

export const updateUser = async (admin, id, { isActive, newPassword }) => {
    if (!mongoose.isValidObjectId(id)) throw new ApiError(400, "Invalid user id");

    const user = await User.findOne({ _id: id, groupId: admin.groupId });
    if (!user) throw new ApiError(404, "User not found");

    if (isActive === false && user._id.equals(admin._id)) {
        throw new ApiError(400, "You cannot deactivate yourself");
    }

    if (isActive !== undefined) user.isActive = isActive;
    if (newPassword) {
        user.passwordHash = await bcrypt.hash(newPassword, 12);
        user.mustChangePassword = true;
    }
    if (isActive === false || newPassword) {
        user.refreshToken = undefined; // ends their session
    }
    await user.save();
    return user;
};