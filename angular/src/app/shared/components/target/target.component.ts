import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Target } from '../../../targets/models/target.model';

@Component({
  selector: 'app-target',
  templateUrl: './target.component.html',
  styleUrls: ['./target.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TargetComponent implements OnInit {
  @Input() target: Target;
  @Output() claimClicked = new EventEmitter<Target>();
  @Output() unclaimClicked = new EventEmitter<Target>();
  @Output() refreshState = new EventEmitter<Target>();
  @Output() connectClicked = new EventEmitter<Target>();

  constructor() { }

  ngOnInit() {
  }

  onClaim() {
    this.claimClicked.emit(this.target);
  }

  onUnclaim() {
    this.unclaimClicked.emit(this.target);
  }

  onConnectClicked() {
    this.connectClicked.emit(this.target);
  }

  onRefreshState() {
    this.refreshState.emit(this.target);
  }

}
