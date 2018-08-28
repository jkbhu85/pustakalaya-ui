import { HttpErrorResponse } from '@angular/common/http';
import { PtkResponse, ResponseCode } from '../models/ptk-response';
import { FormGroup } from '@angular/forms';
import { ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';

export abstract class AbstractFormComponent {
  submitted = false;
  form: FormGroup;
  inFormErrorKey = '';
  private formValueChangeSubscription: Subscription;

  protected showInFormError(key: string) {
    this.inFormErrorKey = key;

    if (this.form) {
      this.formValueChangeSubscription = this.form.valueChanges.subscribe(
        () => this.onValueChanged()
      );
    }
  }

  private onValueChanged() {
    this.inFormErrorKey = '';
    this.formValueChangeSubscription.unsubscribe();
  }

  private setFieldError(fieldName: string, errorCode: number) {
    const errorKey = this.errorKeyFrom(errorCode);

    if (!errorKey) {
      console.error('Error key for error code ' + errorCode + ' not found.');
      return;
    }

    const error: any = {};
    error[errorKey] = 'true';

    if (this.form.get(fieldName)) {
      this.form.get(fieldName).markAsTouched();
      this.form.get(fieldName).setErrors(error, { emitEvent: true });
    } else {
      console.error('\'' + fieldName + '\' not found to set errors.');
    }
  }

  private errorKeyFrom(errorCode: number): string {
    switch (errorCode) {
      case ResponseCode.VALUE_TOO_LARGE:
        return 'maxlength';
      case ResponseCode.VALUE_TOO_SMALL:
        return 'minlength';
      case ResponseCode.INVALID_FORMAT:
        return 'pattern';
      case ResponseCode.UNSUPPORTED_VALUE:
        return 'unsupported';
      case ResponseCode.VALUE_ALREADY_EXIST:
        return 'alreadyexist';
      case ResponseCode.RESOURCE_HAS_EXPIRED:
        return 'expired';
      case ResponseCode.EMPTY_VALUE:
        return 'required';
      case ResponseCode.MAIL_NOT_SENT_INVALID_EMAIL:
        return 'emailnotsent';
      case ResponseCode.DOES_NOT_MATCH:
        return 'doesnotmatch';
      default:
        return '';
    }
  }

  setFormErrors(ptkResponse: PtkResponse) {
    if (!ptkResponse || !this.form) return;
    const errors: any = ptkResponse.errors;
    let errorCode;

    for (let fieldName in errors) {
        if (errors[fieldName]) {
          errorCode = errors[fieldName];
          this.setFieldError(fieldName, errorCode);
        }
      }
  }

  protected abstract changeFormSubmissionStatus(status: boolean);

  protected abstract createForm(): any;

  protected abstract prepareData(): { [key: string]: string; };

  public abstract submit(): void;

  protected abstract handleFailure(errResponse: HttpErrorResponse): void;

  protected abstract handleSuccess(ptkResponse: PtkResponse): void;

  protected abstract handleComplete(): void;

  public abstract resetForm(): void;
}
