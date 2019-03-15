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
  player;

  constructor({config, state, index}) {
    this.config = config;
    this.state = state;
    this.index = index;
  }
}
