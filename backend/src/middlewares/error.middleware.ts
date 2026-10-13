import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';
import { env } from '../config/env';

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 400,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      erro: err.message,
      ...(err.code && { codigo: err.code }),
    });
    return;
  }

  logger.error('Erro não tratado', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
  });

  res.status(500).json({
    erro: env.NODE_ENV === 'production' ? 'Erro interno do servidor' : err.message,
  });
}

export function notFound(req: Request, res: Response): void {
  res.status(404).json({ erro: `Rota ${req.method} ${req.path} não encontrada` });
}
