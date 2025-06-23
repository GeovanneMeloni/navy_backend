import { NextFunction, Request, Response } from "express";
import carService from "../../services/car.service";

export async function verifyCarOwner(
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

    // Aqui você deve implementar a lógica para verificar se o usuário é o proprietário do carro
    const isOwner = await carService.checkCarOwnership(carId, user.id);

    // verificar se é admin também
    const isAdmin = user.role === "admin";

    if (isOwner == false && isAdmin == false) {
        res.status(403).json({
            message: "Acesso negado",
        });

        console.log(
            `Usuário ${user.id} tentou acessar o carro ${carId} sem permissão`
        );

        return;
    }

    next();
}
