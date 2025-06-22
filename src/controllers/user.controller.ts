import { NextFunction, Request, Response } from "express";
import userService from "../services/user.service";
import { ICreateUser, IUser } from "../interface/global";
import { UserType } from "../models/user/user.model";
import { uploadFile } from "../utils/bucket";
import mongoose from "mongoose";
import { attachSignedUrlsToProfile, saveProfileFiles } from "../utils/user.utils";

async function login(req: Request, res: Response, next: NextFunction) {
    try {
        const data = await userService.login(req.body);
        res.status(200).json({
            message: "Usuário autenticado com sucesso",
            tokenJWT: data,
        });
    } catch (error) {
        next(error);
    }
}

async function createOperator(req: Request, res: Response, next: NextFunction) {
    try {
        const { name, cpf, phone, rg, role, userType, ...rest }: ICreateUser =
            req.body;
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
        const data: ICreateUser & { active: boolean } = {
            ...rest,
            role,
            userType: finalUserType,
            name,
            cpf,
            phone,
            rg,
            active: true,
        };
        await userService.create(data);
        res.status(201).json({ message: "Usuário criado com sucesso" });
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
        const { name, cpf, phone, rg, ...rest }: ICreateUser = req.body;

        if (
            !req.files ||
            !req.files["foto"] ||
            !req.files["foto"][0] ||
            !req.files["document"] ||
            !req.files["document"][0]
        ) {
            res.status(400).json({
                message: "Foto e documento são obrigatórios",
            });
            return;
        }

        const [fotoUrl, documentUrl] = await Promise.all([
            uploadFile(
                req.files["foto"][0].buffer,
                `fotos/${Date.now()}_${req.files["foto"][0].originalname}`
            ),
            uploadFile(
                req.files["document"][0].buffer,
                `documentos/${Date.now()}_${
                    req.files["document"][0].originalname
                }`
            ),
        ]);

        const userProfile = {
            name,
            cpf,
            phone,
            rg,
            foto: fotoUrl,
            document: documentUrl,
        };

        const data: UserType = {
            ...rest,
            role: "client",
            userType: "individual",
            user_profile: userProfile,
            active: true,
        };
        await userService.create(data);
        res.status(201).json({ message: "Usuário criado com sucesso" });
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

    const users = await Promise.all(
        rawUsers.map(attachSignedUrlsToProfile)
    );
    res.status(200).json(users);
}

async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const body = req.body;
    let uploadResult: any = {};

    if (req.files && (req.files["foto"] || req.files["document"])) {
      // busca paths antigos para removê-los
      const user = await userService.getById(String(id));
      const old = user.user_profile;

      uploadResult = await saveProfileFiles(
        { foto: req.files["foto"], document: req.files["document"] },
        { foto: old.foto, document: old.document }
      );

      body.user_profile = {
        ...(body.user_profile ?? {}),
        ...uploadResult,
      };
    }

    await userService.update(String(id), body);
    res.status(204).json({ message: `Usuário ${id} atualizado` });
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

        const user = await attachSignedUrlsToProfile(rawUser)

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

export default {
    createOperator,
    createClient,
    login,
    list,
    update,
    changeStatus,
    remove,
    getById,
};
