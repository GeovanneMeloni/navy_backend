import { Request, Response } from "express"
import userService from "../services/user.service.ts"

async function login(req: Request, res: Response) {
    try {
        await userService.login(req.body)
        res.status(200).json({ message: "Usuário autenticado com sucesso" })
    } catch (error) {

        res.status(500).json(error)
    }
}

async function create(req: Request, res: Response) {
    try {
        await userService.create(req.body)
        res.status(201).json({ message: "Usuário criado com sucesso" });
    } catch (error) {
        if (error.code === 11000) return res.status(409).json({message: "E-mail já cadastrado"})
        res.status(500).json(error);
    }
}

async function list(req: Request, res: Response) {
    const users = await userService.list();
    res.status(200).json(users)
}

export default {
    create,
    login,
    list
}