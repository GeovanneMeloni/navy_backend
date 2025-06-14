import { Request, Response, NextFunction } from "express";
import carService from "../services/car.service";
import { getSignedUrl, uploadFile } from "../utils/bucket";

async function create(req: Request, res: Response, next: NextFunction) {
    try {
        const file = req.files[0];

        if (!file) {
            res.status(400).json({
                message: "Foto do carro é obrigatório",
            });
            return;
        }

        const photoCarUrl = await uploadFile(
            file.buffer,
            `fotos/${Date.now()}_${file.originalname}`
        );

        const {
            group,
            model,
            brand,
            year,
            color,
            fuel_type,
            transmission,
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

        const data = {
            ...body,
            details,
            photo_url: photoCarUrl,
        };
        await carService.create(data);
        res.status(201).json({ message: "Carro criado com sucesso" });
    } catch (error) {
        console.log(error);
        
        next(error);
    }
}

async function list(req: Request, res: Response, next: NextFunction) {
    try {
        const cars = await carService.getAll();

        const carsWithUrl = await Promise.all(
            cars.map(async (car) => {
                if (car.photo_url) {
                    const carPhotoSignedUrl = await getSignedUrl(car.photo_url);
                    return {
                        ...car,
                        photo_url: carPhotoSignedUrl,
                    };
                } else {
                    return car;
                }
            })
        );

        res.status(200).json(carsWithUrl);
    } catch (error) {
        next(error);
    }
}

async function listSimplified(req: Request, res: Response, next: NextFunction) {
    try {
        const cars = await carService.getAllSimplified();
        res.status(200).json(cars);
    } catch (error) {
        next(error);
    }
}

async function listNotSold(req: Request, res: Response, next: NextFunction) {
    try {
        const cars = await carService.getAllNotSold();
        res.status(200).json(cars);
    } catch (error) {
        next(error);
    }
}

async function listSold(req: Request, res: Response, next: NextFunction) {
    try {
        const cars = await carService.getAllSold();
        res.status(200).json(cars);
    } catch (error) {
        next(error);
    }
}

async function listAvailableToRent(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const cars = await carService.getAllAvailableToRent();
        res.status(200).json(cars);
    } catch (error) {
        next(error);
    }
}

async function getById(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const car = await carService.getById(id);
        res.status(200).json(car);
    } catch (error) {
        next(error);
    }
}

async function update(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const body = req.body;
        await carService.update(id, body);
        res.status(204).json({ message: `Carro ${id} atualizado com sucesso` });
    } catch (error) {
        next(error);
    }
}

async function remove(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        await carService.remove(id);
        res.status(204).json({ message: `Carro ${id} removido com sucesso` });
    } catch (error) {
        next(error);
    }
}

async function sell(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        await carService.sellCar(id);
        res.status(200).json({ message: `Carro ${id} marcado como vendido` });
    } catch (error) {
        next(error);
    }
}

async function rent(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const { renter_id } = req.body;
        await carService.rentCar(id, renter_id);
        res.status(200).json({ message: `Carro ${id} alugado com sucesso` });
    } catch (error) {
        next(error);
    }
}

async function returnCar(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const { newMileage } = req.body;
        await carService.returnCar(id, newMileage);
        res.status(200).json({ message: `Carro ${id} devolvido com sucesso` });
    } catch (error) {
        next(error);
    }
}

export default {
    create,
    list,
    listSimplified,
    listNotSold,
    listSold,
    listAvailableToRent,
    getById,
    update,
    remove,
    sell,
    rent,
    returnCar,
};
