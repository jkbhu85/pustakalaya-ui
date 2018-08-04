import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidationErrors } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AppTranslateService } from '../../services/app-translate.service';
import { HttpResponse, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BASE_HREF } from '../../consts';
import { AuthService } from '../../app-security/auth.service';
import { UserInfo } from '../../models';
import { PtkResponse, ResponseCode } from '../../models/ptk-response';
import { NotificationService } from '../../notifications/notification.service';

const ADD_USER_URL = BASE_HREF + '/ptk/newUser';
const GET_LOCALES = BASE_HREF + '/ptk/locale';

@Component({
  templateUrl: './add-user.component.html',
  styles: []
})
export class AddUserComponent implements OnInit {

  addUserForm: FormGroup;
  submitStatus = false;
  showError = false;
  errorText$: Observable<any>;
  private formValueChangeSubscription: Subscription;
  private debug = true;
  private userInfo: UserInfo;
  private readonly defaultValues: any = {};
  localeObservable: Observable<string[]>;

  readonly param = {
    'firstNameMaxLen': 30,
    'lastNameMaxLen': 30
  };

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private translate: AppTranslateService,
    private authService: AuthService,
    private notiService: NotificationService
  ) {
    this.authService.getUserInfo().subscribe(
      (userInfo: UserInfo) => this.userInfo = userInfo
    );
    this.createForm();
  }

  ngOnInit() {
  }

  createForm() {
    let localeValue = this.userInfo.locale;
    if (!localeValue) localeValue = 'en-US';

    this.addUserForm = this.fb.group({
      'firstName': ['', [Validators.required, Validators.maxLength(this.param.firstNameMaxLen)]],
      'lastName': ['', [Validators.required, Validators.maxLength(this.param.lastNameMaxLen)]],
      'email': ['', [Validators.required, Validators.pattern(' ^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],
      'locale': [localeValue, [Validators.required]]
    });

    this.defaultValues.firstName = '';
    this.defaultValues.lastName = '';
    this.defaultValues.email = '';
    this.defaultValues.locale = localeValue;
    this.localeObservable = this.http.get<string[]>(GET_LOCALES);
  }

  getTranslation(locale: string): Observable<string> {
    return this.translate.get('langs.' + locale);
  }

  get firstName() {
    return this.addUserForm.get('firstName');
  }

  get lastName() {
    return this.addUserForm.get('lastName');
  }

  get email() {
    return this.addUserForm.get('email');
  }
  get locale() {
    return this.addUserForm.get('locale');
  }

  prepareData() {
    let l: any = {};

    l.firstName = this.firstName.value;
    l.lastName = this.lastName.value;
    l.email = this.email.value;
    l.locale = this.locale.value;

    return l;
  }

  onSubmit() {
    if (this.submitStatus) return;
    if (this.addUserForm.invalid) return;

    this.setFormSubmitStatus(true);
    this.hideFormError();

    const data = this.prepareData();

    this.http
      .post(ADD_USER_URL, data)
      .pipe(finalize(() => this.handleComplete()))
      .subscribe(
        (response: HttpResponse<PtkResponse>) => this.handleSuccess(response),
        (response: HttpErrorResponse) => this.handleFailure(response)
      );
  }

  private handleComplete() {
    this.setFormSubmitStatus(false);
  }

  private handleSuccess(response: HttpResponse<PtkResponse>) {
    // const ptrRes: PtkResponse = response.body;
    this.translate.get('user.add.success').subscribe(
      (msg) => this.notiService.info(msg)
    );
    this.reset();
  }

  private handleFailure(errResponse: HttpErrorResponse) {

    switch (errResponse.status) {
      case 422:
        const response: PtkResponse = errResponse.error;
        console.log(response);
        this.showFormError('common.validationFailed');
        const errors: any = response.errors;

        for (let prop in errors) {
          if (errors[prop]) {
            this.setFieldError(prop, errors[prop]);
          }
        }
        break;
      default:
        console.log(errResponse);
        this.showFormError('common.errorOccurred');
    }
  }

  private setFieldError(fieldName: string, errorCode: number) {
    const errorKey = this.getErrorKeyFrom(errorCode);
    const error: any = {};
    error[errorKey] = 'true';
    console.log(error);

    if (this.addUserForm.get(fieldName)) {
      //this.addUserForm.get(fieldName).markAsTouched();
      this.addUserForm.get(fieldName).setErrors(error, { emitEvent: true });
      console.log('Error set.');
    } else {
      console.log(fieldName + ' not found to set errors.');
    }
  }

  private getErrorKeyFrom(errorCode: number): string {
    switch (errorCode) {
      case ResponseCode.VALUE_TOO_LARGE:
        return 'maxlength';
      case ResponseCode.VALUE_TOO_SMALL_OR_EMPTY:
        return 'required';
      case ResponseCode.INVALID_FORMAT:
        return 'pattern';
      case ResponseCode.UNSUPPORTED_VALUE:
        return '';
      case ResponseCode.VALUE_ALREADY_EXIST:
        return '';
      case ResponseCode.RESOURCE_HAS_EXPIRED:
        return '';
      case ResponseCode.EMPTY_FILE:
        return 'required';
      case ResponseCode.MAIL_NOT_SENT_INVALID_EMAIL:
        return '';
      default:
        return '';
    }
  }

  private setFormSubmitStatus(status: boolean) {
    this.submitStatus = status;
  }

  private showFormError(msgKey: string) {
    this.hideFormError(); // hide previous error if any

    this.showError = true;
    this.errorText$ = this.translate.get(msgKey);
    this.formValueChangeSubscription = this.addUserForm.valueChanges.subscribe(() => this.hideFormError());
  }

  private hideFormError() {
    if (!this.showError) return;

    this.showError = false;
    this.errorText$ = undefined;
    this.formValueChangeSubscription.unsubscribe();
  }

  reset() {
    this.addUserForm.reset(this.defaultValues);
  }

}
