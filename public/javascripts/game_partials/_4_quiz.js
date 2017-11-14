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

                $("#question-box .option").addClass("hide");
                $("#question-box .question").text(question.Question__c);
                if (question.a__c) {
                    $("#question-box #a__c").parent().parent().removeClass("hide").find("#a__c").val(question.a__c).next().text(question.a__c);
                }
                if (question.b__c) {
                    $("#question-box #b__c").parent().parent().removeClass("hide").find("#b__c").val(question.b__c).next().text(question.b__c);
                }
                if (question.c__c) {
                    $("#question-box #c__c").parent().parent().removeClass("hide").find("#c__c").val(question.c__c).next().text(question.c__c);
                }
                if (question.d__c) {
                    $("#question-box #d__c").parent().parent().removeClass("hide").find("#d__c").val(question.d__c).next().text(question.d__c);
                }
                $("#question-box input[type=radio]:checked").prop('checked', false);
                index++;

                $("#question-box .total").text(questions.length)

                // Hint
                if (question.Hint__c) {
                    $("#question-box .hint").text(question.Hint__c).show();
                } else {
                    $("#question-box .hint").hide();
                }

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
                    id: questions[index - 1].Id,
                    answer: $selectedOption.val(),
                    attempt: $("#game-holder").data("id")
                });
            } else {
                if (!$("#toast-container-top").children().length) {
                    toast("Select an option");
                }
            }
        },

        checkedAnswer: function (data) {
            var self = this;
            if (data.answeredCorrect) {
                $("#question-box .score").text(++correct)
                $("#question-box .tally").addClass("correct")
            } else {
                $("#question-box .tally").addClass("incorrect")
            }

            setTimeout(function () {
                $("#question-box .tally").removeClass("incorrect correct")
                self.showNextQuestion();
            }, 1000);
        }
    }

    if (typeof quiz == "undefined") {
        window.quiz = quizFunctions
    }
})(window);