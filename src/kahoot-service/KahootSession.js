const Kahoot = require("./kahoot.js/index.js");

//dummy "hacks" kahoot client script challenge
global.angular = {};
global.angular.isObject = () => false;
global.angular.isString = () => false;
global.angular.isArray = () => false;
global.angular.isDate = () => false;

module.exports = class KahootSession {
    joinPromise;

    constructor(id, name) {
        console.log(`[session ${id} - player ${name}] Creating KahootSession`);
        if (!id || !name) {
            throw new Error('Kahoot session id and player name are required !');
        }

        this.id = id;
        this.name = name;
        this.question = null;
        this.kahoot = new Kahoot();
        this.joinPromise = this.kahoot.join(id, name);

        this.kahoot.on("quizStart", this.onQuizStart);
        this.kahoot.on("question", this.onQuestion);
        this.kahoot.on("questionStart", (question) => {
            this.onQuestionStart(question);
        });
        this.kahoot.on("questionSubmit", this.onQuestionSubmit);

        this.kahoot.on("questionEnd", e => console.debug("questionEnd"));
        this.kahoot.on("finishText", e => console.debug("finishText"));
        this.kahoot.on("quizEnd", () => console.debug("quizEnd"));
    }

    onQuizStart(quiz) {
        console.log(`[player ${this.name}] Quiz ${quiz.name} has started`);
    }

    onQuestion(question) {
        console.log(`[player ${this.name}] Received new question`);
    }

    onQuestionStart(question) {
        console.log(`[player ${this.name}] Question started`);
        this.question = question;
        //TODO: Should RESET target
    }

    answerQuestion(answer) {
        console.log(`[player ${this.name}] Answering question with ${answer}`);
        if (!this.question) throw `[player ${this.name}] Answering before question display, answer dismissed`;
        setTimeout(() => {
            this.question.answer(answer);
        }, 100);
    }

    onQuestionSubmit(event) {
        console.log(`[player ${this.name}] Submitted the answer, Kahoot says, ${event.message}`);
    }
};
