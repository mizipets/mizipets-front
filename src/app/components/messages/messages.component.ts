import {
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild
} from '@angular/core';
import { RoomService } from '../../services/room.service';
import { RoomModel } from '../../models/room.model';
import { SocketService } from '../../services/socket.service';
import {
    MessageModel,
    MessageToRoomModel,
    MessageType
} from '../../models/message.model';
import { AuthService } from '../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { AnimalsDetailComponent } from '../animals/animals-detail/animals-detail.component';

@Component({
    selector: 'app-messages',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit, OnDestroy {
    @ViewChild('scroll_frame', { static: false })
    private scrollFrame: ElementRef;
    isLoading: boolean = false;
    rooms: RoomModel[] = [];
    currentRoom: RoomModel | undefined;
    currentUserId: number;
    message: string = '';

    constructor(
        private roomService: RoomService,
        private socketService: SocketService,
        private authService: AuthService,
        private animalDetailDialog: MatDialog,
        elementRef: ElementRef,
    ) {
        this.scrollFrame = elementRef;
        this.currentUserId = this.authService.decodedToken?.id ?? 0;
    }

    ngOnInit(): void {
        this.socketService.joinedRoom().subscribe(() => {
            this.scrollToBottom();
        });

        this.socketService
            .receiveMessage()
            .subscribe((message: MessageModel) => {
                if (this.isInfoMessage(message.type))
                    this.connectionToRoom(this.currentRoom!);

                this.currentRoom?.messages?.push(message);
                this.scrollToBottom();
            });

        this.roomService.getUserRooms().subscribe({
            next: (rooms: RoomModel[]) => {
                this.rooms = rooms;
            },
            error: (err) => {
                console.error(err);
            }
        });
    }

    ngOnDestroy(): void {
        if (this.currentRoom)
            this.socketService.leaveRoom(this.currentRoom.code);
    }

    onDetail(): void {
        this.animalDetailDialog.open(AnimalsDetailComponent, {
            data: { animalId: this.currentRoom?.animal.id },
            height: '100vh',
            width: '100%'
        });
    }

    sendMessage(): void {
        if (this.currentRoom && this.message !== '') {
            const message: MessageToRoomModel = {
                roomCode: this.currentRoom.code,
                roomId: this.currentRoom.id,
                userId: this.currentUserId,
                msg: this.message,
                type: MessageType.text
            };
            this.socketService.sendMessage(message);
            this.message = '';
            this.scrollToBottom();
        }
    }

    connectionToRoom(roomModel: RoomModel) {
        if (this.currentRoom)
            this.socketService.leaveRoom(this.currentRoom.code);

        this.roomService
            .getRoomById(roomModel.id, roomModel.animal.id)
            .subscribe({
                next: (room: RoomModel) => {
                    this.currentRoom = room;
                    this.socketService.connectToRoom(room.code);
                },
                error: (err) => {
                    console.error(err);
                }
            });
    }

    giveAnimal(): void {
        if (this.currentRoom)
            this.roomService.giveAnimal(this.currentRoom.id).subscribe({
                error: (err) => {
                    console.error(err);
                }
            });
    }

    onKeydown() {
        this.sendMessage();
    }

    onScroll(event: any) {
        if (event.target.scrollTop === 0) {
            this.getOffsetMessages().then();
        }
    }

    getInterlocutor(room: RoomModel) {
        if (
            this.currentUserId == room.animal.owner.id ||
            this.currentUserId == room.animal.lastOwner
        )
            return room.adoptant;

        return room.animal.owner;
    }

    private scrollToBottom(): void {
        this.scrollFrame.nativeElement.scroll({
            top: this.scrollFrame.nativeElement.scrollHeight,
            left: 0,
            behavior: 'smooth'
        });
    }

    private async getOffsetMessages(): Promise<void> {
        const offset: number =
          this.currentRoom?.messages?.length ? (this.currentRoom?.messages?.length + 1) : 0;
        this.isLoading = true;
        await new Promise((f) => setTimeout(f, 1000));
        this.roomService
            .getOffsetMessages(
                this.currentRoom!.id,
                offset
            )
            .subscribe({
                next: (messages: MessageModel[]) => {
                    if (messages.length >= 1)
                        messages
                            .reverse()
                            .map((message) =>
                                this.currentRoom?.messages?.unshift(message)
                            );
                    this.isLoading = false;
                },
                error: (err) => {
                    console.error(err);
                    this.isLoading = false;
                }
            });
    }

    private isInfoMessage(type: MessageType): boolean {
        return (
            type === MessageType.init ||
            type === MessageType.accepted ||
            type === MessageType.refused ||
            type === MessageType.close ||
            type === MessageType.give
        );
    }
}
