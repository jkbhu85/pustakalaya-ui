import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BASE_HREF } from '../../consts';
import { Observable ,  Subscription } from 'rxjs';
import { AppTranslateService } from '../../services/app-translate.service';
import { AuthService } from '../auth.service';

const LOGIN_URL = BASE_HREF + '/api/login';
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
      userId: ['', [Validators.required,Validators.email]],
      password: ['', Validators.required]
    });
  }

  get userId() {
    return this.loginForm.get('userId');
  }

  get password() {
    return this.loginForm.get('password');
  }

  ngOnInit() {
  }

  prepareData() {
    let l: any = {};

    l.username = this.userId.value;
    l.password = this.password.value;

    return l;
  }

  onSubmit() {
    if (this.submitted) return;

    if (this.loginForm.invalid) return;

    this.submitted = true;

    const data = this.prepareData();

    this.http
      .post(LOGIN_URL, data, {observe: 'response', responseType: 'text'})
      .subscribe(
        (response: HttpResponse<string>) => this.handleResponse(response),
        (response: HttpResponse<string>) => this.handleResponse(response)
      );
  }

  private handleResponse(response: HttpResponse<string>) {
    this.submitted = false;
    
    switch (response.status) {
      case 200:
        // login successful
        let jwt = response.body;
        console.log('login successful');
        this.authService.login(jwt);
        break;
      case 400:
        // invalid credentials or account locked or account revoked
        let s = response.body;

        switch (s) {
          case 'account locked':
            this.showLoginError(KEY_ACCOUNT_LOCKED);
            break;
          case 'access revoked':
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
