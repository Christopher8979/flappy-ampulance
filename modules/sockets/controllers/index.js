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

        // on connection, we add a key with unique ID created which will hold the number of pipes user has passed
        socket.score = 0;
        socket.correct = 0;

        socket.on('crash', (data) => {
            // Data has to be processed before using it further
            // TODO: if added signing, do it here

            // get pipespassed from session and check with the value that is sent
            // If session pipe count and pipe count sent from front end is same then user has not cheated
            if (data.pipesPassed !== socket.score) {
                return socket.emit('mismatch')
            }

            // If condition is to be written here
            questions.getLimitedQuestions(data.pipesPassed, (e, questions) => {
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

            socket.score++;

        });

        socket.on('disconnecting', (reason) => {
            // This method gets called when a socket is closed i.e., when browser is closed.
            // Check if the latest attempt is complete, else close the attempt
        });

        socket.on('checkAnswer', (data) => {
            // data has id and answer
            questions.checkAnswer(data.id, data.answer, (err, result) => {
                if (err) {
                    return socket.emit('error')
                }

                if (result.answeredCorrect) {
                    socket.correct++
                }

                socket.emit('answer', result)
            })
        })

        socket.on('quiz-done', (correct) => {
            if (correct !== socket.correct) {
                return socket.emit('mismatch')
            }

            // TODO: Create an attempt here

            socket.emit('game-over');
        })
    });
};