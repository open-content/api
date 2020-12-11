import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique
} from 'typeorm';

import { User } from '../user/user.entity';
import { Workspace } from '../workspace/workspace.entity';

enum MediaType {
  image = 'image',
  video = 'video',
  gif = 'gif'
}

@Entity()
export class Media {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    enum: MediaType,
    default: MediaType.image
  })
  type: string;

  @Unique(['name', 'workspaceId'])
  @Column()
  name: string;

  @Column()
  width: number;

  @Column()
  height: number;

  @Column({
    nullable: true
  })
  caption: string;

  @Column({
    nullable: true
  })
  size: number;

  @Column({
    nullable: true
  })
  color: string;

  @Column({
    nullable: true,
    type: 'json'
  })
  tags: string[];

  @ManyToOne(() => User, (user: User) => user.id)
  uploadedBy: User;

  @ManyToOne(() => Workspace, (workspace: Workspace) => workspace.id)
  workspace: Workspace;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
