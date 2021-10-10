import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Story } from './story.entity';
import { Paginated } from '../types';

@Injectable()
export class StoryService {
  constructor(@InjectRepository(Story) private story: Repository<Story>) {}

  async create(story: any): Promise<any> {
    const saved: any = await this.story.save(this.story.create(story));

    return this.findById(saved.id);
  }

  async update(id: string, data: any): Promise<any> {
    await this.story.update({ id }, data);
    return this.findById(id);
  }

  async find(filter: any = {}): Promise<Paginated<Story>> {
    const [rows, count] = await this.story.findAndCount({
      where: filter,
      take: 10,
      order: { createdAt: 'DESC' },
      relations: ['category', 'author', 'workspace'],
    });

    return {
      rows,
      count,
      page: 1,
      limit: 10,
    };
  }

  async findOne(filter: any, workspaceId: string): Promise<Story> {
    return this.story.findOne(filter);
  }

  async findById(id: string): Promise<Story> {
    return this.story.findOne({
      where: {   id   },
      relations: ['category', 'author']
    });
  }

  async delete(id: string): Promise<any> {
    return this.story.delete(id);
  }
}
