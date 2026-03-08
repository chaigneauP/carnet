import { Prisma } from '@prisma/client';
import { prisma } from '../db/prisma';

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;

export type GameListItem = {
  id: number;
  title: string;
  status: 'backlog' | 'playing' | 'completed' | 'dropped';
  playtimeTotal: number;
  overallScore: number | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

type GameListRecord = Prisma.GameGetPayload<{
  select: {
    id: true;
    title: true;
    status: true;
    playtimeTotal: true;
    createdAt: true;
    updatedAt: true;
    rating: {
      select: {
        overallScore: true;
      };
    };
    gameTags: {
      select: {
        tag: {
          select: {
            name: true;
          };
        };
      };
    };
  };
}>;

export function normalizeLimit(value: unknown): number {
  if (value === undefined) {
    return DEFAULT_LIMIT;
  }

  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    throw new Error('The "limit" query parameter must be a positive integer.');
  }

  return Math.min(parsedValue, MAX_LIMIT);
}

export async function listGames(limit = DEFAULT_LIMIT): Promise<GameListItem[]> {
  const games = await prisma.game.findMany({
    take: limit,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      status: true,
      playtimeTotal: true,
      createdAt: true,
      updatedAt: true,
      rating: {
        select: {
          overallScore: true,
        },
      },
      gameTags: {
        select: {
          tag: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  return games.map((game: GameListRecord) => ({
    id: Number(game.id),
    title: game.title,
    status: game.status,
    playtimeTotal: game.playtimeTotal.toNumber(),
    overallScore: game.rating?.overallScore?.toNumber() ?? null,
    tags: game.gameTags.map((entry: GameListRecord['gameTags'][number]) => entry.tag.name),
    createdAt: game.createdAt.toISOString(),
    updatedAt: game.updatedAt.toISOString(),
  }));
}
