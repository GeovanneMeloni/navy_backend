import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export function auth(req: Request, res: Response, next: NextFunction) {
    try {
        console.log("Oiiii");
        
        const authorization = req.headers.authorization
        if (!authorization || !authorization?.includes("Bearer")) {
            res.status(401).json({ message: "Token inválido" })
            return
        }

        const [_, token] = authorization.split(" ");

        if (!token) {
            res.status(401).json({ message: "Token inválido" })
        }
        const decoded: any = jwt.verify(token, process.env.SECRET_TOKEN!)
        
        req["user"] = {
            id: decoded.userId,
            role: decoded.role
        }
        
        next()
    } catch (error) {
        res.status(401).json({ message: error.message })
        return
    }
}