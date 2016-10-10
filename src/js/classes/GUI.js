define(['jquery', 'vkapi', 'gameLogic', 'vibration', 'gameVariables', 'timer', 'db', 'statistics'], function($, vkapi, gameLogic, vibration, gameVariables, timer, db, statistics) {

    var gui = {};

    gui.login = function() {

        $('.authButton').addClass('loading');

        vkapi.loginUser().then(
            function(result) {
                $(".about").addClass("fadeOut");
                setTimeout(function() {
                    $(".about").addClass("hidden");
                    $(".modes").removeClass("hidden").addClass("fadeIn");
                }, 1000);
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

    function addListenersToOptions(){
        var options = $(".question__answer");

        options.each(function(index) {
            $(this).click(function(){
                if ($(this).text().indexOf(window.rightAnswer) != -1){
                    $(this).addClass("right");
                    gameVariables.addPoints();
                    gui.updatePoints();

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
                }
            })
        });
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

        var promise = db.sendGameResults({
            vk_id: vkapi.getUser(),
            score: gameVariables.getScore(),
            statistics: statistics.getStatistics()
        });

        promise.then(
            function(result) {
                gui.updateTopList();
            },
            function(error) {
                console.log(error);
            }
        )

    };

    gui.updateTopList = function(){
        $.post("/getTopList", {
            number: 10
        }, function(data) {
            var str = '<tr class="tableHead"><th>№</th><th>Имя</th><th>Оценка</th></tr>';

            for (var i = 0; i<data.length; i++){
                str += "<tr><td class ='number'>"+(i+1)
                    +"</td><td class='name'><a href='https://vk.com/id"+data[i]["vk_id"]
                    +"' target = '_blank'>"+data[i]["first_name"]+" "+data[i]["last_name"]
                    +"</a></td><td class='points'>"+data[i]["maxScore"]+"</td></tr>";
            }

            $(".winners").html(str);
        }, "json");

    };

    return gui;

});
/*

    this.updateTopList = function(data){
        var winners = $(".winners");
        var str = '<tr class="tableHead"><th>№</th><th>Имя</th><th>Оценка</th></tr>';

        for (var i = 0; i<data.length; i++){
            str += "<tr><td class ='number'>"+(i+1)
                +"</td><td class='name'><a href='https://vk.com/id"+data[i]["vk_id"]
                +"' target = '_blank'>"+data[i]["first_name"]+" "+data[i]["last_name"]
                +"</a></td><td class='points'>"+data[i]["points"]+"</td></tr>";
        }

        winners.html(str);

        window.gui.prepareDrawUsersRate();
    }

    this.prepareDrawUsersRate = function(){
        var userResultHeader = $(".userResult__header");
        var userResultMain = $(".userResult__main");

        if (localStorage.getItem('vk_id')){
            var str = "Привет, " + localStorage.getItem('name')
                + "!<br>Это твой лучший результат в рейтинге!";
            userResultHeader.html(str);

            // Search neibours for user in the table
            window.db.getNearbyRecords(localStorage.getItem('vk_id'), window.gui.drawUsersRate);
        } else {
            var str = "Здесь может быть твое имя!"
                + "<br>Соревнуйся за звание лучшего друга планеты!";
            userResultHeader.html(str);
            str = "<div class='row'><div class='userResult__fakeImage'><img src='images/vkQuizTable.png'></div></div>";
            userResultMain.html(str);
        }
    }

    this.drawUsersRate = function(loginnedUser){
        var usersRate = $(".userResult__main");
        var str = '<div class="row"><div class="userMark col-sm-4"><div class="mark">'
            +loginnedUser.neighbors[loginnedUser.currentIndex].points+'</div>баллов</div>'
            +'<div class="userRate col-sm-8"><table class="rate__table userRateTable">';
        var setClass;

        for (var i = 0; i < loginnedUser.neighbors.length; i++){
            if (!loginnedUser.neighbors[i]){
                continue;
            }
            if (i == loginnedUser.currentIndex){
                setClass = "class='currentUser'";
            } else {
                setClass = '';
            }

            str += '<tr '+setClass+'><td class="number">'+loginnedUser.neighborsNums[i]
                +'</td><td class="name">'
                +'<a href="https://vk.com/id'+loginnedUser.neighbors[i].vk_id+'" target = "_blank">'
                +loginnedUser.neighbors[i].first_name+' '+loginnedUser.neighbors[i].last_name
                +'</a></td><td class="points">'+loginnedUser.neighbors[i].points+'</td></tr>';
        }

        str += '</table></div></div>';
        logger.log(str);
        logger.log("BATYA");
        usersRate.html(str);
    }

}
*/
