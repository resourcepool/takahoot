export default class Device {

  static states = {
    INITIALIZED: 'INITIALIZED',
    CONNECTED: 'CONNECTED',
    PAIRED: 'PAIRED',
    CALIBRATED: 'CALIBRATED',
    HIT: 'HIT'
  };

  config;
  state;
  index;
  targetPosition;

  constructor({config, state, index, targetPosition}) {
    this.config = config;
    this.state = state;
    this.index = index;
    this.targetPosition = targetPosition;
  }
}
