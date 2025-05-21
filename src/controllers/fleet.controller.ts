import { Request, Response, NextFunction } from "express";
import fleetService from "../services/fleet.service.ts";
import { IFleet } from "../interface/global.ts";

async function create(req: Request, res: Response, next: NextFunction) {
    try {
        const data: IFleet = {
            ...req.body,
            photoUrl: req.file?.buffer, // recebe o buffer da imagem
        };

        await fleetService.create(data);
        res.status(201).json({ message: "Veículo cadastrado com sucesso" });
    } catch (error) {
        next(error);
    }
}

async function getAll(req: Request, res: Response, next: NextFunction) {
    try {
        const vehicles = await fleetService.getAll();
        res.status(200).json(vehicles);
    } catch (error) {
        next(error);
    }
}

async function getById(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.query;
        if (!id)
            return res
                .status(400)
                .json({ message: "ID do veículo não informado" });

        const vehicles = await fleetService.getById(id);
        res.status(200).json(vehicles);
    } catch (error) {
        next(error);
    }
}

async function update(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.query;
        const data: Partial<IFleet> = {
            ...req.body,
            ...(req.file && { photoUrl: req.file.buffer }), // atualiza buffer se enviado
        };

        await fleetService.update(String(id), data);
        res.status(204).json({
            message: `Veículo ${id} atualizado com sucesso`,
        });
    } catch (error) {
        next(error);
    }
}

async function remove(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.query;
        await fleetService.remove(String(id));
        res.status(204).json({ message: `Veículo ${id} removido com sucesso` });
    } catch (error) {
        next(error);
    }
}

async function sellCar(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.query;
        await fleetService.sellCar(String(id));
        res.status(200).json({ message: "Veículo vendido com sucesso" });
    } catch (error) {
        next(error);
    }
}

async function rentCar(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.query;
        await fleetService.rentCar(String(id));
        res.status(200).json({ message: "Veículo alugado com sucesso" });
    } catch (error) {
        next(error);
    }
}

async function returnCar(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.query;
        await fleetService.returnCar(String(id));
        res.status(200).json({ message: "Veículo devolvido com sucesso" });
    } catch (error) {
        next(error);
    }
}

export { create, getAll, update, remove, sellCar, rentCar, returnCar };
