import { NextFunction, Request, Response } from "express";
import { Car } from "../models/car/car.model";

export async function verifyCanBuyCar(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const user = req["user"];
        const carId = req.params.id;

        if (!user) {
            res.status(401).json({ message: "Usuário não autenticado." });
            return;
        }

        const car = await Car.findById(carId);
        if (!car) {
            res.status(404).json({ message: "Carro não encontrado." });
            return;
        }

        if (car.owner_id.toString() === user.id) {
            res.status(403).json({ message: "Você não pode comprar seu próprio carro." });
            return;
        }

        next();
    } catch (error) {
        next(error);
    }
}