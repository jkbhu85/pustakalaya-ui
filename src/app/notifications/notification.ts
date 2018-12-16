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
     * This variable holds a key corressponding to an i18n text message.
     */
    key?: string;

    /**
     * Data to replace placeholders if any, in the message pointed to by the key.
     */
    data?: any;

    /**
     * This variable holds the type part of a
     * notification.
     * 
     * {@link NotiTypes}
     */
    type: NotiType;
}
