import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { MessageModel, MessageToRoomModel } from '../models/message.model';
import { Observable } from 'rxjs';
import { NotificationSocket, RoomSocket } from '../app.module';

@Injectable({
    providedIn: 'root'
})
export class NotificationSocketService {
    constructor(private socket: NotificationSocket) {}

    public receiveMessage(): Observable<MessageModel> {
        return this.socket.fromEvent('receiveMsgToRoom');
    }
    public connected(): Observable<String> {
        return this.socket.fromEvent('connected');
    }

    public connect(): void {
        this.socket.connect()
    }
}
