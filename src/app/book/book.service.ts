import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BASE_HREF } from '../consts';

const URL_BOOK_SAVE = BASE_HREF + '/ptk/book';

@Injectable()
export class BookService {

    constructor (private http: HttpClient) {
    }

    save(bookData: any) {
        return this.http.post(URL_BOOK_SAVE, bookData);
    }
}
