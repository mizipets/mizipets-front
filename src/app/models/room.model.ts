import {AnimalModel} from "./animal.model";
import {Shelter} from "./user.model";
import {MessageModel} from "./message.model";

export interface AdopterModel {
  id: number;
  firstname: string;
  photo: string;
  shelter: Shelter;
}

export interface RoomModel {
  id: number;
  adoptant: AdopterModel;
  animal: AnimalModel;
  messages?: MessageModel[];
  code: string;
  created: string;
  closed: boolean;
  requestGive: boolean;
}
