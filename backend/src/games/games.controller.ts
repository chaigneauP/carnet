import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query } from '@nestjs/common';
import { PlaythroughsService } from '../playthroughs/playthroughs.service';
import { PlaythroughResponseDto, PlaythroughsListResponseDto } from '../playthroughs/dto/playthrough-response.dto';
import { CreatePlaythroughDto } from '../playthroughs/dto/create-playthrough.dto';
import { AddGameTagDto } from './dto/add-game-tag.dto';
import { CreateGameDto } from './dto/create-game.dto';
import { GameIdParamDto } from './dto/game-id-param.dto';
import { GameTagParamDto } from './dto/game-tag-param.dto';
import { GameResponseDto, GamesListResponseDto } from './dto/game-response.dto';
import { GetGamesQueryDto } from './dto/get-games-query.dto';
import { RatingResponseDto } from './dto/rating-response.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { UpsertRatingDto } from './dto/upsert-rating.dto';
import { GamesService } from './games.service';

@Controller('api/games')
export class GamesController {
  constructor(
    private readonly gamesService: GamesService,
    private readonly playthroughsService: PlaythroughsService,
  ) {}

  // ── Games ──────────────────────────────────────────────────────────────

  @Get()
  async getGames(@Query() query: GetGamesQueryDto): Promise<GamesListResponseDto> {
    const games = await this.gamesService.listGames(query.limit);
    const limit = this.gamesService.resolveListLimit(query.limit);

    return {
      data: games,
      meta: {
        count: games.length,
        limit,
      },
    };
  }

  @Get(':id')
  async getGame(@Param() params: GameIdParamDto): Promise<GameResponseDto> {
    const game = await this.gamesService.getGameById(params.id);
    return { data: game };
  }

  @Post()
  async createGame(@Body() dto: CreateGameDto): Promise<GameResponseDto> {
    const game = await this.gamesService.createGame(dto);
    return { data: game };
  }

  @Put(':id')
  async updateGame(@Param() params: GameIdParamDto, @Body() dto: UpdateGameDto): Promise<GameResponseDto> {
    const game = await this.gamesService.updateGame(params.id, dto);
    return { data: game };
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteGame(@Param() params: GameIdParamDto): Promise<void> {
    await this.gamesService.deleteGame(params.id);
  }

  // ── Ratings ────────────────────────────────────────────────────────────

  @Get(':id/rating')
  async getRating(@Param() params: GameIdParamDto): Promise<RatingResponseDto> {
    const rating = await this.gamesService.getRating(params.id);
    return { data: rating };
  }

  @Post(':id/rating')
  @HttpCode(201)
  async createRating(
    @Param() params: GameIdParamDto,
    @Body() dto: UpsertRatingDto,
  ): Promise<RatingResponseDto> {
    const rating = await this.gamesService.createRating(params.id, dto);
    return { data: rating };
  }

  @Put(':id/rating')
  async updateRating(
    @Param() params: GameIdParamDto,
    @Body() dto: UpsertRatingDto,
  ): Promise<RatingResponseDto> {
    const rating = await this.gamesService.updateRating(params.id, dto);
    return { data: rating };
  }

  // ── Playthroughs (game-scoped) ─────────────────────────────────────────

  @Get(':id/playthroughs')
  async getPlaythroughs(@Param() params: GameIdParamDto): Promise<PlaythroughsListResponseDto> {
    const playthroughs = await this.playthroughsService.listByGame(params.id);
    return { data: playthroughs };
  }

  @Post(':id/playthroughs')
  @HttpCode(201)
  async createPlaythrough(
    @Param() params: GameIdParamDto,
    @Body() dto: CreatePlaythroughDto,
  ): Promise<PlaythroughResponseDto> {
    const playthrough = await this.playthroughsService.createForGame(params.id, dto);
    return { data: playthrough };
  }

  // ── Game Tags ──────────────────────────────────────────────────────────

  @Post(':id/tags')
  @HttpCode(204)
  async addTag(@Param() params: GameIdParamDto, @Body() dto: AddGameTagDto): Promise<void> {
    await this.gamesService.addTagToGame(params.id, dto.tagId);
  }

  @Delete(':id/tags/:tagId')
  @HttpCode(204)
  async removeTag(@Param() params: GameTagParamDto): Promise<void> {
    await this.gamesService.removeTagFromGame(params.id, params.tagId);
  }
}


