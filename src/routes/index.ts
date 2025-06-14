import { Router } from "express";
import { userRouter } from "./users.route";
import { auth } from "../middlewares/auth";
import { carRouter } from "./car.route";

const initRoutes = Router();

initRoutes.use("/users", userRouter);
initRoutes.use("/cars", carRouter);

export default initRoutes;
