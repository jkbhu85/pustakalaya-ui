import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { AppTranslateService } from '../../services/app-translate.service';
import { RegistrationInfo } from '../../models/user';

const DATE_PATTERN: RegExp = new RegExp('d{2}/d{2}/d{4}');

/**
 * Returns an object specifying day of month, month (0 based) and year
 * after parsing the date if this date represents a date of the 
 * form DD/MM/YYYY.
 * 
 * @param dateStr date string to be parsed
 */
function parseDate(dateStr: string): {day: number, month: number, year: number} {
  const valid = DATE_PATTERN.test(dateStr);
  if (!valid) return null;

  let d: any;
  let multiple: string[] = dateStr.split('/');

  if (multiple.length !== 3) return null;

  try {
    d.day = parseInt(multiple[0], 10);
    d.month = parseInt(multiple[1], 10) - 1;
    d.year = parseInt(multiple[2], 10);

    const date = new Date(d.year, d.month, d.day);
    if (date.getDate() !== d.day || date.getMonth() !== d.month || date.getFullYear() !== d.year) {
      return null;
    }
  } catch (e) {
    d = null;
  }

  return d;
}

/**
 * Validates the date of an `AbstractControl`.
 * 
 * @see AbstractControl
 */
function dateOfBirthValidator(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const date = parseDate(control.value);

    if (date === null) {
      return {'pattern': 'Invalid date.'};
    }

    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth();
    const yearMin = now.getFullYear() - 100;
    const yearMax = now.getFullYear() - 3;

    let lessThenMin = false;
    let greaterThenMin = false;

    if (date.year > yearMax) greaterThenMin = true;
    else if (date.month > month) greaterThenMin = true;
    else if (date.day > day) greaterThenMin = true;

    if (date.year < yearMin) lessThenMin = true;
    else if (date.month < month) lessThenMin = true;
    else if (date.day < day) lessThenMin = true;

    if (lessThenMin) return {'dobMin': 'Date is less than minimum date.'};
    if (greaterThenMin) return {'dobMax': 'Date is greater than maximum date.'};

    return null;
  };
}

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
    dobMin: '', // date of birth min date
    dobMax: '', // date of birth max date
    dobPattern: 'DD/MM/YYYY',
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
      dateOfBirth: ['', [Validators.required, dateOfBirthValidator]],
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

  private setDobLimits() {
    // Date should be in the range [today minus 100] to [today minus 3]
    const today = new Date();
    const day = today.getDay();
    const month = today.getMonth();
    const year = today.getFullYear();

    this.LIMITS.dobMax = this.getDateString(day, month, year - 3);
    this.LIMITS.dobMin = this.getDateString(day, month, year - 100);
  }

  private getDateString(day: number, month: number, year: number): string {
    let str = '';

    if (day < 10) str += '0' + day;
    else str += day;

    str += '/';
    if (month < 9) str += '0' + month;
    else str += (month + 1);

    str += '/';
    str += year;

    return str;
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
