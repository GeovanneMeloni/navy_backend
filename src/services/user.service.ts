import User from "../models/user.model.ts";
import jwt from "jsonwebtoken";
import { comparePassword, hashPassword } from "../utils/hashFunction.ts";

async function login(data: ILogin) {
    const user = await User.findOne({email: data.email}).exec();

    if (!user) throw { status: 404, message: "Usuário não encontrado"};

    const isCorrectPassword = await comparePassword(data.password, user.password);
    
    if (!isCorrectPassword) throw { status: 400, message: "Senha incorreta"};

    const tokenJWT = jwt.sign({ userId: user.id, role: user.role}, process.env.SECRET_TOKEN!);

    return tokenJWT;

}

async function create(data: ICreateUser) {
    data.password = await hashPassword(data.password);
    console.log(data);
    
    const user = new User(data);
    return user.save();
}

async function list() {
    return User.find();
}

export default {
    login,
    create,
    list
}
