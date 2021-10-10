import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from './setting.entity';

@Injectable()
export class SettingService {
  constructor(
    @InjectRepository(Setting) private setting: Repository<Setting>,
  ) {}

  async create(setting: any, user: any) {
    const existing = await this.setting.findOne({
      workpsace: user.worspace.id,
    });

    console.log(existing);

    if (existing) {
      return this.update(existing.id, setting);
    }

    const saved: any = await this.setting.save(
      this.setting.create({
        ...setting,
        workspace: user.workspace.id,
      }),
    );

    return this.findById(saved.id);
  }

  async update(id: string, data: any) {
    await this.setting.update({ id }, data);
    return this.findById(id);
  }

  async findById(id: string) {
    return this.setting.findOne(
      { id },
      {
        relations: ['workspace'],
      },
    );
  }
}
