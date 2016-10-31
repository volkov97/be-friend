define(
    [
        'require',
        'gui'
    ],
    function (
        require,
        gui
    ) {

        var _timerVar;
        var _gameTime = 0;
        var _gameTimeMax = 9000;
        var _totalGameTime = 0;

        var timer = {};

        /**
         * Starts timer, calculate game time
         */
        timer.start = function() {
            _timerVar = setInterval(function() {
                _totalGameTime += 1000;
                _gameTime += 1000;
                require("gui").updateTimer();

                if (_gameTime >= _gameTimeMax) {
                    _gameTime = _gameTimeMax;
                    require("gui").updateTimer();
                    timer.end();
                }
            }, 1000);
        };

        timer.end = function() {
            require("gui").endGame(true);
            clearInterval(_timerVar);
        };

        timer.clrInterval = function(){
            clearInterval(_timerVar);
        };

        timer.reset = function() {
            timer.clrInterval();
            _gameTime = 0;
            _totalGameTime = 0;
        };

        timer.getSecondsLeft = function() {
            return (_gameTimeMax - _gameTime) / 1000;
        };

        timer.addTime = function() {
            _gameTime -= 2000;
        };

        timer.substractTime = function() {
            _gameTime += 1000;
        };

        // Returns total time of the game
        timer.getTotalGameTime = function(){
            return (_totalGameTime / 1000);
        };

        return timer;
    }
);