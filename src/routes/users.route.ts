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
 *               role:
 *                 type: string
 *                 enum:
 *                   - admin
 *                   - employee
 *               userType:
 *                 type: string
 *                 enum:
 *                   - company
 *                   - navy
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
 *               - role
 *     responses:
 *       201:
 *         description: Operador criado com sucesso
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
 *       - Users
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
 *               gender:
 *                 type: string
 *                 enum:
 *                   - masculino
 *                   - feminino
 *                   - outro
 *               address:
 *                 type: object
 *                 properties:
 *                   cep:
 *                     type: string
 *                   rua:
 *                     type: string
 *                   numero:
 *                     type: string
 *                   logradouro:
 *                     type: string
 *                   estado:
 *                     type: string
 *                   municipio:
 *                     type: string
 *                   location:
 *                     type: object
 *                     properties:
 *                       latitude:
 *                         type: number
 *                       longitude:
 *                         type: number
 *                 required:
 *                   - cep
 *                   - rua
 *                   - numero
 *                   - logradouro
 *                   - estado
 *                   - municipio
 *                   - location
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
 *               - gender
 *               - address
 *               - foto
 *               - document
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
 *     summary: Atualiza um usuário existente (perfil e arquivos)
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
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               gender:
 *                 type: string
 *                 enum:
 *                   - masculino
 *                   - feminino
 *                   - outro
 *               address:
 *                 type: object
 *                 properties:
 *                   cep:
 *                     type: string
 *                   rua:
 *                     type: string
 *                   numero:
 *                     type: string
 *                   logradouro:
 *                     type: string
 *                   estado:
 *                     type: string
 *                   municipio:
 *                     type: string
 *                   location:
 *                     type: object
 *                     properties:
 *                       latitude:
 *                         type: number
 *                       longitude:
 *                         type: number
 *               foto:
 *                 type: string
 *                 format: binary
 *               document:
 *                 type: string
 *                 format: binary
 *             # Nenhum campo é estritamente obrigatório aqui:
 *             # envie apenas os que quiser atualizar
 *     responses:
 *       204:
 *         description: Usuário atualizado com sucesso
 */
userRouter.put(
    "/:id",
    auth,
    checkPermission("edit"),
    upload.fields([{ name: "foto" }, { name: "document" }]),
    userController.update
);

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

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     summary: Obtém um usuário por ID
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
 *         description: Usuário encontrado
 */
userRouter.get("/:id", userController.getById);

export { userRouter };
