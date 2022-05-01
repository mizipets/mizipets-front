import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class AnimalsService {
    constructor(private http: HttpClient) {}

    getUserAnimals(): Observable<any> {
      // /adoption?getMine=true
        return this.http.get<any>(
            environment.baseUrl + 'animals'
        );
    }
}
