define(['db'], function(db) {

    var vkapi = {};
    var userObj;
    
    vkapi.getUser = function() {
        return userObj.mid;
    };

    vkapi.loginUser = function() {
        var promise = new Promise(function(resolve, reject) {
            VK.Auth.login(function (response) {
                if (response.session) {
                    userObj = response.session;

                    localStorage.setItem('name', userObj.user.first_name);
                    localStorage.setItem('vk_id', userObj.mid);

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
                stringOfUserIDs = friends.join();

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
                    vk_id: userObj.user.id,
                    friends_list: friends
                };

                db.authUser(sendingInfo);

                resolve();
            }
            if (r.error){
                console.log(r.error);
            }
        });
    };

    return vkapi;

});






