import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { BrowserModule } from '@angular/platform-browser';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';

import { appReducers } from './store/reducers/app.reducers';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { ConfigEffects } from './store/effects/config.effects';
import { GameEffects } from "./store/effects/game.effects";
import { PlayerEffects } from './store/effects/player.effects';
import { AppComponent } from './app.component';
import { GameService } from './services/game.service';
import { PlayerService } from './services/player.service';
import { DashboardComponent as DashboardContainerComponent } from './containers/dashboard/dashboard.component';
import { PlayersComponent } from './components/players/players.component';
import { GamePinComponent } from "./components/game-pin/game-pin.component";

@NgModule({
  declarations: [
    AppComponent,
    DashboardContainerComponent,
    PlayersComponent,
    GamePinComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    StoreModule.forRoot(appReducers),
    EffectsModule.forRoot([GameEffects, PlayerEffects, ConfigEffects]),
    StoreRouterConnectingModule.forRoot({ stateKey: 'router' }),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    AppRoutingModule
  ],
  providers: [GameService, PlayerService],
  bootstrap: [AppComponent]
})
export class AppModule {}
