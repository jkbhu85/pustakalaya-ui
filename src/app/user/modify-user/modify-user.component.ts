import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { PtkResponse } from '../../models/ptk-response';
import { AbstractFormComponent } from '../../util/abstract-form-component';
import { MsgKey } from '../../consts';

@Component({
  templateUrl: './modify-user.component.html',
  styles: []
})
export class ModifyUserComponent extends AbstractFormComponent implements OnInit {
  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit() {
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
  protected handleFailure(errResponse: HttpErrorResponse): void {
    throw new Error('Method not implemented.');
  }
  protected handleSuccess(ptkResponse: PtkResponse): void {
    throw new Error('Method not implemented.');
  }
  protected handleComplete(): void {
    throw new Error('Method not implemented.');
  }
  public resetForm(): void {
    throw new Error('Method not implemented.');
  }
}
