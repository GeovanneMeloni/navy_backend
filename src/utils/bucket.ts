import { cloudinary } from "../lib/cloudinary";
import { UploadApiResponse, UploadApiErrorResponse } from "cloudinary";

export const uploadFile = async (
    file: Buffer,
    path: string
): Promise<string> => {
    return new Promise((resolve, reject) => {
        // Remove extensão do arquivo para usar como public_id
        // O Cloudinary adiciona automaticamente a extensão baseada no tipo de arquivo
        const publicId = path.replace(/\.[^/.]+$/, "");
        
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: "navy",
                public_id: publicId,
                resource_type: "image",
                overwrite: true,
            },
            (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
                if (error) {
                    reject(error);
                    return;
                }
                if (!result) {
                    reject(new Error("Upload failed: no result returned"));
                    return;
                }
                // Retorna o public_id completo (inclui o folder "navy")
                // Exemplo: "navy/fotos/1234567890_nome"
                resolve(result.public_id);
            }
        );

        uploadStream.end(file);
    });
};

export const deleteFile = async (path: string): Promise<void> => {
    try {
        // O path já deve conter o folder "navy" se foi salvo pelo uploadFile
        // Se não tiver, adicionamos para garantir compatibilidade
        const publicId = path.startsWith("navy/") ? path : `navy/${path}`;
        
        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: "image",
        });

        // "not found" é aceitável (arquivo já foi deletado ou não existe)
        if (result.result !== "ok" && result.result !== "not found") {
            throw new Error(`Erro ao deletar arquivo: ${result.result}`);
        }
    } catch (error: any) {
        throw new Error(`Erro ao deletar arquivo do Cloudinary: ${error.message}`);
    }
};

export const getSignedUrl = async (path: string): Promise<string> => {
    try {
        // O path já deve conter o folder "navy" se foi salvo pelo uploadFile
        // Se não tiver, adicionamos para garantir compatibilidade
        const publicId = path.startsWith("navy/") ? path : `navy/${path}`;
        
        // Cloudinary gera URLs públicas seguras (HTTPS)
        // Podemos adicionar transformações aqui se necessário no futuro
        const url = cloudinary.url(publicId, {
            secure: true,
            resource_type: "image",
        });

        return url;
    } catch (error: any) {
        throw new Error(`Erro ao gerar URL: ${error.message}`);
    }
};
