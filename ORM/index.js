const FS = require('./ForceService.js');

module.exports = {
    getQuestions : (gameID, callBack) => {
        var query = "Select id, Question_1__c, a__c, b__c, c__c, d__c, hint__c from Question__c";

        FS.Query(query, function(err, data) {
            if (err) {
                console.info('error while getting questions from SFDC');
                return callBack(err, null);
            }
            callBack(null, data.records);
        });
    },
    checkAnswer : (id, answered, callBack) => {
        var query = "Select a__c, b__c, c__c, d__c, correct_answer__c from Question__c where id = \'" + id + "\'";

        FS.Query(query, function(err, data) {
            if (err) {
                return callBack(err, null);
            }

            let resp = {
                answeredCorrect: false,
                correctOption : data.records[0].Correct_Answer__c
            };

            if (data.records[0][data.records[0].Correct_Answer__c + '__c'] === answered) {
                resp.answeredCorrect = true;
            }

            callBack(null, resp);
        });
    }
};