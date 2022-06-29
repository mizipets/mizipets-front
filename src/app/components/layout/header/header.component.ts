import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { NotificationSocketService } from '../../../services/notification-socket.service';
import { DeviceDetectorService } from "ngx-device-detector";

@Component({
    selector: 'header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    isMobileDevice: boolean = false;
    newNotificationsCount: number = 0;

    constructor(
        public authService: AuthService,
        private deviceService: DeviceDetectorService,
        private notificationSocket: NotificationSocketService) {}

    ngOnInit(): void {
        this.notificationSocket.notifications.subscribe(newNotificationsCount =>
          this.newNotificationsCount = newNotificationsCount);
        this.isMobileDevice = this.deviceService.isMobile() || this.deviceService.isTablet();
    }
}
