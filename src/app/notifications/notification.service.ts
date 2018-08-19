import { NotiType } from './noti-type.enum';
import { Notification } from './notification';
import { Injectable } from '@angular/core';

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

  constructor() {}

  private notifyMsg(message: string, type: NotiType) {
    this.notifications.push({ message: message, type: type });
  }

  private notify(key: string, type: NotiType) {
    this.notifications.push({ key: key, type: type });
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
   * To provide user some information.
   *
   * @param message message to be shown
   */
  infoMsg(message: string) {
    this.notifyMsg(message, NotiType.INFO);
  }

  info(key: string) {
    this.notify(key, NotiType.INFO);
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

  success(key: string) {
    this.notify(key, NotiType.SUCCESS);
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

  warn(key: string) {
    this.notify(key, NotiType.WARN);
  }

  /**
   * To notify user about an errornous situation.
   *
   * @param message  message to be shown
   */
  dangerMsg(message: string) {
    this.notifyMsg(message, NotiType.DANGER);
  }

  danger(key: string) {
    this.notify(key, NotiType.DANGER);
  }
}
