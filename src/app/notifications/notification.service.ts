import { environment } from '../../environments/environment';
import { NotiType } from './noti-type.enum';
import { Notification } from './notification';
import { Injectable } from '@angular/core';
import { NotificationGroupComponent } from './notification-group/notification-group.component';

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

  constructor(
  ) { }

  private notify(message: string, type: NotiType) {
    this.notifications.push({ message: message, type: type });
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
  info(message: string) {
    this.notify(message, NotiType.INFO);
  }

  /**
   * To notify user that the action he made
   * was successful.
   * 
   * @param message message to be shown
   */
  success(message: string) {
    this.notify(message, NotiType.SUCCESS);
  }

  /**
   * To notify user about a situation that
   * may give an unwanted result.
   * 
   * @param message message to be shown
   */
  warn(message: string) {
    this.notify(message, NotiType.WARN);
  }

  /**
   * To notify user about an errornous situation.
   * 
   * @param message  message to be shown
   */
  danger(message: string) {
    this.notify(message, NotiType.DANGER);
  }
}
