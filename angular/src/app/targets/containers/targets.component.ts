import {Component, OnDestroy, OnInit} from '@angular/core';
import { MDBModalRef } from 'angular-bootstrap-md';
import { Target } from '../models/target.model';
import { AppState } from '../../reducers/index';
import { Store, select } from '@ngrx/store';
import * as fromTargets from './../store/targets.actions';
import {Observable, Subscription} from 'rxjs';
import { getTargets, getAllLoaded } from '../store/targets.selectors';
import { map } from 'rxjs/operators';
import {TargetsService} from '../services/targets.service';
import {IN_COMPUTER_CONNECTED, IN_COMPUTER_GET_STATE} from '../models/target-outbound-message.model';

@Component({
  selector: 'app-targets',
  templateUrl: './targets.component.html',
  styleUrls: ['./targets.component.scss']
})
export class TargetsComponent implements OnInit, OnDestroy {
  targets$: Observable<Target[] | null>;
  isLoading$: Observable<boolean>;
  modalRef: MDBModalRef;

  private targetSubscriptions: {index: number, subscription: Subscription}[] = [];

  modalConfig = {
    class: 'modal-dialog-centered'
  };

  constructor(private store: Store<AppState>, private targetsService: TargetsService) { }

  ngOnInit() {
    this.isLoading$ = this.store.select(getAllLoaded);
    this.targets$ = this.store.pipe(
      select(getTargets),
      map((targets: Target[]) => {
        if (!targets || targets.length === 0) {
          this.store.dispatch(new fromTargets.TargetsRefresh());
        }
        this.updateSubscriptions(targets);
        return targets;
      })
    );
  }

  private updateSubscriptions(targets: Target[]) {
    if (!targets) {
      this.targetSubscriptions.forEach(s => s.subscription.unsubscribe());
      this.targetSubscriptions = [];
      return;
    }
    for (let t of targets) {
      let sub = this.targetSubscriptions.find(s => s.index === t.index);
      if (!sub && t.claimed) {
        let subscription = this.targetsService.readInboundMessages(t).subscribe(tim => {
          this.store.dispatch(new fromTargets.TargetInboundMessageReceived({targetIndex: t.index, message: tim}));
        });
        this.targetSubscriptions.push({index: t.index, subscription: subscription});
      } else if (sub && !t.claimed) {
        sub.subscription.unsubscribe();
        this.targetSubscriptions.splice(this.targetSubscriptions.indexOf(sub), 1);
      }
    }
  }

  claimTarget(target: Target) {
    this.store.dispatch(new fromTargets.TargetClaim({ target }));
  }

  unclaimTarget(target: Target) {
    this.store.dispatch(new fromTargets.TargetUnclaim({ target }));
  }

  connectTarget(target: Target) {
    this.store.dispatch(new fromTargets.TargetSendMessage({message: {code: IN_COMPUTER_CONNECTED}, target }));
  }

  getState(target: Target) {
    this.store.dispatch(new fromTargets.TargetSendMessage({message: {code: IN_COMPUTER_GET_STATE}, target }));
  }

  ngOnDestroy() {

  }
}
