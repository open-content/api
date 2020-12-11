import {
  Entity,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn
} from 'typeorm';

enum Type {
  business = 'business',
  individual = 'individual'
}

@Entity()
export class Workspace {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: Type,
    default: Type.individual
  })
  type: string;

  @Unique(['slug'])
  @Column()
  slug: string;

  @Column({
    nullable: true
  })
  avatar: string; 

  @Column({
    nullable: true
  })
  company: string; 

  @Column({
    nullable: true
  })
  website: string;

  @Column({
    type: Boolean,
    default: false,
  })
  status: boolean;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
