define([
    'jquery',
    'vkapi',
    'gameLogic',
    'vibration',
    'gameVariables',
    'timer',
    'statistics',
    'multiplayer',
    'chart',
    'security'
], function($, vkapi, gameLogic, vibration, gameVariables, timer, statistics, onlineUser, chart, security) {

    var gui = {};

    gui.login = function() {

        $('.authButton').addClass('loading');

        vkapi.loginUser().then(
            function(result) {

                console.log(result);
                vkapi.setId(result.user_id);

                onlineUser.identify(vkapi.getUserInfo());

                $(".about").addClass("bounceOutRight");
                setTimeout(function() {
                    $(".about").addClass("hidden");
                    $(".modes").removeClass("hidden").addClass("bounceInLeft");
                }, 1000);

                gui.updateNeigbours(true);
                gui.updateStatistics(true);
            },
            function(error) {
                // вторая функция - запустится при вызове reject
                alert("Rejected: " + error); // error - аргумент reject
            }
        );

    };
    
    gui.singleGame = function() {
        $(".quiz").removeClass('hidden');

        gui.drawQuestion(gameLogic.makeNewQuestion());
        timer.start();
    };

    gui.drawQuestion = function(questionData) {
        // Добавляем вопрос
        $(".question__text").html(questionData.questionObj.question);

        $(".question__properties").html("");
        // Добавляем изображение, если нужно
        if (questionData.questionObj.withPhoto) {
            $(".question__properties").html($(".question__properties").html() + '<div class="question__image"><img src=\'' + questionData.rightUser.photo_200 + '\' class="question__img" width="200px" height="200px" alt="Quiz Question Image"></div>');
        }
        // Варианты ответа
        $(".question__properties").html($(".question__properties").html() + "<div class='question__answers clearfix'>");
        for (var i = 0; i < questionData.options.length; i++){
            $(".question__answers").html($(".question__answers").html() + "<div class=question__answer>" + questionData.options[i] + "</div>");
        }
        $(".question__properties").html($(".question__properties").html() + "</div>");
        addListenersToOptions();
    };

    gui.updatePoints = function() {
        onlinePoints.innerHTML = gameVariables.getScore();
    };

    gui.updateTimer = function() {
        onlineSeconds.innerHTML = timer.getSecondsLeft();
    };

    gui.endGame = function() {
        $(".question").addClass('hidden');
        gameResult.innerHTML = gameVariables.getScore();
        $(".gameResult").removeClass('hidden');

        $.post("/vl/sendGameResults", {
            user_id: vkapi.getId(),
            score: gameVariables.getScore(),
            statistics: statistics.getOneGameStatistics(),
            access_token: security.getToken()
        }, function(data) {
            gui.updateTopList();
            gui.updateNeigbours();
            gui.updateStatistics();
        });

    };

    gui.updateTopList = function() {
        $.post("/getTopList", {
            number: 10
        }, function(data) {
            var str = '<tr class="tableHead"><th>№</th><th>Имя</th><th>Оценка</th></tr>';

            for (var i = 0; i<data.length; i++){
                str += "<tr><td class ='number'>" + (i + 1)
                    + "</td><td class='name'><a href='https://vk.com/id" + data[i].vk_id
                    + "' target = '_blank'>" + data[i].first_name + " " + data[i].last_name
                    + "</a></td><td class='points'>" + data[i].max_score + "</td></tr>";
            }

            $(".winners").html(str);
        }, "json");
    };

    gui.updateStatistics = function(show) {
        $.post("/vl/getStatistics", {
            id: vkapi.getId(),
            access_token: security.getToken()
        }, function(statisticsData){
            var stats = statistics.getFullStatistics(statisticsData[0]);
            console.log(stats);

            $('.mistakesPerGame').text(stats.averageMistakesPerGame);
            $('.pointsPerGame').text(stats.averageScorePerGame);
            $('.gamesPlayed').text(stats.games_count);
            $('.oneGameTime').text(stats.averageTimePerGame);

            if (show) {
                $('.charts').removeClass('hidden');
            }

            var countOfGames = 10;

            $.post("/vl/getLastGames", {
                id: vkapi.getId(),
                num: countOfGames,
                access_token: security.getToken()
            }, function(lastGamesData){
                var pieChartData = [stats.rightAnswers_count, stats.mistakes_count];

                var barChartData = {
                    labels: [],
                    data: []
                };
                for(var i = 0; i<lastGamesData.rows.length; i++){
                    barChartData.labels[i] = "Game №" + (lastGamesData.countOfGames - lastGamesData.rows.length + i + 1).toString();
                    barChartData.data[lastGamesData.rows.length - 1 - i] = lastGamesData.rows[i].score;
                }

                console.log(pieChartData);
                console.log(barChartData);

                chart.drawCharts(
                    pieChartData, {
                    labels: barChartData.labels,
                    data: barChartData.data
                });
            }, "json");

        }, "json");
    };

    gui.updateNeigbours = function(show) {
        $.post("/vl/getNeighbours", {
            id: vkapi.getId(),
            num: 5,
            access_token: security.getToken()
        }, function(data) {
            var str = '<tr class="tableHead"><th>№</th><th>Имя</th><th>Оценка</th></tr>';

            var ms = data.list;
            for (var i = 0; i < ms.length; i++) {
                if (data.userPos == ms[i].realPos) {
                    str += "<tr class='currentUser'>"
                } else {
                    str += "<tr>";
                }
                str += "<td class ='number'>" + ms[i].realPos
                    + "</td><td class='name'><a href='https://vk.com/id" + ms[i].vk_id
                    + "' target = '_blank'>"+ms[i].first_name + " " + ms[i].last_name
                    + "</a></td><td class='points'>" + ms[i].max_score + "</td></tr>";
            }

            $('.userTopRate table.rate__table tbody').html(str);

            if (show) {
                $('.userTopRate').removeClass('hidden');
            }
        });
    };

    gui.updateOnlinePlayersList = function(list) {
        var code = "";

        for (var i = 0; i < list.length; i++) {
            code += "<li class='onlinePlayers__player'><a href=\'https://vk.com/id" + list[i].id + "\' class='onlinePlayers__link'>" +
                list[i].first_name + " " + list[i].last_name + "</a></li>"
        }

        $('.onlinePlayers__list').html(code);

        gui.setEventListenerOnOnlineUsers();
    };

    gui.setEventListenerOnAuth = function() {
        $(".authButton").click(function(event) {
            gui.login();

            // set other Event Listeners
            gui.setEventListenerOnSingleGame();
            gui.setEventListenerOnOnlineUsers();
        });
    };

    gui.setEventListenerOnSingleGame = function() {
        $('.startSingleGameButton').click(function(event) {
            gui.singleGame();
        });
    };

    gui.setEventListenerOnOnlineUsers = function() {
        $('.onlinePlayers__link').click(function(event) {
            event.preventDefault();

            onlineUser.sendRequestTo($(this).attr('href').slice(17));

            return false;
        });
    };

    function addListenersToOptions() {
        var options = $(".question__answer");

        options.each(function(index) {
            $(this).click(function(){
                if ($(this).text().indexOf(window.rightAnswer) != -1){
                    $(this).addClass("right");
                    gameVariables.addPoints();
                    gui.updatePoints();
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

                    timer.substractTime();
                    gui.updateTimer();

                    gui.updatePoints();
                    statistics.incMistakes_count();
                }
            })
        });
    }

    return gui;

});