import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { PlayerHttp } from '../models/http-models/player-http.interface';

@Injectable()
export class PlayerService {
  playersUrl = `${environment.apiUrl}players`;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };

  constructor(private _http: HttpClient) { }

  getPlayers(): Observable<PlayerHttp> {
    return this._http.get<PlayerHttp>(this.playersUrl);
  }

  addPlayer(action): Observable<PlayerHttp> {
    console.log(action)
    return this._http.post<PlayerHttp>(this.playersUrl, action.player, this.httpOptions);
  }

  deletePlayer(action): Observable<PlayerHttp> {
    console.log(action);
    return this._http.delete<PlayerHttp>(this.playersUrl + '/' + action.playerId + '/');
  }
}
