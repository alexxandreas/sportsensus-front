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
        
        var sid = null;
        
        function setSid(_sid){
            sid = _sid;
        }
        
        var radarId = null;
        
        function setRadarId(_radarId){
            radarId = _radarId;
        }
        
        function request(method, params, responsePath){
            var data = {
                jsonrpc: "2.0",
                method: method,
                params: angular.extend({sid:sid, radarId: radarId}, params),
                id: "id"
            };
            
            return $http.post(url, data).then(function(response){
                var error = response.data && response.data.error;
                if (error){
                    $rootScope.$broadcast('ApiSrv.requestError', error);
                    return $q.reject(response);
                }
                
                var value = get(response, responsePath);
                if (typeof value == "undefined")
                    return $q.reject(response);
                else
                    return(value);
            }, function(response){
                return $q.reject(response);
            });


            function get(obj, key) {
                return key.split(".").reduce(function(o, x) {
                    return (typeof o == "undefined" || o === null) ? o : o[x];
                }, obj);
            }
        }


        function register(params){
            return request('register', params, 'data.result.created');
        }

        function activate(secret){
            return request('activateProfile', {secret: secret}, 'data.result');
        }

        function auth(params){
            return request('auth', params, 'data.result');
        }

        function checkSession(_sid){ 
            return request('check_session', {sid: _sid || sid}, 'data.result');
            // return request('check_session', {sid: _sid || sid}, 'data.result').then(function(data){
                
            // })
        }

        function logout(){
            return request('logout', null, 'data.result.deleted');
        }

        function getStatic(type){
            return request('get_static', {type:type}, 'data.result.data');
        }
        
        function getRadars(){
            var d = $q.defer();
            d.resolve([{
                id: 0,
                name: "Исследование за 2015 год"
            },{
                id: 1,
                name: "Исследование за 2017 год"
            }]);
            return d.promise;
            
            return request('get_databases', null, 'data.result.data');
        }
        
        function getTranslations(){
            return request('get_translations', null, 'data.result.data');
        }

        function getAudienceCount(audience){
            return request('audienceCount', {audience:audience}, 'data.result')
        }
        
        function getImageGraph(audience, sportimage){
            return request('info_sportimage', {audience:audience, sportimage:sportimage}, 'data.result.graph');
        }

        function getInterestGraph(audience, sportinterest){
            return request('info_sportinterest', {audience:audience, sportinterest:sportinterest}, 'data.result.graph');
        }

        function getInvolveGraph(audience, involve){
            return request('info_fan_involvment', {audience:audience, involve:involve}, 'data.result.graph');
        }

        function getRootingGraph(audience, sport, rooting){
            return request('info_sportrooting',  {audience:audience, sportrooting:{sport: sport, rooting: rooting}}, 'data.result.graph');
        }

        function getRootingWatchGraph(audience, sport, rooting){
            return request('info_sportrooting', {audience:audience, sportrooting:{sport: sport, rooting_watch: rooting}}, 'data.result.graph');
        }

        function getRootingWalkGraph(audience, sport, rooting){
            return request('info_sportrooting', {audience:audience, sportrooting:{sport: sport, rooting_walk: rooting}}, 'data.result.graph');
        }

        function getExpressSport(audience, sport, clubs){
            return request('info_express_sport', {audience: audience, sport: sport, clubs: clubs}, 'data.result');
        }

        function getExpressAudience(audience){
            return request('info_express_audience', {audience: audience}, 'data.result');
        }

        function getProfilesList(){
            return request('get_profiles_list', null, 'data.result.profiles');
        }

        function addRole(uid, acl){
            return request('addProfileRole', {uid:uid, acl:acl}, 'data.result');
        }

        function getProfile(){
            return request('getProfile', null, 'data.result');
        }

        function editProfile(params){
            return request('editProfile', params, 'data.result.edit_result');
        }

        function changePassword(password){
            return request('change_pass', {password: password}, 'data.result.changed');
        }

        function getArticles(){
            return request('cms.get_articles', null, 'data.result.articles');
        }
        
        function createArticle(article) {
            return request('cms.create_article', article, 'data.result.article');
        }
        
        function editArticle(article){
            return request('cms.update_article', article, 'data.result.article');
        }
        
        function getArticle(id){
            return request('cms.get_article', {id: id}, 'data.result.article');
        }
        
        function removeArticle(id){
            return request('cms.delete_article', {id: id}, 'data.result.deleted');
        }
        
        function getTariffs(){
            return request('get_tariffs', null, 'data.result.tariffs');
        }
        
        function sendEmail(options) {
            // var a = {
            //     "sid": "UMoEnDBCLNsXXbTEiPmcjGSjpnswnD7W04VzBBHvdNudOJHEPuaKT9Xzb4aYrFhH",
            //     "demo": false,
            //     "ttl": "03/03/2018 02:03:04",
            //     "address": ["redvsice@gmail.com"],
            //     "theme": "hello",
            //     "message": "hi",
            //     "attachments": [{"filename": "1.txt", "data": "YXNkcw=="}]
            // };
            var params = {
                //sid: sid,
                address: angular.isArray(options.address) ? options.address : [options.address],
                theme: options.theme,
                message: options.message,
                attachments: options.attachments // [{"filename": "1.txt", "data": "YXNkcw=="}]
            };
            return request('send_email', params, 'data.result.sent');
        }

        var me = {
            setSid: setSid,
            setRadarId: setRadarId,

            register: register,
            activate: activate,
            auth: auth,
            checkSession: checkSession,
            logout: logout,
            getStatic: getStatic,
            getRadars: getRadars,
            getTranslations: getTranslations,
            getAudienceCount: getAudienceCount,
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
            removeArticle: removeArticle,
            getTariffs: getTariffs
        };


        return me;
    }
}());