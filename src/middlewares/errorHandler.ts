import { NextFunction, Request, Response } from "express";
import multer from "multer";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (res.headersSent) {
      return next(err);
  }

  let status = 500;
  let message = "Erro interno do servidor";
  
  if (err instanceof multer.MulterError) {
      status = 400;
      message = err.code === "LIMIT_FILE_SIZE" 
          ? "Arquivo muito grande! Tamanho máximo: 5MB" 
          : "Erro no upload de arquivo";
  } else if (err.status && typeof err.status === "number") {
      status = err.status;
      message = err.message;
  } else if (err.message) {
      status = err.status ?? 400;
      message = err.message;
  }
  
  res.status(status).json({ error: message });
}