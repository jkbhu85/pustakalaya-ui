import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { HttpErrorResponse } from '../../../../node_modules/@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { AppTranslateService } from '../../services/app-translate.service';
import { RegistrationInfo } from '../../models/user';

@Component({
  templateUrl: './complete-registration.component.html'
})
export class CompleteRegistrationComponent implements OnInit {
  submitStatus = false;
  showError = false;
  form: FormGroup;
  errorText$: Observable<string>;
  registrationInfo: RegistrationInfo;
  private formValueChangeSubscription: Subscription;

  readonly LIMITS = {
    firstNameMaxLen: 30,
    lastNameMaxLen: 30,
    gender: ['M', 'F', 'O'],
    dobMin: '', // date of birth min date
    dobMax: '', // date of birth max date
    dobPattern: ' d{2}/d{2}/d{4}',
    passwordMinLen: 6,
    passwordMaxLen: 12,
    secQuestionMinLen: 15,
    secQuestionMaxLen: 100,
    secAnswerMinLen: 3,
    secAnswerMaxLen: 50
  };

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private translate: AppTranslateService
  ) {}

  ngOnInit() {
    this.getRegistrationInfo();
  }

  private getRegistrationInfo() {
    const id = this.route.snapshot.paramMap.get('id');
    this.userService
      .getRegistrationInfo(id)
      .subscribe(info => this.handleRegInfoFetchSuccess(info), error => this.handleRegInfoFetchFail(error));
  }

  private handleRegInfoFetchSuccess(info: RegistrationInfo) {
    // create form since registration info is now available
    this.createForm();
  }

  private handleRegInfoFetchFail(errResponse: HttpErrorResponse) {}

  private createForm() {
    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(this.LIMITS.firstNameMaxLen)]],
      lastName: ['', [Validators.required], Validators.maxLength(this.LIMITS.lastNameMaxLen)],
      gender: ['', [Validators.required]],
      dateOfBirth: ['', [Validators.required, Validators.pattern(this.LIMITS.dobPattern)]],
      mobile: ['', [Validators.required, Validators.pattern('[1-9][0-9]{9}')]],
      isdCode: ['', [Validators.required]],
      locale: ['', [Validators.required]],
      password: [
        '',
        [Validators.required, Validators.minLength(this.LIMITS.passwordMinLen), Validators.maxLength(this.LIMITS.passwordMaxLen)]
      ],
      confirmPassword: ['', [Validators.required]],
      securityQuestion: [
        '',
        [Validators.required, Validators.minLength(this.LIMITS.secQuestionMinLen), Validators.maxLength(this.LIMITS.secQuestionMaxLen)]
      ],
      securityAnswer: [
        '',
        [Validators.required, Validators.minLength(this.LIMITS.secAnswerMinLen), Validators.maxLength(this.LIMITS.secAnswerMaxLen)]
      ]
    });

    // reset form with default values
    this.reset();
  }

  onSubmit(): void {}

  get firstName() {
    return this.form.get('firstName');
  }

  get lastName() {
    return this.form.get('lastName');
  }

  get gender() {
    return this.form.get('gender');
  }

  get dateOfBirth() {
    return this.form.get('dateOfBirth');
  }

  get mobile() {
    return this.form.get('mobile');
  }

  get isdCode() {
    return this.form.get('isdCode');
  }

  get locale() {
    return this.form.get('locale');
  }

  get password() {
    return this.form.get('password');
  }

  get confirmPassword() {
    return this.form.get('confirmPassword');
  }

  get securityQuestion() {
    return this.form.get('securityQuestion');
  }

  get securityAnswer() {
    return this.form.get('securityAnswer');
  }

  private showLoginError(msgKey: string) {
    this.showError = true;
    this.errorText$ = this.translate.get(msgKey);
    this.formValueChangeSubscription = this.form.valueChanges.subscribe(() => this.hideLoginError());
  }

  private hideLoginError() {
    this.showError = false;
    this.errorText$ = undefined;
    this.formValueChangeSubscription.unsubscribe();
  }

  reset() {
    this.form.reset(this.registrationInfo);
  }
}
