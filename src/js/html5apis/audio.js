define(
    [
        'bufferLoader'
    ],
    function(
        BufferLoader
    ) {

        var _status = true;
        var _hasSupport;
        var _context;
        var _bufferLoader;
        var _soundFiles = [
            '../../sounds/correct.wav',
            '../../sounds/wrong.wav',
            '../../sounds/finish.wav',
            '../../sounds/notify.wav'
        ];
        var _buffers = {
            correct: null,
            wrong: null,
            finish: null,
            notify: null
        };

        function _finishedLoading(bufferList) {
            // Binding with buffers
            _buffers.correct = bufferList[0];
            _buffers.wrong = bufferList[1];
            _buffers.finish = bufferList[2];
            _buffers.notify = bufferList[3];
        }

        function _playSound(buffer) {
            if (_hasSupport && _status) {
                var source = _context.createBufferSource();
                source.buffer = buffer;
                source.connect(_context.destination);
                source.start(0);
            }
        }

        var audio = {};

        // initialize audio module, load sounds
        audio.init = function() {
            window.AudioContext = window.AudioContext || window.webkitAudioContext || null;
            _hasSupport = window.AudioContext;

            if (_hasSupport) {
                _context = new AudioContext();

                _bufferLoader = new BufferLoader(
                    _context,
                    _soundFiles,
                    _finishedLoading
                );

                _bufferLoader.load();
            } else {
                console.warn('Web Audio API is not supported by your device.');
            }
        };

        // Check if audio is supported
        audio.isSupported = function() {
            return _hasSupport;
        };

        // Check if audio is turned on
        audio.isTurnedOn = function() {
            return _status;
        };

        // Turn audio on
        audio.turnOn = function() {
            _status = true;
        };

        // Turn audio off
        audio.turnOff = function() {
            _status = false;
        };

        // Play correct answer sound
        audio.correctAnswer = function() {
            _playSound(_buffers.correct);
        };

        // Play wrong answer sound
        audio.wrongAnswer = function() {
            _playSound(_buffers.wrong);
        };

        // Play finish game sound
        audio.finishGame = function() {
            _playSound(_buffers.finish);
        };

        // Play notification sound
        audio.notification = function() {
            _playSound(_buffers.notify);
        };

        return audio;
    }
);
