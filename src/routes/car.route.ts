import { Router } from "express";
import carController from "../controllers/car.controller";
import { auth } from "../middlewares/auth";
import { upload } from "../middlewares/multer";

const carRouter = Router();

// Criação
/**
 * @openapi
 * /cars:
 *   post:
 *     summary: Cria um novo carro (geral)
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               license_plate:
 *                 type: string
 *               model:
 *                 type: string
 *               brand:
 *                 type: string
 *               year:
 *                 type: integer
 *               color:
 *                 type: string
 *               group:
 *                 type: string
 *               fuel_type:
 *                 type: string
 *               transmission:
 *                 type: string
 *               mileage:
 *                 type: number
 *               operationType:
 *                 type: string
 *                 enum: [sale, rent]
 *               price:
 *                 type: number
 *               price_per_hour:
 *                 type: number
 *               owner_id:
 *                 type: string
 *               cep:
 *                 type: string
 *               rua:
 *                 type: string
 *               numero:
 *                 type: string
 *               logradouro:
 *                 type: string
 *               estado:
 *                 type: string
 *               municipio:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Carro criado com sucesso
 */
carRouter.post("/", upload.fields([{ name: "photo" }]), carController.create);

/**
 * @openapi
 * /cars:
 *   post:
 *     summary: Cria um novo carro para venda
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               license_plate:
 *                 type: string
 *               model:
 *                 type: string
 *               brand:
 *                 type: string
 *               year:
 *                 type: integer
 *               color:
 *                 type: string
 *               group:
 *                 type: string
 *               fuel_type:
 *                 type: string
 *               transmission:
 *                 type: string
 *               mileage:
 *                 type: number
 *               price:
 *                 type: number
 *               price_per_hour:
 *                 type: number
 *               owner_id:
 *                 type: string
 *               cep:
 *                 type: string
 *               rua:
 *                 type: string
 *               numero:
 *                 type: string
 *               logradouro:
 *                 type: string
 *               estado:
 *                 type: string
 *               municipio:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Carro criado com sucesso
 */
carRouter.post(
    "/sale",
    upload.fields([{ name: "photo" }]),
    carController.createForSale
);

/**
 * @openapi
 * /cars:
 *   post:
 *     summary: Cria um novo carro para aluguel/locação
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               license_plate:
 *                 type: string
 *               model:
 *                 type: string
 *               brand:
 *                 type: string
 *               year:
 *                 type: integer
 *               color:
 *                 type: string
 *               group:
 *                 type: string
 *               fuel_type:
 *                 type: string
 *               transmission:
 *                 type: string
 *               mileage:
 *                 type: number
 *               price:
 *                 type: number
 *               price_per_hour:
 *                 type: number
 *               owner_id:
 *                 type: string
 *               cep:
 *                 type: string
 *               rua:
 *                 type: string
 *               numero:
 *                 type: string
 *               logradouro:
 *                 type: string
 *               estado:
 *                 type: string
 *               municipio:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Carro criado com sucesso
 */
carRouter.post(
    "/rent",
    upload.fields([{ name: "photo" }]),
    carController.createForRent
);

/**
 * @openapi
 * /cars:
 *   patch:
 *     summary: Realiza a compra de um carro
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               license_plate:
 *                 type: string
 *               model:
 *                 type: string
 *               brand:
 *                 type: string
 *               year:
 *                 type: integer
 *               color:
 *                 type: string
 *               group:
 *                 type: string
 *               fuel_type:
 *                 type: string
 *               transmission:
 *                 type: string
 *               mileage:
 *                 type: number
 *               price:
 *                 type: number
 *               price_per_hour:
 *                 type: number
 *               owner_id:
 *                 type: string
 *               cep:
 *                 type: string
 *               rua:
 *                 type: string
 *               numero:
 *                 type: string
 *               logradouro:
 *                 type: string
 *               estado:
 *                 type: string
 *               municipio:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Carro criado com sucesso
 */
carRouter.put("/:id", upload.fields([{ name: "photo" }]), carController.update);

/**
 * @openapi
 * /cars/buy/{id}:
 *   patch:
 *     summary: Realiza a compra de um carro
 */
carRouter.patch("/buy/:id", carController.buy);

/**
 * @openapi
 * /cars/rent/{id}:
 *   patch:
 *     summary: Realiza o aluguel de um carro
 */
carRouter.patch("/rent/:id", carController.rent);

/**
 * @openapi
 * /cars/return/{id}:
 *   patch:
 *     summary: Realiza a devolução de um carro alugado
 */
carRouter.patch("/return/:id", carController.returnCar);

/**
 * @openapi
 * /cars:
 *   get:
 *     summary: Lista todos os carros
 */
carRouter.get("/", carController.list);

/**
 * @openapi
 * /cars/available/sale:
 *   get:
 *     summary: Lista todos os carros disponíveis para venda
 */
carRouter.get("/available/sale", carController.listAvailableForSale);

/**
 * @openapi
 * /cars/available/rent:
 *   get:
 *     summary: Lista todos os carros disponíveis para aluguel
 */
carRouter.get("/available/rent", carController.listAvailableForRent);

/**
 * @openapi
 * /cars/sold:
 *   get:
 *     summary: Lista todos os carros vendidos
 */
carRouter.get("/sold", carController.listSold);

/**
 * @openapi
 * /cars/rented:
 *   get:
 *     summary: Lista todos os carros atualmente alugados
 */
carRouter.get("/rented", carController.listCurrentlyRented);

/**
 * @openapi
 * /cars/owner/{ownerId}:
 *   get:
 *     summary: Lista todos os carros de um proprietário, dado o ID do proprietário (user)
 */
carRouter.get("/owner/:ownerId", carController.listByOwner);

/**
 * @openapi
 * /cars/owner/{ownerId}/available/sale:
 *   get:
 *     summary: Lista os carros disponíveis para venda de um proprietário
 */
carRouter.get(
    "/owner/:ownerId/available/sale",
    carController.listAvailableForSaleByOwner
);

/**
 * @openapi
 * /cars/owner/{ownerId}/available/rent:
 *   get:
 *     summary: Lista os carros disponíveis para aluguel de um proprietário
 */
carRouter.get(
    "/owner/:ownerId/available/rent",
    carController.listAvailableForRentByOwner
);

/**
 * @openapi
 * /cars/{id}:
 *   get:
 *     summary: Busca um carro pelo ID
 */
carRouter.get("/:id", carController.getById);

/**
 * @openapi
 * /cars/{id}:
 *   delete:
 *     summary: Remove um carro
 */
carRouter.delete("/:id", carController.remove);

export { carRouter };
