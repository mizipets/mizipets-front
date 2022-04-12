import { Address, Preferences, Shelter } from './user.model';

export class RegisterModel {
    email?: string;
    password?: string;
    firstname?: string;
    lastname?: string;
    address?: Address;
    preferences?: Preferences;
    shelter?: Shelter;
}
