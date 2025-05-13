import userService from "../services/user.service.js"

async function login(req, res) {
    try {
        await userService.login(req.body)
        res.status(200).json({ message: "Usuário autenticado com sucesso" })
    } catch (error) {
        res.status(500).json(error)
    }
}

async function create(req, res) {
    try {
        await userService.create(req.body)
        res.status(201).json({ message: "Usuário criado com sucesso" });
    } catch (error) {
        res.status(500).json(error);
    }
}

async function list(req, res) {
    const users = await userService.list();
    res.status(200).json(users)
}

export default {
    create,
    login,
    list
}