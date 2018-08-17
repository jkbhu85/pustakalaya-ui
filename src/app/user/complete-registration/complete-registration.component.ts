import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { HttpErrorResponse } from '../../../../node_modules/@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { AppTranslateService } from '../../services/app-translate.service';
import { RegistrationInfo } from '../../models/user';
import { NotificationService } from '../../notifications/notification.service';
import { PtkResponse } from '../../models/ptk-response';
import { PtkValidators } from '../../util/custom-validators';
import { DateSeparator, DatePatternType, toString } from '../../util/date-util';
import { Country } from '../../models/other';
import { CountryService } from '../../country/country.service';

@Component({
  templateUrl: './complete-registration.component.html'
})
export class CompleteRegistrationComponent implements OnInit {
  submitStatus = false;
  showForm = false;
  showLoading = true;
  showError = false;
  form: FormGroup;
  errorText$: Observable<string>;
  countries$: Observable<Country[]>;
  registrationInfo: RegistrationInfo;
  private formValueChangeSubscription: Subscription;
  private readonly dateSeparator: DateSeparator = DateSeparator.HYPHEN;
  private readonly datePatternType = DatePatternType.DDMMYYYY;

  readonly LIMITS = {
    firstNameMaxLen: 30,
    lastNameMaxLen: 30,
    gender: ['M', 'F', 'O'],
    dateOfBirthMin: '', // date of birth min date
    dateOfBirthMax: '', // date of birth max date
    mobilePattern: '[1-9][0-9]{9}',
    passwordMinLen: 6,
    passwordMaxLen: 12,
    secQuestionMinLen: 15,
    secQuestionMaxLen: 100,
    secAnswerMinLen: 3,
    secAnswerMaxLen: 50
  };

  constructor(
    private userService: UserService,
    private countryService: CountryService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private translate: AppTranslateService,
    private notiService: NotificationService
  ) {}

  ngOnInit() {
    this.form = this.fb.group([]);
    this.getRegistrationInfo();
  }

  private getRegistrationInfo() {
    const id = this.route.snapshot.queryParamMap.get('id');

    if (id) {
      this.userService
        .getRegistrationInfo(id)
        .subscribe(
          info => this.handleRegInfoFetchSuccess(info),
          error => this.handleRegInfoFetchFail(error)
        );
    } else {
      this.showLoading = false;
      this.notiService.danger('user.register.vld.invalidRegistrationId');
    }
  }

  private handleRegInfoFetchSuccess(info: PtkResponse) {
    this.showForm = true;
    this.showLoading = false;
    this.registrationInfo = info.data;

    // changle locale to user's locale
    this.translate.setUserLocale(this.registrationInfo.locale);
    this.createDateOfBirthRange();
    this.countries$ = this.countryService.getAllCoutries();
    // create form since registration info is now available
    this.createForm();
  }

  private handleRegInfoFetchFail(errResponse: HttpErrorResponse) {
    this.showLoading = false;

    switch (errResponse.status) {
      case 422:
        this.notiService.danger('user.register.vld.registrationIdInvld');
        break;
      default:
        this.notiService.danger('common.errorOccurred');
    }
  }

  private createForm() {
    this.form = this.fb.group(
      {
        firstName: ['', [Validators.required, Validators.maxLength(this.LIMITS.firstNameMaxLen)]],
        lastName: ['', [Validators.required, Validators.maxLength(this.LIMITS.lastNameMaxLen)]],
        gender: ['', [Validators.required]],
        dateOfBirth: [
          '',
          [
            Validators.required,
            PtkValidators.dobRangeValidator(
              this.LIMITS.dateOfBirthMin,
              this.LIMITS.dateOfBirthMax,
              this.datePatternType,
              this.dateSeparator
            )
          ]
        ],
        mobile: ['', [Validators.required, Validators.pattern(this.LIMITS.mobilePattern)]],
        isdCode: ['0', [Validators.required]],
        locale: ['', [Validators.required]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(this.LIMITS.passwordMinLen),
            Validators.maxLength(this.LIMITS.passwordMaxLen)
          ]
        ],
        confirmPassword: ['', [Validators.required]],
        securityQuestion: [
          '',
          [
            Validators.required,
            Validators.minLength(this.LIMITS.secQuestionMinLen),
            Validators.maxLength(this.LIMITS.secQuestionMaxLen)
          ]
        ],
        securityAnswer: [
          '',
          [
            Validators.required,
            Validators.minLength(this.LIMITS.secAnswerMinLen),
            Validators.maxLength(this.LIMITS.secAnswerMaxLen)
          ]
        ]
      },
      {validator: PtkValidators.passwordMatchValidator()}
    );

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

  private createDateOfBirthRange() {
    const date = new Date();
    const currentYear = date.getFullYear();

    date.setFullYear(currentYear - 100);
    this.LIMITS.dateOfBirthMin = toString(date, this.datePatternType, this.dateSeparator);

    date.setFullYear(currentYear - 3);
    this.LIMITS.dateOfBirthMax = toString(date, this.datePatternType, this.dateSeparator);
  }

  private showLoginError(msgKey: string) {
    this.showError = true;
    this.errorText$ = this.translate.get(msgKey);
    this.formValueChangeSubscription = this.form.valueChanges.subscribe(() =>
      this.hideLoginError()
    );
  }

  private hideLoginError() {
    this.showError = false;
    this.errorText$ = undefined;
    this.formValueChangeSubscription.unsubscribe();
  }

  reset() {
    this.form.reset(this.registrationInfo);
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }
}
