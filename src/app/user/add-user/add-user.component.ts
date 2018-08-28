import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../app-security/auth.service';
import { AuthInfo } from '../../models/user';
import { PtkResponse } from '../../models/ptk-response';
import { NotificationService } from '../../notifications/notification.service';
import { AbstractFormComponent } from '../../util/abstract-form-component';
import { UserService } from '../user.service';
import { LocaleService } from '../../services/locale.service';
import { MsgKey } from '../../consts';

@Component({
  templateUrl: './add-user.component.html',
  styles: []
})
export class AddUserComponent extends AbstractFormComponent implements OnInit {
  private userInfo: AuthInfo;
  private depCount = 0;
  showForm = false;
  formLoadSuccessful = true;
  locales: string[];

  readonly LIMITS = {
    'firstNameMaxLen': 30,
    'lastNameMaxLen': 30
  };
  
  private readonly defaultValues: any = {
    locale: ''
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
  }

  ngOnInit() {
    setTimeout(() => this.beforeFormDepenciesLoadStart(), 500);
    this.loadFormDependencies();
  }

  private beforeFormDepenciesLoadStart() {
    if (!this.showForm) this.notiService.showUiBlocker();
  }
  
  private loadFormDependencies() {
    this.depCount++;
    this.localeService
      .getAll()
      .pipe(finalize(() => this.onDependencyLoadComplete()))
      .subscribe(
        (locales: string[]) => this.locales = locales,
        () => this.onDependencyLoadFailure()
      );
  }

  private onDependencyLoadFailure() {
    this.formLoadSuccessful = this.formLoadSuccessful && false;
  }
  
  private onDependencyLoadComplete() {
    if (this.depCount !== 0) this.depCount--;
    if (this.depCount === 0) {
      this.afterFormDependenciesLoaded();
    }
  }

  private afterFormDependenciesLoaded() {
    this.notiService.hideUiBlocker();

    if (this.formLoadSuccessful) {
      this.showForm = true;
      this.createForm();
    } else {
      this.notiService.danger(MsgKey.FORM_LOAD_ERROR);
    }
  }

  protected createForm() {
    let localeValue = this.userInfo.locale;
    if (!localeValue) localeValue = 'en-US';

    this.form = this.fb.group({
      'firstName': [null, [Validators.required, Validators.maxLength(this.LIMITS.firstNameMaxLen)]],
      'lastName': [null, [Validators.required, Validators.maxLength(this.LIMITS.lastNameMaxLen)]],
      'email': [null, [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],
      'locale': [null, [Validators.required]]
    });

    // specify default values
    this.defaultValues.locale = localeValue;
    this.resetForm(); // reset form with default values
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
    if (this.submitted) return;
    if (this.form.invalid) return;

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
          this.showInFormError(MsgKey.VALIDATION_FAILED);
        } else {
          this.showInFormError(MsgKey.EMAIL_DOES_NOT_EXIST);
        }
        break;
      default:
        console.log(errResponse);
        this.showInFormError(MsgKey.ERROR_OCCURRED);
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
