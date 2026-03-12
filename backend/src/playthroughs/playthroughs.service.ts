import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GameEntity } from '../database/entities/game.entity';
import { PlaythroughEntity } from '../database/entities/playthrough.entity';
import { CreatePlaythroughDto } from './dto/create-playthrough.dto';
import { PlaythroughDto, PlaythroughsListResponseDto } from './dto/playthrough-response.dto';
import { UpdatePlaythroughDto } from './dto/update-playthrough.dto';

@Injectable()
export class PlaythroughsService {
  constructor(
    @InjectRepository(PlaythroughEntity)
    private readonly playthroughRepository: Repository<PlaythroughEntity>,
    @InjectRepository(GameEntity)
    private readonly gameRepository: Repository<GameEntity>,
  ) {}

  async listByGame(gameId: number): Promise<PlaythroughDto[]> {
    await this.findGameOrThrow(gameId);

    const playthroughs = await this.playthroughRepository.find({
      where: { gameId },
      order: { createdAt: 'DESC' },
    });

    return playthroughs.map((p) => this.toDto(p));
  }

  async createForGame(gameId: number, dto: CreatePlaythroughDto): Promise<PlaythroughDto> {
    await this.findGameOrThrow(gameId);

    const playthrough = this.playthroughRepository.create({
      gameId,
      platform: dto.platform.trim(),
      startDate: dto.startDate ?? null,
      endDate: dto.endDate ?? null,
      playtimeHours: dto.playtimeHours ?? 0,
      status: dto.status,
      notes: this.normalizeNullableText(dto.notes),
      difficulty: this.normalizeNullableText(dto.difficulty),
      achievementsCompleted: dto.achievementsCompleted ?? null,
    });

    const saved = await this.playthroughRepository.save(playthrough);
    return this.toDto(saved);
  }

  async updatePlaythrough(id: number, dto: UpdatePlaythroughDto): Promise<PlaythroughDto> {
    const playthrough = await this.findPlaythroughOrThrow(id);

    playthrough.platform = dto.platform.trim();
    playthrough.startDate = dto.startDate ?? null;
    playthrough.endDate = dto.endDate ?? null;
    playthrough.playtimeHours = dto.playtimeHours ?? 0;
    playthrough.status = dto.status;
    playthrough.notes = this.normalizeNullableText(dto.notes);
    playthrough.difficulty = this.normalizeNullableText(dto.difficulty);
    playthrough.achievementsCompleted = dto.achievementsCompleted ?? null;

    const saved = await this.playthroughRepository.save(playthrough);
    return this.toDto(saved);
  }

  async deletePlaythrough(id: number): Promise<void> {
    const playthrough = await this.findPlaythroughOrThrow(id);
    await this.playthroughRepository.remove(playthrough);
  }

  private async findGameOrThrow(gameId: number): Promise<GameEntity> {
    const game = await this.gameRepository.findOne({ where: { id: String(gameId) } });
    if (!game) {
      throw new NotFoundException(`Game with id ${gameId} was not found.`);
    }
    return game;
  }

  private async findPlaythroughOrThrow(id: number): Promise<PlaythroughEntity> {
    const playthrough = await this.playthroughRepository.findOne({ where: { id: String(id) } });
    if (!playthrough) {
      throw new NotFoundException(`Playthrough with id ${id} was not found.`);
    }
    return playthrough;
  }

  private toDto(p: PlaythroughEntity): PlaythroughDto {
    return {
      id: Number(p.id),
      gameId: p.gameId,
      platform: p.platform,
      startDate: this.serializeDateOnly(p.startDate),
      endDate: this.serializeDateOnly(p.endDate),
      playtimeHours: p.playtimeHours,
      status: p.status,
      notes: p.notes,
      difficulty: p.difficulty,
      achievementsCompleted: p.achievementsCompleted,
      createdAt: this.serializeTimestamp(p.createdAt),
      updatedAt: this.serializeTimestamp(p.updatedAt),
    };
  }

  private normalizeNullableText(value: string | null | undefined): string | null {
    if (value === null || value === undefined) {
      return null;
    }
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
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

