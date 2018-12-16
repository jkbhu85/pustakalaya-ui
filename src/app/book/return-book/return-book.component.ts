import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MsgKey } from '../../consts';
import { PtkResponse } from '../../models/ptk-response';
import { AbstractFormComponent } from '../../util/abstract-form-component';

@Component({
  selector: 'app-return-book',
  templateUrl: './return-book.component.html'
})
export class ReturnBookComponent extends AbstractFormComponent implements OnInit {
  constructor(
    private fb: FormBuilder
  ) {
    super();
  }

  ngOnInit(): void {
    this.form = this.fb.group([]);
    this.showInFormError(MsgKey.NOT_AVAILABLE, false);
  }

  protected changeFormSubmissionStatus(status: boolean) {
    throw new Error('Method not implemented.');
  }

  protected createForm() {
    throw new Error('Method not implemented.');
  }

  protected prepareData(): { [key: string]: string } {
    throw new Error('Method not implemented.');
  }

  public submit(): void {
    throw new Error('Method not implemented.');
  }

  protected handleSuccess(ptkResponse?: PtkResponse): void {
    throw new Error('Method not implemented.');
  }

  protected handleFailure(errResponse: HttpErrorResponse): void {

  }

  protected handleComplete(): void {
    throw new Error('Method not implemented.');
  }

  public resetForm(): void {
    throw new Error('Method not implemented.');
  }
}
