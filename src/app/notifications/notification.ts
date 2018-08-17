import { NotiType } from './noti-type.enum';

/** 
 * This interface reprensents shape of a notification object.
*/
export interface Notification {
    /**
     * This variable holds the text part of a 
     * notification.
     */
    message?: string;

    /**
     * This variable holds a key corressponding to a i18n text message.
     */
    key?: string;

    /**
     * This variable holds the type part of a
     * notification.
     * 
     * {@link NotiTypes}
     */
    type: NotiType;
}
