import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_HREF } from '../consts';

const URL_LOCALE_GET_ALL = BASE_HREF + '/ptk/locale';

@Injectable()
export class LocaleService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<string[]> {
    return this.http.get<string[]>(URL_LOCALE_GET_ALL);
  }
}
