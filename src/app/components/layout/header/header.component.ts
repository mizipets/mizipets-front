import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { NotificationSocketService } from '../../../services/notification-socket.service';

@Component({
    selector: 'header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    
    newNotificationsCount: number = 0;

    constructor(public authService: AuthService, private notificationSocket: NotificationSocketService) {}

    ngOnInit(): void {
        this.notificationSocket.notifications.subscribe(newNotificationsCount => this.newNotificationsCount = newNotificationsCount)
    }
}
