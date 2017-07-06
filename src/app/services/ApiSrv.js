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

        var url = proxyURL + ConfigSrv.get().apiUrl;
        

        var sidCookieName = 'sportsensus_sid';
        function readSidCookie(){ return  $cookies.get(sidCookieName); }
        function writeSidCookie(sid){ $cookies.put(sidCookieName, sid); }

        var sid = null;
        var userRights;
        
        // промис, который показывает, что данные пользователя загружены (всегда резолвится)
        var userAuthPromise = checkSession(readSidCookie()).catch(function(){
            return null;
        });

        
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


            function get(obj, key) {
                return key.split(".").reduce(function(o, x) {
                    return (typeof o == "undefined" || o === null) ? o : o[x];
                }, obj);
            }
        }

        function clearUser(){
            sid = null;
            userRights = null;
        }

        function setUser(_sid, rights){
            sid = _sid;
            userRights = rights;
            
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
        }


        function activate(secret){
            var params = {
                secret: secret
            };
            var data = prepareRequestData("activateProfile", params);
            return request(data, 'data.result.acl');
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
            }
        }


        var translationsDefer;
        var translationsLoaded = false;// загружались ли когда-нибудь перечисления
        function getTranslations(){
            if (!translationsDefer){
                translationsDefer = $q.defer();
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
        }



        function getImageGraph(audience, sportimage){
            var data = prepareRequestData("info_sportimage", {sid: sid, audience:audience, sportimage:sportimage});
            return request(data, 'data.result.graph');
        }

        function getInterestGraph(audience, sportinterest){
            var data = prepareRequestData("info_sportinterest", {sid: sid, audience:audience, sportinterest:sportinterest});
            return request(data, 'data.result.graph');
        }

        function getInvolveGraph(audience, involve){
            var data = prepareRequestData("info_fan_involvment", {sid: sid, audience:audience, involve:involve});
            return request(data, 'data.result.graph');
        }



        function getRootingGraph(audience, sport, rooting){
            var data = prepareRequestData("info_sportrooting", {sid: sid, audience:audience, sportrooting:{sport: sport, rooting: rooting}});
            return request(data, 'data.result.graph');
        }


        function getRootingWatchGraph(audience, sport, rooting){
            var data = prepareRequestData("info_sportrooting", {sid: sid, audience:audience, sportrooting:{sport: sport, rooting_watch: rooting}});
            return request(data, 'data.result.graph');
        }

        function getRootingWalkGraph(audience, sport, rooting){
            var data = prepareRequestData("info_sportrooting", {sid: sid, audience:audience, sportrooting:{sport: sport, rooting_walk: rooting}});
            return request(data, 'data.result.graph');
        }


        function getExpressSport(audience, sport, clubs){
            var data = prepareRequestData("info_express_sport", {
                sid: sid,
                audience: audience,
                sport: sport,
                clubs: clubs
            });
            return request(data, 'data.result');
        }

        function getExpressAudience(audience){
            var data = prepareRequestData("info_express_audience", {
                sid: sid,
                audience: audience
            });
            return request(data, 'data.result');
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

        function getProfile(){
            var data = prepareRequestData("getProfile", {sid: sid});
            return request(data, 'data.result');
        }

        function editProfile(params){
            var data = prepareRequestData("editProfile", angular.extend({sid: sid}, params));
            return request(data, 'data.result.edit_result');
        }

        function changePassword(password){
            var data = prepareRequestData("change_pass", {sid: sid, password: password});
            return request(data, 'data.result.changed');
        }


      
        function getArticles(){
            var data = prepareRequestData("cms.get_articles", {sid: sid});
            return request(data, 'data.result.articles');
            
        }
        
        function createArticle(article) {
            var data = prepareRequestData("cms.create_article", angular.extend({sid: sid}, article));
            return request(data, 'data.result.article');
        }
        
        function editArticle(article){
            var data = prepareRequestData("cms.update_article", angular.extend({sid: sid}, article));
            return request(data, 'data.result.article');
        }
        
        function getArticle(id){
            var data = prepareRequestData("cms.get_article", {sid: sid, id: id});
            return request(data, 'data.result.article');
        }
        
        function removeArticle(id){
            var data = prepareRequestData("cms.delete_article", {sid: sid, id: id});
            return request(data, 'data.result.deleted');
        }

        var me = {
            getUser: getUser,
            getUserAuthPromise: getUserAuthPromise,
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
            addRole: addRole,
            getProfile: getProfile,
            editProfile: editProfile,
            changePassword: changePassword,
            
            getArticles: getArticles,
            getArticle: getArticle,
            createArticle: createArticle,
            editArticle: editArticle,
            removeArticle: removeArticle
        };


        return me;
    }
}());