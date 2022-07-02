import { UserNotificationType } from './enums/user-notification.enum';

export interface UserNotificationModel {
    type: UserNotificationType;
    title: string;
    body: string;
    icon: string;
}
