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
    'security',
    'slick',
    'events'
], function($, vkapi, gameLogic, vibration, gameVariables, timer, statistics, onlineUser, chart, security, events, slick) {

    var gui = {};

    gui.login = function() {

        $('.authButton').addClass('loading');

        vkapi.loginUser().then(
            function(result) {

                console.log(result);
                vkapi.setId(result.user_id);

                onlineUser.identify(vkapi.getUserInfo());
                gui.updateStatistics();
                gui.updateNeighbors();

                $(".welcomeBlocks .rate, .about").addClass("bounceOutRight");
                $(".welcomeBlocks .descr").addClass("bounceOutLeft");
                setTimeout(function() {
                    $(".welcomeBlocks .rate, .welcomeBlocks .descr, .about").addClass("hidden");

                    $(".stats .rate.miniTop, .charts").addClass("bounceInRight").removeClass("hidden");
                    $(".modes, .rate.userTopRate").addClass("bounceInLeft").removeClass("hidden");

                    require('events').makeSlickSlider();
                    require('events').setEventListenerOnWindowResize();
                }, 1000);
            },
            function(error) {
                // вторая функция - запустится при вызове reject
                alert("Rejected: " + error); // error - аргумент reject
            }
        );

    };

    gui.drawQuestion = function(questionData, multiplayer) {
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

        if (multiplayer) {
            require('events').addListenersToOptionsForMultiplayerGame();
        } else {
            require('events').addListenersToOptionsForSingleGame();
        }

        $('.quiz.hidden').addClass('bounceInLeft').removeClass('hidden');
    };

    gui.updatePoints = function() {
        $("#onlinePoints").text(gameVariables.getScore());
    };

    gui.updateTimer = function() {
        $("#onlineSeconds").text(timer.getSecondsLeft());
    };

    gui.endGame = function() {
        $(".question").addClass('hidden');
        $('#gameResult').text(gameVariables.getScore());
        $(".gameResult").removeClass('hidden');

        $.post("/vl/sendGameResults", {
            user_id: vkapi.getId(),
            score: gameVariables.getScore(),
            statistics: statistics.getOneGameStatistics(),
            access_token: security.getToken()
        }, function(data) {
            gui.updateTopList();
            gui.updateNeighbors();
            gui.updateStatistics();
        });

    };

    gui.updateTopList = function() {
        $.post("/getTopList", {
            number: 5
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
                    barChartData.labels[i] = "Игра №" + (lastGamesData.countOfGames - lastGamesData.rows.length + i + 1).toString();
                    barChartData.data[lastGamesData.rows.length - 1 - i] = lastGamesData.rows[i].score;
                }

                console.log(pieChartData);
                console.log(barChartData);

                chart.drawCharts(pieChartData, {
                    labels: barChartData.labels,
                    data: barChartData.data
                });
            }, "json");

        }, "json");
    };

    gui.updateNeighbors = function(show) {
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
        });
    };

    gui.updateOnlinePlayersList = function(list) {
        var code = "";

        for (var i = 0; i < list.length; i++) {
            code += "<a href=\'https://vk.com/id" + list[i].id + "\' class='onlinePlayers__player'><img src='" +
                    list[i].img_src+ "' class='onlinePlayers__img' width='32' height='32'>" +
                    list[i].first_name + " " + list[i].last_name + "</a>"
        }

        $('.onlinePlayers__list').html(code);

        require('events').setEventListenerOnOnlineUsers();
    };

    gui.noSuchRoom = function() {
        $('.joinGame .errorSpan').removeClass('hidden');
    };

    gui.updateOnlineRoom = function(obj) {
        $('.joinGame .errorSpan').addClass('hidden');

        // updating online room users list
        var list = obj.list;

        var code = '<tr class="tableHead"><th>№</th><th>Имя</th><th>Баллов</th></tr>';

        for (var i = 0; i < list.length; i++) {
            code += "<td class ='number'>" + (i + 1)
                + "</td><td class='name'><a href='https://vk.com/id" + list[i].id
                + "' target = '_blank'>"+list[i].first_name + " " + list[i].last_name
                + "</a></td><td class='points'>" + list[i].points + "</td></tr>";
        }

        $('.roomOnline tbody').html(code);

        // update room key
        var key = obj.key;
        $('.styledInput.key input').val(key);

        if ($('.multiplayer').hasClass('hidden')) {
            $('.multiplayer').addClass('bounceInLeft').removeClass('hidden');
        }
    };

    return gui;

});