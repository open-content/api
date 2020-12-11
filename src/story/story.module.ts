import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StoryService } from './story.service';
import { StoryController } from './story.controller';
import { Story } from './story.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Story])],
  providers: [StoryService],
  controllers: [StoryController],
})
export class StoryModule {}
