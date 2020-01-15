import { BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

    @Column({default: ''})
    body: string;

    @Column({
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
    })
    created: Date;

    @Column({
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
    })
    updated: Date;

    @BeforeUpdate()
    updateTimestamp() {
      this.updated = new Date();
    }

    @Column('simple-array')
    tagList: string[];

    @Column({default: 0})
    favoriteCount: number;
  }
