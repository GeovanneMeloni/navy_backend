import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export function auth(req: Request, res: Response, next: NextFunction) {
    try {
        const authorization = req.headers.authorization;

        if (!authorization || !authorization?.includes("Bearer")) {
            res.status(401).json({ message: "Token inválido" });
            return;
        }

        const [_, token] = authorization.split(" ");

        if (!token) {
            res.status(401).json({ message: "Token inválido" });
        }

        const decoded: any = jwt.verify(token, process.env.SECRET_TOKEN!);

        req["user"] = {
            id: decoded.userId,
            role: decoded.role,
        };

        next();
    } catch (error) {
        let errorMessage = "Erro de autenticação";

        if (error instanceof jwt.JsonWebTokenError) {
            errorMessage =
                "Token inválido, verifique se o token é válido e não expirou";
        } else if (error instanceof jwt.TokenExpiredError) {
            errorMessage = "Token expirado, por favor faça login novamente";
        } else {
            errorMessage = "Erro ao verificar token";
        }

        console.error("Erro de autenticação:", error.message);

        res.status(401).json({ message: errorMessage });
        return;
    }
}
