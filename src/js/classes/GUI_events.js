define(['jquery',
        'gui',
        'multiplayer',
        'gameVariables',
        'statistics',
        'vibration',
        'vkapi',
        'timer',
        'gameLogic'
], function($, gui, onlineUser, gameVariables, statistics, vibration, vkapi, timer, gameLogic) {

    var events = {
        slickActive: false
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
                console.log('1');
                if ($( window ).width() > 992) {
                    $('.modes .row').slick('unslick');

                    events.slickActive = false;
                }
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
                onlineUser.createRoom(vkapi.getUserInfo().id, $('#winPoints').val());

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

            onlineUser.sendRequestTo($(this).attr('href').slice(17));

            return false;
        });
    };

    events.addListenersToOptionsForSingleGame = function() {

        $(".question__answer").each(function(index) {
            $(this).click(function(){
                if ($(this).text().indexOf(gameLogic.getRightAnswer()) != -1){
                    $(this).addClass("right");
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
            $clickedButton.prop("disabled",true);

            // hide single mode
            if (!$singleGameBlock.hasClass('hidden')) {
                waiting = true;

                $singleGameBlock.removeClass('bounceInLeft').addClass('bounceOutRight');

                setTimeout(function() {
                    $singleGameBlock.addClass('hidden');
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
                    $clickedButton.prop("disabled", false);
                    resolve();
                }, 1000);
            }

            // if game already ended and results are in the view, for both modes
            if (!$gameResultBlock.hasClass('hidden')) {
                $gameResultBlock.addClass('hidden');
                $questionBlock.removeClass('hidden');
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