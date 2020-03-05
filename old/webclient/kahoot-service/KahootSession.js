//const {quizEnd} = require("./actions");

import Kahoot from "./kahootjs/index.js";

//dummy "hacks" kahoot client script challenge
window.angular = {};
window.angular.isObject = () => false;
window.angular.isString = () => false;
window.angular.isArray = () => false;
window.angular.isDate = () => false;

export default class KahootSession {
    joinPromise;

    constructor(id, name, targetPosition) {
        console.log(`[session ${id} - player ${name} (index: ${targetPosition})] Creating KahootSession`);
        if (!id || !name) {
            throw new Error('Kahoot session id and player name are required !');
        }

        this.id = id;
        this.name = name;
        this.targetPosition = targetPosition;
        this.question = null;
        this.kahoot = new Kahoot();
        this.joinPromise = this.kahoot.join(id, name);

        this.kahoot.on("quizStart", q => this.onQuizStart(q));
        this.kahoot.on("question", q => this.onQuestion(q));
        this.kahoot.on("questionStart", q => this.onQuestionStart(q));
        this.kahoot.on("questionSubmit", e => this.onQuestionSubmit(e));

        this.kahoot.on("questionEnd", e => console.debug("questionEnd"));
        this.kahoot.on("finishText", e => console.debug("finishText"));
        this.kahoot.on("quizEnd", () => this.onQuizEnd());
    }

    onQuizStart(quiz) {
        console.log(`[player ${this.name}] Quiz ${quiz.name} has started`);
    }

    onQuestion(question) {
        console.log(`[player ${this.name}] Received new question:`);
        console.log(question);
    }

    onQuestionStart(question) {
        console.log(`[player ${this.name}] Question started`);
        this.question = question;
        //TODO: game reset
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

    onQuizEnd() {
        console.log(`[player ${this.name}] Quiz end`);
        //TODO: dispatch quiz end
    }
};
