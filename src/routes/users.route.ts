import { Router } from "express";
import userController from "../controllers/user.controller.ts";
import { auth } from "../middlewares/auth.ts";
import { checkRole } from "../middlewares/role.ts";

const userRouter = Router();

userRouter.post("/login", userController.login);
userRouter.get("/", auth, checkRole("view"), userController.list);
userRouter.post("/", userController.create);

export { userRouter };
