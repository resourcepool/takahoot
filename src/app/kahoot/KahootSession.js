const Kahoot = require("kahoot.js");

//dummy "hacks" kahoot client script challenge
global.angular = {};
global.angular.isObject = () => false;
global.angular.isString = () => false;
global.angular.isArray = () => false;
global.angular.isDate = () => false;

//inputs
// const sessionId = 547567;
// const singleAnswer = [
//     {
//         name: "player1",
//         answer: 0
//     },
//     {
//         name: "player2",
//         answer: 2
//     },
//     {
//         name: "player3",
//         answer: 1
//     }
// ];

module.exports = class KahootSession {
    constructor(id, name) {
        if (!id || !name) {
            throw new Error('Kahoot session id and player name are required !');
        }

        this.id = id;
        this.name = name;
        this.question = null;
        this.kahoot = new Kahoot();
        this.kahoot.join(id, name);

        this.kahoot.on("quizStart", this.onQuizStart);

        this.kahoot.on("question", this.onQuestion);

        this.kahoot.on("questionStart", this.onQuestionStart);

        this.kahoot.on("questionSubmit", this.onQuestionSubmit);

        this.kahoot.on("questionEnd", e => console.debug("questionEnd"));

        this.kahoot.on("finishText", e => console.debug("finishText"));

        this.kahoot.on("quizEnd", () => console.debug("quizEnd"));
    }

    onQuizStart(quiz) {
        console.log(`[session ${this.id} - player ${this.name}] Quiz ${quiz.name} has started`);
    }

    onQuestion(question) {
        console.log(`[session ${this.id} - player ${this.name}] Received new question`);
    }

    onQuestionStart(question) {
        console.log(`[session ${this.id} - player ${this.name}] Question started`);
        this.question = question;
    }

    answerQuestion(answer) {
        console.log(`[session ${this.id} - player ${this.name}] Answering question with ${answer}`);
        if (!this.question) throw `[session ${this.id} - player ${this.name}] Answering before question display on, answer dismissed`;
        this.question.answer(answer);
    }

    onQuestionSubmit(event) {
        console.log(`[session ${this.id} - player ${this.name}] Submitted the answer, Kahoot says, ${event.message}`);
    }
};

// singleAnswer.map(({name, answer}) => {
//     let takahootSession = new KahootSession(sessionId, name);
//     takahootSession.answerQuestion(answer);
// });
//
// console.log(`Answering kahoot ${sessionId} with players:`, singleAnswer);


