import { UserNotificationType } from "./user-notification.enum";
import { UserModel } from "./user.model";

export interface UserNotification {
    id: number;
    type: UserNotificationType;
    title: string;
    body: string;
    icon: string;
    created: Date;
    user: UserModel;
}