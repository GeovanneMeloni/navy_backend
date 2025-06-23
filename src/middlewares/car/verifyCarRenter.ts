import { NextFunction, Request, Response } from "express";
import carService from "../../services/car.service";

export async function verifyCarRenter(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const user = req["user"];
    const carId = req.params.id;

    if (!user || !user.id) {
        res.status(401).json({ message: "Usuário não autenticado" });
        return;
    }

    // Verifica se o carro está disponível para aluguel
    const car = await carService.getById(carId);

    if (!car) {
        res.status(404).json({ message: "Carro não encontrado" });
        return;
    }

    const isRenter = car.rented_by?.toString() === user.id;

    if (!isRenter) {
        res.status(403).json({
            message: "Acesso negado: você não alugou esse carro",
        });
        return;
    }
    // Se o usuário é o locatário, continue para o próximo middleware ou rota
    next();
}
