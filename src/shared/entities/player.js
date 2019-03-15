export default class Player {

    targetPosition;
    name;
    lastHit;

    constructor({name, targetPosition}) {
        this.name = name;
        this.targetPosition = targetPosition;
        this.lastHit = -1;
    }
}
