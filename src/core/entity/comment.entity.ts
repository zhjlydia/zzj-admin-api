import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ArticleEntity } from './article.entity';
import { UserEntity } from './user.entity';

@Entity('comment')
export class CommentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  content: string;

  @Column()
  parentId: number;

  @ManyToOne(
    type => ArticleEntity,
    article => article.comments
  )
  article: ArticleEntity;

  @ManyToOne(
    type => UserEntity,
    user => user.comments
  )
  user: UserEntity;
}
