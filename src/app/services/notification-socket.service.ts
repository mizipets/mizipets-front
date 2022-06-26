import { Injectable } from '@angular/core';
import { MessageModel } from '../models/message.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { NotificationSocket } from '../app.module';
import { UserNotification } from '../models/user-notification';

@Injectable({
    providedIn: 'root'
})
export class NotificationSocketService {

    public notifications: BehaviorSubject<number> = new BehaviorSubject(0)

    constructor(private socket: NotificationSocket) {}

    public receiveNotification(): Observable<UserNotification> {
        return this.socket.fromEvent('notification');
    }
    public connected(): Observable<String> {
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
