import { Router } from "express";
import userController from "../controllers/user.controller";
import { auth } from "../middlewares/auth";
import { checkPermission } from "../middlewares/role";
import { upload } from "../middlewares/multer";

const userRouter = Router();

/**
 * @openapi
 * /api/users/login:
 *   post:
 *     summary: Autentica um usuário e retorna um token JWT
 *     tags:
 *     - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Usuário autenticado com sucesso
 */
userRouter.post("/login", userController.login);

/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: Lista todos os usuários (requer autenticação e permissão)
 *     tags:
 *     - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários
 */
userRouter.get("/", auth, checkPermission("view"), userController.list);

/**
 * @openapi
 * /api/users/client:
 *   post:
 *     summary: Cria um novo cliente com foto e documento
 *     tags:
 *     - Users
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               rg:
 *                 type: string
 *               cpf:
 *                 type: string
 *               foto:
 *                 type: string
 *                 format: binary
 *               document:
 *                 type: string
 *                 format: binary
 *             required:
 *               - email
 *               - password
 *               - name
 *               - phone
 *               - rg
 *               - cpf
 *               - foto
 *               - document
 *     responses:
 *       201:
 *         description: Cliente criado com sucesso
 */
userRouter.post(
    "/employee",
    auth,
    checkPermission("create"),
    userController.createOperator
);

/**
 * @openapi
 * /api/users/client:
 *   post:
 *     summary: Cria um novo cliente com foto e documento
 *     tags:
 *      - Users
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               rg:
 *                 type: string
 *               cpf:
 *                 type: string
 *               foto:
 *                 type: string
 *                 format: binary
 *               document:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Cliente criado com sucesso
 */
userRouter.post(
    "/client",
    upload.fields([{ name: "foto" }, { name: "document" }]),
    userController.createClient
);

/**
 * @openapi
 * /api/users/{id}:
 *   put:
 *     summary: Atualiza um usuário existente
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               active:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       204:
 *         description: Usuário atualizado com sucesso
 */
userRouter.put("/:id", auth, checkPermission("edit"), userController.update);

/**
 * @openapi
 * /api/users/{id}:
 *   patch:
 *     summary: Altera o status de um usuário
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Status atualizado com sucesso
 */
userRouter.patch(
    "/:id",
    auth,
    checkPermission("edit"),
    userController.changeStatus
);

/**
 * @openapi
 * /api/users/{id}:
 *   delete:
 *     summary: Remove um usuário
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Usuário removido com sucesso
 */
userRouter.delete(
    "/:id",
    auth,
    checkPermission("delete"),
    userController.remove
);

export { userRouter };
