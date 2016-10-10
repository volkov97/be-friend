define([], function() {

    var gameLogic = {};
    var questionNumbersToSelect = [];

    var quiz = [
        {
            // [0]
            question: "Кто из ваших друзей изображен на этом фото?",
            withPhoto: true,
            users_available: [],
            chooseOptions: function(){

                // M -> 2, Ж -> 1
                var randomSex = Math.ceil(Math.random() * 2);

                // Что делать если мало друзей такого пола ?
                this.users_available = this.users_available.filter(function(tempUser){
                    if (tempUser.sex != randomSex){
                        return false;
                    } else {
                        return true;
                    }
                });

                this.users_available.sort(function(a, b) {
                    return Math.random() - 0.5;
                });

                window.rightAnswer = this.users_available[0].first_name + " " + this.users_available[0].last_name;

                var result = [
                    this.users_available[0],
                    window.rightAnswer,
                    this.users_available[1].first_name + " " + this.users_available[1].last_name,
                    this.users_available[2].first_name + " " + this.users_available[2].last_name,
                    this.users_available[3].first_name + " " + this.users_available[3].last_name
                ];

                return result;
            },
            getAvailableUsers: function(){
                this.users_available = friends.filter(function(tempUser){
                    if ((!tempUser.photo_200) || (tempUser.photo_200.indexOf("camera_200") != -1)) {
                        return false;
                    } else {
                        return true;
                    }
                });
            }
        },
        {
            // [1]
            question: "Из какого города человек, изображенный на фото?",
            withPhoto: true,
            users_available: [],
            chooseOptions: function(){
                var randomUser = this.users_available[Math.floor(Math.random() * this.users_available.length)];

                var cities = this.users_available.map(function(obj) {
                    return obj.cityName;
                });

                var citiesWithoutDuplicates = [];
                for (var i = 0; i < cities.length; i++) {
                    var fl = 0;

                    for (var j = 0; j < citiesWithoutDuplicates.length; j++) {
                        if (cities[i] == citiesWithoutDuplicates[j]) {
                            fl = 1;
                            break;
                        }
                    }

                    if (fl == 0) {
                        citiesWithoutDuplicates.push(cities[i]);
                    }
                }

                citiesWithoutDuplicates = citiesWithoutDuplicates.filter(function(tempCity){
                    if (tempCity == randomUser.cityName){
                        return false;
                    } else {
                        return true;
                    }
                })

                citiesWithoutDuplicates.sort(function(a, b) {
                    return Math.random() - 0.5;
                });

                var result = [
                    randomUser,
                    randomUser.cityName,
                    citiesWithoutDuplicates[0],
                    citiesWithoutDuplicates[1],
                    citiesWithoutDuplicates[2]
                ];

                window.rightAnswer = randomUser.cityName;

                return result;
            },
            getAvailableUsers: function(){
                this.users_available = friends.filter(function(tempUser){
                    // undefined ?
                    if ((!tempUser.photo_200) || (tempUser.city == 0) ||  (tempUser.photo_200.indexOf("camera_200") != -1 )) {
                        return false;
                    } else {
                        return true;
                    }
                });
            }
        },
        {
            // [2]
            // Вопрос о статусе
            question: "",
            users_available: [],
            withPhoto: false,
            chooseOptions: function(){
                var tempFriends = friends;

                var randomUser = this.users_available[Math.floor(Math.random() * this.users_available.length)];

                tempFriends.sort(function(a, b) {
                    return Math.random() - 0.5;
                });

                // Дополняем вопрос
                this.question = 'Кому принадлежит этот статус: "' + randomUser.status + '" ?';

                var result = [
                    randomUser,
                    randomUser.first_name + " " + randomUser.last_name,
                    tempFriends[0].first_name + " " + tempFriends[0].last_name,
                    tempFriends[1].first_name + " " + tempFriends[1].last_name,
                    tempFriends[2].first_name + " " + tempFriends[2].last_name
                ];

                window.rightAnswer = randomUser.first_name + " " + randomUser.last_name;

                return result;
            },
            getAvailableUsers: function(){
                this.users_available = friends.filter(function(obj){
                    if (obj.status == ""){
                        return false;
                    } else {
                        return true;
                    }
                });
            },
        },
        {
            // [3]
            question: "",
            users_available: [],
            withPhoto: false,
            chooseOptions: function(){
                var randomUser = this.users_available[Math.floor(Math.random() * this.users_available.length)];
                var endOfWord = ' ';
                // Генерируем вопрос
                if (randomUser.sex == 2){
                    endOfWord = "(-лся) ";
                } else {
                    endOfWord = "(-лась) ";
                }

                this.question = "В каком из университетов учится" + endOfWord + randomUser.first_name + " " + randomUser.last_name + " ?";

                var universities = this.users_available.map(function(obj) {
                    return obj.universities[0].name;
                });

                var universitiesWithoutDuplicates = [];
                for (var i = 0; i < universities.length; i++) {
                    var fl = 0;

                    for (var j = 0; j < universitiesWithoutDuplicates.length; j++) {
                        if (universities[i] == universitiesWithoutDuplicates[j]) {
                            fl = 1;
                            break;
                        }
                    }

                    if (fl == 0) {
                        universitiesWithoutDuplicates.push(universities[i]);
                    }
                }

                universitiesWithoutDuplicates = universitiesWithoutDuplicates.filter(function(tempUniversity){
                    if (tempUniversity == randomUser.universities[0].name){
                        return false;
                    } else {
                        return true;
                    }
                })

                universitiesWithoutDuplicates.sort(function(a, b) {
                    return Math.random() - 0.5;
                });

                var result = [
                    randomUser,
                    randomUser.universities[0].name,
                    universitiesWithoutDuplicates[0],
                    universitiesWithoutDuplicates[1],
                    universitiesWithoutDuplicates[2]
                ];

                window.rightAnswer = randomUser.universities[0].name;

                return result;
            },
            getAvailableUsers: function(){
                // Выкидываем тех, у кого поле universities пустое или отсутствует вовсе
                this.users_available = friends.filter(function(obj){
                    if ((!obj.universities) || (obj.universities.lenght < 1) || (obj.university == 0)){
                        return false;
                    } else {
                        return true;
                    }
                });
            }
        },
        {
            // [4]
            quetion: "",
            users_available: [],
            withPhoto: false,
            chooseOptions: function(){
                var randomUser = this.users_available[Math.floor(Math.random() * this.users_available.length)];
                var endOfWord = ' ';
                // Генерируем вопрос
                this.question = "Кто из нижеперечисленных людей учится(-лся, -лась) в " + randomUser.universities[0].name + " ?";

                // Удаляем юзеров, которые учились в том же универе, что и выбранный
                this.users_available = this.users_available.filter(function(obj){
                    for (var i = 0; i<obj.universities.length; i++){
                        if (obj.universities[i].name == randomUser.universities[0].name){
                            flag = 1;
                            return false;
                        }
                    }
                    return true;
                });

                // Перемешиваем массив
                this.users_available.sort(function(a, b) {
                    return Math.random() - 0.5;
                });

                var result = [
                    randomUser,
                    randomUser.first_name + " " + randomUser.last_name,
                    this.users_available[0].first_name + " " + this.users_available[0].last_name,
                    this.users_available[1].first_name + " " + this.users_available[1].last_name,
                    this.users_available[2].first_name + " " + this.users_available[2].last_name,
                ];

                window.rightAnswer = randomUser.first_name + " " + randomUser.last_name;

                return result;
            },
            getAvailableUsers: function(){
                this.users_available = friends.filter(function(obj){
                    if ((!obj.universities) || (obj.universities.lenght < 1) || (obj.university == 0)){
                        return false;
                    } else {
                        return true;
                    }
                });
            }
        },
        {
            // [5]
            question: "",
            users_available: [],
            withPhoto: true,
            chooseOptions: function(){
                var months = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
                var randomUser = this.users_available[Math.floor(Math.random() * this.users_available.length)];
                var monthNumber;
                // Генерируем вопрос
                this.question = "В каком месяце родился " + randomUser.first_name + " " + randomUser.last_name + " ?";

                // Отделяем номер месяца из даты
                if (randomUser.bdate.indexOf(".") == randomUser.bdate.lastIndexOf(".")) { // если дата в формате XX.YY с одной точкой
                    monthNumber = randomUser.bdate.slice(randomUser.bdate.indexOf(".") + 1);
                } else { // если формат с двумя точками XX.YY.ZZZZ
                    monthNumber = randomUser.bdate.slice(randomUser.bdate.indexOf(".") + 1, randomUser.bdate.lastIndexOf("."));
                };

                window.rightAnswer = months[monthNumber - 1];

                months.splice(monthNumber - 1, 1);

                // Перемешиваем массив
                months.sort(function(a, b) {
                    return Math.random() - 0.5;
                });

                var result = [
                    randomUser,
                    window.rightAnswer,
                    months[0],
                    months[1],
                    months[2]
                ];

                return result;
            },
            getAvailableUsers: function(){
                this.users_available = friends.filter(function(tempUser){
                    if ((!tempUser.bdate) || (tempUser.photo_200==undefined) || (tempUser.photo_200.indexOf("camera_200") != -1 ) || (tempUser.bdate==undefined)){
                        return false;
                    } else {
                        return true;
                    }
                });
            }
        },
        {
            // [6]
            question: "",
            users_available: [],
            withPhoto: true,
            chooseOptions: function(){
                var randomUser = this.users_available[Math.floor(Math.random() * this.users_available.length)];
                var opinions = ["Резко негативно", "Негативно", "Компромиссно", "Нейтрально", "Положительно"];

                // Генерируем вопрос
                this.question = "Как " + randomUser.first_name + " " + randomUser.last_name + " относится к курению ?";

                window.rightAnswer = opinions[randomUser.personal.smoking - 1];

                opinions.splice(randomUser.personal.smoking - 1, 1);

                // Перемешиваем массив
                opinions.sort(function(a, b) {
                    return Math.random() - 0.5;
                });

                var result = [
                    randomUser,
                    window.rightAnswer,
                    opinions[0],
                    opinions[1],
                    opinions[2]
                ];

                return result;
            },
            getAvailableUsers: function(){
                this.users_available = friends.filter(function(tempUser){
                    if ((!tempUser.personal) || (tempUser.personal.smoking == "undefined") || (!tempUser.personal.smoking)){
                        return false;
                    } else {
                        return true;
                    }
                });
            }
        },
        {
            // [7]
            question: "",
            users_available: [],
            withPhoto: true,
            chooseOptions: function(){
                var randomUser = this.users_available[Math.floor(Math.random() * this.users_available.length)];
                var opinions = ["Резко негативно", "Негативно", "Компромиссно", "Нейтрально", "Положительно"];

                // Генерируем вопрос
                this.question = "Как " + randomUser.first_name + " " + randomUser.last_name + " относится к алкоголю ?";

                window.rightAnswer = opinions[randomUser.personal.alcohol - 1];

                //console.log(randomUser);
                //console.log(window.rightAnswer);

                opinions.splice(randomUser.personal.alcohol - 1, 1);

                //console.log(opinions);

                // Перемешиваем массив
                opinions.sort(function(a, b) {
                    return Math.random() - 0.5;
                });

                var result = [
                    randomUser,
                    window.rightAnswer,
                    opinions[0],
                    opinions[1],
                    opinions[2]
                ];

                return result;
            },
            getAvailableUsers: function(){
                this.users_available = friends.filter(function(tempUser){
                    if ((!tempUser.personal) || (tempUser.personal.alcohol == "undefined") || (!tempUser.personal.alcohol)){
                        return false;
                    } else {
                        return true;
                    }
                });
            }
        },
        {
            // [8]
            question: "",
            users_available: [],
            withPhoto: true,
            chooseOptions: function(){
                var randomUser = this.users_available[Math.floor(Math.random() * this.users_available.length)];
                var opinions = ["Семья и дети", "Карьера и деньги", "Развлечения и отдых", "Наука и исследования", "Совершенствование мира", "Саморазвитие", "Красота и искусство", "Слава и влияние"];

                // Генерируем вопрос
                this.question = "Что для " + randomUser.first_name_gen + " " + randomUser.last_name_gen + " главное в жизни ?";

                window.rightAnswer = opinions[randomUser.personal.life_main - 1];

                opinions.splice(randomUser.personal.life_main - 1, 1);

                // Перемешиваем массив
                opinions.sort(function(a, b) {
                    return Math.random() - 0.5;
                });

                var result = [
                    randomUser,
                    window.rightAnswer,
                    opinions[0],
                    opinions[1],
                    opinions[2]
                ];

                return result;
            },
            getAvailableUsers: function(){
                this.users_available = friends.filter(function(tempUser){
                    if ((!tempUser.personal) || (tempUser.personal.life_main == "undefined") || (!tempUser.personal.life_main)){
                        return false;
                    } else {
                        return true;
                    }
                });
            }
        },
        {
            // [9]
            question: "",
            users_available: [],
            withPhoto: true,
            chooseOptions: function(){
                var randomUser = this.users_available[Math.floor(Math.random() * this.users_available.length)];
                var opinions = [];
                if (randomUser.sex == 1){
                    opinions = ["Не замужем", "Есть друг", "Помолвлена", "Замужем", "Всё сложно", "В активном поиске", "Влюблена"];
                } else {
                    opinions = ["Не женат", "Есть подруга", "Помолвлен", "Женат", "Всё сложно", "В активном поиске", "Влюблён"];
                }

                this.question = "Семейное положение " + randomUser.first_name_gen + " " + randomUser.last_name_gen + " ?";

                window.rightAnswer = opinions[randomUser.relation - 1];

                opinions.splice(randomUser.relation - 1, 1);

                // Перемешиваем массив
                opinions.sort(function(a, b) {
                    return Math.random() - 0.5;
                });

                var result = [
                    randomUser,
                    window.rightAnswer,
                    opinions[0],
                    opinions[1],
                    opinions[2]
                ];

                return result;
            },
            getAvailableUsers: function(){
                this.users_available = friends.filter(function(tempUser){
                    if ((tempUser.relation == 0) || (tempUser.relation == undefined)){
                        return false
                    } else {
                        return true;
                    }
                });
            }
        }
    ];

    function getNumberOfQuestion(){
        if (questionNumbersToSelect.length == 0){
            for (var i = 0; i<quiz.length; i++){
                questionNumbersToSelect[i] = i;
            }
        }

        var randomSelect = Math.round(Math.random() * (questionNumbersToSelect.length - 1));
        var returnValue = questionNumbersToSelect[randomSelect];
        questionNumbersToSelect.splice(randomSelect, 1);

        return returnValue;
    }

    gameLogic.makeNewQuestion = function() {
        var questionObj = quiz[getNumberOfQuestion()];
        questionObj.getAvailableUsers();
        var options = questionObj.chooseOptions();
        //console.log(options);
        var rightAnswerUser = options[1];
        var rightUser = options[0];

        options = options.slice(1);
        function compareRandom(a, b){
            return Math.random() - 0.5;
        }
        options.sort(compareRandom);

        var questionData = {
            questionObj: questionObj,
            options: options,
            rightUser: rightUser,
            rightAnswerUser: rightAnswerUser
        };

        delete questionObj.users_available;

        return questionData;
    }

    return gameLogic;
});



