import { Router } from "express";
import userController from "../controllers/user.controller.ts";

const userRouter = Router();

userRouter.post("/login", userController.login);
userRouter.get("/", userController.list);
userRouter.post("/", userController.create);

export { userRouter };
