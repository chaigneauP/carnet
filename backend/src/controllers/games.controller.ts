import type { Request, Response, NextFunction } from 'express';
import { listGames, normalizeLimit } from '../services/games.service';

export async function getGames(request: Request, response: Response, next: NextFunction) {
  try {
    const limit = normalizeLimit(request.query.limit);
    const games = await listGames(limit);

    return response.status(200).json({
      data: games,
      meta: {
        count: games.length,
        limit,
      },
    });
  } catch (error) {
    return next(error);
  }
}
