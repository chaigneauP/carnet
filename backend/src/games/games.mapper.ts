import { Injectable } from '@nestjs/common';
import type { DeepPartial } from 'typeorm';
import { GameEntity } from '../database/entities/game.entity';
import { CreateGameDto } from './dto/create-game.dto';
import { GameDetailItemDto, GameListItemDto, GamePlaythroughDto, GameRatingDto } from './dto/game-response.dto';
import { type GameStatusDtoValue } from './dto/game-status.dto';
import { UpdateGameDto } from './dto/update-game.dto';

@Injectable()
export class GamesMapper {
  toGameListItemDto(game: GameEntity): GameListItemDto {
    return {
      id: Number(game.id),
      title: game.title,
      status: game.status,
      playtimeTotal: game.playtimeTotal,
      overallScore: game.rating?.overallScore ?? null,
      tags: game.gameTags.map((entry) => entry.tag.name),
      createdAt: this.serializeTimestamp(game.createdAt),
      updatedAt: this.serializeTimestamp(game.updatedAt),
    };
  }

  toGameDetailItemDto(game: GameEntity): GameDetailItemDto {
    return {
      id: Number(game.id),
      title: game.title,
      developer: game.developer,
      releaseYear: game.releaseYear,
      genre: game.genre,
      coverUrl: game.coverUrl,
      description: game.description,
      status: game.status,
      playtimeTotal: game.playtimeTotal,
      rating: this.toRatingDto(game),
      tags: game.gameTags.map((entry) => entry.tag.name),
      playthroughs: game.playthroughs.map((playthrough) => ({
        id: Number(playthrough.id),
        platform: playthrough.platform,
        startDate: this.serializeDateOnly(playthrough.startDate),
        endDate: this.serializeDateOnly(playthrough.endDate),
        playtimeHours: playthrough.playtimeHours,
        status: playthrough.status,
        notes: playthrough.notes,
        difficulty: playthrough.difficulty,
        achievementsCompleted: playthrough.achievementsCompleted,
        createdAt: this.serializeTimestamp(playthrough.createdAt),
        updatedAt: this.serializeTimestamp(playthrough.updatedAt),
      })),
      createdAt: this.serializeTimestamp(game.createdAt),
      updatedAt: this.serializeTimestamp(game.updatedAt),
    };
  }

  toCreatePersistence(dto: CreateGameDto): DeepPartial<GameEntity> {
    return {
      title: dto.title.trim(),
      developer: this.normalizeNullableText(dto.developer),
      releaseYear: dto.releaseYear ?? null,
      genre: this.normalizeNullableText(dto.genre),
      coverUrl: this.normalizeNullableText(dto.coverUrl),
      description: this.normalizeNullableText(dto.description),
      status: (dto.status ?? 'backlog') as GameStatusDtoValue,
    };
  }

  mergeUpdateDto(entity: GameEntity, dto: UpdateGameDto): GameEntity {
    entity.title = dto.title.trim();
    entity.developer = this.normalizeNullableText(dto.developer);
    entity.releaseYear = dto.releaseYear ?? null;
    entity.genre = this.normalizeNullableText(dto.genre);
    entity.coverUrl = this.normalizeNullableText(dto.coverUrl);
    entity.description = this.normalizeNullableText(dto.description);
    entity.status = dto.status;

    return entity;
  }

  private toRatingDto(game: GameEntity): GameRatingDto | null {
    if (!game.rating) {
      return null;
    }

    return {
      gameplay: game.rating.gameplay,
      levelDesign: game.rating.levelDesign,
      story: game.rating.story,
      atmosphere: game.rating.atmosphere,
      replayability: game.rating.replayability,
      overallScore: game.rating.overallScore,
      notes: game.rating.notes,
    };
  }

  private normalizeNullableText(value: string | null | undefined): string | null {
    if (value === null || value === undefined) {
      return null;
    }

    const normalizedValue = value.trim();
    return normalizedValue.length > 0 ? normalizedValue : null;
  }

  private serializeTimestamp(value: Date | string): string {
    return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
  }

  private serializeDateOnly(value: Date | string | null): string | null {
    if (!value) {
      return null;
    }

    if (value instanceof Date) {
      return value.toISOString();
    }

    return value.includes('T') ? new Date(value).toISOString() : new Date(`${value}T00:00:00.000Z`).toISOString();
  }
}

