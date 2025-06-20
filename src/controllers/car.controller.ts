import { Request, Response, NextFunction } from "express";
import carService from "../services/car.service";
import { getSignedUrl, uploadFile } from "../utils/bucket";
import { formatCarRequestData, GetCarWithSignedUrl } from "../utils/car.utils";

// métodos post
async function create(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> {
    try {
        const file = req.files["photo"]?.[0];

        let photoCarUrl: string = undefined;

        if (file) {
            photoCarUrl = await uploadFile(
                file.buffer,
                `fotos/${Date.now()}_${file.originalname}`
            );
        }

        const data = formatCarRequestData(req, photoCarUrl);

        await carService.create(data);
        res.status(201).json({ message: "Carro criado com sucesso" });
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
        const file = req.files["photo"]?.[0];

        let photoCarUrl: string = undefined;

        if (file) {
            photoCarUrl = await uploadFile(
                file.buffer,
                `fotos/${Date.now()}_${file.originalname}`
            );
        }

        const data = formatCarRequestData(req, photoCarUrl);

        await carService.createCarForSale(data);
        res.status(201).json({
            message: "Carro para venda criado com sucesso",
        });
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
        const file = req.files["photo"]?.[0];

        let photoCarUrl: string = undefined;

        if (file) {
            photoCarUrl = await uploadFile(
                file.buffer,
                `fotos/${Date.now()}_${file.originalname}`
            );
        }

        const data = formatCarRequestData(req, photoCarUrl);

        await carService.createCarForRent(data);
        res.status(201).json({
            message: "Carro para aluguel criado com sucesso",
        });
    } catch (error) {
        next(error);
    }
}

// métodos put
async function buy(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const { buyerId } = req.body;

        await carService.buyCar(id, buyerId);

        res.status(200).json({ message: `Carro ${id} comprado com sucesso` });
    } catch (error) {
        next(error);
    }
}

async function rent(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const { renterId } = req.body;

        await carService.rentCar(id, renterId);

        res.status(200).json({ message: `Carro ${id} alugado com sucesso` });
    } catch (error) {
        next(error);
    }
}

async function returnCar(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
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
        const car = await carService.getById(id);

        const carWithUrl = await GetCarWithSignedUrl(car);

        res.status(200).json(carWithUrl);
    } catch (error) {
        next(error);
    }
}

async function update(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        const data = req.body;

        const file = req.files?.[0];

        if (file) {
            const photoCarUrl = await uploadFile(
                file.buffer,
                `fotos/${Date.now()}_${file.originalname}`
            );

            data.photo_url = photoCarUrl;
        }

        await carService.updateCar(id, data);

        res.status(200).json({ message: `Carro ${id} atualizado com sucesso` });
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
};
