import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';

import { GlobalModule } from './global.module';
import { ExceptionFilter } from './exception.filter';

import { Workspace } from './workspace/workspace.entity';
import { Media } from './media/media.entity';
import { Category } from './category/category.entity';
import { User } from './user/user.entity';
import { Story } from './story/story.entity';

import { CategoryModule } from './category/category.module';
import { StoryModule } from './story/story.module';
import { MediaModule } from './media/media.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { resolve } from 'path';
import { SettingModule } from './setting/setting.module';
import { Setting } from './setting/setting.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV !== 'production'
          ? resolve(__dirname, '../.env')
          : resolve(__dirname, '../prod.env'),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => {
        return {
          type: 'postgres',
          host: config.get('DB_HOST'),
          port: config.get('DB_PORT') || 5432,
          username: config.get('DB_USER'),
          password: config.get('DB_PASSWORD'),
          database: config.get('DB_NAME') || 'ocms',
          synchronize: true,
          logging: true,
          entities: [Media, User, Category, Story, Workspace, Setting],
        };
      },
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: resolve(__dirname, '../uploads'),
    }),
    GlobalModule,
    UserModule,
    AuthModule,
    CategoryModule,
    StoryModule,
    MediaModule,
    SettingModule,
  ],
  providers: [
    ConfigService,
    {
      provide: APP_FILTER,
      useClass: ExceptionFilter,
    },
  ],
})
export class AppModule {}
