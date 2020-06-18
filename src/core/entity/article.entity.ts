import {
  BeforeUpdate,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
import { ClassificationEntity } from './classification.entity';
import { CommentEntity } from './comment.entity';
import { TagEntity } from './tag.entity';
import { UserEntity } from './user.entity';

@Entity('article')
export class ArticleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  slug: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column('text')
  content: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP'
  })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP'
  })
  updatedAt: Date;

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = new Date();
  }

  @ManyToOne(
    type => UserEntity,
    user => user.articles
  )
  author: UserEntity;

  @ManyToOne(
    type => ClassificationEntity,
    classification => classification.articles
  )
  classification: ClassificationEntity;

  @ManyToMany(
    type => TagEntity,
    tag => tag.articles
  )
  @JoinTable({
    name: 'article_tag'
  })
  tags: TagEntity[];

  @OneToMany(
    type => CommentEntity,
    comment => comment.article
  )
  comments: CommentEntity[];

  @Column({ default: 0 })
  favoriteCount: number;
}
