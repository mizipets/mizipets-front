import { RaceModel } from './race.model';

export interface SpecieModel {
    id: number;
    name: string;
    category: string;
    races?: RaceModel[];
}
