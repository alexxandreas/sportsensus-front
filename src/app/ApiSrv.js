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

        function request(data, responsePath){
            return $http.post(url, data).then(function(response){
                var value = get(response, responsePath);
                if (typeof value == "undefined")
                    return $q.reject(response);
                else
                    return(value);
            }, function(response){
                $q.reject(response);
            });

            /*var d = $q.defer();
            $http.post(url, data).then(function(response){
                var value = get(response, resultPath);
                if (typeof o == "undefined")
                    d.reject(response);
                else
                    d.resolve(value);
            }, function(response){
                d.reject(response);
            });
            return d.promise;*/

            function get(obj, key) {
                return key.split(".").reduce(function(o, x) {
                    return (typeof o == "undefined" || o === null) ? o : o[x];
                }, obj);
            }
        }

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
            updateTotalCount();
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

        function register(par){
            var params = par;
            var data = prepareRequestData("register", params);

            return request(data, 'data.result.created');

            /*var d = $q.defer();
            $http.post(url, data).then(function(response){
                if (!response.data.result || !response.data.result.created){
                    d.reject(response);
                }else {
                    d.resolve(response);
                }
            }, function(response){
                d.reject(response);
            });
            return d.promise;*/
        }


        function activate(secret){

            var params = {
                secret: secret
            };
            var data = prepareRequestData("activateProfile", params);
            return request(data, 'data.result.acl');

           /* var d = $q.defer();
            $http.post(url, data).then(function(response){
                if (!response.data.result || !response.data.result.acl){
                    d.reject(response);
                }else {
                    d.resolve(response);
                }
            }, function(response){
                d.reject(response);
            });
            return d.promise;*/
        }



        function auth(par){

            var params = {
                // login: "dashtrih@gmail.com",
                // password: "mqPaCYtz"
                login: par.login,
                password: par.password
            };
            var data = prepareRequestData("auth", params);

            return request(data, 'data.result').then(function(result){
                setUser(result.sid, result.acl);
                return result;
            }, function(result){
                clearUser();
                return $q.reject();
            });

            /*var d = $q.defer();
            $http.post(url, data).then(function(response){
                if (!response.data.result){
                    clearUser();
                    d.reject(response);
                }else {
                    setUser(response.data.result.sid, response.data.result.acl);
                    d.resolve(response);
                }
            }, function(response){
                clearUser();
                d.reject(response);
            });
            return d.promise;*/
        }

        function checkSession(_sid){
            var checkedSid = _sid || sid;
            var params = {
                sid: checkedSid
            };
            var data = prepareRequestData("check_session", params);

            return request(data, 'data.result').then(function(result){
                if (result.exist){
                    setUser(checkedSid, result.acl);
                    return result;
                } else {
                    clearUser();
                    return $q.reject();
                }
            }, function(result){
                clearUser();
                return $q.reject();
            });

           /* var d = $q.defer();
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
            return d.promise;*/
        }

        function logout(){

            var params = {
                sid: sid
            };
            var data = prepareRequestData("logout", params);

            return request(data, 'data.result.deleted').then(function(result){
                clearUser();
                return result;
            }, function(result){
                clearUser();
                return $q.reject(result);
            });


            /*var d = $q.defer();
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
            return d.promise;*/

        }


        var staticDefers = {};
        var staticLoaded = {};// загружались ли когда-нибудь перечисления
        function getStatic(type){

            if (!staticDefers[type]){
                staticDefers[type] = $q.defer();
            }

            if (!staticLoaded[type] && sid)
                loadStatic(type);

            return staticDefers[type].promise;

            function loadStatic(){

                var data = prepareRequestData("get_static", {sid: sid, type:type});
                request(data, 'data.result.data').then(function(data){
                    staticDefers[type].resolve(data);
                }, function(){
                    staticDefers[type].reject();
                });

                /*return $http.post(url, data).then(function(result){
                    if (result.data && result.data.result && result.data.result.data)
                        staticDefers[type].resolve(result.data.result.data);
                    else
                        staticDefers[type].reject();
                }, function (result){
                    staticDefers[type].reject();
                });*/
            }
        }


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
                request(data, 'data.result.data').then(function(data){
                    translationsDefer.resolve(data);
                }, function(){
                    translationsDefer.reject();
                });
                /*return $http.post(url, data).then(function(result){
                    if (result.data && result.data.result && result.data.result.data)
                        translationsDefer.resolve(result.data.result.data);
                    else
                        translationsDefer.reject();
                }, function (result){
                    translationsDefer.reject();
                });*/
            }
        }

        var totalCount = 0;
        // events:
        // 'ApiSrv.totalCountLoaded'
        function updateTotalCount(){
            getCount({}, true).then(function(result){
                totalCount = result.audience_count;
                $rootScope.$broadcast('ApiSrv.totalCountLoaded', totalCount);
            });
        }
        function getTotalCount(){ return totalCount; }

        var lastCountResult = null;
        function getLastCountResult(){ return lastCountResult; }
        // events:
        // 'ApiSrv.countLoading'
        // 'ApiSrv.countLoaded'
        // 'ApiSrv.countError'
        function getCount(audience, silent){
            !silent && $rootScope.$broadcast('ApiSrv.countLoading');
            var data = prepareRequestData("audienceCount", {sid: sid, audience:audience});
            return request(data, 'data.result').then(function(result){
                var percent = totalCount ? result.audience_count / totalCount * 100 : 0;
                result.audiencePercent = percent;
                lastCountResult = result;
                //d.resolve(response.data.result);
                !silent && $rootScope.$broadcast('ApiSrv.countLoaded', result);
                return result;
            }, function(result){
                lastCountResult = null;
                //d.reject(response);
                !silent && $rootScope.$broadcast('ApiSrv.countError');
                return $q.reject(result);
            });

            /*var d = $q.defer();
            $http.post(url, data).then(function(response){
                if (!response.data.result){
                    lastCountResult = null;
                    d.reject(response);
                    !silent && $rootScope.$broadcast('ApiSrv.countError', response);
                }else {
                    var percent = totalCount ? response.data.result.audience_count / totalCount * 100 : 0;
                    response.data.result.audiencePercent = percent;
                    //response.data.result.audienceSelected = totalCount ? response.data.result.audience_count != totalCount : false;

                    lastCountResult = response.data.result;
                    d.resolve(response.data.result);
                    !silent && $rootScope.$broadcast('ApiSrv.countLoaded', response.data.result);
                }
            }, function(response){
                lastCountResult = null;
                d.reject(response);
                !silent && $rootScope.$broadcast('ApiSrv.countError', response);
            });
            return d.promise;*/
        }



        function getImageGraph(audience, sportimage){
            var data = prepareRequestData("info_sportimage", {sid: sid, audience:audience, sportimage:sportimage});
            return request(data, 'data.result.graph');
            /*var d = $q.defer();
            $http.post(url, data).then(function(response){
                if (!response.data.result || !response.data.result.graph){
                    d.reject(response);
                }else {
                    d.resolve(response.data.result.graph);
                }
            }, function(response){
                d.reject(response);
            });
            return d.promise;*/
        }

        function getInterestGraph(audience, sportinterest){
            var data = prepareRequestData("info_sportinterest", {sid: sid, audience:audience, sportinterest:sportinterest});
            return request(data, 'data.result.graph');
            /*
            var d = $q.defer();
            $http.post(url, data).then(function(response){
                if (!response.data.result || !response.data.result.graph){
                    d.reject(response);
                }else {
                    d.resolve(response.data.result.graph);
                }
            }, function(response){
                d.reject(response);
            });
            return d.promise;*/
        }

        function getInvolveGraph(audience, involve){
            var data = prepareRequestData("info_fan_involvment", {sid: sid, audience:audience, involve:involve});
            return request(data, 'data.result.graph');
            /*var d = $q.defer();
            $http.post(url, data).then(function(response){
                if (!response.data.result || !response.data.result.graph){
                    d.reject(response);
                }else {
                    d.resolve(response.data.result.graph);
                }
            }, function(response){
                d.reject(response);
            });
            return d.promise;*/
        }



        function getRootingGraph(audience, sport, rooting){
            var data = prepareRequestData("info_sportrooting", {sid: sid, audience:audience, sportrooting:{sport: sport, rooting: rooting}});
            return request(data, 'data.result.graph');
            /*var d = $q.defer();
            $http.post(url, data).then(function(response){
                if (!response.data.result || !response.data.result.graph){
                    d.reject(response);
                }else {
                    d.resolve(response.data.result.graph);
                }
            }, function(response){
                d.reject(response);
            });
            return d.promise;*/
        }


        function getRootingWatchGraph(audience, sport, rooting){
            var data = prepareRequestData("info_sportrooting", {sid: sid, audience:audience, sportrooting:{sport: sport, rooting_watch: rooting}});
            return request(data, 'data.result.graph');
            /*var d = $q.defer();
            $http.post(url, data).then(function(response){
                if (!response.data.result || !response.data.result.graph){
                    d.reject(response);
                }else {
                    d.resolve(response.data.result.graph);
                }
            }, function(response){
                d.reject(response);
            });
            return d.promise;*/
        }

        function getRootingWalkGraph(audience, sport, rooting){
            var data = prepareRequestData("info_sportrooting", {sid: sid, audience:audience, sportrooting:{sport: sport, rooting_walk: rooting}});
            return request(data, 'data.result.graph');
            /*var d = $q.defer();
            $http.post(url, data).then(function(response){
                if (!response.data.result || !response.data.result.graph){
                    d.reject(response);
                }else {
                    d.resolve(response.data.result.graph);
                }
            }, function(response){
                d.reject(response);
            });
            return d.promise;*/
        }




        function getExpressSport(audience, sport, clubs){
            var data = prepareRequestData("info_express_sport", {
                sid: sid,
                audience: audience,
                sport: sport,
                clubs: clubs
            });
            return request(data, 'data.result');
            /*var d = $q.defer();
            $http.post(url, data).then(function(response){
                if (!response.data.result){
                    d.reject(response);
                }else {
                    d.resolve(response.data.result);
                }
            }, function(response){
                d.reject(response);
            });
            return d.promise;*/
        }

        function getExpressAudience(audience){
            var data = prepareRequestData("info_express_audience", {
                sid: sid,
                audience: audience
            });
            return request(data, 'data.result');
            /*
            var d = $q.defer();
            $http.post(url, data).then(function(response){
                if (!response.data.result){
                    d.reject(response);
                }else {
                    d.resolve(response.data.result);
                }
            }, function(response){
                d.reject(response);
            });
            return d.promise;*/
        }

        function sendEmail(options) {
            // var a = {
            //     "sid": "UMoEnDBCLNsXXbTEiPmcjGSjpnswnD7W04VzBBHvdNudOJHEPuaKT9Xzb4aYrFhH",
            //     "demo": false,
            //     "ttl": "03/03/2018 02:03:04",
            //     "address": "redvsice@gmail.com",
            //     "theme": "hello",
            //     "message": "hi",
            //     "attachments": [{"filename": "1.txt", "data": "YXNkcw=="}]
            // };
            var data = prepareRequestData("send_email", {
                sid: sid,
                address: options.address,
                theme: options.theme,
                message: options.message,
                attachments: options.attachments // [{"filename": "1.txt", "data": "YXNkcw=="}]
            });
            return request(data, 'data.result.sent');
        }

        function getProfilesList(){
            var data = prepareRequestData("get_profiles_list", {sid: sid});
            return request(data, 'data.result.profiles');
        }

        function addRole(uid, acl){
            var data = prepareRequestData("addProfileRole", {sid: sid, uid:uid, acl:acl});
            return request(data, 'data.result');
        }

        var me = {
            getUser: getUser,
            register: register,
            activate: activate,
            auth: auth,
            checkSession: checkSession,
            logout: logout,
            getStatic: getStatic,
            getTranslations: getTranslations,
            //getEnums: getEnums
            getCount: getCount,
            getLastCountResult: getLastCountResult,
            getTotalCount: getTotalCount,
            getImageGraph: getImageGraph,
            getInterestGraph: getInterestGraph,
            getInvolveGraph: getInvolveGraph,
            getRootingGraph: getRootingGraph,
            getRootingWatchGraph: getRootingWatchGraph,
            getRootingWalkGraph: getRootingWalkGraph,
            
            getExpressSport: getExpressSport,
            getExpressAudience: getExpressAudience,


            sendEmail: sendEmail,

            getProfilesList: getProfilesList,
            addRole: addRole
        };


        return me;
    }
}());