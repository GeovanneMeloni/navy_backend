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

// função que verifica se o usuário está tentando acessar o próprio recurso
// por exemplo, um usuário só pode editar ou excluir seu próprio perfil
// ou se for um administrador, pode acessar qualquer recurso
function checkOwnResource(req: Request, res: Response, next: NextFunction) {
    const user = req["user"];
    const role = user?.role;

    if (role === "admin") {
        return next();
    }
    const resourceId = req.params.id;

    if (user && user.id === resourceId) {
        return next();
    }

    res.status(403).json({ message: "Acesso negado ao recurso" });
}

export { checkPermission, checkOwnResource };
