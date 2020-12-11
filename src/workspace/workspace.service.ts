import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { Workspace } from './workspace.entity';
import { Paginated } from '../types';

@Injectable()
export class WorkspaceService {

  private _userFields: Array<string> = ['firstName', 'lastName', 'avatar'];

  constructor(@InjectRepository(Workspace) private workspace: Repository<Workspace>){}

  async create(workspace: any): Promise<any> {
    const saved: any = await this.workspace.save(this.workspace.create(workspace));

    return this.findById(saved.id);
  }

  async update(id: string, data: any): Promise<any> {
    await this.workspace.update({ id }, data);
    return this.findById(id);
  }

  async find(filter: any = {}): Promise<Paginated<Workspace>> {
    const [rows, count] = await this.workspace.findAndCount({
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

  async findOne(filter: any): Promise<Workspace> {
    return this.workspace.findOne(filter)
  }

  async findById(id: string): Promise<Workspace> {
    return this.workspace.findOne({ id });
  }

  async delete(id: string): Promise<any> {
    return this.workspace.delete({id});
  }
}
