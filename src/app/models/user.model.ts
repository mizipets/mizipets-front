export interface Address {
    street: string;
    apartment?: string;
    zip: number;
    city: string;
    country: string;
}

export interface Preferences {
    lang: string;
    darkMode: boolean;
    notifications: boolean;
    update: boolean;
}

export interface Shelter {
    name: string;
}

export enum Roles {
    ADMIN = 'ADMIN',
    PRO = 'PRO'
}

export interface UserModel {
    id: number;
    email: string;
    password: string;
    firstname: string;
    lastname: string;
    photo: string;
    address: Address;
    preferences: Preferences;
    shelter: Shelter;
    role: Roles;
    createDate: Date;
    // closeDate: Date;
    // animals: Animal[];
    // favorites: Favorites[];
    // rooms: Room[];
}
