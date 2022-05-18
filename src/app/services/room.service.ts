import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  constructor(private http: HttpClient,
              private authService: AuthService) {}

  getUserRooms(): Observable<any> {
    return this.http.get<any>(
      environment.baseUrl +
      'room?userId=' +
      this.authService.decodedToken!.id
    );
  }

  getRoomById(roomId: number, animalId: number): Observable<any> {
    return this.http.get<any>(
    environment.baseUrl + `room/${roomId}/${animalId}/orCreate`
    );
  }
}
