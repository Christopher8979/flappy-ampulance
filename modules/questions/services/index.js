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
    getQuestions: (callBack) => {
        // get the game ID and get related questions only
        const gameID = process.env.GAMEID;
        // Call Force service here and get questions
        ORM.getQuestions(gameID, (err, questions) => {
            if (err) {
                return callBack(err, null);
            }

            callBack(null, jumbleOptions(questions));
        });

    }
};