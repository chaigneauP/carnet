import { IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';
import { GAME_STATUSES, type GameStatusDtoValue } from './game-status.dto';

export class CreateGameDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  title!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  developer?: string | null;

  @IsOptional()
  @IsInt()
  @Min(1950)
  @Max(2100)
  releaseYear?: number | null;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  genre?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(2048)
  coverUrl?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(10000)
  description?: string | null;

  @IsOptional()
  @IsIn(GAME_STATUSES)
  status?: GameStatusDtoValue;
}

