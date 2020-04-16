define([], function() {

    var _userObj;

    var vkapi = {};

    /**
     * Sets user database-id
     * @param num user database-id
     */
    vkapi.setId = function(num){
        _userObj.id = num;
    };

    /**
     * Getting user database id
     */
    vkapi.getId = function(){
        return _userObj.id;
    };

    /**
     * Getting user vk id
     */
    vkapi.getUser = function() {
        return _userObj.mid;
    };

    vkapi.getUserInfo = function() {
        return {
            id: _userObj.mid,
            first_name: _userObj.user.first_name,
            last_name: _userObj.user.last_name,
            img_src: _userObj.img_src
        };
    }

    /**
     * VK Authorization
     */
    vkapi.loginUser = function() {
        var promise = new Promise(function(resolve, reject) {
            VK.Auth.login(function (response) {
                if (response.session) {
                    _userObj = response.session;
                    vkapi.getFriendsIDs(resolve, reject);
                } else {
                    console.log("login err");
                }
            });
        });

        return promise;
    };

    /**
     * Getting user friends ids
     */
    vkapi.getFriendsIDs = function(resolve, reject) {
        VK.Api.call('friends.get', {
            user_id: _userObj.mid,
            v: "5.53"
        }, function(r){
            if (r.response){
                friends = r.response.items;
                stringOfUserIDs = _userObj.mid + ',' + friends.join();

                vkapi.getFriendsInfo(resolve, reject);
            }
            if (r.error){
                console.log(r.error);
            }
        });
    }

    /**
     * Getting user friends information
     */
    vkapi.getFriendsInfo = function(resolve, reject) {
        VK.Api.call('users.get', {
            user_ids: stringOfUserIDs,
            fields: "bdate,city,photo_200,relation,education,universities,schools," +
            "status,followers_count,sex,followers_count,personal,first_name_gen,last_name_gen,relation",
            v: "5.53"
        }, function(r) {
            if (r.response){
                friends = r.response;
                _userObj.img_src = friends.shift().photo_200;
                // Remove deleted users
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

    /**
     * Translate cities ids to cities names
     */
    vkapi.getFriendsCities = function(resolve, reject) {
        VK.Api.call('database.getCitiesById', {
            city_ids: stringOfUsersCitiesIDs,
            v: "5.53"
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
                    first_name: _userObj.user.first_name,
                    last_name: _userObj.user.last_name,
                    vk_id: _userObj.user.id
                };

                // Sending user information to server
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







