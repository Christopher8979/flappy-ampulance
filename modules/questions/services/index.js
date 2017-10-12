const async = require('async');
const UTILS = require('../../../utils.js');
const ORM = require('../../../ORM');

const jumbleOptions = (questions) => {
    let placHolder = '';
    let options = ['a__c', 'b__c', 'c__c', 'd__c'];
    let jumbledOptions = UTILS.shuffleArray(JSON.parse(JSON.stringify(options)));
    let tempOptions = [];

    async.each(questions, (ques, callBack) => {
        tempOptions = [];
        jumbledOptions.forEach((key, index) => {
            tempOptions.push(ques[key]);
        });

        options.forEach((key, index) => {
            ques[key] = tempOptions[index];
        });


        callBack(null);
    }, (err) => {
        if (err) {
            console.log('Error in shuffling options');
            console.log(err);
        }
    });

    return questions;

};

module.exports = {
    getQuestions: (randomizeQuestions, randomizeOptions, callBack) => {
        // get the game ID and get related questions only
        const gameID = process.env.GAMEID;
        // Call Force service here and get questions
        ORM.getQuestions(gameID, (err, questions) => {
            if (err) {
                return callBack(err, null);
            }

            questions = randomizeQuestions ? UTILS.shuffleArray(JSON.parse(JSON.stringify(questions))) : questions;

            callBack(null, randomizeOptions ? jumbleOptions(questions) : questions);
        });

    },
    getLimitedQuestions: (number, randomizeQuestions, randomizeOptions, callBack) => {
        // get the game ID and get related questions only
        const gameID = process.env.GAMEID;
        // Call Force service here and get questions
        ORM.getQuestions(gameID, (err, questions) => {
            if (err) {
                return callBack(err, null);
            }

            questions = randomizeQuestions ? UTILS.shuffleArray(JSON.parse(JSON.stringify(questions))) : questions;
            
            questions = UTILS.limitTo(number, questions);
            
            callBack(null, randomizeOptions ? jumbleOptions(questions) : questions);
        });
    },        
    checkAnswer: (id, answered, showAns, callBack) => {

        ORM.checkAnswer(id, answered, (err, response) => {
            if (err) {
                return callBack(err, null);
            }

            if (!showAns) {
                delete resp.correctOption;
            }
            
            callBack(null, resp);
        });
    }
};