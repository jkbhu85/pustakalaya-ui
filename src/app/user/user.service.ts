import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_HREF } from '../consts';
import { PtkResponse } from '../models/ptk-response';

const URL_USER_GET_PREREGISTRATION_INFO = BASE_HREF + '/ptk/newUser/';
const URL_USER_POST_REGISTERATION_INFO = BASE_HREF + '/ptk/user';
const URL_USER_POST_PREREGISTRATION = BASE_HREF + '/ptk/newUser';
const URL_USER_GET_INFO = BASE_HREF + '/ptk/user?';

@Injectable()
export class UserService {

  constructor(
    private http: HttpClient
  ) { }

  getPreRegistrationInfo(id: string): Observable<PtkResponse> {
    return this.http.get<PtkResponse>(URL_USER_GET_PREREGISTRATION_INFO + id);
  }

  submitPreRegistrationData(data: any) {
    return this.http.post<PtkResponse>(URL_USER_POST_PREREGISTRATION, data);
  }

  submitUserData(data: any) {
    return this.http.post<PtkResponse>(URL_USER_POST_REGISTERATION_INFO, data);
  }

  getUserInfo(email: string) {
    console.log('profile url: ' + URL_USER_GET_INFO + 'email=' + email);
    return this.http.get<any>(URL_USER_GET_INFO + 'email=' + email);
  }

}
