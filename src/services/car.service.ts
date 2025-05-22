import { ICarSimplified } from "../interface/global";
import { Car, CarType } from "../models/car/car.model";
import { User } from "../models/user/user.model";

async function create(data: CarType) {
    // Gera a short_description automaticamente
    data.short_description = generateShortDescription(data);
    const car = new Car(data);
    return await car.save();
}

async function getAllSimplified(): Promise<ICarSimplified[]> {
    const carsSimplified = (await Car.find()).map((car) => {
        return {
            id: car._id.toString(),
            price: car.price,
            price_per_hour: car.price_per_hour,
            mileage: car.mileage,
            license_plate: car.license_plate,
            photo_url: car.photo_url,
            is_available: car.is_available,
            is_sold: car.is_sold,
            rented_at: car.rented_at,
            sold_at: car.sold_at,
            short_description: car.short_description,
        };
    });

    return carsSimplified;
}

async function getAll(): Promise<CarType[]> {
    return await Car.find().exec();
}

async function getAllNotSold(): Promise<CarType[]> {
    return await Car.find({ is_sold: false }).exec();
}

async function getAllSold(): Promise<CarType[]> {
    return await Car.find({ is_sold: true }).exec();
}

async function getAllAvailableToRent(): Promise<CarType[]> {
    return await Car.find({ is_available: true, is_sold: false }).exec();
}

async function getById(id: string) {
    return await Car.findById(id).exec();
}

async function update(id: string, data: Partial<CarType>) {
    try {
        const existingCar = await Car.findById(id);
        if (!existingCar) throw new Error("Carro não encontrado");

        const updatedCar: CarType = {
            ...existingCar.toObject(),
            ...data,
            details: {
                ...existingCar.details,
                ...(data.details || {}),
            },
        };

        if (data.details || data.mileage !== undefined) {
            updatedCar.short_description = generateShortDescription(updatedCar);
        }

        await Car.updateOne({ _id: id }, updatedCar);
    } catch (error: any) {
        throw new Error(error.message);
    }
}

async function remove(id: string) {
    try {
        await Car.findByIdAndDelete(id);
    } catch (error: any) {
        throw new Error(error.message);
    }
}

async function sellCar(id: string) {
    const car = await Car.findById(id);

    if (!car) throw { status: 404, message: "Carro não encontrado" };
    if (car.is_sold) throw { status: 400, message: "Carro já foi vendido" };

    car.is_sold = true;
    car.is_available = false;
    car.sold_at = new Date();

    return await car.save();
}

async function rentCar(id: string, renterId?: string) {
    const car = await Car.findById(id);

    if (!car) throw { status: 404, message: "Carro não encontrado" };

    if (!car.is_available)
        throw { status: 400, message: "Carro indisponível para aluguel" };
    if (car.is_sold) throw { status: 400, message: "Carro já foi vendido" };

    if (renterId) {
        const user = await User.findById(renterId);

        if (!user) throw { status: 404, message: "Usuário não encontrado" };

        car.renter_id = user.id;
    }

    car.is_available = false;
    car.rented_at = new Date();

    return await car.save();
}

async function returnCar(id: string, newMileage: number) {
    const car = await Car.findById(id);
    if (!car) throw { status: 404, message: "Carro não encontrado" };
    if (car.is_available)
        throw { status: 400, message: "Carro já está disponível" };

    car.is_available = true;
    car.rented_at = null;
    car.mileage = newMileage;
    car.renter_id = null;

    return await car.save();
}

function generateShortDescription(car: Partial<CarType>): string {
    const { details, mileage } = car;
    if (!details) return "";

    const brand = details.brand ?? "";
    const model = details.model ?? "";
    const mileageString = mileage ? `${mileage.toLocaleString()} km` : "";
    const year = details.year ? `${details.year}` : "";
    const transmission = details.transmission ?? "";

    return `${brand.toUpperCase()} ${model.toUpperCase()} ${mileageString} ${year} ${transmission.toUpperCase()}`.trim();
}

export default {
    create,
    getAll,
    getAllNotSold,
    getAllSold,
    getAllAvailableToRent,
    getById,
    update,
    remove,
    sellCar,
    rentCar,
    returnCar,
    getAllSimplified,
};
