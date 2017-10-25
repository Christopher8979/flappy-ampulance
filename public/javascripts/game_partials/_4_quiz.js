(function (window) {
    var questions;
    var index = 0;
    var correct = 0;

    var quizFunctions = {
        loadQuestions: function (data) {
            questions = data;
        },

        showNextQuestion: function () {
            if (questions.length > index) {
                var question = questions[index];
                
                $("#question-box .question").text(question.Question__c);
                $("#question-box #a__c").val(question.a__c).next().text(question.a__c);
                $("#question-box #b__c").val(question.b__c).next().text(question.b__c);
                $("#question-box #c__c").val(question.c__c).next().text(question.c__c);
                $("#question-box #d__c").val(question.d__c).next().text(question.d__c);
                $("#question-box input[type=radio]:checked").prop('checked', false);
                index++;

                $("#question-box .total").text(questions.length)
                $("#question-box .correct").text(correct)
                $(".question-frame").addClass("show")
            } else {
                socket.emit("quiz-done", correct)
            }
        },

        checkAnswer: function (e) {
            var $selectedOption = $("#question-box input[type=radio]:checked");

            if ($selectedOption.length) {
                socket.emit("checkAnswer", {
                    id: questions[index-1].Id,
                    answer: $selectedOption.val()
                })
            } else {
                toast("Select an option")
            }
        },

        checkedAnswer: function (data) {
            var self = this;
            if (data.answeredCorrect) {
                $("#question-box .correct").text(++correct)
            }

            setTimeout(function() {
                self.showNextQuestion();
            }, 500);
        }
    }

    if (typeof quiz == "undefined") {
        window.quiz = quizFunctions
    }
})(window);