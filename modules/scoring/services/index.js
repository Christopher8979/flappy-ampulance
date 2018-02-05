const async = require('async');
const UTILS = require('../../../utils.js');
const ORM = require('../../../ORM');

let thisService = {
    getWinner: (objDetails, callBack) => {
        ORM.getWinner(objDetails, callBack);
    },
    fetchTopScorrers: (noOfPlayers, offset, obj, callBack) => {
        ORM.fetchTopPlayers(noOfPlayers, offset, obj, callBack);
    },
    checkPlayerLink: (id, objDetails, callBack) => {
        ORM.checkRecords(objDetails.name, objDetails.key, id, (err, resp, id) => {
            if (err) {
                console.log("Error while checking for game splayed for a player");
                return callBack(err, null);
            }

            if (resp) {
                callBack(null, true, id);
            } else {
                callBack(null, false);
            }

        });
    },
    createAttempt: (id, data, objDetails, callBack) => {
        // before creating a new attempt check the isComplete flag.
        ORM.completeIncompleteAttempts(id, objDetails, (err, resp) => {
            if (err) {
                console.log("Error which completing incomplete attempts");
                console.log(err);
                return callBack(err, null);
            }

            ORM.fetchData(id, { name: objDetails.junctionName }, (err, fetchResponse) => {
                if (err) {
                    console.log("Error while fetching junction id");
                    console.log(err);
                    return callBack(err, null);
                }

                let newAttemptDefaultData = {};

                objDetails.defaltsForNewRecord.forEach((detail, index) => {
                    newAttemptDefaultData[detail.key] = detail.value;
                });

                newAttemptDefaultData.Player_Attempts_Game__c = fetchResponse;

                ORM.createRecord(objDetails.objName, newAttemptDefaultData, callBack);
            });
        });
    },
    saveAttempt: (id, data, objName, callBack) => {
        ORM.updateRecord(id, data, objName, callBack);
    },
    fetchAttempts: (id, obj, noOfAttempts, callBack) => {
        ORM.getAttempts(id, obj, noOfAttempts, callBack);
    },
    checkPlayer: (data, objDetails, callBack) => {
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
    checkJunction: (data, objDetails, callBack) => {
        ORM.checkForCompleteRecords(objDetails.name, data, (err, isPresent, ID) => {
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
    createPlayer: (objName, data, callBack) => {
        ORM.createRecord(objName, data, (err, createResp) => {
            if (err) {
                callBack(err, null);
            } else {
                callBack(null, createResp);
            }
        });
    },
    getPlayerDetails: (id, obj, callBack) => {
        ORM.fetchRecordByID(id, obj, callBack);
    },
    getPersonalBest: (id, obj, callBack) => {
        ORM.fetchBestScore(id, obj, callBack);
    }
};

module.exports = thisService;