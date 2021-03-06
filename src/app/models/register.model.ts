import { Address, Preferences, Shelter } from './user.model';

export interface RegisterModel {
    email: string;
    password: string;
    firstname: string;
    lastname: string;
    photo: string;
    address: Address;
    preferences: Preferences;
    shelter: Shelter;
}
