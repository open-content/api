import {
  Entity,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  AfterLoad,
  BeforeUpdate,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { toHash } from '../utils/helpers';
import { Workspace } from '../workspace/workspace.entity';

enum Role {
  admin = 'admin',
  user = 'user'
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Unique(['email', 'workspaceId'])
  @Column()
  email: string;

  @Column({
    nullable: true,
  })
  bio: string;

  @Column({
    nullable: true,
  })
  avatar: string;

  @Column({
    nullable: true,
  })
  location: string;

  @Column({ select: false })
  password: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  status: boolean;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.user,
  })
  role: Role;

  @ManyToOne(() => Workspace, (workspace: Workspace) => workspace.id)
  workspace: Workspace

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @BeforeUpdate()
  @BeforeInsert()
  async beforeInsert() {
    this.email = this.email.toLowerCase();

    if (this.password) {
      this.password = await toHash(this.password);
    }
  }

  @AfterLoad()
  async afterLoad() {}
}
