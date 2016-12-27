import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/Rx';

import { Uri } from './uri';
import { Response, Matrix, Selection, Filter } from '../entities/entity';

@Injectable()
export class EndpointService {

  private baseUrl: string = 'http://192.168.1.105:52192/v1/endpointService';
  private maxRetry: number = 3;

  private options: RequestOptions;

  constructor(private http: Http) {
    let headers = new Headers({
      'Content-Type': 'application/json; charset=utf-8'
    });
    this.options = new RequestOptions({ headers: headers });   
  }

  filter(filter: Filter) {
    let uri = this.toUrl('filter');
    let body = JSON.stringify(filter || {});

    return this.http.post(uri, body, this.options)
      .retry(this.maxRetry)
      .map(r => r.json())
      .map(r => r as Response)
      .map(r => r.code != 200 ? null : r.data);
  } 

  filterBySquare(selection: Selection) {
    let uri = this.toUrl('select');
    let body = JSON.stringify(selection || {});

    return this.http.post(uri, body, this.options)
      .retry(this.maxRetry)
      .map(r => r.json())
      .map(r => r as Response)
      .map(r => r.code != 200 ? null : r.data);    
  }

  pairwise(matrix: Matrix) {
    let uri = this.toUrl('pairwise');
    let body = JSON.stringify(matrix || {});

    return this.http.post(uri, body, this.options)
      .retry(this.maxRetry)
      .map(r => r.json())
      .map(r => r as Response)
      .map(r => r.code != 200 ? null : r.data);
  }

  showcase(count: number) {
    let uri = Uri.create(this.baseUrl)
      .appendPath('showcase')
      .appendEncodedPath(count || 6)
      .toString();

    return this.http.get(uri)
      .retry(this.maxRetry)
      .map(r => r.json())
      .map(r => r as Response)
      .map(r => r.code != 200 ? null : r.data);
  }

  version() {
    let uri = this.toUrl('version');

    return this.http.get(uri)
      .retry(this.maxRetry)
      .map(r => r.json())
      .map(r => r as Response)
      .map(r => r.code != 200 ? null : r.data);
  }

  private toUrl(key: string, value: string | number = null): string {
    if(value) {
      return Uri.create(this.baseUrl)
        .appendEncodedQuery(key, value)
        .toString();
    } else {
      return Uri.create(this.baseUrl)
        .appendEncodedPath(key)
        .toString();
    }
  }
}

