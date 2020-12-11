import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';
import { Paginated } from '../types';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private user: Repository<User>) {}

  async create(user: any): Promise<any> {
    const count: number = await this.user.count();

    if (count === 0) {
      user.role = 'admin';
      user.status = true;
    } else {
      user.role = 'user';
      user.status = false
    }

    return this.user.save(this.user.create(user));
  }

  async update(id: string, data: any): Promise<any> {
    await this.user.update({ id }, data);
    return this.findById(id);
  }


  async find(filter: any = {}): Promise<Paginated<User>> {
    const [rows, count] = await this.user.findAndCount({
      where: filter,
      take: 10,
      order: { createdAt: 'DESC' },
    });

    return {
      rows,
      count,
      page: 1,
      limit: 10,
    };
  }

  async findOne(filter: any): Promise<User> {
    return this.user.findOne(filter);
  }

  async findById(id: string): Promise<User> {
    return this.user.findOne({ id });
  }

  async delete(id: string): Promise<any> {
    return this.user.delete({ id });
  }
}