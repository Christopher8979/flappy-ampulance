/**
 * Controller to interact with other modules or UI for qnything related to scoring.
 */
const service = require('../services');
const config = require('../config.json');


module.exports = {
    getLeaderBoard : (offset, callBack) => {
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
    getHighScorrer : () => {},
    createAttempt : () => {},
    updateAttempt : () => {},
    getLatestAttempts : () => {},
    createPlayer : (info, callBack) => {
        const OBJ_DETAILS = {
            name : config.objectID,
            identifier: config.playerIdentifier
        };
        // Check if player is present and then create if present
        service.checkPlayer(info, OBJ_DETAILS, (err, playerID) => {
            if (err) {
                console.log('Error while creating player');
                console.log(err);
                return callBack(err, null);
            }

            // Gets the ID of player created
            callBack(null, playerID)
        });
    }
}