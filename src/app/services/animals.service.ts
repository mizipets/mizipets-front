import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { AnimalModel, CreateAdoption } from '../models/animal.model';

@Injectable({
    providedIn: 'root'
})
export class AnimalsService {
    constructor(private http: HttpClient, private authService: AuthService) {}

    getUserAnimals(): Observable<AnimalModel[]> {
        return this.http.get<AnimalModel[]>(
            environment.baseUrl +
                'animals?ownerId=' +
                this.authService.decodedToken!.id
        );
    }

    createAdoption(animalData: CreateAdoption): Observable<any> {
        return this.http.post<any>(
            environment.baseUrl + 'animals/adoption',
            animalData
        );
    }
}
