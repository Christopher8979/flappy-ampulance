function initEvents() {
    $(document).on("click", function (e) {
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
}

function updateScore() {
    scoreText.text = score;
}