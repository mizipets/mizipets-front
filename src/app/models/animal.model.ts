import { UserModel } from './user.model';

export interface SpeciesModel {
    id: number;
    name: string;
    category: string;
}

export interface RaceModel {
    id: number;
    name: string;
    species: SpeciesModel;
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
    sex: string;
    owner: UserModel;
    race: RaceModel;
}
