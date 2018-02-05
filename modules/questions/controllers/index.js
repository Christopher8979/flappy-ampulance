/**
 * Controller to interact with other modules or UI for qnything related to questions.
 */
const service = require('../services');
const config = require('../config.json');


Questions = {
    getQuestions: (callBack) => {
        service.getQuestions(config.randomizeQuestions, config.randomizeOptions, callBack);
    },
    checkAnswer: (id, answer, callBack) => {
        // Save data in SFDC.
        service.checkAnswer(id, answer, config.showAnswer, callBack);
    },
    getLimitedQuestions: (number, callBack) => {
        
        service.getLimitedQuestions(number, config.randomizeQuestions, config.randomizeOptions, callBack);        
    }
};

module.exports = Questions;