import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from "@angular/common/http";
import { AuthService } from './auth.service';
import { AnimalModel, CreateAdoption } from '../models/animal.model';

@Injectable({
    providedIn: 'root'
})
export class AnimalsService {
    constructor(private http: HttpClient,
                private authService: AuthService) {}

    getUserAnimals(): Observable<AnimalModel[]> {
      const params = new HttpParams()
        .set('ownerId', this.authService.decodedToken!.id,)
        .set('fetchLastOwner', true);

        return this.http.get<AnimalModel[]>(
            `${environment.baseUrl}animals`, {params}
        );
    }

    getAnimalById(id: number): Observable<AnimalModel> {
      return this.http.get<AnimalModel>(`${environment.baseUrl}animals/${id}`
      );
    }

    createAdoption(animalData: CreateAdoption): Observable<any> {
        return this.http.post<any>(
            environment.baseUrl + 'animals/adoption',
            animalData
        );
    }

    updateAdoption(id: number, animalData: CreateAdoption): Observable<AnimalModel> {
        return this.http.put<AnimalModel>(
            environment.baseUrl + 'animals/' + id,
            animalData
        );
    }

    deleteAdoption(animalID: number): Observable<any> {
        return this.http.delete<any>(
            environment.baseUrl +
            'animals/' +
            animalID
        )
    }
}
