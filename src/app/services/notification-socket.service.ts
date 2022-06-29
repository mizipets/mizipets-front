import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { NotificationSocket } from '../app.module';
import { UserNotificationModel } from '../models/user-notification.model';

@Injectable({
    providedIn: 'root'
})
export class NotificationSocketService {

    public notifications: BehaviorSubject<number> = new BehaviorSubject(0)

    constructor(private socket: NotificationSocket) {}

    public receiveNotification(): Observable<UserNotificationModel> {
        return this.socket.fromEvent('notification');
    }
    public connected(): Observable<string> {
        return this.socket.fromEvent('connected');
    }

    public setId(id: number): void {
        this.socket.emit('setId', id);
    }

    public clearId(): void {
        this.socket.emit('clearId');
    }

    public connect(): void {
        this.socket.connect()
    }
}
