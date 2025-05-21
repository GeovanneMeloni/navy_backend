import { IFleet } from "../interface/global";
import { Fleet } from "../models/fleet.model";

async function create(data: IFleet) {
    const fleet = new Fleet(data);
    return await fleet.save();
}

async function getAll() {
    return await Fleet.find().exec();
}

async function getById(id: string) {
    return await Fleet.findById(id).exec();
}

async function update(id: string, data: Partial<IFleet>) {
    try {
        await Fleet.updateOne({ _id: id }, data);
    } catch (error: any) {
        throw new Error(error.message);
    }
}

async function remove(id: string) {
    try {
        await Fleet.findByIdAndDelete(id);
    } catch (error: any) {
        throw new Error(error.message);
    }
}

async function sellCar(id: string) {
    const car = await Fleet.findById(id);

    if (!car) throw { status: 404, message: "Carro não encontrado" };

    if (car.isSold) throw { status: 400, message: "Carro já foi vendido" };

    car.isSold = true;
    car.isAvailable = false;
    car.soldAt = new Date();

    return await car.save();
}

async function rentCar(id: string) {
    const car = await Fleet.findById(id);

    if (!car) throw { status: 404, message: "Carro não encontrado" };

    if (!car.isAvailable)
        throw { status: 400, message: "Carro não está disponível para alugar" };

    if (car.isSold) throw { status: 400, message: "Carro já foi vendido" };

    car.isAvailable = false;
    car.rentedAt = new Date();

    return await car.save();
}

async function returnCar(id: string) {
    const car = await Fleet.findById(id);
    if (!car) throw { status: 404, message: "Carro não encontrado" };
    if (car.isAvailable)
        throw { status: 400, message: "Carro não está disponível para alugar" };

    car.isAvailable = true;
    car.rentedAt = null;

    return await car.save();
}

export default {
    create,
    getAll,
    getById,
    update,
    remove,
    sellCar,
    rentCar,
    returnCar,
};
