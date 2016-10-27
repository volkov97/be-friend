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

                    $(".stats").removeClass("hidden");
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
        $questionText = $(".question__text");
        $questionProps = $(".question__properties");
        $questionAnswers = $(".question__answers");

        // adding question text
        var str = '<div class="question__text">' + questionData.questionObj.question + '</div>';

        // adding properties wrap
        str += '<div class="question__properties clearfix">';

        // adding image
        if (questionData.questionObj.withPhoto) {
            str += '<div class="question__image"><img src=\'' + questionData.rightUser.photo_200 + '\' class="question__img" width="200px" height="200px" alt="Quiz Question Image"></div>';
        }

        // answers
        str += '<div class="question__answers clearfix">';
        for (var i = 0; i < questionData.options.length; i++) {
            str += '<div class=question__answer>' + questionData.options[i] + '</div>';
        }
        str += '</div>';

        str += '</div>';

        if (multiplayer) {
            $('.quizForMultiplayerGame .question').html(str);
            if ($('.quizForMultiplayerGame').hasClass('hidden')) {
                $('.quizForMultiplayerGame').addClass('bounceInRight').removeClass('hidden');
            }
            if (!$('.roomInfo .waiting').hasClass('hidden')) {
                $('.roomInfo .waiting').addClass('hidden');
            }
            require('events').addListenersToOptionsForMultiplayerGame();
        } else {
            $('.quizForSingleGame .question').html(str);
            require('events').addListenersToOptionsForSingleGame();
        }
    };

    gui.updatePoints = function() {
        $("#onlinePoints").text(gameVariables.getScore());
    };

    gui.updateTimer = function() {
        $("#onlineSeconds").text(timer.getSecondsLeft());
    };

    gui.endGame = function(single) {

        if (single) {
            $(".quizForSingleGame .question").addClass('hidden');
            $('#gameResultPoints').text(gameVariables.getScore());
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
        } else {
            // find user's place in a table
            var table = $(".rate__table.roomOnline tr").each(function(index){
                if (index == 0) return true;
                var userName = this.getElementsByClassName("name")[0].innerText;
                if (userName == vkapi.getUserInfo().first_name + " " + vkapi.getUserInfo().last_name) {
                    $("#gameResultPlace").text(this.getElementsByClassName("number")[0].innerText);
                }
            });

            console.log(statistics.getOneGameStatistics());

            $(".quizForMultiplayerGame .question").addClass('hidden');

            $(".gameResult").removeClass('hidden');
        }


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
                var pieChartData = [stats.rightAnswers_count, stats.mistakes_count, stats.firstTryRightAnswers_count];

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
            var ms = data.list;

            // Check for error
            if (ms == -1){
                return;
            }

            var str = '<thead><tr class="tableHead"><th>№</th><th>Имя</th><th>Оценка</th></tr></thead><tbody>';

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
            str += '</tbody>';

            $('.userTopRate table.rate__table').html(str);
        });
    };

    // mode third block
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

    gui.showMultiplayerError = function(str) {
        $('.multiplayerMode .error').text(str).removeClass('hidden');
    };

    gui.showMultiplayerStartError = function(str) {
        $('.roomInfo .error').text(str).removeClass('hidden');
    };

    gui.updateOnlineRoom = function(obj) {
        $('.joinGame .errorSpan').addClass('hidden');

        // updating online room users list
        var list = obj.list;

        // sort list
        list.sort(function(a, b){
            return a.points < b.points ? 1 : -1;
        });

        var code = '<tr class="tableHead"><th>№</th><th>Имя</th><th>Баллов</th></tr><tdody>';

        for (var i = 0; i < list.length; i++) {
            code += "<td class ='number'>" + (i + 1)
                + "</td><td class='name'><a href='https://vk.com/id" + list[i].id
                + "' target = '_blank'>"+list[i].first_name + " " + list[i].last_name
                + "</a></td><td class='points'>" + list[i].points + "</td></tr>";
        }

        code += '</tdody>';

        $('.members .rate__table').html(code);

        // update room key
        var key = obj.key;
        $('.key.styledInput input').val(key);

        // for viewing
        if ($('.multiplayer').hasClass('hidden')) {
            $('.multiplayer').removeClass('bounceOutRight').addClass('bounceInLeft').removeClass('hidden');
        }

        // end game
        if (obj.endGame) {
            gui.endGame(false);
        }
    };

    return gui;

});