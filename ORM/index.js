const FS = require('./ForceService.js');
const ASYNC = require('async');
const GAMEID = process.env.GAMEID;

module.exports = {
    getMetadata: function (object, callBack) {
        FS.Describe(object, function (err, metadata) {
            if (err) {
                console.log(err);
                return callBack(err, null);
            }

            callBack(null, metadata);
        });
    },
    getQuestions: (gameID, callBack) => {

        var query = "SELECT id, a__c, b__c, c__c, d__c, Hint__c, Question__c FROM LSHC_Question__c WHERE LSHC_Game__r.Name = \'" + GAMEID + "\'";

        FS.Query(query, function (err, data) {
            if (err) {
                console.info('error while getting questions from SFDC');
                return callBack(err, null);
            }
            callBack(null, data.records);
        });
    },
    checkAnswer: (id, answered, callBack) => {

        var query = "SELECT a__c, b__c, c__c, d__c, Correct_Answer_c__c FROM LSHC_Question__c WHERE LSHC_Game__r.Name = \'" + GAMEID + "\' and id = \'" + id + "\'";

        FS.Query(query, function (err, data) {
            if (err) {
                return callBack(err, null);
            }

            let resp = {
                answeredCorrect: false,
                correctOption: data.records[0].Correct_Answer_c__c
            };

            if (data.records[0][data.records[0].Correct_Answer_c__c + '__c'] === answered) {
                resp.answeredCorrect = true;
            }

            callBack(null, resp);
        });
    },
    checkRecords: (object, key, value, callBack) => {
        var query = "Select id from " + object + " where " + key + " = \'" + value + "\'";
        FS.Query(query, function (err, findResp) {

            if (err) {
                return callBack(err, null);
            }

            if (findResp.totalSize) {
                callBack(null, true, findResp.records[0].Id);
            } else {
                callBack(null, false);
            }
        });
    },
    createRecord: (object, data, callBack) => {
        FS.create(object, data, function (err, createResp) {
            if (err) {
                callBack(err, null);
            } else {
                callBack(null, createResp.id);
            }
        });
    },
    fetchTopPlayers: (playerCount, offset, objDetails, callBack) => {

        return callBack(null, {
            Player__r: {
                Name: "Ashwin P Chandran",
                Email__c: "ashchandran@deloitte.com"
            },
            Final_Score__c: "2314"
        });

        var query = "SELECT * FROM " + objDetails.name + " where " + objDetails.flag + " = " + objDetails.value + " AND ORDER BY CreatedDate DESC limit " + playerCount + " OFFSET " + offset;


        FS.Query(query, function (err, data) {
            if (err) {
                return callBack(err, null);
            }

            return callBack(null, data.records);
        });
    },
    completeIncompleteAttempts: (id, obj, callBack) => {

        let getUncheckedRecordsQuery = "Select " + obj.details.join(", ");

        getUncheckedRecordsQuery = getUncheckedRecordsQuery + " From " + obj.objName + " where ";

        Object.keys(obj.clauses).forEach((val, ind) => {
            getUncheckedRecordsQuery = getUncheckedRecordsQuery + " " + val + " = " + obj.clauses[val] + " and ";
        });

        getUncheckedRecordsQuery = getUncheckedRecordsQuery + obj.playerAPI + " = " + obj.value;

        FS.Query(getUncheckedRecordsQuery, function (err, resp) {
            if (err) {
                return callBack(err, null);
            }

            let upsertValue = {};
            upsertValue[obj.key] = true;

            ASYNC.each(resp.records, function (item, cb) {
                FS.upsert(obj.objName, upsertValue, item.Id, function (err, resp) {
                    if (err) {
                        return cb(err, null);
                    }
                    cb(null, resp);
                });
            }, function (err) {
                if (err) {
                    return callBack(err, null);
                }

                let newAttemptDefaultData = {};

                obj.defaltsForNewRecord.forEach((detail, index) => {
                    newAttemptDefaultData[detail.key] = detail.value;
                });

                FS.create(obj.objName, newAttemptDefaultData, function (err, resp) {
                    if (err) {
                        console.info('Error wile saving attempt data in SFDC');
                        console.info(err);
                        callBack(err, null);
                    }

                    callBack(null, resp);
                });
            });
        });
    },
    updateRecord: (id, data, objName, callBack) => {
        FS.upsert(objName, data, id, function (err, resp) {
            if (err) {
                return callBack(err, null);
            }
            callBack(null, resp);
        });
    },
    getAttempts: (id, obj, noOfAttempts, callBack) => {
        let query = "Select " + obj.details.join(", ");

        query = query + " From " + obj.from + " where ";

        Object.keys(obj.clauses).forEach((val, ind) => {
            query = query + " " + val + " = " + obj.clauses[val] + " and ";
        });

        query = query + " Player_ID__c = \'" + id + "\' and Game_ID__c =\'" + GAMEID + "\' ORDER BY CreatedDate DESC NULLS LAST limit " + noOfAttempts + " OFFSET " + obj.offset;

        FS.Query(query, function (err, data) {
            if (err) {
                return callBack(err, null);
            }
            return callBack(null, data.records);
        });
    },
    fetchRecordByID: (id, obj, callBack) => {
        var query = "Select " + obj.details.join(", ") + " from " + obj.object + " where id = \'" + id + "\'";

        FS.Query(query, function (err, data) {
            if (err) {
                console.info('error while getting questions from SFDC');
                return callBack(err, null);
            }

            return callBack(null, data.records);
        });
    }
};