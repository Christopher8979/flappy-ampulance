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

        // Getting error her currently, should change query later.

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

        res.status(200).jsonp({
            id: data
        });
    });

});

router.get('/rules/:id', (req, res) => {

    if (!(req.params && req.params.id)) {
        return res.render('/');
    }

    MODULES.scores.getLatestAttempts(req.params.id, (err, attempts) => {
        if (err) {
            console.info('Error while getting attempts');
            console.log(err);
            return res.render('/');
        }

        // Form data before sending it to rules page

        res.render('rules', {
            attempts: JSON.stringify(attempts),
            playerID: req.params.id
        });
    });
});

router.get('/play-game/:id', function (req, res) {
    if (!(req.params && req.params.id)) {
        return res.render('error', 'No params in rules page');
    }
    res.render('game', {
        title: 'Playing game now'
    });
});


router.post('/check-answer/:attempt/:id', (req, res) => {

    if (!(req.params && req.params.attempt && req.params.id)) {
        return res.render('error', 'Proper params are not provided');
    }

    const questionNo = req.params.id;
    const answeredAs = req.body.answeredAs;
    const attemptID = req.params.attempt;

    MODULES.questions.checkAnswer(questionNo, answeredAs, (err, response) => {
        if (err) {
            console.info('Error wihile checking answers');
            console.log(err);
            return res.status(400).jsonp(err);
        }

        res.status(200).jsonp(response);
    });
});

router.get('/game-over/:id', (req, res) => {

});

router.post('/saveAttempt/:id', (req, res) => {

});

router.get('/contributors', (req, res) => {

});

router.get('/*', function (req, res) {
    res.redirect('/');
});

module.exports = router;
