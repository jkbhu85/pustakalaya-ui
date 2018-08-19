import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { HttpErrorResponse, HttpResponse } from '../../../../node_modules/@angular/common/http';
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
import { finalize } from 'rxjs/operators';
import { AbstractFormComponent } from '../../util/abstract-form-component';
import { InFormErrorHandler } from '../../util/in-form-errors';

@Component({
  templateUrl: './complete-registration.component.html'
})
export class CompleteRegistrationComponent extends AbstractFormComponent implements OnInit {
  showForm = false;
  showLoading = true;
  showError = false;
  form: FormGroup;
  errorText$: Observable<string>;
  countries$: Observable<Country[]>;
  registrationInfo: RegistrationInfo;
  private inFormErrorHandler: InFormErrorHandler;
  private readonly dateSeparator: DateSeparator = DateSeparator.HYPHEN;
  private readonly datePatternType = DatePatternType.DDMMYYYY;
  private readonly defaultValues = {
    isdCode: '0',
    gender: '0',
  };

  readonly LIMITS = {
    firstNameMaxLen: 30,
    lastNameMaxLen: 30,
    gender: ['M', 'F', 'O'],
    dateOfBirthMin: '', // date of birth min date
    dateOfBirthMax: '', // date of birth max date
    dateOfBirthFormat: 'DD-MM-YYYY',
    mobilePattern: '[1-9][0-9]{9}',
    passwordMinLen: 6,
    passwordMaxLen: 12,
    securityQuestionMinLen: 15,
    securityQuestionMaxLen: 100,
    securityAnswerMinLen: 3,
    securityAnswerMaxLen: 50
  };

  constructor(
    private userService: UserService,
    private countryService: CountryService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private translate: AppTranslateService,
    private notiService: NotificationService
  ) {
    super();
  }

  ngOnInit() {
    this.form = this.fb.group([]);
    this.getRegistrationInfo();
    this.inFormErrorHandler = new InFormErrorHandler(this.form);
    this.errorText$ = this.inFormErrorHandler.getErrorKeyObservable();
  }

  private getRegistrationInfo() {
    const id = this.route.snapshot.queryParamMap.get('id');

    if (id) {
      this.userService
        .getRegistrationInfo(id)
        .subscribe(info => this.handleRegInfoFetchSuccess(info), error => this.handleRegInfoFetchFail(error));
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
    this.form.patchValue(this.defaultValues);
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

  protected createForm() {
    this.form = this.fb.group(
      {
        firstName: ['', [Validators.required, Validators.maxLength(this.LIMITS.firstNameMaxLen)]],
        lastName: ['', [Validators.required, Validators.maxLength(this.LIMITS.lastNameMaxLen)]],
        gender: ['', [PtkValidators.requiredOption('0')]],
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
        isdCode: ['', [PtkValidators.requiredOption('0')]],
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
            Validators.minLength(this.LIMITS.securityQuestionMinLen),
            Validators.maxLength(this.LIMITS.securityQuestionMaxLen)
          ]
        ],
        securityAnswer: [
          '',
          [
            Validators.required,
            Validators.minLength(this.LIMITS.securityAnswerMinLen),
            Validators.maxLength(this.LIMITS.securityAnswerMaxLen)
          ]
        ]
      },
      { validator: PtkValidators.passwordMatchValidator() }
    );

    // reset form with default values
    this.resetForm();
  }

  protected prepareData(): { [key: string]: string; } {
    let u: any = {};
    u.email = this.registrationInfo.email;
    u.firstName = this.firstName.value;
    u.lastName = this.lastName.value;
    u.gender = this.gender.value;
    u.dateOfBirth = this.dateOfBirth.value;
    u.mobile = this.mobile.value;
    u.isdCode = this.isdCode.value;
    u.locale = this.locale.value;
    u.password = this.password.value;
    u.confirmPassword = this.confirmPassword.value;
    u.securityQuestion = this.securityQuestion.value;
    u.securityAnswer = this.securityAnswer.value;

    return u;
  }

  submit(): void {
    if (this.form.invalid) return;
    if (this.submitted) return;

    this.submitted = true;
    const data = this.prepareData();
    console.log('Sending add user request');

    this.userService
      .submitUserData(data) 
      .pipe(finalize(() => this.handleComplete()))
      .subscribe(
        (response: PtkResponse) => this.handleSuccess(response),
        (response: HttpErrorResponse) => this.handleFailure(response)
      );
  }

  protected handleComplete() {
    this.changeFormSubmissionStatus(false);
  }

  protected handleSuccess(ptkResponse: PtkResponse) {
    //this.registrationInfo = null;
    //this.showForm = false;
    //this.resetForm();
    this.notiService.success('user.register.successMsg');
  }

  protected handleFailure(errResponse: HttpErrorResponse) {
    console.log(errResponse);
    switch (errResponse.status) {
      case 422:
        const ptkResponse: PtkResponse = errResponse.error;
        if (ptkResponse.message === 'ERROR_INVALID_FIELDS') {
          this.setFormErrors(errResponse.error);
        } else {
          this.notiService.danger('user.register.vld.registrationIdInvld');
        }
        break;
        default:
          //console.log(errResponse);
          this.notiService.danger('common.errorOccurred');
    }
  }

  protected changeFormSubmissionStatus(status: boolean) {
    this.submitted = status;
  }

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

  resetForm() {
    this.form.reset();

    if (this.registrationInfo) {
      this.form.reset(this.registrationInfo);
    }
  }
}
