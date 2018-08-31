import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { PtkResponse } from '../../models/ptk-response';
import { NotificationService } from '../../notifications/notification.service';
import { AbstractFormComponent } from '../../util/abstract-form-component';
import { PtkValidators } from '../../util/custom-validators';
import { Observable } from 'rxjs';
import { BookCategory } from '../../models/book';
import { Currency } from '../../models/other';
import { CurrencyService } from '../../services/currency.service';
import { BookCategoryService } from '../book-category.service';
import { BookService } from '../book.service';
import { finalize } from 'rxjs/operators';
import { MsgKey } from '../../consts';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html'
})
export class AddBookComponent extends AbstractFormComponent implements OnInit {
  constructor(
    private currencyService: CurrencyService,
    private bookCategoryService: BookCategoryService,
    private bookService: BookService,
    private fb: FormBuilder,
    private notiService: NotificationService
  ) {
    super();
    this.loadFormDependencies();
  }

  readonly LIMITS: any = {
    titleMaxLen: 150,
    authorsMaxLen: 250,
    publicationMaxLen: 100,
    priceMax: 9999999.99,
    numberOfPagesMin: 1,
    numberOfPagesMax: 99999,
    numberOfCopiesMin: 1,
    numberOfCopiesMax: 999,
    numberPattern: /^[\-\+]?\d+$/,
    pricePattern: /^\d+(\.\d{1,2})?$/
  };

  readonly DEFAULT_VALUES: any = {
    bookCategory: '0',
    currency: '0'
  };

  ngOnInit() {
    this.createForm();
  }

  private loadFormDependencies() {
    this.loadDependency('currencies', this.currencyService.getAll());
    this.loadDependency('bookCategories', this.bookCategoryService.getAll());
  }

  protected changeFormSubmissionStatus(status: boolean) {
    this.submitted = status;
  }

  protected createForm() {
    this.form = this.fb.group({
      bookCategory: [null, [PtkValidators.requiredOption('0')]],
      title: [null, [Validators.required, Validators.maxLength(this.LIMITS.titleMaxLen)]],
      authors: [null, [Validators.maxLength(this.LIMITS.authorsMaxLen)]],
      edition: [null, [Validators.pattern(this.LIMITS.numberPattern)]],
      publication: [null, [Validators.maxLength(this.LIMITS.publicationMaxLen)]],
      volume: [null, [Validators.pattern(this.LIMITS.numberPattern)]],
      isbn: [null, [PtkValidators.isbnValidator(false)]],
      price: [null, [Validators.required, Validators.pattern(this.LIMITS.pricePattern), Validators.max(this.LIMITS.priceMax)]],
      currency: [null, [PtkValidators.requiredOption('0')]],
      numberOfPages: [
        null,
        [
          Validators.required,
          Validators.min(this.LIMITS.numberOfPagesMin),
          Validators.max(this.LIMITS.numberOfPagesMax),
          Validators.pattern(this.LIMITS.numberPattern)
        ]
      ],
      numberOfCopies: [
        null,
        [
          Validators.required,
          Validators.min(this.LIMITS.numberOfCopiesMin),
          Validators.max(this.LIMITS.numberOfCopiesMax),
          Validators.pattern(this.LIMITS.numberPattern)
        ]
      ]
    });

    this.resetForm();
  }

  get bookCategory() {
    return this.form.get('bookCategory');
  }

  get title() {
    return this.form.get('title');
  }

  get price() {
    return this.form.get('price');
  }

  get currency() {
    return this.form.get('currency');
  }

  get numberOfPages() {
    return this.form.get('numberOfPages');
  }

  get authors() {
    return this.form.get('authors');
  }

  get edition() {
    return this.form.get('edition');
  }

  get isbn() {
    return this.form.get('isbn');
  }

  get publication() {
    return this.form.get('publication');
  }

  get volume() {
    return this.form.get('volume');
  }

  get numberOfCopies() {
    return this.form.get('numberOfCopies');
  }

  protected prepareData(): { [key: string]: string } {
    let data: { [key: string]: string } = {};
    data.bookCategory = this.bookCategory.value;
    data.title = this.title.value;
    data.authors = this.authors.value;
    data.edition = this.edition.value;
    data.publication = this.publication.value;
    data.volume = this.volume.value;
    data.isbn = this.isbn.value;
    data.price = this.price.value;
    data.currency = this.currency.value;
    data.numberOfPages = this.numberOfPages.value;
    data.numberOfCopies = this.numberOfCopies.value;

    return data;
  }
  public submit(): void {
    if (this.submitted) return;
    if (this.form.invalid) {
      this.showInFormError(MsgKey.VALIDATION_FAILED, true);
      console.log(this.form);
      return;
    }
    this.showInFormError(MsgKey.SUBMITTING, false);
    this.changeFormSubmissionStatus(true);
    const data = this.prepareData();

    this.bookService
      .save(data)
      .pipe(finalize(() => this.handleComplete()))
      .subscribe(
        () => this.handleSuccess(null),
        (her) => this.handleFailure(her)
      );
  }
  protected handleFailure(errResponse: HttpErrorResponse): void {
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
  protected handleSuccess(ptkResponse: PtkResponse): void {
    this.notiService.successMsg('Book added successfully.');
    this.resetForm();
  }
  protected handleComplete(): void {
    this.changeFormSubmissionStatus(false);
    this.hideInFormNoti();
  }

  public resetForm(): void {
    this.form.reset();
    
    if (this.DEFAULT_VALUES) {
      this.form.reset(this.DEFAULT_VALUES);
    }
  }
}
