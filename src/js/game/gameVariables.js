define([], function() {



    var gameObj = {
        score: 0,
        timer: null
    };

    gameObj.addPoints = function() {
        gameObj.score += 10;
    };

    gameObj.subtractPoints = function() {
        gameObj.score -= 5;
    };

    gameObj.getScore = function() {
        return gameObj.score;
    };

    return gameObj;

});