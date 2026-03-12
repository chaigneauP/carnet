import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameEntity } from '../database/entities/game.entity';
import { GameTagEntity } from '../database/entities/game-tag.entity';
import { PlaythroughEntity } from '../database/entities/playthrough.entity';
import { RatingEntity } from '../database/entities/rating.entity';
import { TagEntity } from '../database/entities/tag.entity';
import { PlaythroughsModule } from '../playthroughs/playthroughs.module';
import { GamesController } from './games.controller';
import { GamesMapper } from './games.mapper';
import { GamesService } from './games.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([GameEntity, RatingEntity, PlaythroughEntity, TagEntity, GameTagEntity]),
    PlaythroughsModule,
  ],
  controllers: [GamesController],
  providers: [GamesService, GamesMapper],
})
export class GamesModule {}


