import { Component, OnInit } from '@angular/core';
import {RoomService} from "../../services/room.service";
import {RoomModel} from "../../models/room.model";
import {SocketService} from "../../services/socket.service";

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
  rooms: RoomModel[] = [];

  constructor(private roomService: RoomService,
              private socketService: SocketService) { }

  ngOnInit(): void {
    // this.socketService.connection();

    this.roomService.getUserRooms().subscribe({
      next: (value: RoomModel[]) => {
          this.rooms = value;
          console.log(this.rooms);
      },
      error: err => {
          console.error(err);
      }
    })
  }

}
