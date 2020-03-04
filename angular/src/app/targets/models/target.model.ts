import {Bumper} from './bumper.model';

export interface Target {
  index: number;
  name: string;
  claimed: boolean;
  device: USBDevice;
  state: Bumper[];
}
