export default class Player {

    targetPosition;
    name;
    lastHit;
    kahootSession;

    constructor({name, targetPosition}) {
        this.name = name;
        this.targetPosition = targetPosition;
        this.lastHit = -1;
    }
}
