import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GameEntity } from '../database/entities/game.entity';
import { GameTagEntity } from '../database/entities/game-tag.entity';
import { RatingEntity } from '../database/entities/rating.entity';
import { TagEntity } from '../database/entities/tag.entity';
import { CreateGameDto } from './dto/create-game.dto';
import { RatingDto } from './dto/rating-response.dto';
import { GameDetailItemDto, GameListItemDto } from './dto/game-response.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { UpsertRatingDto } from './dto/upsert-rating.dto';
import { GamesMapper } from './games.mapper';

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(GameEntity)
    private readonly gameRepository: Repository<GameEntity>,
    @InjectRepository(RatingEntity)
    private readonly ratingRepository: Repository<RatingEntity>,
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>,
    @InjectRepository(GameTagEntity)
    private readonly gameTagRepository: Repository<GameTagEntity>,
    private readonly gamesMapper: GamesMapper,
  ) {}

  resolveListLimit(limit?: number): number {
    if (limit === undefined) {
      return DEFAULT_LIMIT;
    }

    return Math.min(limit, MAX_LIMIT);
  }

  async listGames(limit?: number): Promise<GameListItemDto[]> {
    const games = await this.gameRepository.find({
      take: this.resolveListLimit(limit),
      order: { createdAt: 'DESC' },
      relations: {
        rating: true,
        gameTags: {
          tag: true,
        },
      },
    });

    return games.map((game) => this.gamesMapper.toGameListItemDto(game));
  }

  async getGameById(id: number): Promise<GameDetailItemDto> {
    const game = await this.findDetailedGameOrThrow(id);
    return this.gamesMapper.toGameDetailItemDto(game);
  }

  async createGame(dto: CreateGameDto): Promise<GameDetailItemDto> {
    const game = this.gameRepository.create(this.gamesMapper.toCreatePersistence(dto));
    const savedGame = await this.gameRepository.save(game);

    return this.getGameById(Number(savedGame.id));
  }

  async updateGame(id: number, dto: UpdateGameDto): Promise<GameDetailItemDto> {
    const game = await this.findGameRecordOrThrow(id);
    const updatedGame = this.gamesMapper.mergeUpdateDto(game, dto);

    await this.gameRepository.save(updatedGame);

    return this.getGameById(id);
  }

  async deleteGame(id: number): Promise<void> {
    const game = await this.findGameRecordOrThrow(id);
    await this.gameRepository.remove(game);
  }

  private async findDetailedGameOrThrow(id: number): Promise<GameEntity> {
    const game = await this.gameRepository
      .createQueryBuilder('game')
      .leftJoinAndSelect('game.rating', 'rating')
      .leftJoinAndSelect('game.gameTags', 'gameTag')
      .leftJoinAndSelect('gameTag.tag', 'tag')
      .leftJoinAndSelect('game.playthroughs', 'playthrough')
      .where('game.id = :id', { id: String(id) })
      .orderBy('playthrough.createdAt', 'DESC')
      .getOne();

    if (!game) {
      throw new NotFoundException(`Game with id ${id} was not found.`);
    }

    return game;
  }

  private async findGameRecordOrThrow(id: number): Promise<GameEntity> {
    const game = await this.gameRepository.findOne({
      where: { id: String(id) },
    });

    if (!game) {
      throw new NotFoundException(`Game with id ${id} was not found.`);
    }

    return game;
  }

  // ── Rating ──────────────────────────────────────────────────────────────

  async getRating(gameId: number): Promise<RatingDto> {
    await this.findGameRecordOrThrow(gameId);

    const rating = await this.ratingRepository.findOne({ where: { gameId } });
    if (!rating) {
      throw new NotFoundException(`Rating for game with id ${gameId} was not found.`);
    }

    return this.toRatingDto(rating);
  }

  async createRating(gameId: number, dto: UpsertRatingDto): Promise<RatingDto> {
    await this.findGameRecordOrThrow(gameId);

    const existing = await this.ratingRepository.findOne({ where: { gameId } });
    if (existing) {
      throw new ConflictException(`Rating for game with id ${gameId} already exists.`);
    }

    const rating = this.ratingRepository.create({
      gameId,
      gameplay: dto.gameplay ?? null,
      levelDesign: dto.levelDesign ?? null,
      story: dto.story ?? null,
      atmosphere: dto.atmosphere ?? null,
      replayability: dto.replayability ?? null,
      overallScore: dto.overallScore ?? null,
      notes: this.normalizeNullableText(dto.notes),
    });

    const saved = await this.ratingRepository.save(rating);
    return this.toRatingDto(saved);
  }

  async updateRating(gameId: number, dto: UpsertRatingDto): Promise<RatingDto> {
    await this.findGameRecordOrThrow(gameId);

    const rating = await this.ratingRepository.findOne({ where: { gameId } });
    if (!rating) {
      throw new NotFoundException(`Rating for game with id ${gameId} was not found.`);
    }

    rating.gameplay = dto.gameplay ?? null;
    rating.levelDesign = dto.levelDesign ?? null;
    rating.story = dto.story ?? null;
    rating.atmosphere = dto.atmosphere ?? null;
    rating.replayability = dto.replayability ?? null;
    rating.overallScore = dto.overallScore ?? null;
    rating.notes = this.normalizeNullableText(dto.notes);

    const saved = await this.ratingRepository.save(rating);
    return this.toRatingDto(saved);
  }

  // ── Game Tags ────────────────────────────────────────────────────────────

  async addTagToGame(gameId: number, tagId: number): Promise<void> {
    await this.findGameRecordOrThrow(gameId);

    const tag = await this.tagRepository.findOne({ where: { id: String(tagId) } });
    if (!tag) {
      throw new NotFoundException(`Tag with id ${tagId} was not found.`);
    }

    const existing = await this.gameTagRepository.findOne({ where: { gameId, tagId } });
    if (existing) {
      return; // idempotent
    }

    const gameTag = this.gameTagRepository.create({ gameId, tagId });
    await this.gameTagRepository.save(gameTag);
  }

  async removeTagFromGame(gameId: number, tagId: number): Promise<void> {
    await this.findGameRecordOrThrow(gameId);

    const gameTag = await this.gameTagRepository.findOne({ where: { gameId, tagId } });
    if (!gameTag) {
      throw new NotFoundException(
        `Tag with id ${tagId} is not associated with game with id ${gameId}.`,
      );
    }

    await this.gameTagRepository.remove(gameTag);
  }

  // ── Private helpers ──────────────────────────────────────────────────────

  private toRatingDto(rating: RatingEntity): RatingDto {
    return {
      id: Number(rating.id),
      gameId: rating.gameId,
      gameplay: rating.gameplay,
      levelDesign: rating.levelDesign,
      story: rating.story,
      atmosphere: rating.atmosphere,
      replayability: rating.replayability,
      overallScore: rating.overallScore,
      notes: rating.notes,
      createdAt: rating.createdAt instanceof Date ? rating.createdAt.toISOString() : new Date(rating.createdAt).toISOString(),
      updatedAt: rating.updatedAt instanceof Date ? rating.updatedAt.toISOString() : new Date(rating.updatedAt).toISOString(),
    };
  }

  private normalizeNullableText(value: string | null | undefined): string | null {
    if (value === null || value === undefined) {
      return null;
    }
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }
}
