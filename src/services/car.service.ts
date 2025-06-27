import { error } from "console";
import { Car, CarType } from "../models/car/car.model";
import { User } from "../models/user/user.model";
import { generateShortDescription } from "../utils/car.utils";
import { deleteFile } from "../utils/bucket";

async function create(data: CarType) {
    // Verifica se o carro é para venda ou aluguel
    if (!data.operationType) {
        // Se não for definido, lança um erro
        throw {
            status: 400,
            message:
                "É necessário definir se o carro é para venda ou para alugar",
            errorDetails:
                "É necessário definir o campo operationType, que deve ser 'sale' ou 'rent'",
        };
    }

    const user = await User.findById(data.owner_id);

    if (!user) {
        throw {
            status: 400,
            message: "Usuário não encontrado para definir como proprietário",
        };
    }

    if (await existsCarWithSameLicensePlate(data.license_plate)) {
        throw {
            status: 400,
            message: "Carro já criado com essa placa!",
        };
    }
    // Gera a short_description automaticamente
    data.short_description = generateShortDescription(data);

    const car = new Car(data);

    const createdCar = await car.save();

    const carWithId = await Car.findById(createdCar._id);

    return carWithId;
}

async function createCarForSale(data: CarType) {
    data.short_description = generateShortDescription(data);

    const user = await User.findById(data.owner_id);

    if (!user) {
        throw {
            status: 400,
            message: "Usuário não encontrado para definir como proprietário",
        };
    }

    //console.log(data);

    if (await existsCarWithSameLicensePlate(data.license_plate)) {
        throw {
            status: 400,
            message: "Carro já criado com essa placa!",
        };
    }

    data.operationType = "sale";
    if (!data.price) {
        throw {
            status: 400,
            message: "Preço é obrigatório para carros à venda",
            errorDetails:
                "É necessário definir o campo price, que deve ser um número",
        };
    }

    const car = new Car(data);
    const createdCar = await car.save();

    const carWithId = await Car.findById(createdCar._id);

    return carWithId;
}

async function createCarForRent(data: CarType) {
    data.operationType = "rent";

    data.short_description = generateShortDescription(data);

    const user = await User.findById(data.owner_id);

    if (!user) {
        throw {
            status: 400,
            message: "Usuário não encontrado para definir como proprietário",
        };
    }

    if (await existsCarWithSameLicensePlate(data.license_plate)) {
        throw {
            status: 400,
            message: "Carro já criado com essa placa!",
        };
    }

    if (!data.price_per_hour) {
        throw {
            status: 400,
            message: "Preço por hora é obrigatório para carros para alugar",
        };
    }

    const car = new Car(data);

    const createdCar = await car.save();

    const carWithId = await Car.findById(createdCar._id);

    return carWithId;
}

async function buyCar(carId: string, buyerId: string) {
    const car = await Car.findById(carId);

    if (!car) throw { status: 404, message: "Carro não encontrado" };

    if (car.operationType !== "sale" || car.status !== "available") {
        throw { status: 400, message: "Carro não disponível para compra" };
    }

    const user = await User.findById(buyerId);

    if (!user) throw { status: 404, message: "Usuário não encontrado" };

    car.status = "sold";

    car.sold_to = user._id;

    car.sold_at = new Date();

    return await car.save();
}

async function rentCar(carId: string, renterId: string) {
    const car = await Car.findById(carId);

    if (!car) throw { status: 404, message: "Carro não encontrado" };

    if (car.operationType !== "rent" || car.status !== "available") {
        throw { status: 400, message: "Carro não disponível para aluguel" };
    }
    const user = await User.findById(renterId);

    if (!user) throw { status: 404, message: "Usuário não encontrado" };

    car.status = "rented";
    car.rented_by = user._id;
    car.rented_at = new Date();

    return await car.save();
}

async function returnRentedCar(carId: string, newMileage: number) {
    const car = await Car.findById(carId);

    if (!car) throw { status: 404, message: "Carro não encontrado" };

    if (car.status !== "rented")
        throw { status: 400, message: "Carro não está alugado" };

    car.status = "available";
    car.rented_by = undefined;
    car.rented_at = null;
    car.mileage = newMileage;

    return await car.save();
}

async function getById(id: string) {
    return await Car.findById(id).exec();
}

async function getAll() {
    return await Car.find().exec();
}

async function getAllWithFilter(filters: any) {
    return Car.find(filters).exec();
}

async function getAllAvailableForRent() {
    return await Car.find({ operationType: "rent", status: "available" });
}

async function getAllAvailableForSale() {
    return await Car.find({ operationType: "sale", status: "available" });
}

async function getAllSold() {
    return await Car.find({ operationType: "sale", status: "sold" });
}

async function getAllCurrentlyRented() {
    return await Car.find({ operationType: "rent", status: "rented" });
}

async function getAllByOwner(ownerId: string) {
    return await Car.find({ owner_id: ownerId });
}

async function getAllAvailableForSaleByOwner(ownerId: string) {
    return await Car.find({
        owner_id: ownerId,
        operationType: "sale",
        status: "available",
    });
}

async function getAllAvailableForRentByOwner(ownerId: string) {
    return await Car.find({
        owner_id: ownerId,
        operationType: "rent",
        status: "available",
    });
}

async function updateCar(id: string, data: Partial<CarType>) {
    const car = await Car.findById(id);

    if (!car) throw { status: 404, message: "Carro não encontrado" };

    Object.assign(car, data);

    car.short_description = generateShortDescription({
        ...car.toObject(),
        ...data,
    });

    return await car.save();
}

async function remove(id: string) {
    try {
        const car = await Car.findById(id);

        if (!car) {
            throw { status: 404, message: "Carro não encontrado" };
        }

        if (car.photo_url) {
            console.log(`Deletando imagem do carro: ${car.photo_url}`);
            await deleteFile(car.photo_url);
        }

        await Car.deleteOne({ _id: id });
    } catch (error: any) {
        throw {
            status: 500,
            message: `Erro ao remover carro: ${error.message}`,
        };
    }
}

async function checkCarOwnership(
    carId: string,
    userId: string
): Promise<boolean> {
    const car = await Car.findById(carId, "owner_id").exec();

    if (!car) {
        throw { status: 404, message: "Carro não encontrado" };
    }

    return car.owner_id.toString() === userId;
}

async function existsCarWithSameLicensePlate(license_plate: string) {
    const normalized = license_plate.trim().toUpperCase();
    const car = await Car.findOne({
        license_plate: { $regex: `^${normalized}$`, $options: "i" },
    }).exec();

    return car != null;
}

export default {
    createCarForSale,
    createCarForRent,
    buyCar,
    rentCar,
    returnRentedCar,
    getById,
    getAll,
    getAllAvailableForRent,
    getAllAvailableForSale,
    getAllSold,
    getAllCurrentlyRented,
    getAllByOwner,
    updateCar,
    getAllAvailableForSaleByOwner,
    getAllAvailableForRentByOwner,
    create,
    remove,
    checkCarOwnership,
    getAllWithFilter,
};
