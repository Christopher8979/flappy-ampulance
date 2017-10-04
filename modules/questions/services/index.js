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
    getQuestions: (gameID) => {
        let questions = {};
        console.log(gameID);
        return questions;
    }
};