import { NextFunction, Request, Response } from "express"
import userService from "../services/user.service.ts"
import { IUser } from "../interface/global.ts"

async function login(req: Request, res: Response, next: NextFunction) {
    try {
        const data = await userService.login(req.body)
        res.status(200).json({ message: "Usuário autenticado com sucesso", tokenJWT: data })
    } catch (error) {
        next(error)
    }
}

async function create(req: Request, res: Response, next: NextFunction) {
    try {       
        const data = {
            ...req.body,
            document: req.file?.buffer
        }
        
        await userService.create(data)
        res.status(201).json({ message: "Usuário criado com sucesso" });
    } catch (error) {
        if (error.code === 11000) {
            next({ status: 409, message: "E-mail já cadastrado" })
            return
        }

        next(error);
    }
}

async function list(req: Request, res: Response, next: NextFunction) {
    const users = await userService.list();
    res.status(200).json(users);
}

async function update(req: Request, res: Response, next: NextFunction) {
    try {
        console.log("adsafas");
        
        const body: IUser = req.body;
        const { id } = req.query;
        await userService.update(String(id), body);
        res.status(204).json({ message: `Atualizado usuário ${id}` });
    } catch (error) {
        next(error)
    }
}

async function changeStatus(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.query;
        await userService.changeStatus(String(id));
        res.status(204).json({ message: "Status atualizado com sucesso" });
    } catch (error) {
        next(error)
    }
}

export default {
    create,
    login,
    list,
    update,
    changeStatus
}