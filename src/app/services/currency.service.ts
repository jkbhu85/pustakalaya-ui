import { Injectable } from '@angular/core';
import { BASE_HREF } from '../consts';
import { Observable } from 'rxjs';
import { Currency } from '../models/other';
import { HttpClient } from '@angular/common/http';

const URL_GET_ALL = BASE_HREF + '/ptk/currency';
const URL_GET_BY_ID = BASE_HREF + 'ptk/currency/';

@Injectable()
export class CurrencyService {

    constructor(private http: HttpClient) {}

    getAll(): Observable<Currency[]> {
        return this.http.get<Currency[]>(URL_GET_ALL);
    }

    find(id: number | string): Observable<Currency> {
        return this.http.get<Currency>(URL_GET_BY_ID + id);
    }
}
