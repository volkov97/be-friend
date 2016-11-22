define(
    [
        'jquery',
        'jquery_cookie',
        'jquery_md5'
    ],
    function(
        $
    ) {

        var security = {};

        security.getToken = function() {
            return $.cookie('hashToken');
        };

        return security;
    }
);