import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import {MessageModel, MessageToRoomModel} from "../models/message.model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  constructor(private socket: Socket) { }

  public connectToRoom(roomCode: string): void {
    this.socket.emit('join', roomCode);
  }

  public leaveRoom(roomCode: string) {
    this.socket.emit('leave', roomCode)
  }

  public joinedRoom(): Observable<string> {
    return this.socket.fromEvent('joined');
  }

  public sendMessage(message: MessageToRoomModel) {
    this.socket.emit('sendMsgToRoom', message);
  }

  public receiveMessage(): Observable<MessageModel> {
    return this.socket.fromEvent('receiveMsgToRoom');
  }

  public leftRoom(): Observable<MessageModel> {
    return this.socket.fromEvent('left');
  }
}
