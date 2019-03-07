import uuid from 'uuid/v4';

export default class Device {

  static states = {
    TO_IDENFITY: 'TO_IDENFITY',
    IDENTIFIED: 'IDENTIFIED',
  };

  id;
  data;
  state;

  constructor(data, state) {
    this.id = uuid();
    this.data = data;
    this.state = state;
  }
}