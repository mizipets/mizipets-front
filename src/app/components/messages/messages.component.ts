import {
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild
} from '@angular/core';
import { RoomService } from '../../services/room.service';
import { RoomModel } from '../../models/room.model';
import { RoomSocketService } from '../../services/room-socket.service';
import {
    MessageModel,
    MessageToRoomModel,
    MessageType
} from '../../models/message.model';
import { AuthService } from '../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { AnimalsDetailComponent } from '../animals/animals-detail/animals-detail.component';
import { NotificationSocketService } from '../../services/notification-socket.service';

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
        private RoomSocketService: RoomSocketService,
        private authService: AuthService,
        private animalDetailDialog: MatDialog,
        private notificationSocket: NotificationSocketService,
        elementRef: ElementRef,
    ) {
        this.scrollFrame = elementRef;
        this.currentUserId = this.authService.decodedToken?.id ?? 0;
    }

    ngOnInit(): void {
        this.RoomSocketService.joinedRoom().subscribe(() => {
            this.scrollToBottom();
        });

        this.notificationSocket.notifications.next(0);

        this.RoomSocketService.receiveMessage().subscribe(
            (message: MessageModel) => {
                if (MessagesComponent.isInfoMessage(message.type))
                    this.connectionToRoom(this.currentRoom!);
                this.seenMessages(
                    [message.id],
                    this.authService.decodeToken(
                        this.authService.getToken() ?? ''
                    ).id
                ).then();
                this.currentRoom?.messages?.push(message);
                this.scrollToBottom();
            }
        );

        this.RoomSocketService.receiveSeenMessages().subscribe(
            (messages: MessageModel[]) => {
                if (this.currentRoom) {
                    this.currentRoom.messages =
                        this.currentRoom?.messages?.map((oldMsg) => {
                            const newMsg = messages.find(
                                (newMsg) => newMsg.id === oldMsg.id
                            );
                            if (newMsg != null) {
                                const merged = oldMsg.seen.concat(newMsg.seen);
                                oldMsg.seen = merged.filter(
                                    (i, pos) => merged.indexOf(i) === pos
                                );
                            }
                            return oldMsg;
                        }) ?? [];
                }
            }
        );

        this.roomService.getUserRooms().subscribe({
            next: (rooms: RoomModel[]) => {
                this.rooms = rooms;
            },
            error: (err) => {
                console.error(err);
            }
        });
    }

    async seenMessages(messageIds: number[], userId: number) {
        if (userId != null) {
            this.RoomSocketService.seenMessage({
                messageIds: messageIds,
                userIds: [userId],
                roomId: this.currentRoom?.id,
                who: 'web'
            });
        }
    }

    getMessageSubtitle(message: MessageModel) {
        return `${this.getCreatedString(message)}`;
    }

    isMsgSeenBy(message: MessageModel, userId?: number): boolean {
        if (!userId) return false;
        return message.seen.includes(userId);
    }

    getCreatedString(message: MessageModel): string {
        const startOfDay = new Date();
        startOfDay.setUTCHours(0);
        startOfDay.setHours(0);

        message.created = new Date(message.created);

        if (message.created.getTime() < startOfDay.getTime()) {
            return `${message.created.getDate()}/${
                message.created.getMonth() + 1
            }/${message.created.getFullYear()} ${message.created
                .getHours()
                .toString()
                .padStart(2, '0')}:${message.created
                .getMinutes()
                .toString()
                .padStart(2, '0')}`;
        } else {
            return `${message.created
                .getHours()
                .toString()
                .padStart(2, '0')}:${message.created
                .getMinutes()
                .toString()
                .padStart(2, '0')}`;
        }
    }

    getOther() {
        const id = this.authService.decodeToken(
            this.authService.getToken() ?? ''
        ).id;
        if (id == null) return null;
        if (id == this.currentRoom?.adoptant.id)
            return this.currentRoom?.animal.owner;
        if (id == this.currentRoom?.animal.lastOwner)
            return this.currentRoom?.animal.owner;
        if (id == this.currentRoom?.animal.owner?.id)
            return this.currentRoom?.adoptant;
        return null;
    }

    ngOnDestroy(): void {
        if (this.currentRoom)
            this.RoomSocketService.leaveRoom(this.currentRoom.code);
    }

    onDetail(): void {
        this.animalDetailDialog.open(AnimalsDetailComponent, {
            data: { animalId: this.currentRoom?.animal.id.toString() }
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
            this.RoomSocketService.sendMessage(message);
            this.message = '';
            this.scrollToBottom();
        }
    }

    connectionToRoom(roomModel: RoomModel) {
        if (this.currentRoom)
            this.RoomSocketService.leaveRoom(this.currentRoom.code);

        this.roomService
            .getRoomById(roomModel.id, roomModel.animal.id)
            .subscribe({
                next: (room: RoomModel) => {
                    this.currentRoom = room;
                    this.RoomSocketService.connectToRoom(room.code);
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
        const offset: number = this.currentRoom?.messages?.length
            ? this.currentRoom?.messages?.length
            : 0;
        this.isLoading = true;
        await new Promise((f) => setTimeout(f, 1000));
        this.roomService
            .getOffsetMessages(this.currentRoom!.id, offset)
            .subscribe({
                next: (messages: MessageModel[]) => {
                    if (messages.length >= 1)
                        this.seenMessages(
                            messages.map((msg) => msg.id),
                            this.authService.decodeToken(
                                this.authService.getToken() ?? ''
                            ).id
                        );
                    messages
                        .reverse()
                        .forEach((message) =>
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

    private static isInfoMessage(type: MessageType): boolean {
        return (
            type === MessageType.init ||
            type === MessageType.accepted ||
            type === MessageType.refused ||
            type === MessageType.close ||
            type === MessageType.give
        );
    }
}
