import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MsgKey } from '../consts';
import { NotificationModule } from './notifications.module';

@Injectable()
export class BlockUiService {
  constructor() {}
  private msgKeySubject = new BehaviorSubject<string>('');

  getBlockStatus(): Observable<string> {
    return this.msgKeySubject;
  }

  showBlocker() {
    this.msgKeySubject.next(MsgKey.LOADING);
  }

  hideBlocker() {
    this.msgKeySubject.next('');
  }

  showBlockerWithMessage(msgKey: string) {
    if (!msgKey) this.showBlocker();
    else this.msgKeySubject.next(msgKey);
  }
}
