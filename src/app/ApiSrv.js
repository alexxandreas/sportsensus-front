(function () {

    "use strict";
    angular.module('SportsensusApp')
        .factory('ApiSrv', ApiSrv);

    // инициализируем сервис
    angular.module('SportsensusApp').run(['ApiSrv', function(ApiSrv) {
        //ApiSrv.init();
        //ApiSrv.logout();

    }]);

    // angula
    // r.module('SportsensusApp').run(ApiSrv.init);

    ApiSrv.$inject = [
        '$rootScope',
        '$http',
        '$q',
        '$cookies',
        'ConfigSrv'
    ];


    /**
     * events:
     * ApiSrv.highlightItem
     */
    function ApiSrv(
        $rootScope,
        $http,
        $q,
        $cookies,
        ConfigSrv
    ) {

        var proxyURL = ConfigSrv.get().proxyURL || '';

        //var proxyURL = 'https://cors-anywhere.herokuapp.com/';
        // var url = 'http://sportsensus.ru:8080/api';
        //var url = proxyURL + 'http://sportsensus.ru:8080/api';
        var url = proxyURL + ConfigSrv.get().apiUrl;

        var sidCookieName = 'sportsensus_sid';
        function readSidCookie(){ return  $cookies.get(sidCookieName); }
        function writeSidCookie(sid){ $cookies.put(sidCookieName, sid); }

        // var sid = $cookies.get(sidCookieName);
        var sid = null;

        var userRights;

        checkSession(readSidCookie());


        function clearUser(){
            sid = null;
            userRights = null;
            //$rootScope.$broadcast('ApiSrv.logout');
        }

        function setUser(_sid, rights){
            sid = _sid;
            userRights = rights;
            writeSidCookie(sid);
            // getEnums();
            getTranslations();
        }
        
        function getUser(){
            return {
                sid: sid,
                userRights: userRights
            };
        }


        function prepareRequestData(method, params){
            var data = {
                jsonrpc: "2.0",
                method: method,
                params: params,
                id: "id"
            };
            return data;
        }

        function auth(par){
            var d = $q.defer();
            var params = {
                // login: "dashtrih@gmail.com",
                // password: "mqPaCYtz"
                login: par.login,
                password: par.password
            };
            var data = prepareRequestData("auth", params);
            $http.post(url, data).then(function(response){
                if (!response.data.result){
                    clearUser();
                    d.reject(response);
                }else {
                    setUser(response.data.result.sid, response.data.result.acl);
                    //$rootScope.$broadcast('ApiSrv.loginSuccess');
                    d.resolve(response);
                }
            }, function(response){
                clearUser();
                d.reject(response);
                //$rootScope.$broadcast('ApiSrv.loginError');
            });
            return d.promise;
        }

        function checkSession(_sid){
            var d = $q.defer();
            var checkedSid = _sid || sid;
            var params = {
                sid: checkedSid
            };
            var data = prepareRequestData("check_session", params);
            $http.post(url, data).then(function(response) {
                if (response.data.result && response.data.result.exist){
                    setUser(checkedSid, response.data.result.acl);
                    d.resolve(response);
                } else {
                    clearUser();
                    d.reject(response);
                }
                //$rootScope.$broadcast('ApiSrv.loginSuccess');
            }, function(response){
                clearUser();
                //$rootScope.$broadcast('ApiSrv.loginError');
                d.reject(response);
            });
            return d.promise;
        }

        function logout(){
            var d = $q.defer();
            var params = {
                sid: sid
            };
            var data = prepareRequestData("logout", params);
            $http.post(url, data).then(function(response) {
                clearUser();
                if (response.data.result && response.data.result.deleted){
                    d.resolve(response);
                } else {
                    d.reject(response);
                }
                //$rootScope.$broadcast('ApiSrv.loginSuccess');
            }, function(response){
                clearUser();
                //$rootScope.$broadcast('ApiSrv.loginError');
                d.reject(response);
            });
            return d.promise;


        }



        /*// Get Enumeration Items
         //Получение списка перечисляемых параметров выбора фильтров АЦ.
         var enumsDefer;
         var enumsLoaded = false;// загружались ли когда-нибудь перечисления
         function getEnums(){
         //var d;
         if (!enumsDefer){
         enumsDefer = $q.defer();
         //enumsPromise = d.promise;
         }

         if (!enumsLoaded && sid)
         loadEnums();

         return enumsDefer.promise;

         function loadEnums(){
         var enumTypes = [
         'FootballClubsKnown', // - футбольные клубы
         'HockeyClubsKnown', // - хоккейные команды
         'BasketballClubsKnown', // - баскетбольные команды
         'CarKnown', // - соревнования автоспорта
         'MobileProvider', // - мобильные операторы
         'TvCableProvider', // - операторы кабельного тв
         'TvSputnicProvider', // - операторы спутникого тв
         'GasStationPeriod', // - АЗС
         'GamingPlatform' // - игровые платформы
         ];



         var promises = enumTypes.map(function(type){
         var data = prepareRequestData("get_enumeration_items", {enum_name: type, sid: sid});
         return $http.post(url, data);
         });

         $q.all(promises).then(function(results){
         var allResults = {};
         var err = false;
         var enumsData = results.map(function(result){
         if (result.data && result.data.result && result.data.result.items)
         allResults[result.config.data.params.enum_name] = result.data.result.items;
         else
         err = true;
         });
         err ? enumsDefer.reject() : enumsDefer.resolve(allResults);
         }, function (results){
         enumsDefer.reject();
         });
         }

         }*/

        var translationsDefer;
        var translationsLoaded = false;// загружались ли когда-нибудь перечисления
        function getTranslations(){
            //var d;
            if (!translationsDefer){
                translationsDefer = $q.defer();
                //enumsPromise = d.promise;
            }

            if (!translationsLoaded && sid)
                loadTranslations();

            return translationsDefer.promise;

            function loadTranslations(){

                var data = prepareRequestData("get_translations", {sid: sid});
                return $http.post(url, data).then(function(result){
                    if (result.data && result.data.result && result.data.result.data)
                        translationsDefer.resolve(result.data.result.data);
                    else
                        translationsDefer.reject();
                }, function (result){
                    translationsDefer.reject();
                });
            }

        }

        // events: 
        // 'ApiSrv.countLoading'
        // 'ApiSrv.countLoaded'
        // 'ApiSrv.countError'
        function getCount(audience){
            var d = $q.defer();
            $rootScope.$broadcast('ApiSrv.countLoading');
            var data = prepareRequestData("audienceCount", {sid: sid, audience:audience});
            $http.post(url, data).then(function(response){
                if (!response.data.result){
                    d.reject(response);
                    $rootScope.$broadcast('ApiSrv.countError', response);
                }else {
                    d.resolve(response.data.result);
                    $rootScope.$broadcast('ApiSrv.countLoaded', response.data.result);
                }
            }, function(response){
                d.reject(response);
                $rootScope.$broadcast('ApiSrv.countError', response);
            });
            return d.promise;
        }

        var me = {
            getUser: getUser,
            auth: auth,
            checkSession: checkSession,
            logout: logout,
            //getEnums: getEnums
            getCount: getCount,
            getTranslations: getTranslations
        };


        return me;
    }
}());