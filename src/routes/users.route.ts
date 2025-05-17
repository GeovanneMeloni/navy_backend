import { Router } from "express";
import userController from "../controllers/user.controller.ts";
import { auth } from "../middlewares/auth.ts";
import { checkRole } from "../middlewares/role.ts";
import { upload } from "../middlewares/multer.ts";

const userRouter = Router();

userRouter.post("/login", userController.login);
userRouter.get("/", auth, checkRole("view"), userController.list);
userRouter.post("/", upload.single("document"), userController.create);

export { userRouter };
