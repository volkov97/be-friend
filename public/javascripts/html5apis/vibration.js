define([], function() {

    var vibration = {};

    vibration.vibrate = function(val){
        if("vibrate" in navigator) return navigator.vibrate(val);
        if("oVibrate" in navigator) return navigator.oVibrate(val);
        if("mozVibrate" in navigator) return navigator.mozVibrate(val);
        if("webkitVibrate" in navigator) return navigator.webkitVibrate(val);

        // Error
        console.warn("Vibrate API is not supported on your device.");
    };

    return vibration;

});


