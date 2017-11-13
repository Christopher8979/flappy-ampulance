$(document).on('initialize-game', function () {
    stage = new createjs.Stage('game-holder');
    $("body").addClass("fixed"); // For ie to remove scrollbar issue

    // get canvas width and height for later calculations:
    w = stage.canvas.width;
    h = stage.canvas.height;

    loader = new createjs.LoadQueue(false);

    loader.addEventListener("complete", handleComplete);
    loader.loadManifest(IMAGE_HOLDER, true, "../images/");

    // Manifest Loading complete handler
    function handleComplete(e) {

        // Removing loading symbol
        // $('.preloader').removeClass('loading');
        // $('.preloader .preloader-wrapper').removeClass('active');

        // Adding sky as background
        stage.canvas.style.backgroundColor = "#4ec0ca";
        var skyImg = loader.getResult("sky");
        sky = new createjs.Shape();
        sky.graphics.bf(skyImg).dr(0, 0, w * 2, skyImg.height);
        sky.y = h - 220;

        // Add ceiling
        var ceilImg = loader.getResult("ceiling");
        ceil = new createjs.Shape();
        ceil.graphics.bf(ceilImg).dr(0, 0, w * 2, ceilImg.height);
        ceil.setBounds(0, 0, ceilImg.width, ceilImg.height);

        // Add Land
        var landImg = loader.getResult("land");
        land = new createjs.Shape();
        land.graphics.bf(landImg).dr(0, 0, w * 2, landImg.height);
        land.y = h - landImg.height;
        land.setBounds(0, 0, landImg.width, landImg.height);

        // Initialize Bird sprite
        var spriteSheet = new createjs.SpriteSheet({
            framerate: 3,
            "images": [loader.getResult("bird")],
            "frames": { "regX": 0, "height": 43, "count": 4, "regY": 0, "width": 60 },
            "animations": {
                "flap": [0, 3, "flap", 4]
            }
        });
        bird = new createjs.Sprite(spriteSheet, "flap");
        bird.x = w * 0.1;
        bird.y = h / 3;
        bird.setBounds(10, 0, 60, 20);

        // Score
        scoreText = new createjs.Text("0", "40px monospace", "#2c2c29");
        scoreText.x = 20;
        scoreText.y = 20;

        // Set ceil and floor values
        gameFloor = h - land.getBounds().height - 50
        gameCeil = ceil.getBounds().height

        createjs.Ticker.timingMode = createjs.Ticker.RAF;
        createjs.Ticker.interval = 100;
        gameTicker = createjs.Ticker.on("tick", tickHandler);

        // Adding layers based on their sequence
        stage.addChild(sky, ceil, land, bird, scoreText);

        stage.update();

        currentstate = states.SplashScreen;

        initTweens();
        initEvents();
    };

});

function initTweens(params) {
    var speedMultiplier = 100;
    var s = speed * speedMultiplier;

    createjs.Tween.get(land, {
        loop: true
    }).to({
        x: -w
    }, s * 45);

    createjs.Tween.get(sky, {
        loop: true
    }).to({
        x: -w
    }, s * 500);

    createjs.Tween.get(ceil, {
        loop: true
    }).to({
        x: -w
    }, s * 100);
}

function addPipe() {
    var pipeImg = loader.getResult("pipe");
    var pipeUpImg = loader.getResult("pipe-up");
    var pipeDownImg = loader.getResult("pipe-down");
    var pipe = new createjs.Shape();
    var openingPoint = pipeUpImg.height * Math.floor((Math.random() * 12) + 1);
    var gap = pipeUpImg.height * 6
    pipe.graphics
        .bf(pipeImg).dr(0, gameCeil, pipeImg.width, openingPoint)
        .bf(pipeImg).dr(0, openingPoint + gap, pipeImg.width, gameFloor)
        .bf(pipeDownImg).dr(0, openingPoint, pipeDownImg.width, pipeDownImg.height)
        .bf(pipeUpImg).dr(0, openingPoint + gap, pipeUpImg.width, pipeUpImg.height);

    pipe.x = w;
    pipe.setBounds(0, 0, pipeImg.width, 30);
    pipe.start = openingPoint
    pipe.end = openingPoint + gap

    // Animate
    var speedMultiplier = 100;
    var s = speed * speedMultiplier;
    createjs.Tween.get(pipe, {
        onComplete: function () {
            stage.removeChild(pipes.pop());
            addPipe();
        }
    }).to({
        x: -pipeUpImg.width
    }, s * 47);

    pipes.push(pipe)

    stage.addChildAt(pipe, 1)
}

$(document).on("initialize-socket", function () {
    socket = io();

    socket.on('fetchedQuestions', function (questions) {
        console.log(questions);
        quiz.loadQuestions(questions);
        quiz.showNextQuestion();
    });

    socket.on("mismatch", function () {
        window.alert("There was a discrepancy in your score, try again")
        window.location = '/'
    })

    socket.on("error", function () {
        toast("Something went wrong, try again");
    })

    socket.on("answer", function (data) {
        quiz.checkedAnswer(data);
    })

    socket.on("game-over", function () {
        window.location = "/game-over/" + window.location.pathname.split("/").pop()
    })
})