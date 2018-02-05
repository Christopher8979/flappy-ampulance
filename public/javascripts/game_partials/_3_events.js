function initEvents() {
    $("#game-holder").on("click", function (e) {
        screenClick();
    })

    $(document).on("keypress", function (e) {
        if (e.keyCode == 32) { //Spacebar
            screenClick();
        }
    })
}

function screenClick() {
    if (currentstate == states.GameScreen) {
        playerJump();
    } else if (currentstate == states.SplashScreen) {
        startGame();
    }
}

function startGame() {
    currentstate = states.GameScreen;
    addPipe();
    setTimeout(function() {
        addPipe();
    }, speed * 100 * 11);
    setTimeout(function() {
        addPipe();
    }, speed * 100 * 23);
    setTimeout(function() {
        addPipe();
    }, speed * 100 * 35);
    playerJump();
}

function playerJump() {
    velocity = jump;
}

function playerDead() {
    currentstate = states.ScoreScreen;
    createjs.Ticker.off("tick", gameTicker);
    music.lowerVolume()
    if (score) {
        socket.emit("crash", {
            pipesPassed: score
        });
    } else {
        $(".question-frame").addClass("no-score show");
    }    
}

function updateScore() {
    createjs.Sound.play("ding");
    scoreText.text = score;
    socket.emit("cross", (Math.random() + score));
};

(function (window) {
    var paused = false;
    var muted = false;
    var volume = 0.5;

    var MusicEvents = {
        mute: function () {
            muted = !muted;

            sound.volume = (muted) ? 0 : volume;
            
            if (muted) {
                $(".action-btns .mute").addClass("muted");
            } else {
                $(".action-btns .mute").removeClass("muted");
            }

        },

        lowerVolume: function () {
            sound.volume = volume = 0.1;
        }
    }
    
    if (window.music == undefined) {
        window.music = MusicEvents
    }
})(window);