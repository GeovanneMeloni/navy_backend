import { Request, Response, NextFunction } from 'express';

export type Action = 'create' | 'edit' | 'delete' | 'view';

export const roles: Record<string, Action[]> = {
  admin: ['create', 'edit', 'delete', 'view'],
  employee: ['create', 'edit', 'view'],
  client: ['view'],
};

export function checkPermission(action: Action) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req["user"];

    if (!user || !user.role) {
      res.status(401).json({ message: 'Usuário não autenticado' });
      return;
    }

    const permissions = roles[user.role];

    if (!permissions) {
      res.status(403).json({ message: 'Função inválida' });
      return;
    }

    if (permissions.includes(action)) {
      next();
      return;
    }

    res.status(403).json({ message: 'Acesso negado' });
    return;
  };
}

