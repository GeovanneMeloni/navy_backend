import { NextFunction, Request, Response } from "express";
import { Car } from "../models/car/car.model";

export async function verifyCanCancelPurchase(
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

        if (user.role === "admin") {
            return next();
        }

        const car = await Car.findById(carId);
        if (!car) {
            res.status(404).json({ message: "Carro não encontrado." });
            return;
        }

        if (car.owner_id.toString() === user.id) {
            return next();
        }

        res.status(403).json({ message: "Acesso negado." });
    } catch (error) {
        next(error);
    }
}