define([], function() {

    var gameObj = {
        score: 0,
        points: {
            forRight: 10,
            forWrong: -5
        }
    };

    gameObj.resetScore = function() {
        gameObj.score = 0;
    };

    gameObj.getPointsForRight = function() {
        return gameObj.points.forRight;
    };

    gameObj.getPointsForWrong = function() {
        return gameObj.points.forWrong;
    };

    gameObj.addPoints = function() {
        gameObj.score += gameObj.getPointsForRight();
    };

    gameObj.subtractPoints = function() {
        gameObj.score += gameObj.getPointsForWrong();
    };

    gameObj.getScore = function() {
        return gameObj.score;
    };

    return gameObj;

});