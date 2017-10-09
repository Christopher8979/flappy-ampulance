const async = require('async');
const UTILS = require('../../../utils.js');
const ORM = require('../../../ORM');

let thisService = {
    fetchScores : (id, attempts, callBack) => {},
    fetchTopScorrers : (noOfPlayers, callBack) => {},
    createAttempt : () => {},
    saveAttempt : () => {},
    checkPlayer : (data, objDetails, callBack) => {
        ORM.checkRecords(objDetails.name, objDetails.identifier, data.Email__c, (err, isPresent, ID) => {
            if (err) {
                return callBack(err, null);
            }
            if (isPresent) {
                callBack(null, ID)
            } else {
                thisService.createPlayer(objDetails.name, data, callBack);
            }
        });
    },
    createPlayer : (objName, data, callBack) => {
        ORM.createRecord(objName, data, (err, createResp) => {
            if (err) {
                callBack(err, null);
            } else {
                callBack(null, createResp.id);
            }
        });
    }
};

module.exports = thisService;