import {RoomModel} from "./room.model";

export enum MessageType {
  text = 'text',
  init = 'init',
  give = 'give',
  accepted = 'accepted',
  refused = 'refused',
  close = 'close'
}


export interface MessageModel {
  id: string;
  text: string;
  created: Date;
  writer: number;
  type: MessageType;
  room: RoomModel;
}
