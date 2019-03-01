import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { GameHttp } from '../models/http-models/game-http.interface';

@Injectable()
export class GameService {
  gameUrl = `${environment.apiUrl}game`;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };

  constructor(private _http: HttpClient) { }

  getGame(): Observable<GameHttp> {
    return this._http.get<GameHttp>(this.gameUrl);
  }

  addGame(game): Observable<GameHttp> {
    return this._http.post<GameHttp>(this.gameUrl, game.game, this.httpOptions);
  }
  
}
