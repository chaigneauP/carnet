import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameEntity } from '../database/entities/game.entity';
import { PlaythroughEntity } from '../database/entities/playthrough.entity';
import { PlaythroughsController } from './playthroughs.controller';
import { PlaythroughsService } from './playthroughs.service';

@Module({
  imports: [TypeOrmModule.forFeature([PlaythroughEntity, GameEntity])],
  controllers: [PlaythroughsController],
  providers: [PlaythroughsService],
  exports: [PlaythroughsService],
})
export class PlaythroughsModule {}

