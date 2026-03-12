import { IsIn, IsInt, IsNumber, IsOptional, IsString, Matches, Max, MaxLength, Min, MinLength } from 'class-validator';

export const PLAYTHROUGH_STATUSES = ['Completed', 'In Progress', 'Dropped'] as const;

export type PlaythroughStatusValue = (typeof PLAYTHROUGH_STATUSES)[number];

const DATE_FORMAT_MESSAGE = 'Must be a date in YYYY-MM-DD format.';
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export class CreatePlaythroughDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  platform!: string;

  @IsOptional()
  @IsString()
  @Matches(DATE_REGEX, { message: `startDate: ${DATE_FORMAT_MESSAGE}` })
  startDate?: string | null;

  @IsOptional()
  @IsString()
  @Matches(DATE_REGEX, { message: `endDate: ${DATE_FORMAT_MESSAGE}` })
  endDate?: string | null;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(9999.9)
  playtimeHours?: number;

  @IsIn(PLAYTHROUGH_STATUSES)
  status!: PlaythroughStatusValue;

  @IsOptional()
  @IsString()
  @MaxLength(10000)
  notes?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  difficulty?: string | null;

  @IsOptional()
  @IsInt()
  @Min(0)
  achievementsCompleted?: number | null;
}

