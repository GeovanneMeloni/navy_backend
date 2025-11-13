import { Request, Response, NextFunction } from "express";
import carService from "../services/car.service";
import { deleteFile, uploadFile } from "../utils/bucket";
import { formatCarRequestData, GetCarWithSignedUrl } from "../utils/car.utils";
import mongoose from "mongoose";
import { getAddress, getUserIdFromRequest } from "../utils/user.utils";

// métodos post
async function create(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> {
    try {
        const photoCarUrl: string = await GetAndUploadCarPhoto(req);

        const userId = getUserIdFromRequest(req);
        const data = formatCarRequestData(req, photoCarUrl, userId);

        const createdCar = await carService.create(data);

        const createdCarWithFoto = await GetCarWithSignedUrl(createdCar);

        res.status(200).json(createdCarWithFoto);
    } catch (error) {
        next(error);
    }
}

async function createForSale(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> {
    try {
        const photoCarUrl: string = await GetAndUploadCarPhoto(req);

        const userId = getUserIdFromRequest(req);
        const data = formatCarRequestData(req, photoCarUrl, userId);

        const createdCar = await carService.createCarForSale(data);

        const createdCarWithFoto = await GetCarWithSignedUrl(createdCar);

        res.status(200).json(createdCarWithFoto);
    } catch (error) {
        next(error);
    }
}

async function createForRent(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> {
    try {
        const photoCarUrl: string = await GetAndUploadCarPhoto(req);

        const userId = getUserIdFromRequest(req);
        const data = formatCarRequestData(req, photoCarUrl, userId);

        const createdCar = await carService.createCarForRent(data);

        const createdCarWithFoto = await GetCarWithSignedUrl(createdCar);

        res.status(200).json(createdCarWithFoto);
    } catch (error) {
        next(error);
    }
}

// métodos put
async function buy(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        if (mongoose.Types.ObjectId.isValid(id) === false) {
            throw { status: 400, message: "ID do carro inválido" };
        }

        const { buyerId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(buyerId)) {
            throw { status: 400, message: "ID do comprador inválido" };
        }

        await carService.buyCar(id, buyerId);

        res.status(200).json({ message: `Carro ${id} comprado com sucesso` });
    } catch (error) {
        next(error);
    }
}

async function rent(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        if (mongoose.Types.ObjectId.isValid(id) === false) {
            throw { status: 400, message: "ID do carro inválido" };
        }

        const { renterId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(renterId)) {
            throw { status: 400, message: "ID do locatário inválido" };
        }

        await carService.rentCar(id, renterId);

        res.status(200).json({ message: `Carro ${id} alugado com sucesso` });
    } catch (error) {
        next(error);
    }
}

async function returnCar(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        if (mongoose.Types.ObjectId.isValid(id) === false) {
            throw { status: 400, message: "ID do carro inválido" };
        }

        const { newMileage } = req.body;
        await carService.returnRentedCar(id, newMileage);
        res.status(200).json({ message: `Carro ${id} devolvido com sucesso` });
    } catch (error) {
        next(error);
    }
}

async function list(req: Request, res: Response, next: NextFunction) {
    try {
        const cars = await carService.getAll();

        const carsWithUrl = await Promise.all(cars.map(GetCarWithSignedUrl));

        res.status(200).json(carsWithUrl);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

async function listAvailableForSale(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const cars = await carService.getAllAvailableForSale();

        const carsWithUrl = await Promise.all(cars.map(GetCarWithSignedUrl));

        res.status(200).json(carsWithUrl);
    } catch (error) {
        next(error);
    }
}

async function listAvailableForRent(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const cars = await carService.getAllAvailableForRent();

        const carsWithUrl = await Promise.all(cars.map(GetCarWithSignedUrl));

        res.status(200).json(carsWithUrl);
    } catch (error) {
        next(error);
    }
}

async function listSold(req: Request, res: Response, next: NextFunction) {
    try {
        const cars = await carService.getAllSold();

        const carsWithUrl = await Promise.all(cars.map(GetCarWithSignedUrl));

        res.status(200).json(carsWithUrl);
    } catch (error) {
        next(error);
    }
}

async function listCurrentlyRented(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const cars = await carService.getAllCurrentlyRented();

        const carsWithUrl = await Promise.all(cars.map(GetCarWithSignedUrl));

        res.status(200).json(carsWithUrl);
    } catch (error) {
        next(error);
    }
}

async function listByOwner(req: Request, res: Response, next: NextFunction) {
    try {
        const { ownerId } = req.params;
        const cars = await carService.getAllByOwner(ownerId);
        const carsWithUrl = await Promise.all(cars.map(GetCarWithSignedUrl));
        res.status(200).json(carsWithUrl);
    } catch (error) {
        next(error);
    }
}

async function listAvailableForSaleByOwner(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const { ownerId } = req.params;

        const cars = await carService.getAllAvailableForSaleByOwner(ownerId);

        const carsWithUrl = await Promise.all(cars.map(GetCarWithSignedUrl));

        res.status(200).json(carsWithUrl);
    } catch (error) {
        next(error);
    }
}

async function listAvailableForRentByOwner(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const { ownerId } = req.params;

        const cars = await carService.getAllAvailableForRentByOwner(ownerId);

        const carsWithUrl = await Promise.all(cars.map(GetCarWithSignedUrl));

        res.status(200).json(carsWithUrl);
    } catch (error) {
        next(error);
    }
}

async function getById(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        // validar id do mongo
        if (mongoose.Types.ObjectId.isValid(id) == false) {
            throw { status: 400, message: "ID do carro inválido" };
        }
        const car = await carService.getById(id);

        if (!car) {
            throw { status: 404, message: "Carro não encontrado" };
        }

        const carWithUrl = await GetCarWithSignedUrl(car);

        res.status(200).json(carWithUrl);
    } catch (error) {
        next(error);
    }
}

async function update(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        const existingCar = await carService.getById(id);
        if (!existingCar) {
            throw { status: 404, message: "Carro não encontrado" };
        }

        // Upload da nova imagem (se fornecida)
        let newPhotoUrl = existingCar.photo_url;

        if (req.files && req.files["photo"]) {
            const newFile = req.files["photo"][0];

            // Remove imagem anterior se existir
            if (existingCar.photo_url) {
                await deleteFile(existingCar.photo_url);
            }

            // Faz upload da nova
            newPhotoUrl = await uploadFile(
                newFile.buffer,
                `fotos/${Date.now()}_${newFile.originalname}`
            );
        }

        // Formata dados
        // não irá atualizar a propriedade owner_id
        const data = formatCarRequestData(req, newPhotoUrl);

        const updatedCar = await carService.updateCar(id, data);

        const carWithUrl = await GetCarWithSignedUrl(updatedCar);

        res.status(200).json(carWithUrl);
    } catch (error) {
        next(error);
    }
}

async function remove(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        await carService.remove(id);

        res.status(204).send();
    } catch (error) {
        next(error);
    }
}

async function GetAndUploadCarPhoto(req: Request): Promise<string | undefined> {
    const contentType = req.headers["content-type"] || "";
    console.log(contentType);

    if (!contentType.startsWith("multipart/form-data")) {
        return undefined;
    }

    const file = req.files["photo"]?.[0];

    if (!file) return undefined;

    try {
        const photoCarUrl = await uploadFile(
            file.buffer,
            `fotos/${Date.now()}_${file.originalname}`
        );
        return photoCarUrl;
    } catch (error) {
        console.error("Erro ao fazer upload da foto do carro:", error);
        throw { status: 500, message: "Erro ao fazer upload da foto do carro" };
    }
}

async function filterCars(req: Request, res: Response, next: NextFunction) {
    try {
        const queryParams = req.query;
        //console.log(queryParams);
        const filters: any = {};

        for (const key in queryParams) {
            if (!queryParams[key]) continue;

            const value = queryParams[key] as string;

            // Suporte a booleano
            if (value === "true" || value === "false") {
                filters[key] = value === "true";
            }
            // Campos que fazem busca aproximada (regex case-insensitive)
            else if (
                [
                    "operationType",
                    "license_plate",
                    "status",
                    "short_description",
                    "address.cep",
                    "address.rua",
                    "address.numero",
                    "address.logradouro",
                    "address.estado",
                    "address.municipio",
                    "model",
                    "brand",
                    "color",
                    "fuel_type",
                    "transmission",
                ].includes(key)
            ) {
                filters[key] = { $regex: new RegExp(value, "i") };
            }
            // Campos numéricos e geográficos (latitude/longitude)
            else if (["year", "mileage", "price_per_hour"].includes(key)) {
                filters[key] = Number(value);
            }
            // Padrão
            else {
                filters[key] = value;
            }
        }
        //console.log(filters);

        const cars = await carService.getAllWithFilter(filters);

        const carsWithUrl = await Promise.all(cars.map(GetCarWithSignedUrl));

        res.status(200).json(carsWithUrl);
    } catch (error) {
        next(error);
    }
}

export default {
    create,
    createForSale,
    createForRent,
    buy,
    rent,
    returnCar,
    list,
    listAvailableForSale,
    listAvailableForRent,
    listSold,
    listCurrentlyRented,
    listByOwner,
    listAvailableForSaleByOwner,
    listAvailableForRentByOwner,
    getById,
    update,
    remove,
    filterCars,
};
