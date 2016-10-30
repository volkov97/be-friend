authButton.click(function(e) {

    friends = [];

    VK.Auth.login(function(response){
        if (response.session){
            userObj = response.session;

            localStorage.setItem('name', userObj.user.first_name);
            localStorage.setItem('vk_id', userObj.mid);

            getFriendsIDs();
        } else {
            console.log("login err");
        }
    });

    return false;
});

startButton.click(function(e) {

    $.post("/getFriends", {
        id: localStorage.getItem('vk_id')
    }, function( data ) {
        // todo
    }, "json");

    return false;
});
