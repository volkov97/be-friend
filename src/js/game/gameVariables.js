define([], function() {

    var gameObj = {
        score: 0,
        points: {
            forRight: 10,
            forWrong: -5
        },
        isFirstTry: true
    };

    gameObj.resetScore = function() {
        gameObj.score = 0;
        gameObj.isFirstTry = true;
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

    gameObj.getIsFirstTryValue = function() {
        return gameObj.isFirstTry;
    };

    gameObj.setIsFirstTryValue = function(bool){
        gameObj.isFirstTry = bool;
    };

    return gameObj;
});