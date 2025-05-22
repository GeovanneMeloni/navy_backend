import { Router } from "express";
import carController from "../controllers/car.controller.ts";
import { auth } from "../middlewares/auth.ts";
import { checkRole } from "../middlewares/role.ts";
import { upload } from "../middlewares/multer.ts";

const carRouter = Router();

carRouter.post("/", upload.single("photo"), carController.create);
carRouter.get("/", carController.list);
carRouter.get("/simplified", carController.listSimplified);
carRouter.get("/available", carController.listAvailableToRent);
carRouter.get("/sold", carController.listSold);
carRouter.get("/notsold", carController.listNotSold);
carRouter.get("/:id", carController.getById);
carRouter.put("/:id", carController.update);
carRouter.delete("/:id", carController.remove);
carRouter.patch("/sell/:id", carController.sell);
carRouter.patch("/rent/:id", carController.rent);
carRouter.patch("/return/:id", carController.returnCar);

export { carRouter };
