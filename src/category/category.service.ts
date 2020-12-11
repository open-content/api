import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { Category } from './category.entity';
import { Paginated } from '..//types';

@Injectable()
export class CategoryService {

  private _userFields: Array<string> = ['firstName', 'lastName', 'avatar'];

  constructor(@InjectRepository(Category) private category: Repository<Category>){}

  async create(category: any): Promise<any> {
    const saved: any = await this.category.save(this.category.create(category));

    return this.findById(saved.id);
  }

  async update(id: string, data: any): Promise<any> {
    await this.category.update({ id }, data);
    return this.findById(id);
  }

  async find(filter: any = {}): Promise<Paginated<Category>> {
    const [rows, count] = await this.category.findAndCount({
      where: filter,
      relations: ['createdBy'],
      order: { createdAt: 'DESC' },
    });

    return {
      rows,
      count,
      page: 1,
      limit: 10
    }
  }

  async findOne(filter: any): Promise<Category> {
    return this.category.findOne(filter, {
      relations: ['createdBy']
    })
  }

  async findById(id: string): Promise<Category> {
    return this.category.findOne({ id }, {
      relations: ['createdBy']
    });
  }

  async delete(id: string): Promise<any> {
    return this.category.delete({id});
  }
}
