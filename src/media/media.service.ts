import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { createReadStream, createWriteStream } from 'fs';
import { join } from 'path';
import { unlink } from 'fs';
import { In, Repository } from 'typeorm';
import * as probe from 'probe-image-size';
import * as Storage from '@google-cloud/storage';
import { extname } from 'path';
import { get } from 'request';

import { Paginated } from '../types';
import { Media } from './media.entity';

import { UnsplashService } from './unsplash.service';
import { PexelsService } from './pexels.service';
import { PixabayService } from './pixabay.service';
import { uuid } from '../utils/helpers';
import request from '../utils/request';

@Injectable()
export class MediaService {
  private storage: Storage = new Storage({
    projectId: this.config.get('GOOGLE_PROJECT_ID'),
    keyFilename: this.config.get('GOOGLE_KEY_PATH'),
  });

  constructor(
    @InjectRepository(Media) private media: Repository<Media>,
    private config: ConfigService,
    private unsplash: UnsplashService,
    private pexels: PexelsService,
    private pixabay: PixabayService,
  ) {}

  async tags(url: string) {
    return [];
    
    const { result = {} }: any = await request(
      `https://api.imagga.com/v2/tags?image_url=${encodeURIComponent(url)}`,
      'GET',
      {
        headers: {
          Authorization:
            'Basic YWNjXzYzMTE1ZDUxOWMxODMxMzo2YjFkZjgyZDI2ODFjNzhmZjJkNmVhZjA5OTI0ZGE1Zg==',
        },
      },
    );

    return (result.tags || [])
      .filter((t: any) => t.confidence > 20)
      .map((t: any) => {
        return t.tag.en;
      });
  }

  async create(files: any, user: any) {
    const media: any = [];
    const type: string =
      this.config.get('STORAGE_TYPE').toLowerCase() || 'disc';
    const fileUrl: string = this.config.get('URL') || 'http://localhost:4000/';

    for (let i = 0; i < files.length; i++) {
      const file: any = files[i],
        info: any =
          type === 'disc'
            ? await probe(createReadStream(file.path))
            : await probe(`${this.config.get('GOOGLE_URL')}/${file.filename}`);

      const tags: Array<string> = await this.tags(
        `${fileUrl}/${file.filename}`,
      );

      media.push({
        name: file.filename.split('/')[1],
        type: info.mime,
        size: info.length ? Math.floor(info.length / 1000) : null,
        width: info.width,
        height: info.height,
        uploadedBy: user.id,
        tags,
        workspace: user.workspace.id,
      });
    }

    const inserted: any = await this.media.insert(media);

    return this.media.findOne({
      where: {
        id: In(inserted.generatedMaps.map((img: any) => img.id)),
      },
      relations: ['uploadedBy', 'workspace'],
    });
  }

  async copy(files: Array<any>, user: any) {
    const tostorage: Array<Promise<any>> = [],
      type: string = this.config.get('STORAGE_TYPE').toLowerCase() || 'disc',
      uploadPath: string = this.config.get('UPLOADS_PATH'),
      media: Array<any> = [],
      bucket: Storage.Bucket =
        type === 'google'
          ? this.storage.bucket(this.config.get('GOOGLE_BUCKET'))
          : null;

    files.forEach((file: any) => {
      tostorage.push(
        new Promise(
          async (
            resolve: (value: any) => void,
            reject: (error: any) => void,
          ) => {
            const ext: string = extname(file.url),
              id: string = uuid(),
              _file = bucket
                ? bucket.file(`${user.workspace.id}/${id}${ext}`)
                : null,
              info = await probe(file.url);
            get(file.url)
              .pipe(
                _file
                  ? _file.createWriteStream({
                      public: true,
                      contentType: info.mime,
                    })
                  : createWriteStream(
                      `${uploadPath}/${user.workspace.id}/${id}${ext}`,
                    ),
              )
              .on('error', (error: any) => {
                reject(error);
              })
              .on('finish', () => {
                media.push({
                  tags: file.caption
                    .split(',')
                    .map((tag: string) => tag.trim()),
                  width: info.width,
                  height: info.height,
                  name: `${id}${ext}`,
                  type: info.mime,
                  size: info.length ? Math.floor(info.length / 1000) : null,
                  uploadedBy: user.id,
                  workspace: user.workspace.id,
                });
                resolve({});
              });
          },
        ),
      );
    });

    await Promise.all(tostorage);
    const result = await this.media.insert(media);

    const inserted: Array<any> = await this.media.find({
      where: {
        id: In(result.generatedMaps.map((img: any) => img.id)),
      },
      relations: ['uploadedBy', 'workspace'],
    });

    return {
      status: true,
      inserted,
    };
  }

  async find(filter: any = {}): Promise<Paginated<Media>> {
    const [rows, count] = await this.media.findAndCount({
      where: filter,
      relations: ['uploadedBy', 'workspace'],
      order: { createdAt: 'DESC' },
    });

    return {
      rows,
      count,
      page: 1,
      limit: 10,
    };
  }

  async file(workspaceId: string, name: string) {
    const media: any = await this.media.findOne({
      where: {
        name,
        workspaceId,
      },
    });

    return {
      ...media,
      path: `${this.config.get('UPLOADS_PATH')}/${media.workspaceId}/${
        media.name
      }`,
    };
  }

  async search(keyword: any, page: any) {
    return this.pixabay.photos(keyword, page);

    // switch (provider) {
    //   case 'unsplash':
    //     return this.unsplash.photos(filter.keyword, filter.page);

    //   case 'pexels':
    //     return this.pexels.photos(filter.keyword, filter.page);

    //   case 'pixabay':
    //     return this.pixabay.photos(filter.keyword, filter.page);
    // }
  }

  async findById(id: string): Promise<Media> {
    return this.media.findOne(
      { id },
      {
        relations: ['uploadedBy'],
      },
    );
  }

  async delete(id: string, user: any): Promise<any> {
    const media: any = await this.media.findOne({ id }),
      type: string = this.config.get('STORAGE_TYPE').toLowerCase() || 'disc';

    if (type === 'google') {
      const bucket = this.storage.bucket(this.config.get('GOOGLE_BUCKET'));
      await bucket.file(`${user.workspace.id}/${media.name}`).delete();
    } else {
      unlink(
        join(this.config.get('UPLOADS_PATH'), user.workspace.id, media.name),
        () => null,
      );
    }

    await this.media.delete({ id });

    return {
      status: 'success',
      id,
      name: media.name,
      message: 'Media deleted successfully.',
    };
  }
}
