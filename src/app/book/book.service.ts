import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_HREF } from '../consts';

const URL_BOOK_SAVE = API_BASE_HREF + '/ptk/book';

@Injectable()
export class BookService {

    constructor (private http: HttpClient) {
    }

    save(bookData: any) {
        return this.http.post(URL_BOOK_SAVE, bookData);
    }
}
