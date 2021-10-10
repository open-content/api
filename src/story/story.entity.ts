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
import { Workspace } from '../workspace/workspace.entity';

type PostContentBlockData<T extends object = any> = T;

interface PostContentBlock {
  type: string;
  data: PostContentBlockData;
}

interface ExtraInfo {
  [label: string]: any
}

@Entity()
export class Story {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: true
  })
  banner: string;

  @Column({
    nullable: true
  })
  title: string;

  @Column({
    nullable: true
  })
  description: string;

  @Column({
    type: "json",
    nullable: true
  })
  content: any;

  @Column({
    type: 'json',
    nullable: true
  })
  tags: string[];

  @Column({
    type: 'json',
    nullable: true
  })
  extra: ExtraInfo

  @ManyToOne(() => Category, (category: Category) => category.id)
  category: Category;

  @ManyToOne(() => User, (user: User) => user.id)
  author: User;

  @ManyToOne(() => Workspace, (workspace: Workspace) => workspace.id)
  workspace: Workspace;

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
