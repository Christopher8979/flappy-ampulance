/**
 * Controller to interact with other modules or UI for qnything related to questions.
 */
const service = require('../services');
const config = require('../config.json');


module.exports = {
    getQuestions: (callBack) => {
        service.getQuestions(config.randomizeQuestions, config.randomizeOptions, callBack);
    },
    checkAnswer: () => {

    }
}