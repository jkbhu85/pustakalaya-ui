import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { AppTranslateService } from '../../services/app-translate.service';
import { HttpResponse, HttpClient, HttpHeaders } from '@angular/common/http';
import { BASE_HREF } from '../../consts';
import { AuthService } from '../../app-security/auth.service';
import { UserInfo } from '../../models/models';

const ADD_USER_URL = BASE_HREF + '/api/newUser';

@Component({
  templateUrl: './add-user.component.html',
  styles: []
})
export class AddUserComponent implements OnInit {

  addUserForm: FormGroup;
  submitted = false;
  showError = false;
  errorText$: Observable<any>;
  private formValueChangeSubscription: Subscription;
  private debug = true;
  private userInfo: UserInfo;
  private readonly defaultValues:any = {};

  readonly param = {
    'firstNameMaxLen': 30,
    'lastNameMaxLen': 30
  };

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private translate: AppTranslateService,
    private authService: AuthService
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
      'email': ['', [Validators.required, Validators.email]],
      'locale': ['', [Validators.required]]
    });

    // specify default values
    this.defaultValues.firstName = '';
    this.defaultValues.lastName = '';
    this.defaultValues.email = '';
    this.defaultValues.locale = localeValue;

    this.reset(); // reset form with default values
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
    l.localeStr = this.locale.value;

    return l;
  }

  onSubmit() {
    if (this.submitted) return;

    if (this.addUserForm.invalid) return;

    this.submitted = true;
    const data = this.prepareData();
    console.log("Submitting form with data: " + JSON.stringify(data));

    this.http
      .post(ADD_USER_URL, data, {observe: 'response', responseType: 'text'})
      .subscribe(
        (response: HttpResponse<string>) => this.handleResponse(response),
        (response: HttpResponse<string>) => this.handleResponse(response)
      );
  }


  private handleResponse(response: HttpResponse<string>) {
    this.submitted = false;
    
    switch (response.status) {
      case 200:
        console.log('User added successfully.');
        break;
      default:
        // some error occurred
        console.log('error occurred')
        this.showLoginError('common.errorOccurred');
    }
  }

  private showLoginError(msgKey: string) {
    this.showError = true;
    this.errorText$ = this.translate.get(msgKey);
    this.formValueChangeSubscription = this.addUserForm.valueChanges.subscribe(() => this.hideLoginError())
  }

  private hideLoginError() {
    this.showError = false;
    this.errorText$ = undefined;
    this.formValueChangeSubscription.unsubscribe();
  }

  reset() {
    this.addUserForm.reset(this.defaultValues);
  }

}
