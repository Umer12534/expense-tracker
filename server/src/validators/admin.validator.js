import { z } from "zod";
import { email, password } from "./auth.validator.js";

export const createUserSchema = z.object({
    name: z.string().trim().min(1, "Name is required").max(60),
    email,
    password,
    role: z.enum(["admin", "user"]).optional(),
});

export const updateUserSchema = z
    .object({
        isActive: z.boolean().optional(),
        newPassword: password.optional(),
    })
    .refine((d) => d.isActive !== undefined || d.newPassword !== undefined, {
        message: "Nothing to update",
    });