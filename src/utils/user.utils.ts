import { createClient } from "@supabase/supabase-js";
import { Request } from "express";

import { getSignedUrl } from "./bucket";
import { supabaseClient } from "../lib/supabase";
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

    if (!foto && !document) return user;

    const [signedFoto, signedDoc] = await Promise.all([
        foto ? getSignedUrl(foto) : null,
        document ? getSignedUrl(document) : null,
    ]);

    if (signedDoc) {
        user.user_profile.document = signedDoc;
    }

    if (signedFoto) {
        user.user_profile.foto = signedFoto;
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
    const toDelete: string[] = [];
    if (oldPaths?.foto) toDelete.push(oldPaths.foto);
    if (oldPaths?.document) toDelete.push(oldPaths.document);
    if (toDelete.length) {
        const { error: delErr } = await supabaseClient.storage
            .from("navy-bucket")
            .remove(toDelete);
        if (delErr) throw delErr;
    }

    const uploadTasks = [];

    if (files.foto?.[0]) {
        const f = files.foto[0];
        const path = `fotos/${Date.now()}_${f.originalname}`;
        uploadTasks.push(
            supabaseClient.storage
                .from("navy-bucket")
                .upload(path, f.buffer, { upsert: true })
                .then(({ data, error }) => {
                    if (error) throw error;
                    out.foto = data.path;
                })
        );
    }
    if (files.document?.[0]) {
        const d = files.document[0];
        const path = `documentos/${Date.now()}_${d.originalname}`;
        uploadTasks.push(
            supabaseClient.storage
                .from("navy-bucket")
                .upload(path, d.buffer, { upsert: true })
                .then(({ data, error }) => {
                    if (error) throw error;
                    out.document = data.path;
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

    const address: AddressType = {
        cep,
        rua,
        numero,
        logradouro,
        estado,
        municipio,
        complemento,
        tipoEndereco,
    };

    if (latitude && longitude) {
        address.location = {
            latitude,
            longitude,
        };
    }

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

    return {
        name,
        cpf,
        phone,
        rg,
        gender,
        cnh,
    };
}
