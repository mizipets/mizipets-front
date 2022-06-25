import { UserNotificationType } from "./user-notification.enum";

export interface UserNotification {
    type: UserNotificationType;
    title: string;
    body: string;
    icon: string;
}