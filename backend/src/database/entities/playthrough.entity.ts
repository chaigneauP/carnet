import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { bigintToNumberTransformer, numericToNumberTransformer } from '../transformers/column.transformers';
import { GameEntity } from './game.entity';

export type PlaythroughStatus = 'Completed' | 'In Progress' | 'Dropped';

@Entity({ name: 'playthroughs' })
export class PlaythroughEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @Column({ name: 'game_id', type: 'bigint', transformer: bigintToNumberTransformer })
  gameId!: number;

  @Column({ type: 'text' })
  platform!: string;

  @Column({ name: 'start_date', type: 'date', nullable: true })
  startDate!: string | null;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate!: string | null;

  @Column({
    name: 'playtime_hours',
    type: 'numeric',
    precision: 6,
    scale: 1,
    default: 0,
    transformer: numericToNumberTransformer,
  })
  playtimeHours!: number;

  @Column({ type: 'text' })
  status!: PlaythroughStatus;

  @Column({ type: 'text', nullable: true })
  notes!: string | null;

  @Column({ type: 'text', nullable: true })
  difficulty!: string | null;

  @Column({ name: 'achievements_completed', type: 'integer', nullable: true })
  achievementsCompleted!: number | null;

  @Column({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @Column({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  @ManyToOne(() => GameEntity, (game) => game.playthroughs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'game_id' })
  game!: GameEntity;
}
