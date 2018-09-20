import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { MsgKey } from '../../consts';
import { PtkResponse } from '../../models/ptk-response';
import { NotificationService } from '../../notifications/notification.service';
import { AbstractFormComponent } from '../../util/abstract-form-component';
import { PtkValidators } from '../../util/custom-validators';
import { UserService } from '../user.service';

@Component({
  templateUrl: './change-password.component.html'
})
export class ChangePasswordComponent extends AbstractFormComponent implements OnInit {
  readonly LIMITS = {
    passwordMinLen: 6,
    passwordMaxLen: 12
  };

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private notiService: NotificationService
  ) {
    super();
  }

  ngOnInit() {
    this.createForm();
  }

  protected changeFormSubmissionStatus(status: boolean) {
    this.submitted = status;
  }

  protected createForm() {
    this.form = this.fb.group(
      {
        currentPassword: [null, [Validators.required]],
        newPassword: [
          null,
          [
            Validators.required,
            Validators.minLength(this.LIMITS.passwordMinLen),
            Validators.maxLength(this.LIMITS.passwordMaxLen)
          ]
        ],
        confirmNewPassword: [null, [Validators.required]]
      },
      {
        validator: [PtkValidators.passwordMatchValidator('newPassword', 'confirmNewPassword')]
      }
    );

    this.showForm = true;
  }

  get currentPassword() {
    return this.form.get('currentPassword');
  }

  get newPassword() {
    return this.form.get('newPassword');
  }

  get confirmNewPassword() {
    return this.form.get('confirmNewPassword');
  }

  protected prepareData(): { [key: string]: string } {
    let data: any = {};

    data.currentPassword = this.currentPassword.value;
    data.newPassword = this.newPassword.value;
    data.confirmNewPassword = this.confirmNewPassword.value;

    return data;
  }

  public submit(): void {
    if (this.form.invalid) {
      return;
    }

    if (this.submitted) return;

    const data = this.prepareData();
    this.changeFormSubmissionStatus(true);
    this.showInFormInfo(MsgKey.SUBMITTING, false);

    this.userService
      .updatePassword(data)
      .pipe(finalize(() => this.handleComplete()))
      .subscribe(() => this.handleSuccess(), err => this.handleFailure(err));
  }

  protected handleFailure(errResponse: HttpErrorResponse): void {
    switch (errResponse.status) {
      case 422:
        this.setFormErrors(errResponse.error);
        this.showInFormError(MsgKey.VALIDATION_FAILED, true);
        console.log(errResponse.error);
        break;
      case 500:
      default:
        this.showInFormError(MsgKey.ERROR_OCCURRED, true);
        console.error(errResponse);
        break;
    }
  }

  protected handleSuccess(ptkResponse?: PtkResponse): void {
    this.resetForm();
    this.hideInFormNoti();
    this.notiService.success(MsgKey.USER_CHANGE_PASSWORD_SUCCESS);
  }

  protected handleComplete(): void {
    this.changeFormSubmissionStatus(false);
  }

  public resetForm(): void {
    this.form.reset();
  }
}
