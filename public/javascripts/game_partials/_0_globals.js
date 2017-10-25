// Globals
var sky, ceil, land, bird, scoreText, pipes = [];
var speed = 1, velocity = 0, gravity = 0.3, jump = -5;
var gameFloor, gameCeil, rotation = 0;
var states = Object.freeze({
    SplashScreen: 0,
    GameScreen: 1,
    QuizScreen: 2,
    ScoreScreen: 3
 });
var currentstate;
var gameTicker;
var loader;
var score = 0;

var IMAGE_HOLDER = [
    {
        src: "copter.png",
        id: "bird"
    },{
        src: "land.png",
        id: "land"
    },{
        src: "ceiling.png",
        id: "ceiling"
    },{
        src: "sky.png",
        id: "sky"
    },{
        src: "pipe.png",
        id: "pipe"
    },{
        src: "pipe-up.png",
        id: "pipe-up"
    },{
        src: "pipe-down.png",
        id: "pipe-down"
    }
]

var socket;