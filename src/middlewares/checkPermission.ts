import { Request, Response, NextFunction } from "express";
import { Action, Resource, permissions } from "../security/permissions";

function checkPermission(action: Action, resource: Resource) {
    return (req: Request, res: Response, next: NextFunction): void => {
        const user = req["user"];

        if (!user || !user.role) {
            res.status(401).json({ message: "Usuário não autenticado" });
            return;
        }

        const userPermissions = permissions[user.role]?.[resource];

        if (!userPermissions || !userPermissions.includes(action)) {
            res.status(403).json({ message: "Acesso negado" });
            return;
        }

        next();
    };
}

export { checkPermission };
