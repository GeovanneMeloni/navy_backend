import { Router } from "express";
import carController from "../controllers/car.controller";
import { auth } from "../middlewares/auth";
import { upload } from "../middlewares/multer";

const carRouter = Router();

// Criação
carRouter.post("/", upload.fields([{ name: "photo" }]), carController.create);
carRouter.post(
    "/sale",
    upload.fields([{ name: "photo" }]),
    carController.createForSale
);
carRouter.post(
    "/rent",
    upload.fields([{ name: "photo" }]),
    carController.createForRent
);

// Atualização
carRouter.put("/:id", upload.fields([{ name: "photo" }]), carController.update);

// Ações
carRouter.patch("/buy/:id", carController.buy);
carRouter.patch("/rent/:id", carController.rent);
carRouter.patch("/return/:id", carController.returnCar);

// Listagens
carRouter.get("/", carController.list);
carRouter.get("/available/sale", carController.listAvailableForSale);
carRouter.get("/available/rent", carController.listAvailableForRent);
carRouter.get("/sold", carController.listSold);
carRouter.get("/rented", carController.listCurrentlyRented);

// Listagens por owner
carRouter.get("/owner/:ownerId", carController.listByOwner);
carRouter.get(
    "/owner/:ownerId/available/sale",
    carController.listAvailableForSaleByOwner
);
carRouter.get(
    "/owner/:ownerId/available/rent",
    carController.listAvailableForRentByOwner
);

// Leitura individual
carRouter.get("/:id", carController.getById);

// Remoção
carRouter.delete("/:id", carController.remove);

export { carRouter };
