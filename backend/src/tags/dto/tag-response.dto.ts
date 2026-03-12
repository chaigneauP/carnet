export class TagDto {
  id!: number;
  name!: string;
}

export class TagsListResponseDto {
  data!: TagDto[];
}

export class TagResponseDto {
  data!: TagDto;
}

