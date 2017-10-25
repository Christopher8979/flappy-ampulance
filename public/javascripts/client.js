$(document).ready(function () {
    var route = location.pathname;

    if (route === '/') {
        $(document).trigger('initialize-entry');
    } else if (route.search('play-game') !== -1) {
        $(document).trigger('initialize-game');
        $(document).trigger('initialize-socket');
    } else if (route.search('rules') !== -1) {
        $(document).trigger('initialize-rules');
    } else if (route.search('game-over') !== -1) {
        $(document).trigger('initialize-exit');
    }
})