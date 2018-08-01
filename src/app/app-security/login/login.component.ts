import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { BASE_HREF } from '../../consts';
import { Observable ,  Subscription } from 'rxjs';
import { AppTranslateService } from '../../services/app-translate.service';
import { AuthService } from '../auth.service';
import { PtkResponse, ResponseCode } from '../../models/ptk-response';

const LOGIN_URL = BASE_HREF + '/ptk/login';
const KEY_ACCESS_REVOKED = 'login.vld.accessRevoked';
const KEY_INVALID_CREDENTIALS = 'login.vld.invalidCredentials';
const KEY_ACCOUNT_LOCKED = 'login.vld.accountLocked';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  submitted = false;
  showError = false;
  errorText$: Observable<any>;
  private formValueChangeSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private translate: AppTranslateService,
    private authService: AuthService
  ) {
    this.createForm();
  }

  createForm(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required,Validators.email]],
      password: ['', Validators.required]
    });
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  ngOnInit() {
  }

  prepareData() {
    let l: any = {};

    l.username = this.username.value;
    l.password = this.password.value;

    return l;
  }

  private setFormSubmitStatus(status: boolean) {
    this.submitted = status;
  }

  onSubmit() {
    if (this.submitted) return;

    if (this.loginForm.invalid) return;

    this.setFormSubmitStatus(true);

    const data = this.prepareData();

    this.http
      .post(LOGIN_URL, data, {observe: 'response', responseType: 'text'})
      .subscribe(
        (response: HttpResponse<string>) => this.handleResponse(response),
        (response: HttpResponse<string>) => this.handleResponse(response),
        () => this.handleComplete()
      );
  }

  private handleComplete() {
    this.setFormSubmitStatus(false);
  }

  private handleResponse(response: HttpResponse<string>) {
    this.submitted = false;
    const res:PtkResponse = JSON.parse(response instanceof HttpErrorResponse ? response.error : response.body);
    
    switch (response.status) {
      case 200:
        // login successful
        let jwt = res.data;
        console.log('login successful');
        this.authService.login(jwt);
        break;
      case 422:
        // invalid credentials or account locked or account revoked
        let s = res.responseCode;

        switch (s) {
          case ResponseCode.ACCOUNT_LOCKED:
            this.showLoginError(KEY_ACCOUNT_LOCKED);
            break;
          case ResponseCode.ACCOUNT_ACCESS_REVOKED:
            this.showLoginError(KEY_ACCESS_REVOKED);
            break;
          default:
            this.showLoginError(KEY_INVALID_CREDENTIALS);
        }

        break;
      default:
        // some error occurred
        this.showLoginError('common.errorOccurred');
    }
  }

  private showLoginError(msgKey: string) {
    this.showError = true;
    this.errorText$ = this.translate.get(msgKey);
    this.formValueChangeSubscription = this.loginForm.valueChanges.subscribe(() => this.hideLoginError())
  }

  private hideLoginError() {
    this.showError = false;
    this.errorText$ = undefined;
    this.formValueChangeSubscription.unsubscribe();
  }

}
