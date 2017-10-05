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
    }
};