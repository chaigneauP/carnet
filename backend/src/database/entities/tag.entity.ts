import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { GameTagEntity } from './game-tag.entity';

@Entity({ name: 'tags' })
export class TagEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @Column({ type: 'text', unique: true })
  name!: string;

  @OneToMany(() => GameTagEntity, (gameTag) => gameTag.tag)
  gameTags!: GameTagEntity[];
}
