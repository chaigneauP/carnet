import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { bigintToNumberTransformer, numericToNumberTransformer } from '../transformers/column.transformers';
import { GameTagEntity } from './game-tag.entity';
import { PlaythroughEntity } from './playthrough.entity';
import { RatingEntity } from './rating.entity';

export type GameStatus = 'backlog' | 'playing' | 'completed' | 'dropped';

@Entity({ name: 'games' })
export class GameEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @Column({ type: 'text' })
  title!: string;

  @Column({ type: 'text', nullable: true })
  developer!: string | null;

  @Column({ name: 'release_year', type: 'integer', nullable: true })
  releaseYear!: number | null;

  @Column({ type: 'text', nullable: true })
  genre!: string | null;

  @Column({ name: 'cover_url', type: 'text', nullable: true })
  coverUrl!: string | null;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'text', default: 'backlog' })
  status!: GameStatus;

  @Column({
    name: 'playtime_total',
    type: 'numeric',
    precision: 6,
    scale: 1,
    default: 0,
    transformer: numericToNumberTransformer,
  })
  playtimeTotal!: number;

  @Column({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @Column({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  @OneToOne(() => RatingEntity, (rating) => rating.game)
  rating!: RatingEntity | null;

  @OneToMany(() => PlaythroughEntity, (playthrough) => playthrough.game)
  playthroughs!: PlaythroughEntity[];

  @OneToMany(() => GameTagEntity, (gameTag) => gameTag.game)
  gameTags!: GameTagEntity[];
}
