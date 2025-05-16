import { NextFunction, Request, Response } from "express";

const roles = {
  admin: {
    can: ['create', 'edit', 'delete', 'view'],
  },
  seller: {
    can: ['create', 'edit', 'view'],
  },
  buyer: {
    can: ['view'],
  },
};


export function checkRole(action: string){
  return (req, res, next) => {
    const userRole = req.user.role;
    const permissions = roles[userRole].can;

    if (permissions.includes(action)) {
      next(); 
    } else {
      res.status(403).json({ message: "Access Denied" });
    }
  };
}