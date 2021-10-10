import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';
import GoogleStorage from 'multer-google-storage';

import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { Media } from './media.entity';
import { uuid } from '../utils/helpers';
import { extname } from 'path';
import { UnsplashService } from './unsplash.service';
import { PixabayService } from './pixabay.service';
import { PexelsService } from './pexels.service';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        
        const factory: any = {
          fileFilter: (req: any, file: any, callback: any) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
              return callback(new Error('Only images are allowed'), false);
            }
            callback(null, true);
          },
        }

        const type: string = config.get('STORAGE_TYPE') || 'DISC';

        console.log(type);

        if(type.toLowerCase() === 'google') {

          factory.storage = new GoogleStorage({
            projectId: config.get('GOOGLE_PROJECT_ID'),
            keyFilename: config.get('GOOGLE_KEY_PATH'),
            bucket: config.get('GOOGLE_BUCKET'),
            contentType: (req: any, file: any) => {
              return file.mimetype;
            },
            filename: (req: any, file: any, callback: any) => {              
              const name: string = uuid(),
                ext: string = extname(file.originalname);
              callback(null, `${req.user['workspace']['id']}/${name}${ext}`);
            },
          });
        } else {
          factory.dest = config.get('UPLOADS_PATH');
          factory.storage = diskStorage({
            destination: config.get('UPLOADS_PATH'),
            filename: (req: any, file: any, callback: any) => {
              const name: string = uuid(),
                ext: string = extname(file.originalname);
              callback(null, `${req.user['workspace']['id']}/${name}${ext}`);
            },
          })
        }

        return factory;
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Media]),
    ConfigModule,
  ],
  providers: [MediaService, UnsplashService, PixabayService, PexelsService],
  controllers: [MediaController],
})
export class MediaModule {}
