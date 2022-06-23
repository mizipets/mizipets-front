import { Component, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { NotificationSocketService } from './services/notification-socket.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    isMobileDevice: boolean = false;

        
    constructor(private deviceService: DeviceDetectorService, 
        private notificationSocket: NotificationSocketService) {}

    ngOnInit(): void {
        this.isMobileDevice =
            this.deviceService.isMobile() || this.deviceService.isTablet();
    }
}
