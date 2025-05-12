import { Router } from "express";
import { userRouter } from "./users.route.js";

const initRoutes = Router();

initRoutes.use("/users", userRouter);

export default initRoutes;