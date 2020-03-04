import {Component, OnInit, Input, ChangeDetectionStrategy, Output, EventEmitter} from '@angular/core';
import { Target } from '../../../targets/models/target.model';

@Component({
  selector: 'app-targets-list',
  templateUrl: './targets-list.component.html',
  styleUrls: ['./targets-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TargetsListComponent implements OnInit {
  @Input() targets: Target[];
  @Output() onTargetClaim = new EventEmitter<Target>();
  @Output() onTargetUnclaim = new EventEmitter<Target>();
  @Output() onTargetConnect = new EventEmitter<Target>();
  @Output() onGetState = new EventEmitter<Target>();

  constructor() { }

  ngOnInit() {
  }

  trackByFunction(index: any) {
    return index;
  }

  onTargetClaimClicked(target: Target) {
    this.onTargetClaim.emit(target);
  }

  onTargetUnclaimClicked(target: Target) {
    this.onTargetUnclaim.emit(target);
  }

  onTargetConnectClicked(target: Target) {
    this.onTargetConnect.emit(target);
  }

  onRefreshState(target: Target) {
    this.onGetState.emit(target);
  }
}
