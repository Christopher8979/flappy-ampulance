const FS = require('./ForceService.js');
const ASYNC = require('async');
const GAMEID = process.env.GAMEID;

module.exports = {
    getWinner: (obj, callBack) => {
        obj.clauses.Game_ID__c = process.env.GAMEID;

        var query = "Select " + obj.details.join(", ") + " From " + obj.name + " where ";

        Object.keys(obj.clauses).forEach((val, ind) => {
            query = query + " " + val + " = \'" + obj.clauses[val] + "\' and ";
        });

        query = query + "Attempt_Completed__c = true ORDER BY Final_Score__c Desc limit 1 offset 0";

        FS.Query(query, function (err, findResp) {

            if (err) {
                return callBack(err, null);
            }

            if (!findResp.records.length) {
                return callBack(null, {
                    Player__r: {
                        Name: "--",
                        Email__c: "--"
                    },
                    Final_Score__c: "--",
                    Service_Line__c: "--"
                });
            }

            const highScore = findResp.records[0].Final_Score__c;

            query = "Select " + obj.winnerDetails.join(", ") + " From " + obj.name + " where Game_ID__c = \'" + process.env.GAMEID + "\' and Attempt_Completed__c=true and Final_Score__c=" + highScore + " ORDER BY Hidden_Multiplier__c Desc limit 1 offset 0";

            FS.Query(query, function (err, scorrerResp) {

                if (err) {
                    return callBack(err, null);
                }

                console.log(scorrerResp);

                callBack(null, {
                    Player__r: {
                        Name: scorrerResp.records[0].Player_Attempts_Game__r.LSHC_Players__r.Player_Name__c,
                        Email__c: scorrerResp.records[0].Player_Attempts_Game__r.LSHC_Players__r.Email__c
                    },
                    Final_Score__c: scorrerResp.records[0].Final_Score__c,
                    Service_Line__c: scorrerResp.records[0].Player_Attempts_Game__r.LSHC_Players__r.Service_Line__c
                });
            });
        });
    },
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
    checkForCompleteRecords: (object, data, callBack) => {
        var query = "Select id from " + object + " where ";

        Object.keys(data).forEach((key, index) => {
            query += key + " = \'" + data[key] + "\' AND ";
        });

        query = query.substring(0, query.length - " AND ".length);

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
    fetchData: (id, obj, callBack) => {
        var query = "Select id From " + obj.name + " where LSHC_Game__c = \'" + process.env.GAME_SFDC_ID + "\' AND LSHC_Players__c = \'" + id + "\'";

        FS.Query(query, function (err, findResp) {

            if (err) {
                return callBack(err, null);
            }

            callBack(null, findResp.records[0].Id);
        });
    },
    fetchTopPlayers: (playerCount, offset, objDetails, callBack) => {

        return callBack(null, {
            Player__r: {
                Name: "Ashwin P Chandran",
                Email__c: "ashchandran@deloitte.com"
            },
            Final_Score__c: "2314",
            Service_Line__c: "DD"
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

        obj.clauses.Player_ID__c = id;
        obj.clauses.Game_ID__c = process.env.GAMEID;

        let getUncheckedRecordsQuery = "Select " + obj.getThese.join(", ");

        getUncheckedRecordsQuery = getUncheckedRecordsQuery + " From " + obj.objName + " where ";

        Object.keys(obj.clauses).forEach((val, ind) => {
            getUncheckedRecordsQuery = getUncheckedRecordsQuery + " " + val + " = \'" + obj.clauses[val] + "\' and ";
        });

        getUncheckedRecordsQuery = getUncheckedRecordsQuery + "Attempt_Completed__c = false";

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

                callBack(null, null);
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

        query = query + " Player_ID__c = \'" + id + "\' and Game_ID__c =\'" + process.env.GAMEID + "\' ORDER BY CreatedDate DESC NULLS LAST limit " + noOfAttempts + " OFFSET " + obj.offset;

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
    },
    fetchBestScore: (id, obj, callBack) => {
        var query = "Select " + obj.details.join(", ") + " from " + obj.object + " where Player_ID__c = \'" + id + "\' AND Game_ID__c = \'" + process.env.GAMEID + "\' AND Attempt_Completed__c=TRUE ORDER BY Final_Score__c DESC limit 1";

        FS.Query(query, function (err, data) {
            if (err) {
                console.info('error while getting questions from SFDC');
                return callBack(err, null);
            }

            return callBack(null, data.records[0]);
        });
    }
};