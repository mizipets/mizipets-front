import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeviceDetectorService } from 'ngx-device-detector';
import { UserNotificationType } from './models/user-notification.enum';
import { AuthService } from './services/auth.service';
import { NotificationSocketService } from './services/notification-socket.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    isMobileDevice: boolean = false;

        
    constructor(private deviceService: DeviceDetectorService, 
        private notificationSocket: NotificationSocketService,
        private authService: AuthService,
        private snackBar: MatSnackBar,

        ) {}

    ngOnInit(): void {
        if(this.authService.isLogged()) {
            this.notificationSocket.setId(this.authService.decodeToken(this.authService.getToken() ?? '').id)
        }
        
        this.notificationSocket.receiveNotification().subscribe(notification => {
            const snabckBarRef = this.snackBar.open(notification.title, 'Go to', {
                duration: 3000,
                verticalPosition: 'top',
                horizontalPosition: 'right',
            });
            snabckBarRef.onAction().subscribe(() => {
                switch(notification.type) {
                    case UserNotificationType.MESSAGE:
                        console.log('route to');
                        
                        break;
                }
            });
            snabckBarRef.dismiss();
        })

        this.isMobileDevice =
            this.deviceService.isMobile() || this.deviceService.isTablet();
    }
}
