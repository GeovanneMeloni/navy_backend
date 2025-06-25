import { User, UserType } from "../models/user/user.model";
import jwt from "jsonwebtoken";
import { comparePassword, hashPassword } from "../utils/hashFunction";
import {
    ILogin,
    ICreateUser,
    IUser,
    ILoginResponse,
} from "../interface/global";
import { deleteFile } from "../utils/bucket";

async function login(data: ILogin): Promise<ILoginResponse> {
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

    return {
        tokenJWT,
        user: {
            id: user.id,
            name: user?.user_profile?.name || user.email,
        },
    };
}

async function create(data: UserType) {
    data.password = await hashPassword(data.password);

    const user = new User(data);

    const createdUser = await user.save();

    const userWithoutId = await User.findById(createdUser._id, { password: 0 });

    return userWithoutId;
}

async function list() {
    return User.find({}, { password: 0 }).exec();
}

async function listWithFilter(filters: any) {
    return User.find(filters, { password: 0 }).exec();
}

async function getById(id: string) {
    return await User.findById(id, { password: 0 });
}

async function update(id: string, data) {
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
        const user = await User.findById(id);

        if (!user) throw { status: 404, message: "Usuário não encontrado" };

        const userImagesUrl = [
            { field: "document", url: user.user_profile?.document },
            { field: "foto", url: user.user_profile?.foto },
        ];

        for (const image of userImagesUrl) {
            if (image.url) {
                console.log(`Deleting user ${image.field} image:`, image.url);
                await deleteFile(image.url);
            }
        }

        await User.deleteOne({ _id: id });
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
    getById,
    listWithFilter,
};
