import { User, UserType } from "../models/user/user.model";
import jwt from "jsonwebtoken";
import { comparePassword, hashPassword } from "../utils/hashFunction";
import { ILogin, ICreateUser, IUser } from "../interface/global";

async function login(data: ILogin) {
    const user = await User.findOne({ email: data.email }).exec();

    if (!user) throw { status: 404, message: "Usuário não encontrado" };

    const isCorrectPassword = await comparePassword(
        data.password,
        user.password
    );

    if (!isCorrectPassword) throw { status: 400, message: "Senha incorreta" };

    const tokenJWT = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.SECRET_TOKEN!,
        { expiresIn: "3h" }
    );

    return tokenJWT;
}

async function create(data: UserType) {
    data.password = await hashPassword(data.password);

    const user = new User(data);
    return user.save();
}

async function list() {
    return User.find();
}

async function update(id: string, data: IUser) {
    try {
        await User.updateOne({ _id: id }, data);
    } catch (error) {
        throw new Error(error.message);
    }
}

async function changeStatus(id: string) {
    try {
        let doc = await User.findById(id);
        if (!doc) throw { status: 404, message: "Usuário não encotrado" };

        doc.active = !doc.active;
        await doc.save();
    } catch (error) {
        throw new Error(error.message);
    }
}

async function remove(id: string) {
    try {
        const user = await User.findByIdAndDelete(id);

        if (!user) throw { status: 404, message: "Usuário não encontrado" };
    } catch (error) {
        throw new Error(error.message);
    }
}

export default {
    login,
    create,
    list,
    update,
    changeStatus,
    remove,
};
