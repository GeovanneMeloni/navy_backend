import { Router } from "express";
import carController from "../controllers/car.controller";
import { auth } from "../middlewares/auth";
import { upload } from "../middlewares/multer";
import { checkPermission } from "../middlewares/role";

const carRouter = Router();

carRouter.post("/", auth, checkPermission("create"), upload.any(), carController.create);
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
