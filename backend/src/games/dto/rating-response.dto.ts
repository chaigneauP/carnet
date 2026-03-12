export class RatingDto {
  id!: number;
  gameId!: number;
  gameplay!: number | null;
  levelDesign!: number | null;
  story!: number | null;
  atmosphere!: number | null;
  replayability!: number | null;
  overallScore!: number | null;
  notes!: string | null;
  createdAt!: string;
  updatedAt!: string;
}

export class RatingResponseDto {
  data!: RatingDto;
}

