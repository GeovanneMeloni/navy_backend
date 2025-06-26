import mongoose from "mongoose";
import { ICreateCar } from "../interface/global";
import { CarType } from "../models/car/car.model";
import { AddressType } from "../models/user/address.schema";
import { getSignedUrl } from "./bucket";
import { StorageApiError } from "@supabase/storage-js";

// Gera uma descrição resumida do carro
// com base nos detalhes e quilometragem
// Exemplo: "FORD FOCUS 120000 km 2018 AUTOMATICO"
function generateShortDescription(car: Partial<CarType>): string {
    const { mileage, brand, model, year, transmission } = car;

    const mileageString = mileage ? `${mileage.toLocaleString()} km` : "0 km";

    return `${brand.toUpperCase()} ${model.toUpperCase()} ${mileageString} ${year} ${transmission.toUpperCase()}`.trim();
}

async function GetCarWithSignedUrl(car: CarType): Promise<CarType> {
    if (!car.photo_url) return car;

    try {
        const signedUrl = await getSignedUrl(car.photo_url);
        //console.log("Signed URL gerada:", signedUrl);
        //console.log("Old URL", car.photo_url);
        car.photo_url = signedUrl;
        return car;
    } catch (err) {
        console.error("Erro ao gerar signed URL:", err);
        // verificar se é stoargeapierror e object not found
        if (
            err instanceof StorageApiError &&
            err.message.includes("Object not found")
        ) {
            console.error(
                "Imagem do carro não encontrada no bucket:",
                car.photo_url
            );
            car.photo_url = "not_found"; // Remove a URL se não for encontrada
        }

        return car;
    }
}

import { Request } from "express";

export function formatCarRequestData(
    req: Request,
    photo_url?: string,
    current_user_id?: string
): CarType {
    const {
        operationType,
        status,
        rented_at,
        sold_at,
        rented_by,
        sold_to,
        owner_id,
        // Endereço e localização
        cep,
        rua,
        numero,
        logradouro,
        estado,
        municipio,

        latitude,
        longitude,
        ...rest
    }: ICreateCar = req.body;

    const hasAddressData =
        cep || rua || numero || logradouro || estado || municipio;
    const hasLocationData = latitude || longitude;

    let address: AddressType = undefined;

    if (hasAddressData) {
        address = {
            cep,
            rua,
            numero,
            logradouro,
            estado,
            municipio,
        };

        if (hasLocationData) {
            address.location = {
                latitude: latitude ? Number(latitude) : undefined,
                longitude: longitude ? Number(longitude) : undefined,
            };
        }
    }

    const data: CarType = {
        ...rest,
        operationType,
        status,
        rented_at,
        sold_at,
        rented_by: undefined,
        sold_to: undefined,
        owner_id: undefined,
        //rented_by: new mongoose.Types.ObjectId(rented_by) || undefined,
        //sold_to: new mongoose.Types.ObjectId(sold_to) || undefined,
        //owner_id: new mongoose.Types.ObjectId(owner_id) || undefined,
        address: address,
        photo_url: photo_url || undefined,
    };

    if (rented_by) {
        if (mongoose.Types.ObjectId.isValid(rented_by) == false) {
            throw {
                status: 400,
                message:
                    "ID do usuário que irá alugar não está no formato válido",
            };
        }
        data.rented_by = new mongoose.Types.ObjectId(rented_by);
    }

    if (sold_to) {
        if (mongoose.Types.ObjectId.isValid(sold_to) == false) {
            throw {
                status: 400,
                message:
                    "ID do usuário que irá comprar o carro não está no formato válido",
            };
        }
        data.sold_to = new mongoose.Types.ObjectId(sold_to);
    }

    const actualOwnerId = current_user_id || owner_id;

    if (actualOwnerId) {
        if (mongoose.Types.ObjectId.isValid(actualOwnerId) == false) {
            throw {
                status: 400,
                message:
                    "ID do proprietário do carro não está no formato válido",
            };
        }
        data.owner_id = new mongoose.Types.ObjectId(actualOwnerId);
    }

    return data;
}

export { generateShortDescription, GetCarWithSignedUrl };
