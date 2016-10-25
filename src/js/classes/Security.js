define([
    'jquery',
    'jquery_cookie',
    'jquery_md5'
], function($, $.cookie, $.md5){

    var security = {
        getToken: getToken
    }

    function getToken(){

        return $.cookie($.md5('hashToken'));
    }

    return security;
})