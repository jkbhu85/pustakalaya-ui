import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { BASE_HREF } from '../../consts';
import { Observable, Subscription } from 'rxjs';
import { AppTranslateService } from '../../services/app-translate.service';
import { AuthService } from '../auth.service';
import { PtkResponse, ResponseCode } from '../../models/ptk-response';

const LOGIN_URL = BASE_HREF + '/ptk/login';
const KEY_ACCESS_REVOKED = 'login.vld.accessRevoked';
const KEY_INVALID_CREDENTIALS = 'login.vld.credentialsInvld';
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
      username: ['', [Validators.required, Validators.email]],
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
    this.hideFormError();

    const data = this.prepareData();

    this.http
      .post(LOGIN_URL, data)
      .pipe(finalize(() => this.handleComplete()))
      .subscribe(
        (response: PtkResponse) => this.handleSuccess(response),
        (response: HttpErrorResponse) => this.handleFailure(response),
        () => this.handleComplete()
      );
  }

  private handleComplete() {
    this.setFormSubmitStatus(false);
  }

  private handleSuccess(ptkRes: PtkResponse) {
    // login successful
    let jwt = ptkRes.data;
    console.log('login successful');
    this.authService.login(jwt);
  }

  private handleFailure(errResponse: HttpErrorResponse) {
    switch (errResponse.status) {
      case 422:
        const res: PtkResponse = errResponse.error;
        // invalid credentials or account locked or account revoked
        let s = res.responseCode;

        switch (s) {
          case ResponseCode.ACCOUNT_LOCKED:
            this.showFormError(KEY_ACCOUNT_LOCKED);
            break;
          case ResponseCode.ACCOUNT_ACCESS_REVOKED:
            this.showFormError(KEY_ACCESS_REVOKED);
            break;
          default:
            this.showFormError(KEY_INVALID_CREDENTIALS);
        }
        break;
      default:
        // some error occurred
        this.showFormError('common.errorOccurred');
    }
  }

  private showFormError(msgKey: string) {
    this.showError = true;
    this.errorText$ = this.translate.get(msgKey);
    this.formValueChangeSubscription = this.loginForm.valueChanges.subscribe(() => this.hideFormError());
  }

  private hideFormError() {
    if (!this.showError) return;

    this.showError = false;
    this.errorText$ = undefined;
    this.formValueChangeSubscription.unsubscribe();
  }
}
