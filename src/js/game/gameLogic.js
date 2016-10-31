define([], function() {

    var _questionNumbersToSelect = [];

    var _quiz = [
        {
            // [0]
            question: "Кто из ваших друзей изображен на этом фото?",
            withPhoto: true,
            users_available: [],
            chooseOptions: function(){
                // Man -> 2, Woman -> 1
                var randomSex = Math.ceil(Math.random() * 2);

                this.users_available = this.users_available.filter(function(tempUser){
                    if (tempUser.sex != randomSex){
                        return false;
                    } else {
                        return true;
                    }
                });

                // Mix available users
                this.users_available.sort(function(a, b) {
                    return Math.random() - 0.5;
                });

                // Choose right answer
                gameLogic.setRightAnswer(this.users_available[0].first_name + " " + this.users_available[0].last_name);

                // Return info about chosen user and 4 answer options
                var result = [
                    this.users_available[0],
                    gameLogic.getRightAnswer(),
                    this.users_available[1].first_name + " " + this.users_available[1].last_name,
                    this.users_available[2].first_name + " " + this.users_available[2].last_name,
                    this.users_available[3].first_name + " " + this.users_available[3].last_name
                ];

                return result;
            },
            getAvailableUsers: function(){
                // Filter users without photo
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
                // Create cities list without duplicates
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

                // Delete right answer from list
                citiesWithoutDuplicates = citiesWithoutDuplicates.filter(function(tempCity){
                    if (tempCity == randomUser.cityName){
                        return false;
                    } else {
                        return true;
                    }
                });

                // Mix cities
                citiesWithoutDuplicates.sort(function(a, b) {
                    return Math.random() - 0.5;
                });

                // Return info about chosen user and 4 answer options
                var result = [
                    randomUser,
                    randomUser.cityName,
                    citiesWithoutDuplicates[0],
                    citiesWithoutDuplicates[1],
                    citiesWithoutDuplicates[2]
                ];

                gameLogic.setRightAnswer(randomUser.cityName);

                return result;
            },
            getAvailableUsers: function(){
                // Filter users without photo and city
                this.users_available = friends.filter(function(tempUser){
                    if ((!tempUser.photo_200) || (tempUser.city == 0) ||
                        (tempUser.photo_200.indexOf("camera_200") != -1 )) {
                        return false;
                    } else {
                        return true;
                    }
                });
            }
        },
        {
            // [2]
            question: "",
            users_available: [],
            withPhoto: false,
            chooseOptions: function(){
                var tempFriends = friends;

                var randomUser = this.users_available[Math.floor(Math.random() * this.users_available.length)];

                // Mix friends list
                tempFriends.sort(function(a, b) {
                    return Math.random() - 0.5;
                });

                // Create question
                this.question = 'Кому принадлежит этот статус: "' + randomUser.status + '" ?';

                // Return info about chosen user and 4 answer options
                var result = [
                    randomUser,
                    randomUser.first_name + " " + randomUser.last_name,
                    tempFriends[0].first_name + " " + tempFriends[0].last_name,
                    tempFriends[1].first_name + " " + tempFriends[1].last_name,
                    tempFriends[2].first_name + " " + tempFriends[2].last_name
                ];

                gameLogic.setRightAnswer(randomUser.first_name + " " + randomUser.last_name);

                return result;
            },
            getAvailableUsers: function(){
                // Filter users without status
                this.users_available = friends.filter(function(obj){
                    if (obj.status == ""){
                        return false;
                    } else {
                        return true;
                    }
                });
            }
        },
        {
            // [3]
            question: "",
            users_available: [],
            withPhoto: false,
            chooseOptions: function(){
                var randomUser = this.users_available[Math.floor(Math.random() * this.users_available.length)];
                var endOfWord = ' ';
                // Change ending of word depending on the sex
                if (randomUser.sex == 2){
                    endOfWord = "(-лся) ";
                } else {
                    endOfWord = "(-лась) ";
                }

                // Create question
                this.question = "В каком из университетов учится" + endOfWord +
                    randomUser.first_name + " " + randomUser.last_name + " ?";

                var universities = this.users_available.map(function(obj) {
                    return obj.universities[0].name;
                });

                var universitiesWithoutDuplicates = [];
                // Create universities list without duplicates
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

                // Delete right answer
                universitiesWithoutDuplicates = universitiesWithoutDuplicates.filter(function(tempUniversity){
                    return tempUniversity != randomUser.universities[0].name;
                });

                // Mix list
                universitiesWithoutDuplicates.sort(function(a, b) {
                    return Math.random() - 0.5;
                });

                // Return info about chosen user and 4 answer options
                var result = [
                    randomUser,
                    randomUser.universities[0].name,
                    universitiesWithoutDuplicates[0],
                    universitiesWithoutDuplicates[1],
                    universitiesWithoutDuplicates[2]
                ];

                gameLogic.setRightAnswer(randomUser.universities[0].name);

                return result;
            },
            getAvailableUsers: function(){
                // Filter friends without universities info
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
            question: "",
            users_available: [],
            withPhoto: false,
            chooseOptions: function(){
                var randomUser = this.users_available[Math.floor(Math.random() * this.users_available.length)];

                // Create question
                this.question = "Кто из нижеперечисленных людей учится(-лся, -лась) в " +
                    randomUser.universities[0].name + " ?";

                // Filter friends, who studied at the same uni as selected friend
                this.users_available = this.users_available.filter(function(obj){
                    for (var i = 0; i<obj.universities.length; i++){
                        if (obj.universities[i].name == randomUser.universities[0].name){
                            flag = 1;
                            return false;
                        }
                    }
                    return true;
                });

                // Mix list
                this.users_available.sort(function(a, b) {
                    return Math.random() - 0.5;
                });

                // Return info about chosen user and 4 answer options
                var result = [
                    randomUser,
                    randomUser.first_name + " " + randomUser.last_name,
                    this.users_available[0].first_name + " " + this.users_available[0].last_name,
                    this.users_available[1].first_name + " " + this.users_available[1].last_name,
                    this.users_available[2].first_name + " " + this.users_available[2].last_name,
                ];

                gameLogic.setRightAnswer(randomUser.first_name + " " + randomUser.last_name);

                return result;
            },
            getAvailableUsers: function(){
                // Filter friends without universities info
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
                var months = ["Январь", "Февраль", "Март", "Апрель", "Май",
                    "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
                var randomUser = this.users_available[Math.floor(Math.random() * this.users_available.length)];
                var monthNumber;
                // Create question
                this.question = "В каком месяце родился " + randomUser.first_name + " " + randomUser.last_name + " ?";

                // Getting number of month from data
                if (randomUser.bdate.indexOf(".") == randomUser.bdate.lastIndexOf(".")) {
                    // If DD.MM format
                    monthNumber = randomUser.bdate.slice(randomUser.bdate.indexOf(".") + 1);
                } else {
                    // If DD.MM.YYYY format
                    monthNumber = randomUser.bdate.slice(randomUser.bdate.indexOf(".") + 1,
                        randomUser.bdate.lastIndexOf("."));
                }

                gameLogic.setRightAnswer(months[monthNumber - 1]);

                // Delete right answer
                months.splice(monthNumber - 1, 1);

                // Mix list
                months.sort(function(a, b) {
                    return Math.random() - 0.5;
                });

                // Return info about chosen user and 4 answer options
                var result = [
                    randomUser,
                    gameLogic.getRightAnswer(),
                    months[0],
                    months[1],
                    months[2]
                ];

                return result;
            },
            getAvailableUsers: function(){
                this.users_available = friends.filter(function(tempUser){
                    // Filter friends without birthdate and photo
                    if ((!tempUser.bdate) || (tempUser.photo_200==undefined) ||
                        (tempUser.photo_200.indexOf("camera_200") != -1 ) || (tempUser.bdate==undefined)){
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

                // Create question
                this.question = "Как " + randomUser.first_name + " " + randomUser.last_name + " относится к курению ?";

                gameLogic.setRightAnswer(opinions[randomUser.personal.smoking - 1]);

                // Delete right answer
                opinions.splice(randomUser.personal.smoking - 1, 1);

                // Mix list
                opinions.sort(function(a, b) {
                    return Math.random() - 0.5;
                });

                // Return info about chosen user and 4 answer options
                var result = [
                    randomUser,
                    gameLogic.getRightAnswer(),
                    opinions[0],
                    opinions[1],
                    opinions[2]
                ];

                return result;
            },
            getAvailableUsers: function(){
                this.users_available = friends.filter(function(tempUser){
                    // Filter friends without personal information about smoking
                    if ((!tempUser.personal) || (tempUser.personal.smoking == "undefined") ||
                        (!tempUser.personal.smoking)){
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

                // Create question
                this.question = "Как " + randomUser.first_name + " " + randomUser.last_name + " относится к алкоголю ?";

                gameLogic.setRightAnswer(opinions[randomUser.personal.alcohol - 1]);

                // Delete right answer
                opinions.splice(randomUser.personal.alcohol - 1, 1);

                // Mix list
                opinions.sort(function(a, b) {
                    return Math.random() - 0.5;
                });

                // Return info about chosen user and 4 answer optionss
                var result = [
                    randomUser,
                    gameLogic.getRightAnswer(),
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
                var opinions = ["Семья и дети", "Карьера и деньги", "Развлечения и отдых",
                    "Наука и исследования", "Совершенствование мира", "Саморазвитие",
                    "Красота и искусство", "Слава и влияние"];

                // Create question
                this.question = "Что для " + randomUser.first_name_gen + " " + randomUser.last_name_gen + " главное в жизни ?";

                gameLogic.setRightAnswer(opinions[randomUser.personal.life_main - 1]);

                // Delete right answer
                opinions.splice(randomUser.personal.life_main - 1, 1);

                // Mix list
                opinions.sort(function(a, b) {
                    return Math.random() - 0.5;
                });

                // Return info about chosen user and 4 answer options
                var result = [
                    randomUser,
                    gameLogic.getRightAnswer(),
                    opinions[0],
                    opinions[1],
                    opinions[2]
                ];

                return result;
            },
            getAvailableUsers: function(){
                this.users_available = friends.filter(function(tempUser){
                    // Filter friends without personal info
                    if ((!tempUser.personal) || (tempUser.personal.life_main == "undefined") ||
                        (!tempUser.personal.life_main)){
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
                    // Woman
                    opinions = ["Не замужем", "Есть друг", "Помолвлена", "Замужем",
                        "Всё сложно", "В активном поиске", "Влюблена"];
                } else {
                    // Man
                    opinions = ["Не женат", "Есть подруга", "Помолвлен", "Женат",
                        "Всё сложно", "В активном поиске", "Влюблён"];
                }

                // Create question
                this.question = "Семейное положение " + randomUser.first_name_gen + " "
                    + randomUser.last_name_gen + " ?";

                gameLogic.setRightAnswer(opinions[randomUser.relation - 1]);

                // Delete right answer
                opinions.splice(randomUser.relation - 1, 1);

                // Mix list
                opinions.sort(function(a, b) {
                    return Math.random() - 0.5;
                });

                // Return info about chosen user and 4 answer options
                var result = [
                    randomUser,
                    gameLogic.getRightAnswer(),
                    opinions[0],
                    opinions[1],
                    opinions[2]
                ];

                return result;
            },
            getAvailableUsers: function(){
                // Filter friends without relation info
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

    /**
     * Get number of generated question without repeats
     */
    function _getNumberOfQuestion(){
        if (_questionNumbersToSelect.length == 0){
            for (var i = 0; i < _quiz.length; i++){
                _questionNumbersToSelect[i] = i;
            }
        }

        var randomSelect = Math.round(Math.random() * (_questionNumbersToSelect.length - 1));
        var returnValue = _questionNumbersToSelect[randomSelect];
        _questionNumbersToSelect.splice(randomSelect, 1);

        return returnValue;
    }

    var gameLogic = {
        rightAnswer: ""
    };

    gameLogic.getRightAnswer = function() {
        return gameLogic.rightAnswer;
    };

    gameLogic.setRightAnswer = function(str) {
        gameLogic.rightAnswer = str;
    };

    /**
     * Chose question, returns main information about it: options, right answer
     * @param typeNum number of generate question
     */
    gameLogic.makeNewQuestion = function(typeNum) {

        if (typeNum < 0 || typeNum >= _quiz.length) return false;

        var questionObj = _quiz[typeNum || _getNumberOfQuestion()];
        questionObj.getAvailableUsers();
        var options = questionObj.chooseOptions();
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
    };

    return gameLogic;
});



