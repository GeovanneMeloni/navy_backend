import userService from "../services/user.service.js"

async function login(req, res) {
    console.log(req.body);
    userService.login(req.body)
    res.status(200)
}

async function create(req, res) {
    console.log("controller ", req.body);
    
    userService.create(req.body)
    res.status(200)
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