import { CarType } from "../models/car/car.model";
import { getSignedUrl } from "./bucket";

// Gera uma descrição resumida do carro
// com base nos detalhes e quilometragem
// Exemplo: "FORD FOCUS 120000 km 2018 AUTOMATICO"
function generateShortDescription(car: Partial<CarType>): string {
    const { details, mileage } = car;
    if (!details) return "";

    const brand = details.brand ?? "";
    const model = details.model ?? "";
    const mileageString = mileage ? `${mileage.toLocaleString()} km` : "0 km";
    const year = details.year ? `${details.year}` : "";
    const transmission = details.transmission ?? "";

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
        return car;
    }
}

import { Request } from "express";

export function formatCarRequestData(req: Request, photo_url?: string) {
    const {
        group,
        model,
        brand,
        year,
        color,
        fuel_type,
        transmission,

        // Endereço e localização (embora venham "planos" no req.body)
        cep,
        rua,
        numero,
        logradouro,
        estado,
        municipio,
        latitude,
        longitude,

        ...body
    } = req.body;

    const details = {
        group,
        model,
        brand,
        year,
        color,
        fuel_type,
        transmission,
    };

    const hasAddressData =
        cep || rua || numero || logradouro || estado || municipio;
    const hasLocationData = latitude || longitude;

    let address: any = undefined;

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

    return {
        ...body,
        details,
        address,
        photo_url,
    };
}

export { generateShortDescription, GetCarWithSignedUrl };
