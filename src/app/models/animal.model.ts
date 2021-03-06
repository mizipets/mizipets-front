import { UserModel } from './user.model';

export interface SpecieModel {
    id: number;
    name: string;
    category: string;
}

export interface RaceModel {
    id: number;
    name: string;
    specie: SpecieModel;
}

export interface AnimalModel {
    id: number;
    name: string;
    comment: string;
    birthDate: Date;
    createDate: Date;
    images: string[];
    isAdoption: boolean;
    isLost: boolean;
    sex: Sex;
    owner: UserModel;
    lastOwner?: number;
    race: RaceModel;
}

export interface CreateAdoption {
    name: string;
    comment: string;
    birthDate: Date;
    sex: string;
    raceId: number;
    images?: string[];
}

export enum Sex {
    male = 'male',
    female = 'female',
    unknown = 'unknown'
}
