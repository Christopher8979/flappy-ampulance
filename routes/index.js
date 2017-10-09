var express = require('express');
var router = express.Router();

const MODULES = {
  questions : require('../modules/questions/controllers')
};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/questions', (req, res) => {
  MODULES.questions.getQuestions((err, questions) => {
    if (err) {
      return res.status(500).jsonp({
        status: 'error while fetching questions',
        error: err
      });
    }

    res.status(200).jsonp(questions);
  });
});

router.post('/check-answer/:attempt/:id', (req, res) => {

  if (!(req.params && req.params.attempt && req.params.id )) {
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

module.exports = router;