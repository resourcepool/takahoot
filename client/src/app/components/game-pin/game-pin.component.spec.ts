import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GamePinComponent } from './game-pin.component';

describe('GamesComponent', () => {
  let component: GamePinComponent;
  let fixture: ComponentFixture<GamePinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GamePinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GamePinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
