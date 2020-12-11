import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import request from '../utils/request';

@Injectable()
export class PixabayService {
  private url: any = {
    single: '/',
    list: '/',
    search: '/'
  }

  constructor(private config: ConfigService){}

  private _query(keyword: string, per_page: number = 15, page: number = 1): string {
    const params: any = {
      key: this.config.get('PIXABAY_ACCESS_KEY'),
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
      params.q = keyword;
    }

    return Object.keys(params).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(params[key])).join('&');
  }

  private async _fetch(url: string, method: string, params: any = {}): Promise<any> {
    return request(url, method);
  }

  async photos(keyword: string = null, page: number = 1, limit: number = 15) {
    const endpoint: string = keyword ? this.url.search : this.url.list;
    const _query: string = this._query(keyword, limit, page);
    const url: string = _query ? `${this.config.get('PIXABAY_API_URL')}${endpoint}?${_query}` : `${this.config.get('PIXABAY_API_URL')}${endpoint}`;

    const response: any = await this._fetch(url, 'get');

    if(!response || (response && response.hits.length === 0)) {
      return null;
    }

    const rows: any = response.hits.map((photo: any) => {
      return {
        id: photo.id,
        width: photo.imageWidth,
        height: photo.imageHeight,
        caption: photo.tags,
        link: photo.pageURL,
        url: photo.imageURL,
        thumb: photo.webformatURL,
        color: photo.color
      }
    });

    return {
      rows,
      count: response.total
    }
  }
}