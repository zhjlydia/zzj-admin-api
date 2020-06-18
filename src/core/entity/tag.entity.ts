import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ArticleEntity } from './article.entity';

@Entity('tag')
export class TagEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToMany(
    type => ArticleEntity,
    article => article.tags
  )
  articles: ArticleEntity;
}
