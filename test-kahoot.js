const KahootSession = require("./src/kahoot-service/KahootSession");

const kahootSession = new KahootSession("7907205", "Alex", 1);

kahootSession.joinPromise.then(() => {
    console.info("Kahoot session joined !");
});
