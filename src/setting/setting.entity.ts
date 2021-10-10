import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Workspace } from '../workspace/workspace.entity';

interface AccessSetting {
  model: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT';
}

@Entity()
export class Setting {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'json',
    nullable: true,
  })
  keys: string[];

  @Column({
    type: 'json',
    nullable: true,
  })
  domains: string[];

  @Column({
    type: 'json',
    nullable: true,
  })
  access: Array<AccessSetting>;

  @ManyToOne(() => Workspace, (workpsace: Workspace) => workpsace.id)
  workpsace: Workspace;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
