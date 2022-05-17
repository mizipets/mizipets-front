import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import {MessageModel} from "../models/message.model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  constructor(private socket: Socket) { }

  public connectToRoom(room: string): void {
    this.socket.emit('join', room);
  }

  public getHistoryMessage(): Observable<Array<MessageModel>> {
    return this.socket.fromEvent('message');
  }

  public sendMessage(message: MessageModel) {
    this.socket.emit('sendMsgToRoom', message);
  }

  public receiveMessage(): Observable<MessageModel> {
    return this.socket.fromEvent('receiveMsgToRoom');
  }
}
