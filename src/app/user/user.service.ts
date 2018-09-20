import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_HREF } from '../consts';
import { PtkResponse } from '../models/ptk-response';

const URL_USER_GET_PREREGISTRATION_INFO = API_BASE_HREF + '/ptk/newUser/';
const URL_USER_POST_REGISTERATION_INFO = API_BASE_HREF + '/ptk/user';
const URL_USER_POST_PREREGISTRATION = API_BASE_HREF + '/ptk/newUser';
const URL_USER_GET_INFO = API_BASE_HREF + '/ptk/user?';
const URL_USER_UPDATE_PASSWORD = API_BASE_HREF + '/ptk/user/password';
const URL_USER_UPDATE_QUESTION = API_BASE_HREF + '/ptk/user/question';

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
    return this.http.get<any>(URL_USER_GET_INFO + 'email=' + email);
  }

  updatePassword(data: any) {
    return this.http.put<any>(URL_USER_UPDATE_PASSWORD, data);
  }

  updateQuestion(data: any) {
    return this.http.put<any>(URL_USER_UPDATE_QUESTION, data);
  }
}
