import { prisma } from '../db/prisma';
import type { Request, Response } from 'express';

export async function getHealth(_request: Request, response: Response) {
  try {
    await prisma.$queryRaw`SELECT 1`;

    return response.status(200).json({
      status: 'ok',
      database: 'up',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return response.status(503).json({
      status: 'error',
      database: 'down',
      message: error instanceof Error ? error.message : 'Unknown database error',
      timestamp: new Date().toISOString(),
    });
  }
}
