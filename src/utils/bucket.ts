import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;

export const uploadFile = async (file: File, path: string): Promise<string> => {
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase.storage
        .from("navy-bucket")
        .upload(path, file, {
            upsert: true,
        });
    if (error) throw error;

    return data?.path;
};

export const getSignedUrl = async (path: string) => {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    path.replace("navy-bucket/", "")
    console.log(path);

    const { data, error } = await supabase.storage
        .from("navy-bucket")
        .createSignedUrl(path, 60 * 60);

    if (error) throw error;

    return data.signedUrl;
};
