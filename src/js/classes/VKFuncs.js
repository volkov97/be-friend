define([], function() {

    var vkapi = {};
    var userObj;

    vkapi.setId = function(num){
        userObj.id = num;
    };

    vkapi.getId = function(){
        return userObj.id;
    };
    
    vkapi.getUser = function() {
        return userObj.mid;
    };

    vkapi.getUserInfo = function() {
        return {
            id: userObj.mid,
            first_name: userObj.user.first_name,
            last_name: userObj.user.last_name,
            img_src: userObj.img_src
        };
    }

    vkapi.loginUser = function() {
        var promise = new Promise(function(resolve, reject) {
            VK.Auth.login(function (response) {
                if (response.session) {
                    userObj = response.session;
                    vkapi.getFriendsIDs(resolve, reject);
                } else {
                    console.log("login err");
                }
            });
        });

        return promise;
    };

    vkapi.getFriendsIDs = function(resolve, reject) {
        VK.Api.call('friends.get', {
            user_id: userObj.mid,
            version: "5.53"
        }, function(r){
            if (r.response){
                friends = r.response;
                stringOfUserIDs = userObj.mid + ',' + friends.join();

                vkapi.getFriendsInfo(resolve, reject);
            }
            if (r.error){
                console.log(r.error);
            }
        });
    }

    vkapi.getFriendsInfo = function(resolve, reject) {
        VK.Api.call('users.get', {
            user_ids: stringOfUserIDs,
            fields: "bdate,city,photo_200,relation,education,universities,schools,status,followers_count,sex,followers_count,personal,first_name_gen,last_name_gen,relation",
            version: "5.53"
        }, function(r) {
            if (r.response){
                friends = r.response;
                userObj.img_src = friends.shift().photo_200;
                friends = friends.filter(function(tempUser){
                    if (tempUser.deactivated == "deleted") {
                        return false;
                    } else {
                        return true;
                    }
                });

                stringOfUsersCitiesIDs = friends.map(function(obj) {
                    return obj.city;
                }).join();

                vkapi.getFriendsCities(resolve, reject);
            }
            if (r.error){
                console.log(r.error);
            }
        });
    };

    vkapi.getFriendsCities = function(resolve, reject) {
        VK.Api.call('database.getCitiesById', {
            city_ids: stringOfUsersCitiesIDs,
            version: "5.53"
        }, function(r){
            if (r.response){
                var cities = r.response;

                for (var i = 0; i < friends.length; i++) {

                    var cityId = friends[i].city;

                    for (var j = 0; j < cities.length; j++) {
                        if (cityId == cities[j].cid) {
                            friends[i].cityName = cities[j].name;
                        }
                    }

                }

                var sendingInfo = {
                    first_name: userObj.user.first_name,
                    last_name: userObj.user.last_name,
                    vk_id: userObj.user.id
                };

                $.post("/auth", sendingInfo, function(data) {
                    resolve(data);
                }, "json");
            }
            if (r.error){
                console.log(r.error);
            }
        });
    };

    return vkapi;

});







