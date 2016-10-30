define(['jquery',
        'gui',
        'multiplayer',
        'gameVariables',
        'statistics',
        'vibration',
        'vkapi',
        'timer',
        'gameLogic',
        'fullscreen',
        'audio',
        'slick'
    ], function($, gui, onlineUser, gameVariables, statistics, vibration, vkapi, timer, gameLogic, fullscreen, audio, slick) {

    var events = {
        slickActive: false
    };

    events.connectHeaderButtons = function() {
        events.setEventListenerOnAuth();

        events.triggerSound();
        events.share();
        events.triggerFullscreen();
    };

    events.share = function () {
        $('.controls .share a').click(function(event) {
            if (navigator.share !== undefined) {
                event.preventDefault();

                navigator.share({
                    title: 'BeFriend',
                    text: 'Наше приложение позволит Вам сблизиться со всеми вашими знакомыми и заводить настоящих друзей. Мы поможем Вам узнать знакомых намного лучше, а также обнаружить у них Ваши общие интересы. Все это сделает из Вас внимательного, привлекательного в общении человека.',
                    url: 'https://befriend.herokuapp.com'
                }).then(function() {
                    console.log('Successful share');
                }).catch(function() {
                    console.log('Error sharing:', error);
                });

                return false;
            }
        });

    };

    events.triggerFullscreen = function() {

        if (screenfull.enabled) {
            document.addEventListener(screenfull.raw.fullscreenchange, function() {
                    if (screenfull.isFullscreen) {
                        $('.controls .fullscreen svg use').attr('xlink:href', '#fullscreenExit');
                    } else {
                        $('.controls .fullscreen svg use').attr('xlink:href', '#fullscreenEnter');
                    }
            });
        }

        $('.controls .fullscreen a').click(function(event) {
            event.preventDefault();

            if (screenfull.enabled) {
                screenfull.toggle();
            } else {
                alert('Полноэкранный режим не поддерживается на Вашем устройстве.');
            }

            return false;
        });
    };

    events.triggerSound = function() {

        if (!audio.isSupported()) {
            $('.controls .sound svg use').attr('xlink:href', '#soundOff');
        }

        $('.controls .sound a').click(function(event) {
            event.preventDefault();

            if (audio.isSupported()) {
                if (audio.isTurnedOn()) {
                    $('.controls .sound svg use').attr('xlink:href', '#soundOff');
                    audio.turnOff();
                } else {
                    $('.controls .sound svg use').attr('xlink:href', '#soundOn');
                    audio.turnOn();
                }
            }

            return false;
        });

    };

    events.makeSlickSlider = function() {
        if ($( window ).width() <= 992) {
            $('.modes .row').slick({
                slidesToShow: 1,
                dots: true,
                prevArrow: false,
                nextArrow: false,
                infinite: false
            });
            events.slickActive = true;
        }
    };

    events.setEventListenerOnWindowResize = function() {
        $(window).resize(function() {
            if (events.slickActive) {
                if ($( window ).width() > 992) {
                    $('.modes .row').slick('unslick');

                    events.slickActive = false;
                }
                // else do nothing!
            } else {
                events.makeSlickSlider();
            }
        });
    };

    events.setEventListenerOnAuth = function() {
        $(".authButton").click(function(event) {
            gui.login();

            // set other Event Listeners
            events.setEventListenerOnSingleGame();
            events.setEventListenerOnOnlineUsers();
            events.setEventListenerOnSearchPlayers();
            events.setEventListenerOnCreateRoom();
            events.setEventListenerOnJoinRoom();
            events.setEventListenerOnStartRoom();
            events.setEventListenersOnNotifications();
        });
    };

    events.setEventListenerOnSearchPlayers = function() {
        $('.searchUsersInput').keyup(function (event) {
            $('.onlinePlayers .onlinePlayers__player').addClass('hidden').filter(function() {
                return $(this).text().indexOf($('.searchUsersInput').val()) != -1;
            }).removeClass('hidden');
        });
    };

    events.setEventListenerOnSingleGame = function() {
        $('.startSingleGameButton').click(function(event) {
            event.preventDefault();

            returnAllToDefaultState($('.startSingleGameButton')).then(function() {
                $('.startSingleGameButton').text('Заново');

                gui.drawQuestion(gameLogic.makeNewQuestion());

                $(".quizForSingleGame").removeClass("bounceOutRight").addClass("bounceInLeft").removeClass('hidden');
                timer.start();
            });

            return false;
        });
    };

    events.setEventListenerOnCreateRoom = function() {
        $('.createRoomButton').click(function(event) {
            event.preventDefault();

            returnAllToDefaultState($(this)).then(function() {
                onlineUser.createRoom(vkapi.getUserInfo().id);

                $(".multiplayer").removeClass("bounceOutRight").addClass("bounceInLeft").removeClass('hidden');
            });

            return false;
        });
    };

    events.setEventListenerOnJoinRoom = function() {
        $('.joinRoomButton').click(function(event) {
            event.preventDefault();

            returnAllToDefaultState($('.joinRoomButton')).then(function() {
                if ($('.joinGameSecret').val() == '') {
                    require('gui').showMultiplayerError("Введите секретный код.");
                    return false;
                }

                if (onlineUser.getRoom()) {
                    onlineUser.clearRoom();
                }
                onlineUser.joinRoom($('.joinGameSecret').val());

                $('.roomInfo .forCreator').addClass('hidden');
                $('.roomInfo .forUser').removeClass('hidden');
            });

            return false;
        });
    };

    events.setEventListenerOnStartRoom = function() {
        $('.startRoomButton').click(function(event) {
            event.preventDefault();

            if ($('#winPoints').val() == '') {
                require('gui').showMultiplayerStartError("Введите победные очки.");
                return false;
            } else {
                $('.roomInfo .error').addClass('hidden');
            }

            onlineUser.setRoomOptions(onlineUser.getRoom(), {
                maxScore: $('#winPoints').val()
            });

            onlineUser.getNewQuestion(onlineUser.getRoom());

            $('.startRoomButton').addClass('hidden');

            return false;
        });
    };

    events.setEventListenerOnOnlineUsers = function() {
        console.log("setttted");
        $('.onlinePlayers__player').click(function(event) {
            event.preventDefault();

            var $player = $(this);

            returnAllToDefaultState($('.onlinePlayers__player')).then(function() {
                var roomName = onlineUser.createRoom(vkapi.getUserInfo().id);
                onlineUser.sendRequestTo($player.attr('href').slice(17), roomName);

                $(".multiplayer").removeClass("bounceOutRight").addClass("bounceInLeft").removeClass('hidden');
            });

            return false;
        });
    };

    events.setEventListenersOnNotifications = function() {

        // reject game request
        $('body').on('click', '.gameRequest .notification__close, .gameRequest .notification__activities .reject', function (event) {
            event.preventDefault();

            var notificationBlock = $(this).closest('.notification');

            notificationBlock.removeClass('bounceInUp').addClass('bounceOutDown');

            setTimeout(function() {
                notificationBlock.addClass('hidden').remove();
            }, 1000);

            return false;
        });

        // confirm game request
        $('body').on('click', '.gameRequest .notification__activities .confirm', function(event) {
            event.preventDefault();

            var notificationBlock = $(this).closest('.notification');

            var notificationText = notificationBlock.find('.notification__text').text();
            var startIndex = notificationText.lastIndexOf('(') + 6;
            var endIndex = notificationText.lastIndexOf(')');
            var roomKey = notificationText.substring(startIndex, endIndex);

            returnAllToDefaultState($(this)).then(function() {

                if (onlineUser.getRoom()) {
                    onlineUser.clearRoom();
                }
                onlineUser.joinRoom(roomKey);

                $('.roomInfo .forCreator').addClass('hidden');
                $('.roomInfo .forUser').removeClass('hidden');
            });

            notificationBlock.removeClass('bounceInUp').addClass('bounceOutDown');

            setTimeout(function() {
                notificationBlock.addClass('hidden').remove();
            }, 1000);

            return false;
        });

    };

    events.addListenersToOptionsForSingleGame = function() {

        $(".question__answer").each(function(index) {
            $(this).click(function(){
                if ($(this).text().indexOf(gameLogic.getRightAnswer()) != -1){
                    $(this).addClass("right");
                    audio.correctAnswer();
                    gameVariables.addPoints();
                    if (gameVariables.getIsFirstTryValue() == true){
                        statistics.incFirstTryRightAnswers();
                    } else {
                        gameVariables.setIsFirstTryValue(true);
                    }
                    gui.updatePoints();
                    gui.updateTimer();
                    statistics.incRightAnswers_count();

                    if ($(".question__answer.wrong").length == 0) {
                        timer.addTime();
                        gui.updateTimer();
                    }

                    gui.drawQuestion(gameLogic.makeNewQuestion());

                } else {
                    vibration.vibrate(100);
                    $(this).addClass("wrong");
                    audio.wrongAnswer();
                    gameVariables.subtractPoints();
                    gameVariables.setIsFirstTryValue(false);

                    timer.substractTime();
                    gui.updateTimer();

                    gui.updatePoints();
                    statistics.incMistakes_count();
                }
            })
        });
    }

    events.addListenersToOptionsForMultiplayerGame = function() {
        $(".question__answer").each(function(index) {
            $(this).click(function () {
                if ($(this).text().indexOf(gameLogic.getRightAnswer()) != -1) {
                    $(this).addClass("right");
                    audio.correctAnswer();
                    gameVariables.addPoints();
                    statistics.incRightAnswers_count();

                    onlineUser.answer({
                        vk_id: vkapi.getUserInfo().id,
                        points: gameVariables.getPointsForRight(),
                        roomName: onlineUser.getRoom(),
                        right: true
                    });

                } else {
                    vibration.vibrate(100);
                    $(this).addClass("wrong");
                    audio.wrongAnswer();
                    gameVariables.subtractPoints();
                    statistics.incMistakes_count();

                    onlineUser.answer({
                        vk_id: vkapi.getUserInfo().id,
                        points: gameVariables.getPointsForWrong(),
                        roomName: onlineUser.getRoom(),
                        right: false
                    });
                }
            });
        });
    };

    function returnAllToDefaultState($clickedButton) {
        return new Promise(function(resolve, reject) {

            // variables
            var $singleGameButton = $('.startSingleGameButton');
            var $multiplayerCreateButton = $('.createRoomButton');
            var $multiplayerJoinButton = $('.joinRoomButton');

            var $singleGameBlock = $('.quizForSingleGame');
            var $multiplayerGameBlock = $('.multiplayer');
            var $quizForMultiplayerGame = $('.quizForMultiplayerGame');
            var $elementsForAdmin = $('.roomInfo .forCreator');
            var $elementsForUser = $('.roomInfo .forUser');

            var $gameResultBlock = $('.gameResult');
            var $questionBlock = $('.questionWrap .question');

            var waiting = false;

            // disable the button
            $clickedButton.prop("disabled", true);

            // hide single mode
            if (!$singleGameBlock.hasClass('hidden')) {
                waiting = true;

                $singleGameBlock.removeClass('bounceInLeft').addClass('bounceOutRight');

                setTimeout(function() {
                    $singleGameBlock.addClass('hidden');

                    // if game already ended and results are in the view, for both modes
                    if (!$gameResultBlock.hasClass('hidden')) {
                        $gameResultBlock.addClass('hidden');
                        $questionBlock.removeClass('hidden');
                    }

                    $clickedButton.prop("disabled", false);
                    resolve();
                }, 1000);
            }

            // hide multiplayer mode
            if (!$multiplayerGameBlock.hasClass('hidden')) {
                waiting = true;

                $multiplayerGameBlock.removeClass('bounceInLeft').addClass('bounceOutRight');

                // if already in the room - leave
                if (onlineUser.getRoom()) {
                    onlineUser.clearRoom();
                }

                setTimeout(function() {
                    $multiplayerGameBlock.addClass('hidden');
                    $quizForMultiplayerGame.removeClass('bounceInRight').addClass('hidden');
                    $elementsForAdmin.removeClass('hidden');
                    $elementsForUser.addClass('hidden');

                    // if game already ended and results are in the view, for both modes
                    if (!$gameResultBlock.hasClass('hidden')) {
                        $gameResultBlock.addClass('hidden');
                        $questionBlock.removeClass('hidden');
                    }

                    $clickedButton.prop("disabled", false);
                    resolve();
                }, 1000);
            }

            // other buttons text to default, except clicked
            if (!$singleGameButton.is($clickedButton)) {
                console.log("ATTEMPT");
                $singleGameButton.text('Начать');
            }

            // remove opened errors
            $('.multiplayerMode .error').addClass('hidden');
            $('.roomInfo .error').addClass('hidden');

            // resetting game variables
            statistics.resetStatistic();
            timer.reset();
            gui.updateTimer();
            gameVariables.resetScore();

            if (!waiting) {
                $clickedButton.prop("disabled", false);
                resolve();
            }
        });
    }

    return events;

});