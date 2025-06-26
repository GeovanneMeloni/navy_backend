import { NextFunction, Request, Response } from "express";
import userService from "../services/user.service";
import { ICreateUser, IUpdateUser, IUser } from "../interface/global";
import { UserType } from "../models/user/user.model";
import { uploadFile } from "../utils/bucket";
import mongoose from "mongoose";
import {
    attachSignedUrlsToProfile,
    getAddress,
    getUserIdFromRequest,
    getUserProfile,
    saveProfileFiles,
} from "../utils/user.utils";

async function login(req: Request, res: Response, next: NextFunction) {
    try {
        const data = await userService.login(req.body);
        res.status(200).json({
            message: "Usuário autenticado com sucesso",
            tokenJWT: data.tokenJWT,
            user: {
                id: data.user.id,
                name: data.user.name,
            },
        });
    } catch (error) {
        next(error);
    }
}

async function createOperator(req: Request, res: Response, next: NextFunction) {
    try {
        const requestBody = req.body as ICreateUser;

        const { role, userType, ...rest }: ICreateUser = requestBody;

        if (!role || !["admin", "employee"].includes(role)) {
            res.status(400).json({ message: "Role inválido para operador" });
            return;
        }

        const finalUserType = userType || "company";

        if (!["company", "navy"].includes(finalUserType)) {
            res.status(400).json({
                message: "userType inválido para operador",
            });
            return;
        }

        const address = getAddress(requestBody);
        const userProfile = getUserProfile(requestBody);

        if (address) {
            userProfile.address = address;
        }

        const data: UserType = {
            ...rest,
            role: "client",
            userType: finalUserType,
            user_profile: userProfile,
            active: true,
        };

        const createdUser = await userService.create(data);

        const userWithSignedUrls = await attachSignedUrlsToProfile(createdUser);
        //res.status(201).json({ message: "Usuário criado com sucesso" });

        res.status(200).json(userWithSignedUrls);

        return;
    } catch (error: any) {
        if (error.code === 11000) {
            next({ status: 409, message: "E-mail já cadastrado" });
            return;
        }
        next(error);
        return;
    }
}

async function createClient(req: Request, res: Response, next: NextFunction) {
    try {
        const requestBody = req.body as ICreateUser;
        const { name, cpf, phone, rg, cep, ...rest }: ICreateUser = requestBody;

        const address = getAddress(requestBody);

        const userProfile = getUserProfile(requestBody);

        const contentType = req.headers["content-type"] || "";
        console.log(contentType);

        if (contentType.startsWith("multipart/form-data")) {
            let fotoUrl: string | undefined;
            let documentUrl: string | undefined;

            if (req.files && req.files["foto"] && req.files["foto"][0]) {
                const fotoFile = req.files["foto"][0];

                fotoUrl = await uploadFile(
                    fotoFile.buffer,
                    `fotos/${Date.now()}_${fotoFile.originalname}`
                );
                if (fotoUrl) {
                    userProfile.foto = fotoUrl;
                }
            }

            if (
                req.files &&
                req.files["document"] &&
                req.files["document"][0]
            ) {
                const documentFile = req.files["document"][0];
                documentUrl = await uploadFile(
                    documentFile.buffer,
                    `documentos/${Date.now()}_${documentFile.originalname}`
                );
                if (documentUrl) {
                    userProfile.document = documentUrl;
                }
            }
        }

        if (address) {
            userProfile.address = address;
        }

        const data: UserType = {
            ...rest,
            role: "client",
            userType: "individual",
            user_profile: userProfile,
            active: true,
        };

        const createdUser = await userService.create(data);
        //res.status(201).json({ message: "Usuário criado com sucesso" });

        const userWithSignedUrls = await attachSignedUrlsToProfile(createdUser);

        res.status(200).json(userWithSignedUrls);
    } catch (error: any) {
        if (error.code === 11000) {
            next({ status: 409, message: "E-mail já cadastrado" });
            return;
        }
        next(error);
    }
}

async function list(req: Request, res: Response, next: NextFunction) {
    const rawUsers = await userService.list();

    const users = await Promise.all(rawUsers.map(attachSignedUrlsToProfile));

    res.status(200).json(users);
}

async function filterUsers(req: Request, res: Response, next: NextFunction) {
    try {
        const queryParams = req.query;
        console.log(queryParams);
        const filters: any = {};

        for (const key in queryParams) {
            if (!queryParams[key]) continue;

            const value = queryParams[key] as string;

            // Suporte a booleano
            if (value === "true" || value === "false") {
                filters[key] = value === "true";
            }
            // Campos que fazem busca aproximada (regex case-insensitive)
            else if (
                [
                    "email",
                    "user_profile.name",
                    "user_profile.phone",
                    "user_profile.cpf",
                    "user_profile.rg",
                    "user_profile.cnh",
                    "user_profile.address.rua",
                    "user_profile.address.logradouro",
                    "user_profile.address.estado",
                    "user_profile.address.municipio",
                    "user_profile.address.cep",
                ].includes(key)
            ) {
                filters[key] = { $regex: new RegExp(value, "i") };
            }
            // Campos numéricos e geográficos (latitude/longitude)
            else if (
                [
                    "user_profile.address.location.latitude",
                    "user_profile.address.location.longitude",
                ].includes(key)
            ) {
                filters[key] = Number(value);
            }
            // Padrão
            else {
                filters[key] = value;
            }
        }
        console.log(filters);

        const rawUsers = await userService.listWithFilter(filters);

        const users = await Promise.all(
            rawUsers.map(attachSignedUrlsToProfile)
        );

        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
}

async function update(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        const user = await userService.getById(String(id));

        if (!user) {
            res.status(404).json({ message: "Usuário não encontrado." });
            return;
        }
        const body = req.body as IUpdateUser;

        let userProfile = getUserProfile(body);
        const address = getAddress(body);

        if (address) {
            userProfile.address = address;
        }

        const contentType = req.headers["content-type"] || "";
        console.log(contentType);

        if (contentType.startsWith("multipart/form-data")) {
            if (req.files && (req.files["foto"] || req.files["document"])) {
                const old = user.user_profile;
                // busca paths antigos para removê-los

                const uploadResult = await saveProfileFiles(
                    {
                        foto: req.files["foto"],
                        document: req.files["document"],
                    },
                    { foto: old.foto, document: old.document }
                );

                userProfile.foto = uploadResult.foto;
                userProfile.document = uploadResult.document;
            }
        }

        const updateData: Partial<UserType> = {
            user_profile: userProfile,
        };

        await userService.update(String(id), updateData);

        const updatedUser = await userService.getById(String(id));

        const userWithSignedUrls = await attachSignedUrlsToProfile(updatedUser);

        res.status(200).json(userWithSignedUrls);
    } catch (error: any) {
        next(error);
    }
}

async function remove(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        if (!id || !mongoose.isValidObjectId(String(id))) {
            res.status(400).json({ message: "ID inválido" });
            return;
        }

        await userService.remove(String(id));

        res.status(204).json({ message: "Usuário removido com sucesso" });
    } catch (error) {
        next(error);
    }
}

async function getById(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        if (!id || !mongoose.isValidObjectId(String(id))) {
            res.status(400).json({ message: "ID inválido" });
            return;
        }

        const rawUser = await userService.getById(String(id));

        if (!rawUser) {
            res.status(404).json({ message: "Usuário não encontrado" });
            return;
        }

        const user = await attachSignedUrlsToProfile(rawUser);

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}

async function changeStatus(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        await userService.changeStatus(String(id));
        res.status(204).json({ message: "Status atualizado com sucesso" });
    } catch (error) {
        next(error);
    }
}

async function changeOwnPassword(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const { oldPassword, newPassword } = req.body;

        const userId = getUserIdFromRequest(req);

        if (!userId) {
            res.status(401).json("Usuário não autenticado");
            return;
        }

        const result = await userService.changeOwnPassword(
            userId,
            oldPassword,
            newPassword
        );

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

async function resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
        const { identifier } = req.body;

        const result = await userService.resetUserPassword(identifier);

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export default {
    createOperator,
    createClient,
    login,
    list,
    update,
    changeStatus,
    remove,
    getById,
    filterUsers,
    changeOwnPassword,
    resetPassword,
};
