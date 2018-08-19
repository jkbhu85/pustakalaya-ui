import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_HREF } from '../consts';
import { Observable } from '../../../node_modules/rxjs';
import { PtkResponse } from '../models/ptk-response';

const URL_GET_REGISTRATION_INFO = BASE_HREF + '/ptk/newUser/';
const URL_POST_REGISTER_USER = BASE_HREF + '/ptk/user';

@Injectable()
export class UserService {

  constructor(
    private http: HttpClient
  ) { }

  getRegistrationInfo(id: string): Observable<PtkResponse> {
    return this.http.get<PtkResponse>(URL_GET_REGISTRATION_INFO + id);
  }

  submitUserData(data: any) {
    console.log(data);
    return this.http.post<PtkResponse>(URL_POST_REGISTER_USER, data);
  }
}
