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

            // hide multiplayer mode
            if (!$('.multiplayer').hasClass('hidden')) {
                $('.multiplayer').removeClass('bounceInLeft').addClass('bounceOutRight');

                setTimeout(function() {
                    $('.multiplayer').addClass('hidden')
                }, 1000);
            }

            // if game already ended and results are in the view
            if (!$('.questionWrap__results.gameResult').hasClass('hidden')) {
                $('.questionWrap__results.gameResult').addClass('hidden');
                $('.questionWrap .question').removeClass('hidden');
            }

            // check if already playing
            if ($(this).hasClass('reset')) {
                // reset all
                statistics.resetStatistic();
                timer.reset();
                gui.updateTimer();
                gameVariables.resetScore();
            } else {
                // not playing
                $(this).addClass('reset').text('Заново');
            }

            gui.drawQuestion(gameLogic.makeNewQuestion());

            $(".quizForSingleGame").addClass("bounceInLeft").removeClass('hidden');
            timer.start();
        });
    };

    events.setEventListenerOnCreateRoom = function() {
        $('.createRoomButton').click(function(event) {
            onlineUser.createRoom(vkapi.getUserInfo().id);
        });
    };

    events.setEventListenerOnJoinRoom = function() {
        $('.joinRoomButton').click(function(event) {
            onlineUser.joinRoom($('.joinGameSecret').val());
        });
    };

    events.setEventListenerOnStartRoom = function() {
        $('.startRoomButton').click(function(event) {
            onlineUser.getNewQuestion(onlineUser.getRoom());
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
    }

    return events;

});