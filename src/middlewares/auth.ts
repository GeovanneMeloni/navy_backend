import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../interface/global";

export function auth(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({
                message: "Token não fornecido ou mal formatado",
            });
            return;
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            res.status(401).json({ message: "Token inválido" });
            return;
        }

        const decoded = jwt.verify(
            token,
            process.env.SECRET_TOKEN!
        ) as JwtPayload;

        req["user"] = {
            id: decoded.userId,
            role: decoded.role,
        };

        next();
    } catch (error: any) {
        let message = "Erro de autenticação";

        if (error instanceof jwt.TokenExpiredError) {
            message = "Token expirado. Faça login novamente.";
        } else if (error instanceof jwt.JsonWebTokenError) {
            message = "Token inválido. Verifique suas credenciais.";
        }

        console.error("Erro no middleware de autenticação:", error.message);

        res.status(401).json({ message: message });
        return;
    }
}
