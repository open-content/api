import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import request from '../utils/request';

@Injectable()
export class UnsplashService {
  private url: any = {
    single: '/photos',
    list: '/photos',
    search: '/search/photos'
  }

  constructor(private config: ConfigService){}

  private _query(keyword: string, per_page: number = 15, page: number = 1): string {
    const params: any = {
      per_page,
      page
    }

    if(!per_page) {
      params.per_page = 15
    }

    if(!page) {
      params.page = 1;
    }

    if(keyword) {
      params.query = keyword;
    }

    return Object.keys(params).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(params[key])).join('&');
  }

  private async _fetch(url: string, method: string, params: any = {}): Promise<any> {
    const headers: any = {
      Authorization: `Client-ID ${this.config.get('UNSPLASH_ACCESS_KEY')}`
    }

    return request(url, method, {
      ...params,
      headers: {
        ...params.headers,
        ...headers
      }
    });
  }

  async photos(keyword: string = null, page: number = 1, limit: number = 15) {
    console.log(keyword);
    const endpoint: string = keyword ? this.url.search : this.url.list;
    const _query: string = this._query(keyword, limit, page);
    const url: string = _query ? `${this.config.get('UNSPLASH_API_URL')}${endpoint}?${_query}` : `${this.config.get('UNSPLASH_API_URL')}${endpoint}`;

    const response: any = await this._fetch(url, 'get');

    if(keyword && (!response || (response && response.results.length === 0))) {
      return {
        rows: [],
        count: null
      }
    }

    if(!keyword && (!response || (response && response.length === 0))) {
      return {
        rows: [],
        count: null
      }
    }

    const _data: any = keyword ? response.results : response;

    const rows: any = _data.map((photo: any) => {
      return {
        id: photo.id,
        width: photo.width,
        height: photo.height,
        caption: photo.alt_description,
        link: photo.links.html,
        url: photo.urls.full,
        thumb: photo.urls.thumb,
        color: photo.color
      }
    });

    return {
      rows,
      count: keyword ? response.total : null
    }
  }
}