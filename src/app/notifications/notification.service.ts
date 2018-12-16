import { Injectable } from '@angular/core';
import { BlockUiService } from './block-ui.service';
import { NotiType } from './noti-type.enum';
import { Notification } from './notification';
import { TIME_DELAY_DISPLAY_LOAD_SCREEN } from '../consts';

/**
 * This class provides a service to show notifications
 * to user in a unified manner.
 *
 * All components of the application has access to this
 * service via injection.
 *
 * @see {@link NotificationGroupComponent}
 */

@Injectable()
export class NotificationService {
  private notifications: Notification[] = [];

  constructor(private blockUiService: BlockUiService) {}

  private notifyMsg(message: string, type: NotiType) {
    this.notifications.push({ message: message, type: type });
  }

  private notify(key: string, type: NotiType, data?: any) {
    this.notifications.push({ key: key, type: type, data: data });
  }

  getAllNotifications(): Notification[] {
    return this.notifications;
  }

  removeNotification(notification: Notification) {
    for (let i = 0; i < this.notifications.length; ++i) {
      if (this.notifications[i] === notification) {
        this.notifications.splice(i, 1);
        break;
      }
    }
  }

  /**
   * Displays UI blocker with default loading message.
   */
  showUiBlocker() {
    this.blockUiService.showBlocker();
  }

  /**
   * Displays UI blocker with loading message obtained using the specified message key.
   * @param msgKey the specified key for the loading message text
   */
  showUiBlockerWithMessage(msgKey: string) {
    this.blockUiService.showBlockerWithMessage(msgKey);
  }

  hideUiBlocker() {
    this.blockUiService.hideBlocker();
  }

  /**
   * To provide user some information.
   *
   * @param message message to be shown
   */
  infoMsg(message: string) {
    this.notifyMsg(message, NotiType.INFO);
  }

  info(key: string, data?: any) {
    this.notify(key, NotiType.INFO, data);
  }

  /**
   * To notify user that the action he made
   * was successful.
   *
   * @param message message to be shown
   */
  successMsg(message: string) {
    this.notifyMsg(message, NotiType.SUCCESS);
  }

  success(key: string, data?: any) {
    this.notify(key, NotiType.SUCCESS, data);
  }

  /**
   * To notify user about a situation that
   * may give an unwanted result.
   *
   * @param message message to be shown
   */
  warnMsg(message: string) {
    this.notifyMsg(message, NotiType.WARN);
  }

  warn(key: string, data?: any) {
    this.notify(key, NotiType.WARN, data);
  }

  /**
   * To notify user about an errornous situation.
   *
   * @param message  message to be shown
   */
  dangerMsg(message: string) {
    this.notifyMsg(message, NotiType.DANGER);
  }

  danger(key: string, data?: any) {
    this.notify(key, NotiType.DANGER, data);
  }
}
