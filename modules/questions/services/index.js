const async = require('async');
const UTILS = require('../../../utils.js');

const jumbleOptions = (questions) => {

    async.each(questions, (ques, callBack) => {
        ques.options = UTILS.shuffleArray(ques.options);
    }, (err) => {
        if (err) {
            console.log('Error in shuffling options');
            console.log(err);
        }
    });

    return questions;
};

module.exports = {
    getQuestions: (callBack) => {
        // get the game ID and get related questions only
        const gameID = process.env.GAMEID;
        let questions = {};
        // Call Force service here and get questions
        console.log(gameID);
        callBack(null, questions);
    }
};