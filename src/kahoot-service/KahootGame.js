const KahootSession = require("./KahootSession");

module.exports = class KahootGame {
    kahootSessions = [];
    kahootSessionsPromise;

    constructor(gamePin, players) {
        this.kahootSessions = players.map(p => new KahootSession(gamePin, p.name));
        this.kahootSessionsPromise = Promise.all(this.kahootSessions.map(ks => ks.joinPromise));
    }
};
