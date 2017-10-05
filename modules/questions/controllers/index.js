/**
 * Controller to interact with other modules or UI for qnything related to questions.
 */
const service = require('../services');


module.exports = {
    getQuestions: (gameID, callBack) => {
        service.getQuestions(gameID, callBack);
    },
    checkAnswer: () => {

    }
}