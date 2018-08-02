import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { UserService } from '../user.service';
import { HttpErrorResponse } from '../../../../node_modules/@angular/common/http';

@Component({
  selector: 'app-complete-registration',
  templateUrl: './complete-registration.component.html'
})
export class CompleteRegistrationComponent implements OnInit {
  registrationInfo: RegistrationInfo = null;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit() {
    this.getUserInfo();
  }

  getUserInfo() {
    const id = this.route.snapshot.paramMap.get('id');
    this.userService
      .getRegistrationInfo(id)
      .subscribe(
        (info) => this.handleSuccess(info),
        (error) => this.handleError(error)
      );
  }

  private handleSuccess(info: RegistrationInfo) {}

  private handleError(errResponse: HttpErrorResponse) {

  }

}
