define(
    [
        'bufferLoader'
    ],
    function(
        BufferLoader
    ) {

        var _context;
        var _hasSupport;
        var _bufferLoader;
        var _soundFiles = [
            '../../sounds/correct.wav',
            '../../sounds/wrong.wav',
            '../../sounds/finish.wav'
        ];
        var _buffers = {
            correct: null,
            wrong: null,
            finish: null
        };

        function _finishedLoading(bufferList) {
            // Binding with buffers
            _buffers.correct = bufferList[0];
            _buffers.wrong = bufferList[1];
            _buffers.finish = bufferList[2];
        }

        function _playSound(buffer) {
            if (_hasSupport) {
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

        // play correct answer sound
        audio.correctAnswer = function() {
            _playSound(_buffers.correct);
        };

        // play wrong answer sound
        audio.wrongAnswer = function() {
            _playSound(_buffers.wrong);
        };

        // play finish game sound
        audio.finishGame = function() {
            _playSound(_buffers.finish);
        };

        return audio;
    }
);
