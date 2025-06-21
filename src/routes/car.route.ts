import { Router } from "express";
import carController from "../controllers/car.controller";
import { auth } from "../middlewares/auth";
import { upload } from "../middlewares/multer";

const carRouter = Router();

// Criação
/**
 * @openapi
 * /api/cars:
 *   post:
 *     summary: Cria um novo carro
 *     description: Cria um novo carro com as informações fornecidas. O campo photo é opcional e deve ser enviado como um arquivo, o campo operationType indica se é aluguel ou para venda.
 *     tags:
 *       - Car
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
 * /api/cars/sale:
 *   post:
 *     summary: Cria um novo carro para venda
 *     description: Cria um novo carro com as informações fornecidas. O campo operationType não é necessário, pois este endpoint é específico para venda (vai ser sale).
 *     tags:
 *       - Car
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
 * /api/cars/rent:
 *   post:
 *     summary: Cria um novo carro para aluguel/locação
 *     description: Cria um novo carro com as informações fornecidas. O campo operationType não é necessário, pois este endpoint é específico para alugar (vai ser rent).
 *     tags:
 *       - Car
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
 * /api/cars:
 *   put:
 *     summary: Atualiza um carro existente
 *     tags:
 *       - Car
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
 * /api/cars/buy/{id}:
 *   patch:
 *     summary: Realiza a compra de um carro
 *     tags:
 *       - Car
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 */
carRouter.patch("/buy/:id", carController.buy);

/**
 * @openapi
 * /api/cars/rent/{id}:
 *   patch:
 *     summary: Realiza o aluguel de um carro
 *     tags:
 *       - Car
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 */
carRouter.patch("/rent/:id", carController.rent);

/**
 * @openapi
 * /api/cars/return/{id}:
 *   patch:
 *     summary: Realiza a devolução de um carro alugado
 *     tags:
 *       - Car
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 */
carRouter.patch("/return/:id", carController.returnCar);

/**
 * @openapi
 * /api/cars:
 *   get:
 *     summary: Lista todos os carros
 *     tags:
 *       - Car
 *     responses:
 *       200:
 *        description: Lista de carros retornada com sucesso
 */
carRouter.get("/", carController.list);

/**
 * @openapi
 * /api/cars/available/sale:
 *   get:
 *     summary: Lista todos os carros disponíveis para venda
 *     tags:
 *       - Car
 *     responses:
 *       200:
 *        description: Lista de carros retornada com sucesso
 */
carRouter.get("/available/sale", carController.listAvailableForSale);

/**
 * @openapi
 * /api/cars/available/rent:
 *   get:
 *     summary: Lista todos os carros disponíveis para aluguel
 *     tags:
 *       - Car
 *     responses:
 *       200:
 *        description: Lista de carros retornada com sucesso
 */
carRouter.get("/available/rent", carController.listAvailableForRent);

/**
 * @openapi
 * /api/cars/sold:
 *   get:
 *     summary: Lista todos os carros vendidos
 *     tags:
 *       - Car
 *     responses:
 *       200:
 *        description: Lista de carros retornada com sucesso
 */
carRouter.get("/sold", carController.listSold);

/**
 * @openapi
 * /api/cars/rented:
 *   get:
 *     summary: Lista todos os carros atualmente alugados
 *     tags:
 *       - Car
 *     responses:
 *       200:
 *        description: Lista de carros retornada com sucesso
 */
carRouter.get("/rented", carController.listCurrentlyRented);

/**
 * @openapi
 * /api/cars/owner/{ownerId}:
 *   get:
 *     summary: Lista todos os carros de um proprietário, dado o ID do proprietário (user)
 *     tags:
 *       - Car
 *     parameters:
 *       - in: path
 *         name: ownerId
 *         required: true
 *     responses:
 *       200:
 *        description: Lista de carros retornada com sucesso
 */
carRouter.get("/owner/:ownerId", carController.listByOwner);

/**
 * @openapi
 * /api/cars/owner/{ownerId}/available/sale:
 *   get:
 *     summary: Lista os carros disponíveis para venda de um proprietário
 *     tags:
 *       - Car
 *     parameters:
 *       - in: path
 *         name: ownerId
 *         required: true
 *     responses:
 *       200:
 *        description: Lista de carros retornada com sucesso
 */
carRouter.get(
    "/owner/:ownerId/available/sale",
    carController.listAvailableForSaleByOwner
);

/**
 * @openapi
 * /api/cars/owner/{ownerId}/available/rent:
 *   get:
 *     summary: Lista os carros disponíveis para aluguel de um proprietário
 *     tags:
 *       - Car
 *     parameters:
 *       - in: path
 *         name: ownerId
 *         required: true
 *     responses:
 *       200:
 *        description: Lista de carros retornada com sucesso
 */
carRouter.get(
    "/owner/:ownerId/available/rent",
    carController.listAvailableForRentByOwner
);

/**
 * @openapi
 * /api/cars/{id}:
 *   get:
 *     summary: Busca um carro pelo ID
 *     tags:
 *       - Car
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *        description: Carro encontrado com sucesso
 */
carRouter.get("/:id", carController.getById);

/**
 * @openapi
 * /api/cars/{id}:
 *   delete:
 *     summary: Remove um carro
 *     tags:
 *       - Car
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       204:
 *        description: Carro removido com sucesso
 */
carRouter.delete("/:id", carController.remove);

export { carRouter };
