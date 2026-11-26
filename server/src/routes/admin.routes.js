import { Router } from "express";
import { listUsers, createUser, updateUser } from "../controllers/admin.controller.js";
import { verifyJWT, requirePasswordChanged } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createUserSchema, updateUserSchema } from "../validators/admin.validator.js";

const router = Router();

router.use(verifyJWT, requirePasswordChanged, requireRole("admin"));

router.route("/users").get(listUsers).post(validate(createUserSchema), createUser);
router.patch("/users/:id", validate(updateUserSchema), updateUser);

export default router;