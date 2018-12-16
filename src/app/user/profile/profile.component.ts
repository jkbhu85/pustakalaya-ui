import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../app-security/auth.service';
import { MsgKey } from '../../consts';
import { AuthInfo, User, getGenderFullName } from '../../models/user';
import { NotificationService } from '../../notifications/notification.service';
import { DatePatternType, DateSeparator, toString, dateParser } from '../../util/date-util';
import { UserService } from '../user.service';

@Component({
  templateUrl: './profile.component.html'
})
export class UserProfileComponent implements OnInit {
  user: User;
  private authInfo: AuthInfo;

  constructor(
    private notiService: NotificationService,
    private userService: UserService,
    private authService: AuthService
  ) {
    this.authService
      .getUserInfo()
      .subscribe(
        (data) => this.authInfo = data
      );
  }

  ngOnInit() {
    this.loadUserInfo();
  }

  private loadUserInfo() {
    this.notiService.showUiBlocker();

    this.userService
      .getUserInfo(this.authInfo.email)
      .pipe(
        finalize(() => this.notiService.hideUiBlocker())
      )
      .subscribe(
        (data: User) => this.onDataReceived(data),
        () => this.notiService.danger(MsgKey.ERROR_OCCURRED)
      );
  }

  onDataReceived(data: User) {
    data.gender = getGenderFullName(data.gender);
    this.user = data;
  }

  dateOfBirth() {
    if (this.user && this.user.dateOfBirth) {
      const dob = dateParser(this.user.dateOfBirth, DatePatternType.YYYYMMDD, DateSeparator.HYPHEN);
      return toString(dob, DatePatternType.DDMMYYYY, DateSeparator.HYPHEN);
    }

    return '';
  }

  acCreatedOn() {
    if (this.user && this.user.createdOn) {
      const createdOn = dateParser(this.user.createdOn.split('T')[0], DatePatternType.YYYYMMDD, DateSeparator.HYPHEN);
      return toString(createdOn, DatePatternType.DDMMYYYY, DateSeparator.HYPHEN);
    }

    return '';
  }
}
