/**
 * Controller to interact with other modules or UI for qnything related to scoring.
 */
const service = require('../services');
const config = require('../config.json');


thisController = {
    getLeaderBoard: (offset, callBack) => {
        const OBJ_DETAILS = {
            name: config.objectID,
            flag: config.attemptCompleteFlag,
            value: config.attemptCompleteValue
        };

        if (config.isLazyLoading) {
            const NO_OF_PLAYERS = config.playersPerSet;
        } else {
            const NO_OF_PLAYERS = config.playersLCount;
            offset = 0;
        }

        service.fetchTopScorrers(NO_OF_PLAYERS, offset, OBJ_DETAILS, callBack);
    },
    getHighScorrer: (callBack) => {
        const OBJ_DETAILS = {
            name: config.objectID,
            flag: config.attemptCompleteFlag
        };

        service.fetchTopScorrers(1, 0, OBJ_DETAILS, callBack);
    },
    getPersonalBest: (id, callBack) => {
        const OBJ_DETAILS = config.personalBest;

        service.getPersonalBest(id, OBJ_DETAILS, callBack);
    },
    checkCreatePlayerAttempt: (id, callBack) => {
        const OBJ_DETAILS = config.playerLinkCheck;
        let DEFAULT_ATTEMPT_DATA = config.defaultAttempt;

        service.getIncompleteAttempts(id, OBJ_DETAILS, (err, linkPresent, linkID) => {
            if (err) {
                console.log("error while checking for games played record");
                return callBack(err, null);
            }

            if (linkPresent) {
                DEFAULT_ATTEMPT_DATA["someKey"] = linkID;
                thisController.createAttempt(DEFAULT_ATTEMPT_DATA, callBack);
            } else {
                thisController.createPlayerLink(OBJ_DETAILS, (err, newLink) => {
                    if (err) {
                        console.log("error while creating games played object for this player");
                        return callBack(err, null);
                    }

                    DEFAULT_ATTEMPT_DATA["someKey"] = newLink;
                    thisController.createAttempt(DEFAULT_ATTEMPT_DATA, callBack);
                });
            }
        });
    },
    createAttempt: (id, data, callBack) => {
        const OBJ_DETAILS = config.isAttemptComplete;

        service.createAttempt(id, data, OBJ_DETAILS, callBack);
    },
    updateAttempt: (id, data, callBack) => {
        const OBJ_DETAILS = config.attemptsObjName;
        service.saveAttempt(id, data, OBJ_DETAILS, callBack);
    },
    getLatestAttempts: (id, callBack) => {
        const OBJ_DETAILS = config.lastAttemptDetails;
        service.fetchAttempts(id, OBJ_DETAILS, config.latestAttempts, callBack);
    },
    getLastAttempt: (id, callBack) => {
        const OBJ_DETAILS = config.lastAttemptDetails;
        service.fetchAttempts(id, OBJ_DETAILS, 1, callBack);
    },
    createPlayer: (info, callBack) => {
        const OBJ_DETAILS = {
            name: config.objectID,
            identifier: config.playerIdentifier
        };
        // Check if player is present and then create if present
        service.checkPlayer(info, OBJ_DETAILS, (err, playerPresent, playerID) => {
            if (err) {
                console.log('Error while creating player');
                console.log(err);
                return callBack(err, null);
            }

            if (playerPresent) {
                callBack(null, playerID);
            } else {
                service.createPlayer(OBJ_DETAILS.name, info, callBack);
            }
        });
    },
    createPlayerJunction: (info, callBack) => {
        const OBJ_DETAILS = {
            name: config.attemptsLink
        };

        // Check if junction is present and then create if present
        service.checkJunction(info, OBJ_DETAILS, (err, junctionPresent, junctionID) => {
            if (err) {
                console.log('Error while creating junction');
                console.log(err);
                return callBack(err, null);
            }

            if (junctionPresent) {
                callBack(null, junctionID);
            } else {
                service.createPlayer(OBJ_DETAILS.name, info, callBack);
            }
        });
    },
    getPlayerDetails: (id, callBack) => {
        const OBJ_DETAILS = config.details;
        service.getPlayerDetails(id, OBJ_DETAILS, callBack);
    }
};


module.exports = thisController;
