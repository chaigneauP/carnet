import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { bigintToNumberTransformer, numericToNumberTransformer } from '../transformers/column.transformers';
import { GameEntity } from './game.entity';

@Entity({ name: 'ratings' })
export class RatingEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @Column({ name: 'game_id', type: 'bigint', unique: true, transformer: bigintToNumberTransformer })
  gameId!: number;

  @Column({ type: 'numeric', precision: 3, scale: 1, nullable: true, transformer: numericToNumberTransformer })
  gameplay!: number | null;

  @Column({
    name: 'level_design',
    type: 'numeric',
    precision: 3,
    scale: 1,
    nullable: true,
    transformer: numericToNumberTransformer,
  })
  levelDesign!: number | null;

  @Column({ type: 'numeric', precision: 3, scale: 1, nullable: true, transformer: numericToNumberTransformer })
  story!: number | null;

  @Column({ type: 'numeric', precision: 3, scale: 1, nullable: true, transformer: numericToNumberTransformer })
  atmosphere!: number | null;

  @Column({ type: 'numeric', precision: 3, scale: 1, nullable: true, transformer: numericToNumberTransformer })
  replayability!: number | null;

  @Column({
    name: 'overall_score',
    type: 'numeric',
    precision: 3,
    scale: 1,
    nullable: true,
    transformer: numericToNumberTransformer,
  })
  overallScore!: number | null;

  @Column({ type: 'text', nullable: true })
  notes!: string | null;

  @Column({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @Column({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  @OneToOne(() => GameEntity, (game) => game.rating, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'game_id' })
  game!: GameEntity;
}
