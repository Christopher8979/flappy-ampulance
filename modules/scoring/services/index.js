const async = require('async');
const UTILS = require('../../../utils.js');
const ORM = require('../../../ORM');

let thisService = {
    fetchTopScorrers : (noOfPlayers, offset, obj, callBack) => {
        ORM.fetchTopPlayers(noOfPlayers, offset, obj, callBack);
    },
    createAttempt : (id, data, objDetails, callBack) => {
        // before creating a new attempt check the isComplete flag.
        objDetails.value = data.Player__c;
        ORM.completeIncompleteAttempts(id, objDetails, () => {

        });
    },
    saveAttempt : (id, data, objName, callBack) => {
        ORM.updateRecord(id, data, objName, callBack);
    },
    fetchAttempts : (id, obj, noOfAttempts, callBack) => {
        ORM.getAttempts(id, obj, noOfAttempts, callBack);
    },
    checkPlayer : (data, objDetails, callBack) => {
        ORM.checkRecords(objDetails.name, objDetails.identifier, data.Email__c, (err, isPresent, ID) => {
            if (err) {
                return callBack(err, null);
            }
            if (isPresent) {
                callBack(null, isPresent, ID);
            } else {
                callBack(null, isPresent);
            }
        });
    },
    createPlayer : (objName, data, callBack) => {
        ORM.createRecord(objName, data, (err, createResp) => {
            if (err) {
                callBack(err, null);
            } else {
                callBack(null, createResp);
            }
        });
    },
    getPlayerDetails : (id, obj, callBack) => {
        ORM.fetchRecordByID(id, obj, callBack);
    }
};

module.exports = thisService;