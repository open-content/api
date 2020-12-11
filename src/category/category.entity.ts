import {
  Entity,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  AfterLoad,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';

import { User } from '../user/user.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Unique(['slug'])
  @Column()
  slug: string;

  @Column()
  description: string;

  @Column({
    type: Boolean,
    default: false,
  })
  status: boolean;

  @ManyToOne(() => User, (user: User) => user.id)
  createdBy: User;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @AfterLoad()
  async afterLoad (){
    
  }
}
