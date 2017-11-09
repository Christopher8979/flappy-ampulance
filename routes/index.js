var express = require('express');
var router = express.Router();

const MODULES = {
    questions: require('../modules/questions/controllers'),
    scores: require('../modules/scoring/controllers'),
    orm: require('../ORM')
};

/* GET home page. */
router.get('/', function (req, res, next) {
    MODULES.scores.getHighScorrer((err, winnerInfo) => {


        var topScorrer = {
            name: "-",
            email: "-",
            score: "-"
        };

        if (winnerInfo) {
            topScorrer = {
                name: winnerInfo.Player__r.Name,
                email: winnerInfo.Player__r.Email__c,
                score: winnerInfo.Final_Score__c
            };
        }

        MODULES.orm.getMetadata(process.env.META_DATA_AT, (err, metadata) => {
            if (err) {
                console.log(err);
                return res.render('500', 'Something went wrong in the backend');
            }

            var fields = metadata.fields;
            var serviceLineOptions = [];
            fields.forEach(function (value) {
                if (value.name === process.env.SERVICE_LINE_KEY) {
                    value.picklistValues.forEach(function (options) {
                        serviceLineOptions.push({
                            label: options.label,
                            value: options.value
                        });
                    });
                }
            });

            res.render('index', {
                title: 'Flappy Ambulance',
                description: 'Some random text',
                topScorrer: topScorrer,
                serviceLineOptions: serviceLineOptions
            });
        });

    });
});

router.post('/checkUser', (req, res) => {
    if (!req.body) {
        return res.status(400).jsonp({
            'status': 'Player details not sent in ajax call'
        });
    }

    MODULES.scores.createPlayer(req.body, (err, data) => {
        if (err) {
            return res.status(400).jsonp({
                'status': 'Some error while validating details provided',
                'error': err
            });
        }

        MODULES.scores.createPlayerJunction({ LSHC_Game__c: process.env.GAME_SFDC_ID, LSHC_Players__c: data }, (err, junctionResp) => {
            if (err) {
                return res.status(400).jsonp({
                    'status': 'Some error while validating details provided',
                    'error': err
                });
            }

            res.status(200).jsonp({
                id: data
            });
        });
    });

});

router.get('/rules/:id', (req, res) => {

    if (!(req.params && req.params.id)) {
        return res.redirect('/');
    }

    MODULES.scores.getPersonalBest(req.params.id, (err, data) => {
        if (err) {
            console.info('Error while getting personal best');
            console.log(err);
            return res.redirect('/');
        }

        // Form data before sending it to rules page
        if (!data) {
            data = {
                Final_Score__c: 0,
                No_of_Pipes_Passed__c: 0,
                Answered_Correct__c: 0
            }
        }

        res.render('rules', {
            data: data,
            playerID: req.params.id
        });
    });
});

router.get('/play-game/:id', function (req, res) {
    if (!(req.params && req.params.id)) {
        return res.render('error', 'No params in rules page');
    }
    var defaults = {};

    MODULES.scores.createAttempt(req.params.id, defaults, (err, attemptID) => {
        if (err) {
            console.log(err);
            return res.redirect("/");
        }
        res.render('game', {
            attemptID: attemptID,
            id: req.params.id
        });
    });

});

router.get('/game-over/:id', (req, res) => {
    if (!(req.params && req.params.id)) {
        return res.render('400', 'No params in rules page');
    }

    MODULES.scores.getLastAttempt(req.params.id, (err, attemptData) => {
        if (err) {
            console.info('Error while getting last attempt');
            return res.redirect('/');
        }

        MODULES.scores.getPlayerDetails(req.params.id, (err, playerInfo) => {
            if (err) {
                console.info('Error while getting player details');
                return res.redirect('/');
            }

            MODULES.scores.getHighScorrer((err, winnerInfo) => {
                if (err) {
                    console.info('Error while getting winner');
                    return res.redirect('/');
                }

                var topScorrer = {
                    name: winnerInfo.Player__r.Name,
                    email: winnerInfo.Player__r.Email__c,
                    score: winnerInfo.Final_Score__c,
                    serviceLine: winnerInfo.Service_Line__c
                };

                res.render('game-over', {
                    lastAttempts: attemptData[0],
                    topScorrer: topScorrer,
                    player: playerInfo[0],
                    id: req.params.id,
                    isTopScorrer : topScorrer.score === attemptData[0].Final_Score__c
                });
            });
        });

    });
});

router.get('/contributors', (req, res) => {

});

router.get('/*', function (req, res) {
    res.redirect('/');
});

module.exports = router;
