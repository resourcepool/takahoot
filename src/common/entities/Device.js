import uuid from 'uuid/v4';

export default class Device {

  static states = {
    INITIALIZED: 'INITIALIZED',
    CONNECTED: 'CONNECTED',
    PAIRED: 'PAIRED',
  };

  data;
  state;

  constructor(data, state) {
    this.data = data;
    this.state = state;
  }
}