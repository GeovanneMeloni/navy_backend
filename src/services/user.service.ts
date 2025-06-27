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
import crypto from "node:crypto";

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

    const userWithId = await User.findById(createdUser._id, { password: 0 });

    return userWithId;
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

async function update(id: string, data: Partial<UserType>) {
    try {
        await User.updateOne({ _id: id }, { $set: data });
    } catch (error: any) {
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

async function changeOwnPassword(
    userId: string,
    oldPassword: string,
    newPassword: string
) {
    //console.log(userId);
    const user = await User.findById(userId);

    if (!user) throw { status: 404, message: "Usuário não encontrado" };

    const isCorrect = await comparePassword(oldPassword, user.password);

    if (!isCorrect) throw { status: 400, message: "Senha antiga incorreta" };

    user.password = await hashPassword(newPassword);
    await user.save();

    return { message: "Senha atualizada com sucesso" };
}

async function resetUserPassword(identifier: string) {
    const isIdentifierUserId =
        identifier.length === 24 && /^[a-f\d]{24}$/i.test(identifier);

    const user = isIdentifierUserId
        ? await User.findById(identifier)
        : await User.findOne({ email: identifier });

    if (!user)
        throw {
            status: 404,
            message: `Usuário não encontrado com esse ${
                isIdentifierUserId ? "id" : "e-mail"
            }`,
        };

    // 12 bytes -> 16 caracteres Base64 (+- 96 bits)
    const newPassword = crypto.randomBytes(12).toString("base64");
    user.password = await hashPassword(newPassword);

    await user.save();

    return {
        password: newPassword,
    };
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
    changeOwnPassword,
    resetUserPassword,
};
