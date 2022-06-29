import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserNotification } from './models/user-notification';
import { UserNotificationType } from './models/user-notification.enum';
import { AuthService } from './services/auth.service';
import { NotificationSocketService } from './services/notification-socket.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    constructor(
        private notificationSocket: NotificationSocketService,
        private authService: AuthService,
        private snackBar: MatSnackBar,
        private router: Router,
        ) {}

    ngOnInit(): void {
        if(this.authService.isLogged()) {
            this.notificationSocket.setId(this.authService.decodeToken(this.authService.getToken() ?? '').id)
        }

        this.notificationSocket.receiveNotification().subscribe((notification: UserNotification) => {
            if(this.router.url === '/messages') {
                this.notificationSocket.notifications.next(0)
            } else {
                this.notificationSocket.notifications.next(this.notificationSocket.notifications.getValue() + 1)
            }
            if (notification.type === UserNotificationType.MESSAGE) {
                const snackBarRef = this.snackBar.open(`Message from ${notification.title}: ${notification.body}`, 'Go to room', {
                    duration: 5000,
                    verticalPosition: 'top',
                    horizontalPosition: 'center',
                });
                snackBarRef.onAction().subscribe(() => {
                    this.router.navigate(['messages'])
                });
            }
        })
    }
}
