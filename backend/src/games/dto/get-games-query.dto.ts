import { Transform } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

const INVALID_LIMIT_MESSAGE = 'The "limit" query parameter must be a positive integer.';

export class GetGamesQueryDto {
  @Transform(({ value }) => (value === undefined ? undefined : Number(value)))
  @IsOptional()
  @IsInt({ message: INVALID_LIMIT_MESSAGE })
  @Min(1, { message: INVALID_LIMIT_MESSAGE })
  limit?: number;
}

