import { use } from 'passport';
import {
  Entity,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  AfterLoad,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';

import { Category } from '../category/category.entity';
import { User } from '../user/user.entity';

type PostContentBlockData<T extends object = any> = T;

interface PostContentBlock {
  type: string;
  data: PostContentBlockData;
}

@Entity()
export class Story {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  banner: string;

  @Column()
  title: string;

  @Unique(['slug'])
  @Column()
  slug: string;

  @Column()
  description: string;

  @Column({
    type: "json",
  })
  content: any;

  @Column({
    type: 'json'
  })
  tags: string[];

  @ManyToOne(() => Category, (category: Category) => category.id)
  category: Category;

  @ManyToOne(() => User, (user: User) => user.id)
  author: User;

  @Column({
    type: Boolean,
    default: false,
  })
  status: boolean;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @BeforeInsert()
  @BeforeUpdate()
  async beforeInsert() {
    
  }

  @AfterLoad()
  async afterLoad() {
    
  }
}
