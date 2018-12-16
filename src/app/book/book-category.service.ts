import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BookCategoryObj } from '../models/book';
import { Observable } from 'rxjs';
import { API_BASE_HREF } from '../consts';

const URL_GET_ALL = API_BASE_HREF + '/ptk/book/category';

@Injectable()
export class BookCategoryService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<BookCategoryObj[]> {
    return this.http.get<BookCategoryObj[]>(URL_GET_ALL);
  }
}
