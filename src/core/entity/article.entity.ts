import {
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
import { ClassificationEntity } from './classification.entity';
import { CommentEntity } from './comment.entity';
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
  created: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP'
  })
  updated: Date;

  @BeforeUpdate()
  updateTimestamp() {
    this.updated = new Date();
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

  @OneToMany(
    type => CommentEntity,
    comment => comment.article,
    { eager: true }
  )
  @JoinColumn()
  comments: CommentEntity[];
  @Column({ default: 0 })
  favoriteCount: number;
}
