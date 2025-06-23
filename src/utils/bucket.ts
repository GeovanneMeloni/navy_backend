import { supabaseClient } from "../lib/supabase";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;

export const uploadFile = async (file: File, path: string): Promise<string> => {
    const { data, error } = await supabaseClient.storage
        .from("navy-bucket")
        .upload(path, file, {
            upsert: true,
        });
    if (error) throw error;

    return data?.path;
};

export const deleteFile = async (path: string): Promise<void> => {
    const cleanPath = path.startsWith("navy-bucket/")
        ? path.replace("navy-bucket/", "")
        : path;

    const { error } = await supabaseClient.storage
        .from("navy-bucket")
        .remove([cleanPath]);

    if (error) {
        throw new Error(`Erro ao deletar arquivo do bucket: ${error.message}`);
    }
};

export const getSignedUrl = async (path: string) => {
    const cleanPath = path.startsWith("navy-bucket/")
        ? path.replace("navy-bucket/", "")
        : path;

    const { data, error } = await supabaseClient.storage
        .from("navy-bucket")
        .createSignedUrl(cleanPath, 60 * 60);

    if (error) throw error;

    return data.signedUrl;
};
