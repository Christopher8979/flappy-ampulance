/**
 * Controller to interact with other modules or UI for qnything related to questions.
 */
const service = require('../services');
const config = require('../config.json');

const questions = require('../../questions/controllers');

const decodeData = (text) => {
    return text;
};

module.exports = (io) => {
    io.on('connection', (socket) => {

        socket.on('crash', (data) => {
            // Data has to be processed before using it further
            id = decodeData(data.id);
            attemptID = decodeData(data.attemptID);
            pipesPassed = decodeData(data.pipesPassed);

            // get pipespassed from session and check with the value that is sent
            // If session pipe count and pipe count sent from front end is same then user has not cheated

            // If condition is to be written here
            questions.getLimitedQuestions(pipesPassed, (e, questions) => {
                
                socket.emit('fetchedQuestions', questions);
            });

        });

        socket.on('start', () => {
            // Check if this use has a session already existing
            // If yes, clear that session and then create new session
            // Sample/Default session - session[id] = {time: <<timestamp>>, pipespassed: 0}
        });

        socket.on('cross', (currentStatus) => {
            // currentStatus should contain Id of player and pipe score
            // Id - to get proper session from redis
            // pipe score - no purpose for now as we as anyways storing in redis
            // Increment pipe value in session

        });


    });
};