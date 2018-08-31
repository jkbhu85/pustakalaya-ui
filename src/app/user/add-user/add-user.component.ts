import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../app-security/auth.service';
import { MsgKey } from '../../consts';
import { PtkResponse } from '../../models/ptk-response';
import { AuthInfo } from '../../models/user';
import { NotificationService } from '../../notifications/notification.service';
import { LocaleService } from '../../services/locale.service';
import { AbstractFormComponent } from '../../util/abstract-form-component';
import { UserService } from '../user.service';

@Component({
  templateUrl: './add-user.component.html',
  styles: []
})
export class AddUserComponent extends AbstractFormComponent implements OnInit {
  private userInfo: AuthInfo;

  readonly LIMITS = {
    'firstNameMaxLen': 30,
    'lastNameMaxLen': 30
  };
  
  private readonly defaultValues: any = {
    locale: '0'
  };

  constructor(
    private fb: FormBuilder,
    private localeService: LocaleService,
    private userService: UserService,
    private authService: AuthService,
    private notiService: NotificationService
  ) {
    super();
    this.authService.getUserInfo().subscribe(
      (userInfo: AuthInfo) => this.userInfo = userInfo
    );
    this.loadFormDependencies();
  }

  ngOnInit() {
    this.createForm();
  }
  
  private loadFormDependencies() {
    this.loadDependency('locales', this.localeService.getAll());
  }

  protected createForm() {
    this.form = this.fb.group({
      'firstName': [null, [Validators.required, Validators.maxLength(this.LIMITS.firstNameMaxLen)]],
      'lastName': [null, [Validators.required, Validators.maxLength(this.LIMITS.lastNameMaxLen)]],
      'email': [null, [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],
      'locale': [null, [Validators.required]]
    });

    // specify default values
    if (this.userInfo.locale) this.defaultValues.locale = this.userInfo.locale;
    // reset form with default values
    this.resetForm();
  }

  get firstName() {
    return this.form.get('firstName');
  }

  get lastName() {
    return this.form.get('lastName');
  }

  get email() {
    return this.form.get('email');
  }
  get locale() {
    return this.form.get('locale');
  }

  protected prepareData() {
    let data: any = {};

    data.firstName = this.firstName.value;
    data.lastName = this.lastName.value;
    data.email = this.email.value;
    data.locale = this.locale.value;

    return data;
  }

  submit() {
    if (this.form.invalid) {
      this.showInFormError(MsgKey.VALIDATION_FAILED, true);
      return;
    }
    if (this.submitted) return;

    this.showInFormInfo(MsgKey.SUBMITTING, true);
    this.changeFormSubmissionStatus(true);
    const data = this.prepareData();

    this.userService
      .submitPreRegistrationData(data)
      .pipe(finalize(() => this.handleComplete()))
      .subscribe(
        (response: PtkResponse) => this.handleSuccess(response),
        (response: HttpErrorResponse) => this.handleFailure(response)
      );
  }

  protected handleComplete() {
    this.changeFormSubmissionStatus(false);
    this.hideInFormNoti();
  }

  protected handleSuccess(response: PtkResponse) {
    this.notiService.success('user.add.success');
    this.resetForm();
  }

  protected handleFailure(errResponse: HttpErrorResponse) {
    switch (errResponse.status) {
      case 422:
        const response: PtkResponse = errResponse.error;
        console.log(response);
        if (response.responseCode === 61) {
          this.setFormErrors(response);
          this.showInFormError(MsgKey.VALIDATION_FAILED, true);
        } else {
          this.showInFormError(MsgKey.EMAIL_DOES_NOT_EXIST, true);
        }
        break;
      default:
        console.log(errResponse);
        this.showInFormError(MsgKey.ERROR_OCCURRED, true);
    }
  }

  protected changeFormSubmissionStatus(status: boolean) {
    this.submitted = status;
  }

  resetForm() {
    this.form.reset();

    if (this.defaultValues) {
      this.form.reset(this.defaultValues);
    }
  }

}
