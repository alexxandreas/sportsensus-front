(function () {

    "use strict";
    angular.module('SportsensusApp')
        .factory('UserSrv', UserSrv);

    // инициализируем сервис
    angular.module('SportsensusApp').run(['UserSrv', function(UserSrv) {

    }]);

    // angula
    // r.module('SportsensusApp').run(UserSrv.init);

    UserSrv.$inject = [
        '$rootScope',
        '$q',
        'ApiSrv'
    ];


    function UserSrv(
        $rootScope,
        $q,
        ApiSrv
    ) {
        
        var userRights;
        
        // промис, который показывает, что данные пользователя загружены (всегда резолвится)
        var userAuthPromise = checkSession(readSidCookie()).catch(function(){
            return null;
        });
        
        
        
        function clearUser(){
            sid = null;
            userRights = null;
        }

        function setUser(_sid, rights){
            sid = _sid;
            userRights = rights;
            writeSidCookie(sid);
            // getEnums();
            getTranslations();
            updateTotalCount();
        }
        
        function getUser(){
            return {
                sid: sid,
                userRights: userRights
            };
        }
        
        function getUserAuthPromise(){
            return userAuthPromise;
        }
        
        
        
        
        

        var me = {
            getArticles: getArticles,
            getArticle: getArticle,
            setArticle: setArticle,
            removeArticle: removeArticle,
            getTags: getTags
        };


        return me;
    }
}());