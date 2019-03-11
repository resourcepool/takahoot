export default class Device {

  static states = {
    INITIALIZED: 'INITIALIZED',
    CONNECTED: 'CONNECTED',
    PAIRED: 'PAIRED',
    CALIBRATED: 'CALIBRATED',
  };

  data;
  state;
  index;

  constructor(data, state, index) {
    this.data = data;
    this.state = state;
    this.index = index;
  }
}