export class PlaythroughDto {
  id!: number;
  gameId!: number;
  platform!: string;
  startDate!: string | null;
  endDate!: string | null;
  playtimeHours!: number;
  status!: 'Completed' | 'In Progress' | 'Dropped';
  notes!: string | null;
  difficulty!: string | null;
  achievementsCompleted!: number | null;
  createdAt!: string;
  updatedAt!: string;
}

export class PlaythroughResponseDto {
  data!: PlaythroughDto;
}

export class PlaythroughsListResponseDto {
  data!: PlaythroughDto[];
}

