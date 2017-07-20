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
        '$cookies',
        'ApiSrv'
    ];

    /**
     * userAuthDefer - ждет авторизации пользователя
     * при логине - резолвится
     * при разлогине - создается новый незарезолвленный промис
     * 
     * events: 
     * UserSrv.login (резолвит userAuthDefer, потом кидается событие)
     * UserSrv.logout (обновляется userAuthDefer, потом кидается событие)
     * 
     * 
     * 
     * 
     * 
     * 
     */
    function UserSrv(
        $rootScope,
        $q,
        $cookies,
        ApiSrv
    ) {
        
        var user;
        
        var sidCookieName = 'sportsensus_sid';
        function readSidCookie(){ return  $cookies.get(sidCookieName); }
        function writeSidCookie(sid){ $cookies.put(sidCookieName, sid); }
        
        //var sid;
        //var userRights;
        
        // промис, который показывает, что данные пользователя загружены (всегда резолвится)
        var userAuthDefer = $q.defer();
        
        // промис, показывающий результат проверки авторизованности пользователя
        var userCheckDefer = $q.defer();
        
        checkSession(readSidCookie()).catch(function(){
            return null;
        });
        
        $rootScope.$on('ApiSrv.requestError', function(event, error){
            if (error.code == 1010){
                logout();
            }
        });
        
        function getSid(){
            return user ? user.sid : null;
        }
        
        function auth(params){
            
   
            // var params = {
            //     // login: "dashtrih@gmail.com",
            //     // password: "mqPaCYtz"
            //     login: par.login,
            //     password: par.password
            // };
            
            return ApiSrv.auth(params).then(function(result){
                setUser(result.sid, result.acl);
                return user;
            }, function(result){
                clearUser();
                return $q.reject();
            });
        }
        
        function checkSession(_sid){ 
            
            var checkedSid = _sid || getSid();
            if (!checkedSid) {
                clearUser();
                return $q.reject();
            }
            
            return ApiSrv.checkSession(checkedSid).then(function(result){
                if (result.exist){
                    setUser(checkedSid, result.acl);
                    return user;
                } else {
                    clearUser();
                    return $q.reject();
                }
            }, function(result){
                clearUser();
                return $q.reject();
            });
            
        }
        
        function logout(){
            ApiSrv.logout();
            ApiSrv.setSid(null);
            clearUser();
            return $q.resolve();
        }
        
        
        

        function setUser(sid, userRights){
            angular.extend(userRights, {
                tariff:{
                    id:100,
                    name:'Тариф 100',
                    description: 'Описание',
                    duration:3,
                    sessionCount:4,
                    sessionDuration: 1000,
                    accessCases: true,
                    accessInfoblock: true,
                    accessAnalytics: true,
                    accessScheduler: true
                },
                tariffActivationTime: (new Date()).toISOString(),
                loginTime: (new Date()).toISOString(),
                remainingTime: 500,
                sessionsCount: 2
            })
            
            user = {
                sid: sid,
                userRights: userRights 
            }
            ApiSrv.setSid(sid);
            // sid = _sid;
            // userRights = rights;
            writeSidCookie(sid);
            // getEnums();
            userAuthDefer.resolve(user);
            syncUserCheckDefer();
            
            $rootScope.$broadcast('UserSrv.login', user);
            // $scope.$on('UserSrv.login', function(event, user){})
            
            // getTranslations();
            
            // updateTotalCount();
        }
        
        
        
        
        function syncUserCheckDefer(){
            var loggedIn = user && user.sid;
            var status = userCheckDefer.promise.$$state.status;
            
            if (status == 0) { // pending
                loggedIn ? userCheckDefer.resolve(user) : userCheckDefer.reject();
            } else if (status == 1) { // resolved
                if (!loggedIn)
                    userCheckDefer = $q.defer();
                    userCheckDefer.reject();
            } else if (status == 2) { // rejected
                if (loggedIn)
                    userCheckDefer = $q.defer();
                    userCheckDefer.resolve(user);
            }
        }
        
        function clearUser(){
            user = null;
            ApiSrv.setSid(null);
            
            userAuthDefer = $q.defer();
            syncUserCheckDefer();
            
            $rootScope.$broadcast('UserSrv.logout');
            
            // sid = null;
            // userRights = null;
        }
        
        function getUser(){
            return user;
        } 
        
        function getUserAuthPromise(){
            return userAuthDefer.promise;
        }
        
        function getUserCheckPromise(){
            return userCheckDefer.promise;
        }
        
        
        
        // fn(resolve, reject)
        /**
         * Хелпер для промисов, ожидающих логина пользователя.
         * fn - function(resolve, reject) - функция, вызываемая после авторизации
         *      может зарезолвить или зареджектить промис, который возвращается функцией check
         * в сервисе описывается fn, например 
         * function loadTranslations(resolve, reject){
         *   ApiSrv.getTranslations().then(resolve, reject);
         * }
         * создается функция-getter: var getTranslations = UserSrv.loadWhenAuth(loadTranslations);
         * getTranslations возвращает promise.
         * при первом вызове, после авторизации юзера, промис резолвится или режектится в loadTranslations
         * при последующих вызовах до логаута возвращается тот же промис
         * при логауте промис очищается, и вызов getTranslations инициирует новый вызов loadTranslations после логина
         * 
         */
        function loadWhenAuth(fn, reloadIfReject){
            var loaded = false;
            //var defer = $q.defer();
            var defer = null;
            
            $rootScope.$on('UserSrv.logout', function(){
                defer = null;
                //loaded = false;
            })
            
            function check(){
                if (defer){
                    return defer.promise;
                }
                
                defer = $q.defer();
                var tempDefer = defer;
                getUserAuthPromise().then(function(){
                    fn(function(data){
                        defer.resolve(data);
                    }, function(data){
                        defer.reject(data);
                        if (reloadIfReject)
                            defer = null;
                    });
                });
            
                return tempDefer.promise;
            }
            
            return check;
        }
        

        var me = {
            getSid: getSid,
            getUserAuthPromise: getUserAuthPromise,
            getUserCheckPromise: getUserCheckPromise,
            getUser: getUser,
            auth: auth,
            logout: logout,
            loadWhenAuth: loadWhenAuth
            
            
        };


        return me;
    }
}());