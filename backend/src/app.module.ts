import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { createTypeOrmOptions } from './database/typeorm.config';
import { GamesModule } from './games/games.module';
import { HealthModule } from './health/health.module';
import { PlaythroughsModule } from './playthroughs/playthroughs.module';
import { TagsModule } from './tags/tags.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: createTypeOrmOptions,
    }),
    HealthModule,
    GamesModule,
    PlaythroughsModule,
    TagsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}



