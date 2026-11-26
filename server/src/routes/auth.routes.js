import { Router } from "express";
import {
    login,
    refreshToken,
    logout,
    me,
    changePassword,
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { loginLimiter } from "../middlewares/rateLimit.middleware.js";
import { loginSchema, changePasswordSchema } from "../validators/auth.validator.js";

const router = Router();

router.post("/login", loginLimiter, validate(loginSchema), login);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);
router.get("/me", verifyJWT, me);
router.post("/change-password", verifyJWT, validate(changePasswordSchema), changePassword);

export default router;