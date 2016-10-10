define([], function() {

    var db = {};

    db.authUser = function(obj) {
        $.post("/auth", obj, function(data) {
            console.log(data);
        }, "json");
    };

    db.sendGameResults = function(obj, callback) {
        return new Promise(function(resolve, reject) {
            $.post("/sendGameResults", obj, function(data) {
                console.log(data);
                resolve(data);
            });
        })
    };

    return db;

});
/*
    // All records
    this.getRecords = function() {
        $.post("php/addRecordAction.php", {
            typeOfActivity: "getRecordsJSONAct"
        } , function( data ) {
            //console.log(data);
        }, "json");

        sendPostRequest("php/addRecordAction.php", {
            typeOfActivity: "getRecordsJSONAct"
        });
    }

    this.addRecord = function(obj, getFirstRecordsJSON) {
        logger.log("addRecordBeforePost");
        $.post("php/addRecordAction.php", {
            typeOfActivity: "addRecordAct",
            first_name: obj.name,
            last_name: obj.surname,
            vk_id: obj.id,
            points: obj.score
        }, function(){
            logger.log("addRecord");
            if (typeof(getFirstRecordsJSON) == 'function'){
                logger.log("addRecordINIF");
                getFirstRecordsJSON(10, window.gui.updateTopList);
            }
        });
    }

    // TOP {X} records
    this.getFirstRecordsJSON = function(counter, updateUI) {
        $.post("php/addRecordAction.php", {
            typeOfActivity: "getFirstRecordsJSONAct",
            count: counter
        }, function(data){
            logger.log("getFirstRecordsJSON");
            if (typeof(updateUI) == 'function'){
                updateUI(data);
                logger.log("getFirstRecordsJSONINIF");
            }
        }, "json");
    }

    // Neighbors in DB
    this.getNearbyRecords = function(vk_id, drawUsersRate){
        $.post("php/addRecordAction.php", {
            typeOfActivity: "getRecordsJSONAct"
        }, function(data){
            if (typeof(drawUsersRate) == 'function'){
                var loginnedUser = {
                    neighbors: [],
                    currentIndex: 0,
                    neighborsNums: []
                };
                for (var i = 0; i<data.length; i++){
                    // Finding loginned user in database
                    if (data[i].vk_id == vk_id){
                        if (i == 0){
                            // if this user FIRST
                            loginnedUser.neighbors.push(data[i], data[i+1], data[i+2]);
                            loginnedUser.neighborsNums.push(i+1, i+2, i+3);
                            loginnedUser.currentIndex = 0;
                        } else if (i == data.length - 1){
                            // if this user LAST
                            loginnedUser.neighbors.push(data[i-2], data[i-1], data[i]);
                            loginnedUser.neighborsNums.push(i-1, i, i+1);
                            loginnedUser.currentIndex = 2;
                        } else {
                            // Middle of the database
                            loginnedUser.neighbors.push(data[i-1], data[i], data[i+1]);
                            loginnedUser.neighborsNums.push(i, i+1, i+2);
                            loginnedUser.currentIndex = 1;
                        }
                        break;
                    }
                }
                drawUsersRate(loginnedUser);
            }
        }, "json");
    }

    // Send user info to php
    this.sendUserInfo = function() {
        $.post("php/addRecordAction.php", {
            typeOfActivity: "sendUserInfoAct",
            vk_id: userObj.mid
        });
    }

}
*/