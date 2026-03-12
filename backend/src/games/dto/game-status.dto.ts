export const GAME_STATUSES = ['backlog', 'playing', 'completed', 'dropped'] as const;

export type GameStatusDtoValue = (typeof GAME_STATUSES)[number];

