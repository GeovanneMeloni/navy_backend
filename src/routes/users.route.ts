import { Router } from "express";
import userController from "../controllers/user.controller";
import { auth } from "../middlewares/auth";
import { checkPermission } from "../middlewares/checkPermission";
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
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@navy.com
 *               password:
 *                 type: string
 *                 example: "123456"
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Usuário autenticado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuário autenticado com sucesso
 *                 tokenJWT:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 510568911905901
 *                     name:
 *                       type: string
 *                       example: admin@navy.com
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
    checkPermission("edit", "user"),
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
 *         description: Usuário encontrado
 */
userRouter.get("/:id", auth, userController.getById);

export { userRouter };
