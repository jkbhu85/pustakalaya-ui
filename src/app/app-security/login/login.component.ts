import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { API_BASE_HREF, MsgKey } from '../../consts';
import { Observable, Subscription } from 'rxjs';
import { AppTranslateService } from '../../services/app-translate.service';
import { AuthService } from '../auth.service';
import { PtkResponse, ResponseCode } from '../../models/ptk-response';
import { AbstractFormComponent } from '../../util/abstract-form-component';
import { NotificationService } from '../../notifications/notification.service';

const LOGIN_URL = API_BASE_HREF + '/ptk/login';
const KEY_ACCESS_REVOKED = 'login.vld.accessRevoked';
const KEY_INVALID_CREDENTIALS = 'login.vld.credentialsInvld';
const KEY_ACCOUNT_LOCKED = 'login.vld.accountLocked';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent extends AbstractFormComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private notiService: NotificationService,
    private authService: AuthService
  ) {
    super();
  }

  get username() {
    return this.form.get('username');
  }

  get password() {
    return this.form.get('password');
  }

  ngOnInit() {
    this.createForm();
    this.showForm = true;
  }
  
  protected createForm() {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  protected prepareData() {
    let data: any = {};

    data.username = this.username.value;
    data.password = this.password.value;

    return data;
  }

  submit() {
    if (this.form.invalid) return;
    if (this.submitted) return;

    this.changeFormSubmissionStatus(true);
    this.showInFormInfo(MsgKey.SUBMITTING, false);

    const data = this.prepareData();

    this.http
      .post(LOGIN_URL, data)
      .pipe(finalize(() => this.handleComplete()))
      .subscribe(
        (response: PtkResponse) => this.handleSuccess(response),
        (response: HttpErrorResponse) => this.handleFailure(response)
      );
  }

  protected changeFormSubmissionStatus(status: boolean) {
    this.submitted = status;
  }

  protected handleComplete() {
    this.changeFormSubmissionStatus(false);
  }

  protected handleSuccess(ptkRes: PtkResponse) {
    // login successful
    let jwt = ptkRes.data;
    this.authService.login(jwt);
    console.log('login successful');
    this.hideInFormNoti();
  }

  protected handleFailure(errResponse: HttpErrorResponse) {
    console.log(errResponse);

    switch (errResponse.status) {
      case 422:
        const res: PtkResponse = errResponse.error;
        // invalid credentials or account locked or account revoked
        let s = res.responseCode;

        switch (+s) {
          case ResponseCode.ACCOUNT_LOCKED:
            this.showInFormError(KEY_ACCOUNT_LOCKED, true);
            break;
          case ResponseCode.ACCOUNT_ACCESS_REVOKED:
            this.showInFormError(KEY_ACCESS_REVOKED, true);
            break;
          default:
            this.showInFormError(KEY_INVALID_CREDENTIALS, true);
        }
        break;
      default:
        // some error occurred
        this.notiService.danger(MsgKey.ERROR_OCCURRED);
        this.hideInFormNoti();
    }
  }
 
  resetForm(): void {
    this.form.reset();
  }
}
