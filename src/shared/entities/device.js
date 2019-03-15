export default class Device {

  static states = {
    INITIALIZED: 'INITIALIZED',
    CONNECTED: 'CONNECTED',
    PAIRED: 'PAIRED',
    CALIBRATED: 'CALIBRATED',
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