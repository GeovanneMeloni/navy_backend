import { Router } from "express";
import { userRouter } from "./users.route.ts";
import { auth } from "../middlewares/auth.ts";
import { carRouter } from "./car.route.ts";

const initRoutes = Router();

initRoutes.use("/users", userRouter);
initRoutes.use("/cars", carRouter);

export default initRoutes;
