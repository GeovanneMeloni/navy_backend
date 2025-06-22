import { createClient } from "@supabase/supabase-js";
import { getSignedUrl } from "./bucket";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;

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

    return {
        ...user,
        user_profile: {
            ...user.user_profile,
            ...(signedFoto ? { foto: signedFoto } : {}),
            ...(signedDoc ? { document: signedDoc } : {}),
        },
    };
}

export async function saveProfileFiles(
    files: { foto?: Express.Multer.File[]; document?: Express.Multer.File[] },
    oldPaths?: { foto?: string; document?: string }
): Promise<{ foto?: string; document?: string }> {
    const supabase = createClient(supabaseUrl, supabaseKey);

    const out: any = {};
    // remove arquivos antigos se vierem
    const toDelete: string[] = [];
    if (oldPaths?.foto) toDelete.push(oldPaths.foto);
    if (oldPaths?.document) toDelete.push(oldPaths.document);
    if (toDelete.length) {
        const { error: delErr } = await supabase.storage
            .from("navy-bucket")
            .remove(toDelete);
        if (delErr) throw delErr;
    }

    const uploadTasks = [];
    if (files.foto?.[0]) {
        const f = files.foto[0];
        const path = `fotos/${Date.now()}_${f.originalname}`;
        uploadTasks.push(
            supabase.storage
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
            supabase.storage
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
