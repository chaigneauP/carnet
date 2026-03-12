import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { bigintToNumberTransformer } from '../transformers/column.transformers';
import { GameEntity } from './game.entity';
import { TagEntity } from './tag.entity';

@Entity({ name: 'game_tags' })
export class GameTagEntity {
  @PrimaryColumn({ name: 'game_id', type: 'bigint', transformer: bigintToNumberTransformer })
  gameId!: number;

  @PrimaryColumn({ name: 'tag_id', type: 'bigint', transformer: bigintToNumberTransformer })
  tagId!: number;

  @ManyToOne(() => GameEntity, (game) => game.gameTags, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'game_id' })
  game!: GameEntity;

  @ManyToOne(() => TagEntity, (tag) => tag.gameTags, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tag_id' })
  tag!: TagEntity;
}

