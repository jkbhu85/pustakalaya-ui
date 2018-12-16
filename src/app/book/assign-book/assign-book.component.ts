import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { MsgKey } from '../../consts';
import { BookInstance, BookInstanceStatus } from '../../models/book';
import { PtkResponse } from '../../models/ptk-response';
import { User, UserAcStatus } from '../../models/user';
import { NotificationService } from '../../notifications/notification.service';
import { UserService } from '../../user/user.service';
import { AbstractFormComponent } from '../../util/abstract-form-component';
import { BookService } from '../book.service';
import { AppTranslateService } from '../../services/app-translate.service';

@Component({
  selector: 'app-assign-book',
  templateUrl: './assign-book.component.html',
  styles: []
})
export class AssignBookComponent extends AbstractFormComponent implements OnInit {
  enableUserInput = false;
  validUser = false;
  book: BookInstance;
  user: User;

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private userService: UserService,
    private notiService: NotificationService,
    private translateService: AppTranslateService
  ) {
    super();
    this.loadFormDependencies();
  }

  private loadFormDependencies() {}

  ngOnInit() {
    this.createForm();
    this.showForm = true;
  }

  protected changeFormSubmissionStatus(status: boolean) {
    this.submitted = status;
  }

  protected createForm() {
    this.form = this.fb.group({
      bookId: [null, [Validators.required]],
      username: [null, [Validators.required]]
    });
  }

  get username() {
    return this.form.get('username');
  }

  get bookId() {
    return this.form.get('bookId');
  }

  protected prepareData(): { [key: string]: string } {
    return { bookInstanceId: this.book.id, username: this.user.email };
  }

  public submit(): void {
    if (!this.validUser || this.form.invalid || this.submitted) {
      return;
    }

    const data: any = this.prepareData();

    this.changeFormSubmissionStatus(true);
    this.bookService.assginBook(data)
    .pipe(finalize(() => this.handleComplete()))
    .subscribe(
      (res: PtkResponse) => this.handleSuccess(res),
      (her: HttpErrorResponse) => this.handleFailure(her)
    );
  }

  protected handleFailure(errResponse?: HttpErrorResponse): void {
    switch (errResponse.status) {
      case 422:
        console.log(errResponse.error);
        this.showInFormError(MsgKey.VALIDATION_FAILED, true);
        this.setFormErrors(errResponse.error);
        break;
      default:
        console.error(errResponse);
        this.notiService.danger(MsgKey.ERROR_OCCURRED);
    }
  }

  protected handleSuccess(ptkResponse?: PtkResponse): void {
    const data = {'title': this.book.title, 'user': this.user.email };
    this.notiService.success('book.assign.msg.assignedSuccessfully', data);

    this.resetForm();
  }

  protected handleComplete(): void {
    this.changeFormSubmissionStatus(false);
    this.hideInFormNoti();
  }

  public resetForm(): void {
    this.form.reset();
    this.enableUserInput = false;
    this.validUser = false;
    this.user = null;
    this.book = null;
  }

  public searchBook(): void {
    if (!this.bookId.value && this.bookId.invalid) {
      this.book = null;
      return;
    }

    this.notiService.showUiBlocker();
    this.bookService
      .find(this.bookId.value)
      .pipe(finalize(() => this.notiService.hideUiBlocker()))
      .subscribe((book: BookInstance) => this.onBookSearchComplete(book), her => this.handleFailure(her));
  }

  private onBookSearchComplete(book: BookInstance) {
    this.book = book;

    if (book == null) {
      this.setFieldError('bookId', null, 'invalid');
      return;
    }

    console.log(book);

    if (book.status === BookInstanceStatus.AVAILABLE) {
      this.enableUserInput = true;
    } else if (book.status === BookInstanceStatus.ISSUED) {
      this.setFieldError('bookId', null, 'alreadyAssigned');
    } else if (book.status === BookInstanceStatus.REMOVED || book.status === BookInstanceStatus.UNAVAILABLE) {
      this.setFieldError('bookId', null, 'notAvailable');
    } else {
      this.showInFormError(MsgKey.ERROR_OCCURRED, true);
      console.error('Book instance status could not be determined. Status: ' + book.status);
    }
  }

  public searchUser(): void {
    if (!this.username.value && this.username.invalid) {
      this.user = null;
      return;
    }

    this.notiService.showUiBlocker();
    this.userService
      .getUserInfo(this.username.value)
      .pipe(finalize(() => this.notiService.hideUiBlocker()))
      .subscribe((user: User) => this.onUserSearchComplete(user), her => this.handleFailure(her));
  }

  private onUserSearchComplete(user: User) {
    this.user = user;

    if (user == null) {
      this.validUser = false;
      this.setFieldError('username', null, 'invalid');
      return;
    }

    switch (user.accountStatus) {
      case UserAcStatus.INCOMPLETE:
      case UserAcStatus.REVOKED:
      case UserAcStatus.CLOSED:
        this.setFieldError('username', null, 'notAvailable');
        this.validUser = false;
        return;
    }

    if (user.bookQuota === user.bookAssignCount) {
      this.validUser = false;
      this.setFieldError('username', null, 'quotaMax');
      return;
    }

    this.validUser = true;
  }
}
