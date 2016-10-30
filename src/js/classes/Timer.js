define(
    [
        'require',
        'gui'
    ],
    function (
        require,
        gui
    ) {

    var _timer;
    var _gameTime = 0
    var _gameTimeMax = 9000;
    var _totalGameTime = 0;
    var _self = this;

    /**
     * Starts timer, calculate game time
     */
    this.start = function() {
        _timer = setInterval(function() {
            _totalGameTime += 1000;
            _gameTime += 1000;
            require("gui").updateTimer();

            if (_gameTime >= _gameTimeMax) {
                _self.end();
            }
        }, 1000);
    };

    this.end = function() {
        require("gui").endGame(true);
        clearInterval(_timer);
    };

    this.clrInterval = function(){
        clearInterval(_timer);
    };

    this.reset = function() {
        this.clrInterval();
        _gameTime = 0;
        _totalGameTime = 0;
    };

    this.getSecondsLeft = function() {
        return (_gameTimeMax - _gameTime) / 1000;
    };

    this.addTime = function() {
        _gameTime -= 2000;
    };

    this.substractTime = function() {
        _gameTime += 1000;
    };

    // Returns total time of the game
    this.getTotalGameTime = function(){
        return (_totalGameTime / 1000);
    };

    return this;

});