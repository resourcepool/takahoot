import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { GameHttp } from '../models/http-models/game-http.interface';

@Injectable()
export class GameService {
  gamesUrl = `${environment.apiUrl}game`;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };

  constructor(private _http: HttpClient) { }

  addGame(game): Observable<GameHttp> {
    return this._http.post<GameHttp>(this.gamesUrl, game.payload, this.httpOptions);
  }
  
}
