import { IsNumber, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class UpsertRatingDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  gameplay?: number | null;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  levelDesign?: number | null;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  story?: number | null;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  atmosphere?: number | null;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  replayability?: number | null;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  overallScore?: number | null;

  @IsOptional()
  @IsString()
  @MaxLength(10000)
  notes?: string | null;
}

