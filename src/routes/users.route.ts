import { Router } from "express";
import userController from "../controllers/user.controller";
import { auth } from "../middlewares/auth";
import {
    checkOwnResource,
    checkPermission,
} from "../middlewares/checkPermission";
import { upload } from "../middlewares/multer";

const userRouter = Router();

/**
 * @openapi
 * /api/users/login:
 *   post:
 *     summary: Autentica um usuário e retorna um token JWT
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Usuário autenticado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserListResponse'
 */
userRouter.get("/", auth, checkPermission("view", "user"), userController.list);

/**
 * @openapi
 * /api/users/employee:
 *   post:
 *     summary: Cria um novo operador
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/UserEmployeeRequest'
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 */
userRouter.post(
    "/employee",
    auth,
    upload.none(),
    checkPermission("create", "user"),
    userController.createOperator
);

/**
 * @openapi
 * /api/users/client:
 *   post:
 *     summary: Cria um novo cliente com foto e documento (cadastro de usuário normal)
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/UserClientRequest'
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
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
 *     summary: Atualiza um usuário existente (perfil e arquivos) (requer autenticação e permissão)
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
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdateInput'
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 */
userRouter.put(
    "/:id",
    auth,
    checkPermission("edit", "user"),
    checkOwnResource,
    upload.fields([{ name: "foto" }, { name: "document" }]),
    userController.update
);

/**
 * @openapi
 * /api/users/{id}:
 *   patch:
 *     summary: Altera o status de um usuário (requer autenticação e permissão)
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
    checkPermission("edit", "user"),
    userController.changeStatus
);

/**
 * @openapi
 * /api/users/{id}:
 *   delete:
 *     summary: Remove um usuário (requer autenticação e permissão)
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
    checkPermission("delete", "user"),
    userController.remove
);

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     summary: Obtém um usuário por ID (requer autenticação)
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
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 */
userRouter.get("/:id", auth, userController.getById);

export { userRouter };
