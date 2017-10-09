/**
 * Controller to interact with other modules or UI for qnything related to scoring.
 */
const service = require('../services');
const config = require('../config.json');


module.exports = {
    getLeaderBoard : () => {
        const NO_OF_PLAYERS = config.playersLCount;


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