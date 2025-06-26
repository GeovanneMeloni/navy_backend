import { Router } from "express";
import carController from "../controllers/car.controller";
import { auth } from "../middlewares/auth";
import { upload } from "../middlewares/multer";
import { checkPermission } from "../middlewares/checkPermission";
import { verifyCarOwner } from "../middlewares/car/verifyCarOwner";
import { verifyCarRenter } from "../middlewares/car/verifyCarRenter";

const carRouter = Router();

// Criação
/**
 * @openapi
 * /api/cars:
 *   post:
 *     summary: Cria um novo carro (requer autenticação )
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
 *             $ref: '#/components/schemas/CarInput'
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CarInputJson'
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CarResponse'
 */
carRouter.post(
    "/",
    auth,
    checkPermission("create", "car"),
    upload.fields([{ name: "photo" }]),
    carController.create
);

/**
 * @openapi
 * /api/cars/sale:
 *   post:
 *     summary: Cria um novo carro para venda (requer autenticação)
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
 *             $ref: '#/components/schemas/CarInput'
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CarInputJson'
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CarResponse'
 */
carRouter.post(
    "/sale",
    auth,
    checkPermission("create", "car"),
    upload.fields([{ name: "photo" }]),
    carController.createForSale
);

/**
 * @openapi
 * /api/cars/rent:
 *   post:
 *     summary: Cria um novo carro para aluguel/locação (requer autenticação)
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
 *             $ref: '#/components/schemas/CarInput'
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CarInputJson'
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CarResponse'
 */
carRouter.post(
    "/rent",
    auth,
    checkPermission("create", "car"),
    upload.fields([{ name: "photo" }]),
    carController.createForRent
);

/**
 * @openapi
 * /api/cars:
 *   put:
 *     summary: Atualiza um carro existente (requer autenticação e permissão - Somente quem criou ou o admin pode mudar)
 *     tags:
 *       - Car
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/CarUpdateInput'
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CarUpdateInputJson'
 *     responses:
 *       200:
 *         description: Carro com as informações atualizadas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CarResponse'
 */
carRouter.put(
    "/:id",
    auth,
    checkPermission("edit", "car"),
    verifyCarOwner,
    upload.fields([{ name: "photo" }]),
    carController.update
);

/**
 * @openapi
 * /api/cars/buy/{id}:
 *   patch:
 *     summary: Realiza a compra de um carro (requer autenticação e permissão)
 *     tags:
 *       - Car
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 */
carRouter.patch(
    "/buy/:id",
    auth,
    checkPermission("edit", "car"),
    carController.buy
);

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
carRouter.patch(
    "/rent/:id",
    auth,
    checkPermission("edit", "car"),
    carController.rent
);

/**
 * @openapi
 * /api/cars/return/{id}:
 *   patch:
 *     summary: Realiza a devolução de um carro alugado (requer autenticação e permissão)
 *     tags:
 *       - Car
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 */
carRouter.patch(
    "/return/:id",
    auth,
    checkPermission("edit", "car"),
    verifyCarRenter,
    carController.returnCar
);

/**
 * @openapi
 * /api/cars:
 *   get:
 *     summary: Lista todos os carros
 *     tags:
 *       - Car
 *     responses:
 *       200:
 *         description: Lista de carros
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CarListResponse'
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
 *         description: Lista de carros para venda
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CarListResponse'
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
 *         description: Lista de carros para alugar
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CarListResponse'
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
 *         description: Lista de carros vendidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CarListResponse'
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
 *         description: Lista de carros alugados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CarListResponse'
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
 *         description: Lista de carros de um proprietário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CarListResponse'
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
 *         description: Lista de carros de um proprietário para venda
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CarListResponse'
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
 *         description: Lista de carros de um proprietário para alugar
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CarListResponse'
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
 *         description: Um carro
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CarResponse'
 */
carRouter.get("/:id", carController.getById);

/**
 * @openapi
 * /api/cars/{id}:
 *   delete:
 *     summary: Remove um carro (requer autenticação e permissão - Somente quem criou ou o admin pode mudar)
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
carRouter.delete(
    "/:id",
    auth,
    checkPermission("delete", "car"),
    verifyCarOwner,
    carController.remove
);

export { carRouter };
