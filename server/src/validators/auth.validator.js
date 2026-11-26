import { z } from "zod";

const email = z.string().trim().toLowerCase().email("Enter a valid email");
export const password = z.string().min(8, "At least 8 characters").max(72, "At most 72 characters");

export const loginSchema = z.object({
    email,
    password: z.string().min(1, "Password is required"),
});

export const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: password,
});

export { email };