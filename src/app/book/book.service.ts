import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_HREF } from '../consts';
import { BookInstance } from '../models/book';

const URL_BOOK_SAVE = API_BASE_HREF + '/ptk/book';
const URL_FIND_BOOK = API_BASE_HREF + '/ptk/book/instance';
const URL_ASSIGN_BOOK = API_BASE_HREF + '/ptk/book/instance/assign';

@Injectable()
export class BookService {

    constructor (private http: HttpClient) {
    }

    save(bookData: any) {
        return this.http.post(URL_BOOK_SAVE, bookData);
    }

    find(booKId: string): Observable<BookInstance> {
        return this.http.get<BookInstance>(encodeURI(URL_FIND_BOOK + '/' + booKId));
    }

    assginBook(data: {bookInstanceId: string, username: string}) {
        return this.http.post(URL_ASSIGN_BOOK, data);
    }
}
