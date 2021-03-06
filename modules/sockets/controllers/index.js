/**
 * Controller to interact with other modules or UI for qnything related to questions.
 */
const service = require('../services');
const config = require('../config.json');

const questions = require('../../questions/controllers');
const scoring = require('../../scoring/controllers');

const decodeData = (text) => {
    return text;
};

module.exports = (io) => {
    io.on('connection', (socket) => {

        // on connection, we add a key with unique ID created which will hold the number of pipes user has passed
        socket.score = 0;
        socket.correct = 0;
        socket.attempted = 0;

        socket.on('crash', (data) => {
            // Data has to be processed before using it further
            // TODO: if added signing, do it here

            // get pipespassed from session and check with the value that is sent
            // If session pipe count and pipe count sent from front end is same then user has not cheated
            if (data.pipesPassed !== socket.score) {
                return socket.emit('mismatch')
            }

            // If condition is to be written here
            questions.getLimitedQuestions(socket.score > process.env.MAX_QUESTIONS ? process.env.MAX_QUESTIONS : socket.score, (e, questions) => {
                socket.emit('fetchedQuestions', questions);
            });

        });

        socket.on('start', (attemptID) => {
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
            console.log('Game ended', reason);
        });

        socket.on('checkAnswer', (data) => {

            socket.attemptID = data.attempt;

            // data has id and answer
            questions.checkAnswer(data.id, data.answer, (err, result) => {
                if (err) {
                    return socket.emit('error')
                }

                if (result.answeredCorrect) {
                    socket.correct++
                }
                socket.attempted++;

                socket.emit('answer', result);
                // This implies that user has attempted all the questions that he is given with
                if (socket.attempted === socket.score || socket.attempted == process.env.MAX_QUESTIONS) {
                    scoring.updateAttempt(data.attempt, details, (err, resp) => {
                        if (err) {
                            console.log("error while updating attempt");
                            return;
                        }

                        saveAttempt();
                    });
                }
            })
        });

        socket.on('quiz-done', (correct) => {
            if (correct !== socket.correct) {
                return socket.emit('mismatch');
            }

            saveAttempt();
        });

        var saveAttempt = () => {


            let updates = {
                No_of_Pipes_Passed__c: socket.score,
                Total_Questions_Attempted__c: socket.attempted,
                Attempt_Completed__c: true,
                Answered_Correct__c: socket.correct
            };

            scoring.updateAttempt(socket.attemptID, updates, (err, resp) => {
                if (err) {
                    console.log(err);
                    return socket.emit('mismatch');
                }

                socket.emit("game-over");
            });
        }
    });
};