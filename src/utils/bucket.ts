import { createClient } from '@supabase/supabase-js'


export const uploadFile = async (file: File, path: string): Promise<string> => {
    const supabaseUrl = process.env.SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_KEY!;
    
    const supabase = createClient(supabaseUrl, supabaseKey)

    const {data, error} = await supabase.storage.from("navy-bucket").upload(path, file, {
        upsert: true
    });
    if (error) throw error;
    
    return data?.fullPath;
}    

