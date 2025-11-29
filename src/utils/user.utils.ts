import { Request } from "express";

import { getSignedUrl, uploadFile, deleteFile } from "./bucket";
import { AddressType } from "../models/user/address.schema";
import { ICreateUser } from "../interface/global";
import { UserProfileType } from "../models/user/userProfile.schema";

export async function attachSignedUrlsToProfile<
    T extends {
        user_profile?: {
            foto?: string | null;
            document?: string | null;
        };
        [key: string]: any;
    }
>(user: T): Promise<T> {
    if (!user.user_profile) return user;

    const { foto, document } = user.user_profile;

    if (foto) {
        const signedFoto = foto ? await getSignedUrl(foto) : null;
        user.user_profile.foto = signedFoto;
    }

    if (document) {
        const signedDocument = document ? await getSignedUrl(document) : null;
        user.user_profile.document = signedDocument;
    }

    // corigido bug, pois fazer o ...user, traz propriedades do banco que não é legal
    return user;
}

export async function saveProfileFiles(
    files: { foto?: Express.Multer.File[]; document?: Express.Multer.File[] },
    oldPaths?: { foto?: string; document?: string }
): Promise<{ foto?: string; document?: string }> {
    const out: any = {};
    // remove arquivos antigos se vierem
    const deleteTasks: Promise<void>[] = [];

    if (oldPaths?.foto) {
        deleteTasks.push(deleteFile(oldPaths.foto));
    }

    if (oldPaths?.document) {
        deleteTasks.push(deleteFile(oldPaths.document));
    }

    if (deleteTasks.length) {
        await Promise.all(deleteTasks);
    }

    const uploadTasks = [];

    if (files.foto?.[0]) {
        const f = files.foto[0];
        const path = `fotos/${Date.now()}_${f.originalname}`;

        uploadTasks.push(
            uploadFile(f.buffer, path).then((publicId) => {
                out.foto = publicId;
            })
        );
    }
    if (files.document?.[0]) {
        const d = files.document[0];
        const path = `documentos/${Date.now()}_${d.originalname}`;
        uploadTasks.push(
            uploadFile(d.buffer, path).then((publicId) => {
                out.document = publicId;
            })
        );
    }
    await Promise.all(uploadTasks);

    return out;
}

export function getAddress(data: ICreateUser): AddressType | undefined {
    const {
        cep,
        rua,
        numero,
        logradouro,
        estado,
        municipio,
        complemento,
        tipoEndereco,
        latitude,
        longitude,
    } = data;

    if (!cep) return undefined;

    const address: AddressType = removeUndefined({
        cep,
        rua,
        numero,
        logradouro,
        estado,
        municipio,
        complemento,
        tipoEndereco,
        location: latitude && longitude ? { latitude, longitude } : undefined,
    });

    return address;
}

export function getUserIdFromRequest(req: Request): string {
    const userId = req["user"].id;

    if (!userId) {
        throw { status: 401, message: "Usuário não autenticado" };
    }

    return userId;
}

export function getUserProfile(data: ICreateUser): UserProfileType {
    const { name, cpf, phone, rg, gender, cnh } = data;

    return removeUndefined({
        name,
        cpf,
        phone,
        rg,
        gender,
        cnh,
    });
}

export function removeUndefined<T>(obj: any): T {
    return Object.fromEntries(
        Object.entries(obj).filter(([_, v]) => v !== undefined)
    ) as T;
}
