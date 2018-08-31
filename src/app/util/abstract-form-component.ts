import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { MsgKey } from '../consts';
import { FormDependencies } from '../models/other';
import { PtkResponse, ResponseCode } from '../models/ptk-response';

enum InFormNotiCssClass {
  ERROR = 'in-form-error',
  INFO = 'in-form-info'
}

export abstract class AbstractFormComponent {
  submitted = false;
  form: FormGroup;
  inFormErrorKey = '';
  showForm = false;

  formDeps: FormDependencies = {
    loadedSuccessfully: true
  };

  inFormNoti: {
    msgKey: string;
    cssClass: string;
  } = {
    msgKey: '',
    cssClass: InFormNotiCssClass.INFO
  };

  private depLoadErrors: any = {};
  private depCount = 0;
  private formValueChangeSubscription: Subscription;

  /**
   * Loads the specified dependency and calls the callback if given and
   * form is shown when dependency (ies) have been loaded successfully.
   *
   * @param dependencyName name of property for dependency
   * @param observable the observable that fetches the data
   * @param callback if given it will be called on request completion (whether fails or succeeds)
   */
  protected loadDependency(
    dependencyName: string,
    observable: Observable<any>,
    callback?: (errResponse?: HttpErrorResponse) => void
  ) {
    this.showInFormInfo(MsgKey.LOADING, false);
    this.depCount++;
    observable
      .pipe(finalize(() => this.onDependencyLoadComplete(dependencyName, callback)))
      .subscribe(
        (locales: string[]) => (this.formDeps[dependencyName] = locales),
        error => this.onDependencyLoadFailure(dependencyName, error)
      );
  }

  /**
   * Loads the specified dependency and calls the callback if given and
   * form is not displayed when the dependency has been loaded successfully.
   *
   * @param dependencyName name of property for dependency
   * @param observable the observable that fetches the data
   * @param callback if given it will be called on request completion (whether fails or succeeds)
   */
  protected loadDependencyNoFormDisplay(
    dependencyName: string,
    observable: Observable<any>,
    callback?: (errResponse?: HttpErrorResponse) => void
  ) {
    this.showInFormInfo(MsgKey.LOADING, false);
    this.depCount++;
    observable
      .pipe(finalize(() => this.onDependencyLoadCompleteNoFormDisplay(dependencyName, callback)))
      .subscribe(
        (locales: string[]) => (this.formDeps[dependencyName] = locales),
        error => this.onDependencyLoadFailure(dependencyName, error)
      );
  }

  private onDependencyLoadFailure(dependencyName: string, errResponse: HttpErrorResponse) {
    this.depLoadErrors[dependencyName] = errResponse;
    this.formDeps.loadedSuccessfully = this.formDeps.loadedSuccessfully && false;
  }

  private onDependencyLoadComplete(
    dependencyName: string,
    callback?: (errResponse?: HttpErrorResponse) => void
  ) {
    if (this.depCount !== 0) this.depCount--;
    if (this.depCount === 0) {
      if (this.formDeps.loadedSuccessfully) {
        this.hideInFormNoti();
        this.showForm = true;
      } else {
        this.showInFormError(MsgKey.FORM_LOAD_ERROR, false);
      }
    }
    if (callback) callback(this.depLoadErrors[dependencyName]);
  }

  private onDependencyLoadCompleteNoFormDisplay(
    dependencyName: string,
    callback?: (errResponse?: HttpErrorResponse) => void
  ) {
    if (this.depCount !== 0) this.depCount--;
    if (this.depCount === 0) {
      if (this.formDeps.loadedSuccessfully) {
        this.hideInFormNoti();
      } else {
        this.showInFormError(MsgKey.FORM_LOAD_ERROR, false);
      }
    }
    if (callback) callback(this.depLoadErrors[dependencyName]);
  }

  protected showInFormError(msgKey: string, hideOnFormChange: boolean) {
    this.inFormNoti.msgKey = msgKey;
    this.inFormNoti.cssClass = InFormNotiCssClass.ERROR;
    this.setHideNotiOnFormChange(hideOnFormChange);
  }

  protected showInFormInfo(msgKey: string, hideOnFormChange: boolean) {
    this.inFormNoti.msgKey = msgKey;
    this.inFormNoti.cssClass = InFormNotiCssClass.INFO;
    this.setHideNotiOnFormChange(hideOnFormChange);
  }

  private setHideNotiOnFormChange(hideOnFormChange: boolean) {
    if (this.form) {
      if (hideOnFormChange) {
        this.formValueChangeSubscription = this.form.valueChanges.subscribe(() =>
          this.hideInFormNoti()
        );
      } else {
        if (this.formValueChangeSubscription) this.formValueChangeSubscription.unsubscribe();
        this.formValueChangeSubscription = null;
      }
    }
  }

  protected hideInFormNoti() {
    this.inFormNoti.msgKey = '';
    if (this.formValueChangeSubscription) this.formValueChangeSubscription.unsubscribe();
    this.formValueChangeSubscription = null;
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

  protected abstract prepareData(): { [key: string]: string };

  public abstract submit(): void;

  protected abstract handleFailure(errResponse: HttpErrorResponse): void;

  protected abstract handleSuccess(ptkResponse: PtkResponse): void;

  protected abstract handleComplete(): void;

  public abstract resetForm(): void;
}
