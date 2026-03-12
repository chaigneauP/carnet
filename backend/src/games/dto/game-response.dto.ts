import type { GameStatusDtoValue } from './game-status.dto';

export class GameListItemDto {
  id!: number;
  title!: string;
  status!: GameStatusDtoValue;
  playtimeTotal!: number;
  overallScore!: number | null;
  tags!: string[];
  createdAt!: string;
  updatedAt!: string;
}

export class GameRatingDto {
  gameplay!: number | null;
  levelDesign!: number | null;
  story!: number | null;
  atmosphere!: number | null;
  replayability!: number | null;
  overallScore!: number | null;
  notes!: string | null;
}

export class GamePlaythroughDto {
  id!: number;
  platform!: string;
  startDate!: string | null;
  endDate!: string | null;
  playtimeHours!: number;
  status!: 'Completed' | 'In Progress' | 'Dropped';
  notes!: string | null;
  difficulty!: string | null;
  achievementsCompleted!: number | null;
  createdAt!: string;
  updatedAt!: string;
}

export class GameDetailItemDto {
  id!: number;
  title!: string;
  developer!: string | null;
  releaseYear!: number | null;
  genre!: string | null;
  coverUrl!: string | null;
  description!: string | null;
  status!: GameStatusDtoValue;
  playtimeTotal!: number;
  rating!: GameRatingDto | null;
  tags!: string[];
  playthroughs!: GamePlaythroughDto[];
  createdAt!: string;
  updatedAt!: string;
}

export class GamesListMetaDto {
  count!: number;
  limit!: number;
}

export class GamesListResponseDto {
  data!: GameListItemDto[];
  meta!: GamesListMetaDto;
}

export class GameResponseDto {
  data!: GameDetailItemDto;
}

