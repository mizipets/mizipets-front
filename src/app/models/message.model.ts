import { RoomModel } from './room.model';

export enum MessageType {
    text = 'text',
    init = 'init',
    give = 'give',
    accepted = 'accepted',
    refused = 'refused',
    close = 'close'
}

export interface MessageToRoomModel {
    roomCode: string;
    roomId: number;
    userId: number;
    msg: string;
    type: MessageType;
}

export interface SeenMessageModel {
    roomId?: number;
    userIds: number[];
    messageIds: number[];
}

export interface MessageModel {
    id: number;
    text: string;
    created: Date;
    writer: number;
    type: MessageType;
    room: RoomModel;
    seen: number[];
}
