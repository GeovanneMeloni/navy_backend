import { Router } from "express";
import userController from "../controllers/user.controller.ts";
import { auth } from "../middlewares/auth.ts";
import { checkPermission } from "../middlewares/role.ts";
import { upload } from "../middlewares/multer.ts";

const userRouter = Router();

userRouter.post("/login", userController.login);

userRouter.get("/", auth, checkPermission("view"), userController.list);
userRouter.post("/employee", auth, checkPermission("create"), userController.createOperator);

userRouter.post("/client", upload.fields([{ name: "foto" }, { name: "document" }]), userController.createClient);

userRouter.put("/:id", auth, checkPermission("edit"), userController.update);
userRouter.patch("/:id", auth, checkPermission("edit"), userController.changeStatus);

export { userRouter };
