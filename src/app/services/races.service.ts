import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { RaceModel } from '../models/race.model';

@Injectable({
    providedIn: 'root'
})
export class RacesService {
    constructor(private http: HttpClient) {}

    getRaces(): Observable<RaceModel[]> {
        return this.http.get<RaceModel[]>(environment.baseUrl + 'races');
    }
}
