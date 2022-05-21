import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {RoomService} from "../../services/room.service";
import {RoomModel} from "../../models/room.model";
import {SocketService} from "../../services/socket.service";
import {MessageModel, MessageToRoomModel, MessageType} from "../../models/message.model";

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit, OnDestroy {
  rooms: RoomModel[] = [];
  currentRoom: RoomModel | undefined;
  isConnected: boolean = false;
  message: string = '';
  // @ts-ignore
  @ViewChild('bottom') private myScrollContainer: ElementRef;

  constructor(private roomService: RoomService,
              private socketService: SocketService) { }

  ngOnInit(): void {
    this.socketService.joinedRoom().subscribe((value: string) => {
        this.isConnected = !this.currentRoom?.closed;
    });

    this.socketService.receiveMessage().subscribe((message: MessageModel) => {
          this.currentRoom?.messages?.push(message);
    });

    this.roomService.getUserRooms().subscribe({
      next: (value: RoomModel[]) => {
          this.rooms = value;
      },
      error: err => {
          console.error(err);
      }
    })
  }

  ngOnDestroy(): void {
    if(this.currentRoom)
      this.socketService.leaveRoom(this.currentRoom.code);
  }

  sendMessage(): void {
    if(this.currentRoom) {
      const userId = this.currentRoom.animal.owner.id;

      const message: MessageToRoomModel = {
        roomCode: this.currentRoom.code,
        roomId: this.currentRoom.id,
        userId: userId ? userId.toString() : '',
        msg: this.message,
        type: MessageType.text
      }
      this.socketService.sendMessage(message);
      this.scrollToBottom();
    }
  }

  connectionToRoom(roomModel: RoomModel) {
      if(this.currentRoom)
          this.socketService.leaveRoom(this.currentRoom.code);

      this.roomService.getRoomById(roomModel.id, roomModel.animal.id).subscribe({
          next: (room: RoomModel) => {
            this.currentRoom = room;
            this.socketService.connectToRoom(room.code);
          },
          error: err => {
            console.error(err);
          }
      });
  }

  giveAnimal(): void {
    if(this.currentRoom)
      this.roomService.giveAnimal(this.currentRoom.id).subscribe({
        next: value => {
          console.log(value);
        },
        error: err => {
          console.error(err);
        }
      })
  }

  scrollToBottom(): void {
    this.myScrollContainer.nativeElement.scroll({
      top: this.myScrollContainer.nativeElement.scrollHeight,
      left: 0,
      behavior: 'smooth'
    });
  }
}
