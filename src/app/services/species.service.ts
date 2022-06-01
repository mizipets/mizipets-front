import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { SpecieModel } from '../models/specie.model';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class SpeciesService {
    constructor(private http: HttpClient, private authService: AuthService) {}

    getSpecies(): Observable<SpecieModel[]> {
        return this.http.get<SpecieModel[]>(
            environment.baseUrl +
                'species'
        );
    }

    getSpecieById(id: number): Observable<SpecieModel> {
        return this.http.get<SpecieModel>(
            environment.baseUrl +
                'species/' +
                id
        );
    }
}
