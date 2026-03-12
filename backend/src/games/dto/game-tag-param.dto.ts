import { Transform } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

const INVALID_ID_MESSAGE = 'The "id" route parameter must be a positive integer.';
const INVALID_TAG_ID_MESSAGE = 'The "tagId" route parameter must be a positive integer.';

export class GameTagParamDto {
  @Transform(({ value }) => Number(value))
  @IsInt({ message: INVALID_ID_MESSAGE })
  @Min(1, { message: INVALID_ID_MESSAGE })
  id!: number;

  @Transform(({ value }) => Number(value))
  @IsInt({ message: INVALID_TAG_ID_MESSAGE })
  @Min(1, { message: INVALID_TAG_ID_MESSAGE })
  tagId!: number;
}

