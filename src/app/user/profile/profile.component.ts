import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../app-security/auth.service';
import { MsgKey } from '../../consts';
import { AuthInfo } from '../../models/user';
import { NotificationService } from '../../notifications/notification.service';
import { DatePatternType, DateSeparator, toString, dateParser } from '../../util/date-util';
import { UserService } from '../user.service';

@Component({
  templateUrl: './profile.component.html'
})
export class UserProfileComponent implements OnInit {
  user: {
    email?: string;
    firstName?: string;
    lastName?: string;
    gender?: string;
    imagePath?: string;
    isdCode?: string;
    mobile?: string;
    bookQuota?: number;
    dateOfBirth?: string;
    createdOn?: string;
    locale?: string;
  };
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
        (data) => this.onDataReceived(data),
        () => this.notiService.danger(MsgKey.ERROR_OCCURRED)
      );
  }

  onDataReceived(data) {
    data.gender = this.findGenderFullName(data.gender);
    this.user = data;
  }

  private findGenderFullName(abbr: string) {
    if (!abbr) return null;

    abbr = abbr.toUpperCase();
    switch (abbr) {
      case 'M': return 'male';
      case 'F': return 'female';
      case 'O': return 'other';
      default: return null;
    }
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
