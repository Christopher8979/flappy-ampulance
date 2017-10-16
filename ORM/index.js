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
        var query = "Select id, Question_1__c, a__c, b__c, c__c, d__c, hint__c from Question__c";

        FS.Query(query, function (err, data) {
            if (err) {
                console.info('error while getting questions from SFDC');
                return callBack(err, null);
            }
            callBack(null, data.records);
        });
    },
    checkAnswer: (id, answered, callBack) => {
        var query = "Select a__c, b__c, c__c, d__c, correct_answer__c from Question__c where id = \'" + id + "\'";

        FS.Query(query, function (err, data) {
            if (err) {
                return callBack(err, null);
            }

            let resp = {
                answeredCorrect: false,
                correctOption: data.records[0].Correct_Answer__c
            };

            if (data.records[0][data.records[0].Correct_Answer__c + '__c'] === answered) {
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
                Name: "",
                Email__c: ""
            },
            Final_Score__c: ""
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

        let getUncheckedRecordsQuery = "Select ";

        obj.getThese.forEach((val, ind) => {
            getUncheckedRecordsQuery = getUncheckedRecordsQuery + val + ", ";
        });

        getUncheckedRecordsQuery = getUncheckedRecordsQuery.substring(0, getUncheckedRecordsQuery.length - 2);

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
    getAttempts: (id, obj, callBack) => {
        let query = "Select ";

        obj.details.forEach((val, ind) => {
            query = query + val + ", ";
        });

        query = query.substring(0, query.length - 2);

        query = query + " From " + obj.from + " where ";

        Object.keys(obj.clauses).forEach((val, ind) => {
            query = query + " " + val + " = " + obj.clauses[val] + " and ";
        });
        
        query = query + " Player_ID__c = \'" + id + "\' and Game_ID__c =\'" + GAMEID + "\' ORDER BY CreatedDate DESC NULLS LAST limit " + obj.limit + " OFFSET " + obj.offset;

        FS.Query(query, function (err, data) {
            if (err) {
                return callBack(err, null);
            }
            return callBack(null, data.records);
        });
    }
};