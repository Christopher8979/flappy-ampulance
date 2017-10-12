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

            questions.getLimitedQuestions(pipesPassed, (e, d) => {
                
                socket.emit('fetchedQuestions', d);
            });

        });
    });
};