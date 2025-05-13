import { Router } from "express";
import { userRouter } from "./users.route.ts";

const initRoutes = Router();

initRoutes.use("/users", userRouter);

export default initRoutes;