const KahootSession = require("./KahootSession");

module.exports = class KahootGame {
    kahootSessions = [];

    constructor(gamePin, players) {
        players.forEach(p => {
            this.kahootSessions.push(new KahootSession(gamePin, p.name));
        });
        return Promise.all(this.kahootSessions);
    }
};
