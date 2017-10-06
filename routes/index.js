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

module.exports = router;
