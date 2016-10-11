define(['require', 'gui'], function (require, gui) {

    var timer, gameTime = 0, gameTimeMax = 9000, totalGameTime = 0, self = this;

    this.start = function() {
        timer = setInterval(function() {
            totalGameTime += 1000;
            gameTime += 1000;
            require("gui").updateTimer();

            if (gameTime >= gameTimeMax) {
                self.end();
            }
        }, 1000);
    };

    this.end = function() {
        require("gui").endGame();
        clearInterval(timer);
    };

    this.clrInterval = function(){
        clearInterval(timer);
    };

    this.getSecondsLeft = function() {
        return (gameTimeMax - gameTime) / 1000;
    };

    this.addTime = function() {
        gameTime -= 2000;
    };

    this.substractTime = function() {
        gameTime += 1000;
    };

    this.getTotalGameTime = function(){
        return (totalGameTime / 1000);
    }

    return this;

});