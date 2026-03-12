import { Transform } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class AddGameTagDto {
  @Transform(({ value }) => Number(value))
  @IsInt({ message: 'The "tagId" field must be a positive integer.' })
  @Min(1, { message: 'The "tagId" field must be a positive integer.' })
  tagId!: number;
}

