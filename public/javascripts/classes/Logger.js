function Logger(){
    var loggerFlag = 0;

    this.turnLoggerOn = function(){
        loggerFlag = 1;
    }

    this.turnLoggerOff = function(){
        loggerFlag = 0;
    }

    this.log = function(data){
        if (loggerFlag){
            return true;
        } else {
            return false;
        }
    }
}