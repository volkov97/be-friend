define([], function() {

    var obj = {};

    obj.vibrate = function(val){
        if("vibrate" in navigator) return navigator.vibrate(val);
        if("oVibrate" in navigator) return navigator.oVibrate(val);
        if("mozVibrate" in navigator) return navigator.mozVibrate(val);
        if("webkitVibrate" in navigator) return navigator.webkitVibrate(val);

        // error
    }

    return obj;

});


