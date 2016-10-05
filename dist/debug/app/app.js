angular
	.module('SportsensusApp', [
		'ngMaterial',
		'ngRoute',
		'ngCookies',
		'Views' 
	])
	// .config(function($mdThemingProvider) {
	// 	$mdThemingProvider.theme('dark-grey').backgroundPalette('grey').dark();
	// })
	.config(['$locationProvider', '$routeProvider',
		function config($locationProvider, $routeProvider) {
			$locationProvider.hashPrefix('!');

			$routeProvider
			// when('/phones', {
			// 	template: '<phone-list></phone-list>'
			// }).
			// when('/phones/:phoneId', {
			// 	template: '<phone-detail></phone-detail>'
			// }).
			// otherwise('/phones');
			.when('/', {
				template: '<home-dir></home-dir>'
			})
			.when('/infobox/', { 
				template: '<infobox-dir></infobox-dir>'
			})
			.when('/login/', { 
				template: '<login-dir></login-dir>'
			})
			/*.when('/hotel/:hotelId', {
				template: '<hotel-dir></hotel-dir>'
			})
			.when('/hotel/:hotelId/event/:eventId', {
				template: '<event-dir></event-dir>'
			})
			.when('/hotel/:hotelId/service/:serviceId', {
				template: '<service-dir></service-dir>'
			})
			.when('/hotel/:hotelId/poi/:poiId', {
				template: '<poi-dir></poi-dir>'
			})*/
			.otherwise('/');
			
		}
	])
	.run(['ConfigSrv', function (ConfigSrv) {
		var config = window.appConfig;
		ConfigSrv.set(config);
	}]);
	
	// .config(function($mdIconProvider) {
	// });
	
	
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

        function getImageGraph(audience, sportimage){
            var d = $q.defer();
            var data = prepareRequestData("info_sportimage", {sid: sid, audience:audience, sportimage:sportimage});
            $http.post(url, data).then(function(response){
                if (!response.data.result || !response.data.result.graph){
                    d.reject(response);
                }else {
                    d.resolve(response.data.result.graph);
                }
            }, function(response){
                d.reject(response);
            });
            return d.promise;
        }

        function getInterestGraph(audience, sportinterest){
            var d = $q.defer();
            var data = prepareRequestData("info_sportinterest", {sid: sid, audience:audience, sportinterest:sportinterest});
            $http.post(url, data).then(function(response){
                if (!response.data.result || !response.data.result.graph){
                    d.reject(response);
                }else {
                    d.resolve(response.data.result.graph);
                }
            }, function(response){
                d.reject(response);
            });
            return d.promise;
        }

        function getInvolveGraph(audience, involve){
            var d = $q.defer();
            var data = prepareRequestData("info_fan_involvment", {sid: sid, audience:audience, involve:involve});
            $http.post(url, data).then(function(response){
                if (!response.data.result || !response.data.result.graph){
                    d.reject(response);
                }else {
                    d.resolve(response.data.result.graph);
                }
            }, function(response){
                d.reject(response);
            });
            return d.promise;
        }

        function getExpressSport(audience, sport, clubs){
            var d = $q.defer();
            var data = prepareRequestData("info_express_sport", {
                sid: sid,
                audience: audience,
                sport: sport,
                clubs: clubs
            });
            $http.post(url, data).then(function(response){
                if (!response.data.result){
                    d.reject(response);
                }else {
                    d.resolve(response.data.result);
                }
            }, function(response){
                d.reject(response);
            });
            return d.promise;
        }

        function getExpressAudience(audience){
            var d = $q.defer();
            var data = prepareRequestData("info_express_audience", {
                sid: sid,
                audience: audience
            });
            $http.post(url, data).then(function(response){
                if (!response.data.result){
                    d.reject(response);
                }else {
                    d.resolve(response.data.result);
                }
            }, function(response){
                d.reject(response);
            });
            return d.promise;
        }



        var me = {
            getUser: getUser,
            auth: auth,
            checkSession: checkSession,
            logout: logout,
            getTranslations: getTranslations,
            //getEnums: getEnums
            getCount: getCount,
            getImageGraph: getImageGraph,
            getInterestGraph: getInterestGraph,
            getInvolveGraph: getInvolveGraph,
            
            getExpressSport: getExpressSport,
            getExpressAudience: getExpressAudience
        };


        return me;
    }
}());
(function () {
    "use strict";
    angular.module('SportsensusApp')
        .factory('ConfigSrv', ConfigSrv);


    function ConfigSrv() {
        var conf = {};
        var me = {
            set: function set(conf_) {
                conf = angular.extend({}, conf_);
            },
            _update: function _update(conf_) {
                angular.extend(conf, conf_);
            },
            get: function get() {
                return conf || {};
            }
        };
        return me;
    }
}());
(function () {

    "use strict";
    angular.module('SportsensusApp')
        .factory('ParamsSrv', ParamsSrv);

    // инициализируем сервис
    angular.module('SportsensusApp').run(['ParamsSrv', function(ParamsSrv) {

    }]);

    // angula
    // r.module('SportsensusApp').run(ParamsSrv.init);

    ParamsSrv.$inject = [
        '$rootScope',
        '$http',
        '$q',
        'ApiSrv',
        'ConfigSrv'
    ];


    /**
     * events:
     * ParamsSrv.paramsChanged type newValue oldValue. type in ['demography','consume','regions','sport','interest','rooting','involve','image']
     */
    function ParamsSrv(
        $rootScope,
        $http,
        $q,
        ApiSrv,
        ConfigSrv
    ) {

        var padamsDefer = $q.defer();


        var parameters = {};
        //var enums = null;
        /*ApiSrv.getEnums().then(function(data){
            enums = data;
            prepareParams();
            setParamsWatchers();
            padamsDefer.resolve(parameters);
        }, function(){
            padamsDefer.reject();
        });*/

        var translations = null; // {pages, translates}
        ApiSrv.getTranslations().then(function(data){
            translations = data;
            prepareParams();
            setParamsWatchers();
            padamsDefer.resolve(parameters);
        }, function(){
            padamsDefer.reject();
        });

        // подписка на изменение параметров, для перезапроса count
        function setParamsWatchers(){

        }

        function prepareParams() {

            function getElement(id){
                function isNumber(n) {
                    return !isNaN(parseFloat(n)) && isFinite(n);
                }
                /*function recFillTranslations(item){ // TODO убрать, когда будет переделан формат выдачи
                    if (!(item.lists instanceof Array)) return;
                    if (item.lists.every(function(subitem){return isNumber(subitem);})){
                        item.lists = item.lists.map(function(subitem){
                            return {
                                id: subitem,
                                name: translations.translates[item.id + '_' + subitem]
                            }
                        })
                    } else {
                        item.lists.forEach(function(subitem){
                            recFillTranslations(subitem);
                        })
                    }
                }*/
                
                function recFind(items){
                    var finded;
                    items.some(function(item){
                        if (item.id && item.id == id){
                            finded = item;
                        } else if (item.lists instanceof Array){
                            finded = recFind(item.lists);
                        }
                        return !!finded;
                    });
                    return finded;
                }
                
                var item = recFind(translations.pages);
                if (!item) return;
                //recFillTranslations(item); // TODO убрать, когда будет переделан формат выдачи
                return item;
                
                // translations.translates = {}
            }

            ['demography','consume','regions','sport','interest','rooting','involve','image'].forEach(function(type){
                parameters[type] = getElement(type);
                $rootScope.$watch(function(){return parameters[type]; }, function(newValue, oldValue){
                    $rootScope.$broadcast('ParamsSrv.paramsChanged', type, newValue, oldValue);

                    if (['demography','consume','regions'].indexOf(type) >= 0){
                        ApiSrv.getCount(getSelectedAudience());
                    }
                }, true);
            });

            // TODO убрать! хардкодим числовые ключи для спортов
            var allSports = {
                "football":1, 
                "hockey":2, 
                "basketball":3, 
                "car":4, 
                "figskating":5, 
                "biathlon":6, 
                "boxing":7, 
                "tennis":8
            };
            var colorGenerator = d3.scale.category10();
            parameters.sport.lists.forEach(function(item){
                item.key = allSports[item.id];
                item.chartColor = colorGenerator(allSports[item.id]);
            });
            parameters.interest.lists.forEach(function(item){
                item.chartColor = colorGenerator(item.id);
            });
            parameters.involve.lists.forEach(function(item){
                item.chartColor = colorGenerator(item.id);
            });



            $rootScope.$watch(function(){return [
                parameters.demography,
                parameters.consume,
                parameters.regions
            ]}, audienceChanged, true);

            function audienceChanged(){
                var audience = getSelectedAudience();
                ApiSrv.getCount(audience);
            }

            [].forEach(function(param){

            });

            $rootScope.$watch(function(){return [
                parameters.demography,
                parameters.consume,
                parameters.regions
            ]}, audienceChanged, true);

            function audienceChanged(){
                var audience = getSelectedAudience();
                ApiSrv.getCount(audience);
            }
 
           
            //getAudience();

            (function prepareDemography(){
                parameters.demography = [{
                    id: 'gender',
                    text: 'Пол',
                    type: 'radio',
                    img: '/static/img/icons/gender.png',
                    items: [{
                        id: 1,
                        //selected: false,
                        text: 'Мужской'
                    }, {
                        id: 2,
                        //selected: false,
                        text: 'Женский'
                    }]
                }, {
                    id: 'career',
                    type: 'radio',
                    text: 'Род деятельности',
                    img: '/static/img/icons/career.png',
                    items: [{
                        id: 1,
                        text: 'Директор'
                    }, {
                        id: 2,
                        text: 'Менеджер/руководитель отдела'
                    }, {
                        id: 3,
                        text: 'Частный предприниматель'
                    }, {
                        id: 4,
                        text: 'Служащий/Работник офиса'
                    }, {
                        id: 5,
                        text: 'Рабочий'
                    }, {
                        id: 6,
                        text: 'Студент/ка'
                    }, {
                        id: 7,
                        text: 'Пенсионер'
                    }, {
                        id: 8,
                        text: 'Не работаю / домохозяйка'
                    }, {
                        id: 96,
                        text: 'Другое'
                    }]
                }, {
                    id: 'children',
                    type: 'radio',
                    text: 'Сколько детей в возрасте до 16 лет',
                    img: '/static/img/icons/children.png',
                    items: [{
                        id: 98,
                        text: 'Ни одного'
                    }, {
                        id: 1,
                        text: 'Один'
                    }, {
                        id: 2,
                        text: 'Двое'
                    }, {
                        id: 3,
                        text: 'Трое'
                    }, {
                        id: 4,
                        text: 'Четверо'
                    }, {
                        id: 5,
                        text: '4 и более'
                    }]
                }, {
                    id: 'family',
                    type: 'radio',
                    text: 'Семейное положение',
                    img: '/static/img/icons/family.png',
                    items: [{
                        id: 3,
                        text: 'Женат / Замужем'
                    }, {
                        id: 2,
                        text: 'Гражданский брак'
                    }, {
                        id: 1,
                        text: 'Холост /не замужем'
                    }, {
                        id: 4,
                        text: 'Разведен(а) / проживаем раздельно / Вдова/Вдовец'
                    }]
                }, {
                    id: 'income',
                    type: 'radio',
                    text: 'Доход',
                    img: '/static/img/icons/income.png',
                    items: [{
                        id: 1,
                        text: 'Менее 5 000 руб. на чел/мес.'
                    }, {
                        id: 2,
                        text: '5 – 10 000 рублей'
                    }, {
                        id: 3,
                        text: '10 – 15 000 рублей'
                    }, {
                        id: 4,
                        text: '15 – 25 000 рублей'
                    }, {
                        id: 5,
                        text: '25 – 40 000 рублей'
                    }, {
                        id: 6,
                        text: '40 – 80 000 рублей'
                    }, {
                        id: 7,
                        text: 'Более 80 000 рублей на чел/мес.'
                    }]
                }, {
                    id: 'age',
                    type: 'radio',
                    text: 'Возраст',
                    img: '/static/img/icons/age.png',
                    items: [{
                        id: 1,
                        text: 'Менее 14'
                    }, {
                        id: 2,
                        text: '14-24'
                    }, {
                        id: 3,
                        text: '25-34'
                    }, {
                        id: 4,
                        text: '35-44'
                    }, {
                        id: 5,
                        text: '45-60'
                    }, {
                        id: 6,
                        text: '61-75'
                    }, {
                        id: 7,
                        text: 'Более 75'
                    }]
                }, {
                    id: 'familysize',
                    type: 'radio',
                    text: 'Сколько человек живет в семье',
                    img: '/static/img/icons/familysize.png',
                    items: [{
                        id: 1,
                        text: 'Один'
                    }, {
                        id: 2,
                        text: 'Двое'
                    }, {
                        id: 3,
                        text: 'Трое'
                    }, {
                        id: 4,
                        text: 'Четверо'
                    }, {
                        id: 5,
                        text: 'Пятеро'
                    }, {
                        id: 6,
                        text: 'Шесть и более'
                    }]
                }
                ];
            });

            (function prepareConsume(){
                parameters.consume = [{
                    id: 'car',
                    text: 'Наличие автомобиля',
                    img: '/static/img/icons/car.png',
                    type: 'radio',
                    items: [{
                        id: 1,
                        text: 'Да'
                    }, {
                        id: 2,
                        text: 'Нет'
                    }]
                }, {
                    id: 'oil',
                    text: 'Частота покупки моторного масла',
                    img: '/static/img/l-board/oil.png',
                    type: 'radio',
                    items: [{
                        id: 2,
                        text: 'Несколько раз в год'
                    }, {
                        id: 5,
                        text: 'Раз в год и реже'
                    }, {
                        id: 98,
                        text: 'Не покупал(а)'
                    }]
                }, {
                    id: 'bus',
                    text: 'Частота покупки шин',
                    img: '/static/img/l-board/shin.png',
                    type: 'radio',
                    items: [{
                        id: 1,
                        text: 'Раз в месяц и реже'
                    }, {
                        id: 2,
                        text: 'Несколько раз в год'
                    }, {
                        id: 3,
                        text: 'Раз в два года'
                    }, {
                        id: 4,
                        text: 'Раз в три года и реже'
                    }, {
                        id: 98,
                        text: 'Не покупал(а)'
                    }]
                }, {
                    id: 'mobileprovider',
                    text: 'Оператор мобильной связи',
                    img: '/static/img/l-board/smart.png',
                    type: 'checkbox',
                    items: enums.MobileProvider.map(function(item){return {id:item.id, text:item.name};})
                    /*items: [{
                        id: 1,
                        text: 'МегаФон'
                    }, {
                        id: 2,
                        text: 'Билайн'
                    }, {
                        id: 3,
                        text: 'МТС'
                    }, {
                        id: 4,
                        text: 'Теле2'
                    }]*/
                }, {
                    id: 'gasyear',
                    text: 'На каких АЗС Вы заправляли свой автомобиль за последние 3 месяца?',
                    img: '/static/img/l-board/azs.png',
                    type: 'checkbox',
                    items: enums.GasStationPeriod.map(function(item){return {id:item.id, text:item.name};})
                    /*items: [{
                        id: 1,
                        text: 'Лукойл'
                    }, {
                        id: 2,
                        text: 'Газпромнефть'
                    }, {
                        id: 3,
                        text: 'ТНК'
                    }, {
                        id: 4,
                        text: 'Шелл'
                    }, {
                        id: 5,
                        text: 'БиПи'
                    }, {
                        id: 6,
                        text: 'Роснефть'
                    }, {
                        id: 7,
                        text: 'Татнефть'
                    }, {
                        id: 8,
                        text: 'Башнефть'
                    }, {
                        id: 9,
                        text: 'НэстэОйл'
                    }, {
                        id: 10,
                        text: 'СтатОйл'
                    }]*/
                }, {
                    id: 'gasoften',
                    text: 'На какой АЗС Вы чаще всего заправляете свой автомобиль?',
                    img: '/static/img/l-board/azs.png',
                    type: 'checkbox',
                    items: enums.GasStationPeriod.map(function(item){return {id:item.id, text:item.name};})
                    /*items: [{
                        id: 1,
                        text: 'Лукойл'
                    }, {
                        id: 2,
                        text: 'Газпромнефть'
                    }, {
                        id: 3,
                        text: 'ТНК'
                    }, {
                        id: 4,
                        text: 'Шелл'
                    }, {
                        id: 5,
                        text: 'БиПи'
                    }, {
                        id: 6,
                        text: 'Роснефть'
                    }, {
                        id: 7,
                        text: 'Татнефть'
                    }, {
                        id: 8,
                        text: 'Башнефть'
                    }, {
                        id: 9,
                        text: 'НэстэОйл'
                    }, {
                        id: 10,
                        text: 'СтатОйл'
                    }]*/
                }, {
                    id: 'electronics_exist',
                    text: 'Наличие устройств',
                    img: '/static/img/l-board/pc.png',
                    type: 'checkbox',
                    items: [{
                        id: 1,
                        text: 'Смартфон'
                    }, {
                        id: 2,
                        text: 'Планшет'
                    }, {
                        id: 3,
                        text: 'Ноутбук'
                    }, {
                        id: 4,
                        text: 'Стационарный компьютер'
                    }]
                }, {
                    id: 'gamingtime',
                    text: 'Играете ли Вы в видеоигры?',
                    img: '',
                    type: 'radio',
                    items: [{
                        id: 1,
                        text: 'Да, играю в онлайн игры'
                    }, {
                        id: 2,
                        text: 'Да, играю в оффлайн игры'
                    }, {
                        id: 3,
                        text: 'Да, играю в онлайн и оффлайн игры'
                    }, {
                        id: 4,
                        text: 'Нет, не играю'
                    }]
                }, {
                    id: 'gamingplatform',
                    text: 'На каких устройствах Вы играете в видеоигры?',
                    img: '',
                    type: 'checkbox',
                    items: enums.GamingPlatform.map(function(item){return {id:item.id, text:item.name};})
                    /*items: [{
                        id: 1,
                        text: 'Персональный компьютер / ноутбук'
                    }, {
                        id: 2,
                        text: 'Игровая приставка / консоль'
                    }, {
                        id: 3,
                        text: 'Мобильный телефон / планшет / смартфон'
                    }]*/
                }, {
                    id: 'tvhome',
                    text: 'Телевидение, подключенное дома',
                    img: '',
                    type: 'checkbox',
                    items: [{
                        id: 1,
                        text: 'Обычное эфирное телевидение'
                    }, {
                        id: 2,
                        text: 'Кабельное или IP телевидение'
                    }, {
                        id: 3,
                        text: 'Спутниковое телевидение'
                    }, {
                        id: 4,
                        text: 'Другое'
                    }]
                }, {
                    id: 'tvcable',
                    text: 'Поставщик кабельного или IP телевидения',
                    img: '',
                    type: 'checkbox',
                    items: enums.TvCableProvider.map(function(item){return {id:item.id, text:item.name};})
                    /*items: [{
                        id: 1,
                        text: 'Ростелеком'
                    }, {
                        id: 2,
                        text: 'МТС'
                    }, {
                        id: 3,
                        text: 'МегаФон'
                    }, {
                        id: 4,
                        text: 'Билайн / Вымпелком'
                    }, {
                        id: 5,
                        text: 'Дом.ru / Эр-Телеком'
                    }, {
                        id: 6,
                        text: 'ТТК'
                    }, {
                        id: 7,
                        text: 'Сумма Телеком / Сам Тел'
                    }, {
                        id: 8,
                        text: 'ТатТелеком / Летай'
                    }, {
                        id: 9,
                        text: 'Уфа Нэт'
                    }, {
                        id: 10,
                        text: 'Сибирские сети'
                    }, {
                        id: 11,
                        text: 'Акадо'
                    }]*/
                }, {
                    id: 'tvsputnic',
                    text: 'Телевидение, подключенное дома',
                    img: '',
                    type: 'checkbox',
                    items: enums.TvSputnicProvider.map(function(item){return {id:item.id, text:item.name};})
                    /*items: [{
                        id: 1,
                        text: 'Актив ТВ'
                    }, {
                        id: 2,
                        text: 'Континент ТВ'
                    }, {
                        id: 3,
                        text: 'НТВ-Плюс'
                    }, {
                        id: 4,
                        text: 'Орион-Экспресс'
                    }, {
                        id: 5,
                        text: 'Радуга ТВ'
                    }, {
                        id: 6,
                        text: 'Телекарта'
                    }, {
                        id: 7,
                        text: 'Триколор ТВ'
                    }, {
                        id: 8,
                        text: 'Восточный Экспресс'
                    }]*/
                }];
            });

            (function prepareSport(){
                parameters.sport = [{
                    id: 'sport_1',
                    text: 'Футбол',
                    img: '',
                    type: 'checkbox',
                    items: enums.FootballClubsKnown.map(function(item){return {id:item.id, text:item.name};})
                    /*items: [{
                        id: 0,
                        text: 'Сборная России по футболу'
                    }, {
                        id: 1,
                        text: 'Молодежная сборная России по футболу'
                    }, {
                        id: 2,
                        text: 'Амкар'
                    }, {
                        id: 3,
                        text: 'Анжи'
                    }, {
                        id: 4,
                        text: 'Арсенал (Тула)'
                    }, {
                        id: 5,
                        text: 'Динамо (Москва)'
                    }, {
                        id: 6,
                        text: 'Зенит'
                    }, {
                        id: 7,
                        text: 'Краснодар'
                    }, {
                        id: 8,
                        text: 'Крылья Советов'
                    }, {
                        id: 9,
                        text: 'Кубань'
                    }, {
                        id: 10,
                        text: 'Локомотив'
                    }, {
                        id: 11,
                        text: 'Мордовия'
                    }, {
                        id: 12,
                        text: 'Ростов'
                    }, {
                        id: 13,
                        text: 'Рубин'
                    }, {
                        id: 14,
                        text: 'Спартак (Москва)'
                    }, {
                        id: 15,
                        text: 'Терек'
                    }, {
                        id: 16,
                        text: 'Томь'
                    }, {
                        id: 17,
                        text: 'Торпедо (Москва)'
                    }, {
                        id: 18,
                        text: 'Тосно'
                    }, {
                        id: 19,
                        text: 'Урал'
                    }, {
                        id: 20,
                        text: 'Уфа'
                    }, {
                        id: 21,
                        text: 'ЦСКА'
                    }
                    ]*/
                }, {
                    id: 'sport_2',
                    text: 'Хоккей',
                    img: '',
                    type: 'checkbox',
                    items: enums.HockeyClubsKnown.map(function(item){return {id:item.id, text:item.name};})
                    /*items: [{
                        id: 0,
                        text: 'Сборная России по хоккею'
                    }, {
                        id: 1,
                        text: 'Авангард'
                    }, {
                        id: 2,
                        text: 'Автомобилист'
                    }, {
                        id: 3,
                        text: 'Адмирал'
                    }, {
                        id: 4,
                        text: 'Ак Барс'
                    }, {
                        id: 5,
                        text: 'Амур'
                    }, {
                        id: 6,
                        text: 'Атлант'
                    }, {
                        id: 7,
                        text: 'Белые Медведи (Молодежная хоккейная лига)'
                    }, {
                        id: 8,
                        text: 'Витязь'
                    }, {
                        id: 9,
                        text: 'Динамо (Москва)'
                    }, {
                        id: 10,
                        text: 'Лада'
                    }, {
                        id: 11,
                        text: 'Локомотив'
                    }, {
                        id: 12,
                        text: 'Металлург (Магнитогорск)'
                    }, {
                        id: 13,
                        text: 'Металлург (Новокузнецк)'
                    }, {
                        id: 14,
                        text: 'Нефтехимик'
                    }, {
                        id: 15,
                        text: 'Салават Юлаев'
                    }, {
                        id: 16,
                        text: 'Северсталь'
                    }, {
                        id: 17,
                        text: 'Сибирь'
                    }, {
                        id: 18,
                        text: 'СКА'
                    }, {
                        id: 19,
                        text: 'Торпедо (Нижний Новгород)'
                    }, {
                        id: 20,
                        text: 'Трактор'
                    }, {
                        id: 21,
                        text: 'Хоккейный Клуб Сочи'
                    }, {
                        id: 22,
                        text: 'ЦСКА'
                    }, {
                        id: 23,
                        text: 'Чайка (Молодежная хоккейная лига)'
                    }, {
                        id: 24,
                        text: 'Югра'
                    }]*/
                }, {
                    id: 'sport_3',
                    text: 'Баскетбол',
                    img: '',
                    type: 'checkbox',
                    items: enums.BasketballClubsKnown.map(function(item){return {id:item.id, text:item.name};})
                    /*items: [{
                        id: 0,
                        text: 'Сборная России по баскетболу'
                    }, {
                        id: 1,
                        text: 'Автодор'
                    }, {
                        id: 2,
                        text: 'Енисей'
                    }, {
                        id: 3,
                        text: 'Зенит'
                    }, {
                        id: 4,
                        text: 'Красные Крылья'
                    }, {
                        id: 5,
                        text: 'Красный Октябрь'
                    }, {
                        id: 6,
                        text: 'Локомотив-Кубань'
                    }, {
                        id: 7,
                        text: 'Нижний Новгород'
                    }, {
                        id: 8,
                        text: 'УНИКС '
                    }, {
                        id: 9,
                        text: 'Химки'
                    }, {
                        id: 10,
                        text: 'ЦСКА'
                    }]*/
                }, {
                    id: 'sport_car',
                    text: 'Автоспорт',
                    img: '',
                    type: 'checkbox',
                    items: enums.CarKnown.map(function(item){return {id:item.id, text:item.name};})
                }, {
                    id: 'sport_figskating',
                    text: 'Фигурное катание',
                    img: '',
                    type: 'checkbox'
                }, {
                    id: 'sport_biathlon',
                    text: 'Биатлон',
                    img: '',
                    type: 'checkbox'
                }, {
                    id: 'sport_boxing',
                    text: 'Бокс',
                    img: '',
                    type: 'checkbox'
                }, {
                    id: 'sport_tennis',
                    text: 'Теннис',
                    img: '',
                    type: 'checkbox'
                }];
            });

            (function prepareInterest(){
                parameters.interest = [{
                    id: 'interest',
                    text: 'Степень интереса',
                    img: '/static/img/icons/interest.png',
                    type: 'radio',
                    items: ConfigSrv.get().parameters.interest
                    /*items: [{
                        id: 1,
                        text: 'совершенно неинтересен'
                    }, {
                        id: 2,
                        text: 'скорее неинтересен'
                    }, {
                        id: 3,
                        text: 'ни то, ни другое'
                    }, {
                        id: 4,
                        text: 'скорее интересен'
                    }, {
                        id: 5,
                        text: 'очень интересен'
                    }]*/
                }
                ];
            });

            (function prepareRooting(){
                parameters.rooting = [{
                    id: 'rooting1',
                    text: 'Спонтанное знание',
                    img: '',
                    type: 'radio'
                }, {
                    id: 'rooting2',
                    text: 'Подсказанное знание',
                    img: '',
                    type: 'radio'
                }, {
                    id: 'rooting3',
                    text: 'Просмотр соревнования по ТВ или в интернете',
                    img: '',
                    type: 'radio',
                    items: [{
                        id: 1,
                        text: 'Смотрел(а) только за компанию с друзьями/родными'
                    }, {
                        id: 2,
                        text: 'Смотрел(а) время от времени, когда есть свободное время'
                    }, {
                        id: 3,
                        text: 'Смотрел(а) только самые значимые или интересные игры'
                    }, {
                        id: 4,
                        text: 'Старался(ась) не пропускать ни одной игры'
                    }, {
                        id: 5,
                        text: 'Смотрел(а) только за компанию с друзьями/родными'
                    }]
                }, {
                    id: 'rooting4',
                    text: 'Посещение соревнований',
                    type: 'radio',
                    items: [{
                        id: 1,
                        text: 'Ходил(а) только за компанию с друзьями/родными'
                    }, {
                        id: 2,
                        text: 'Ходил(а) время от времени, когда было свободное время'
                    }, {
                        id: 3,
                        text: 'Ходил(а) только самые значимые или интересные игры'
                    }, {
                        id: 4,
                        text: 'Старался(ась) не пропускать ни одной игры'
                    }]
                }
                ];
            });

            (function prepareInvolve(){
                parameters.involve = [{
                    id: 'involve',
                    text: 'Причастность к видам спорта',
                    img: '/static/img/icons/involve.png',
                    type: 'radio',
                    items: ConfigSrv.get().parameters.involve
                    /*items: [{
                        id: 1,
                        text: 'Занимаюсь спортом сам(а)'
                    }, {
                        id: 2,
                        text: 'Занимаются спортом члены семьи, друзья'
                    }, {
                        id: 3,
                        text: 'Смотрю спортивные трансляции по телевизору'
                    }, {
                        id: 4,
                        text: 'Читаю спортивные новости в интернете или в газетах/журналах'
                    }, {
                        id: 5,
                        text: 'Хожу на матчи, посещаю соревнования'
                    }, {
                        id: 6,
                        text: 'Не слежу, но к этому спорту отношусь позитивно'
                    }]*/
                }
                ];
            });

            (function prepareImage(){
                parameters.image = [{
                    id: 'image',
                    text: 'Восприятие видов спорта',
                    img: '/static/img/icons/image.png',
                    type: 'radio',
                    items: [{
                        id: 1,
                        text: 'Посмотреть восприятие'
                    }]
                }
                ];
            });

        }


        function getSelectedParamsRec(item){
            if (item.lists.every(function(subitem){return !subitem.lists; })){ // терминальный лист (age, clubs)
                var selectedA = item.lists.filter(function(subitem){return subitem.selected; })
                    .map(function(subitem){return subitem.id});
                if (selectedA.length){
                    return selectedA.length ? selectedA : undefined;
                    // return (selectedA.length && item.selected !== false && item.interested !== false) ? selectedA : undefined;
                }
            } else {
                var res = {};
                // проходим по дочерним, только если текущий не отмечен, как выбранный
                if (item.selected !== false && item.interested !== false) {
                    item.lists.forEach(function (subitem) {
                        var subitemList = getSelectedParamsRec(subitem);
                        if (subitemList) {
                            res[subitem.id] = subitemList;
                        } //else res[subitem.id] = []; //  TODO comment this line
                    });
                }
                if (item.interested) // хардкодим для спорта
                    res.interested = true;
                return Object.keys(res).length ? res : undefined;
            }
        }

        function getSelectedParams(itemName){
            return getSelectedParamsRec(parameters[itemName]);
        }

        function getSelectedAudience(){
            return {
                demography: getSelectedParams('demography'),
                regions: getSelectedParams('regions'),
                consume: getSelectedParams('consume')
            };
            
            var demography = {
                    age:[],
                    gender:[],
                    familysize:[],
                    children:[],
                    income:[],
                    career:[],
                    family:[]
            };
            var consume = {
                    gaming: {
                        gamingtime:[],
                        gamingplatform:[]
                    },
                    mobile: {
                        mobileprovider:[],
                        mobilenet:[]
                    },
                    electronics: {
                        electronics_exist:[],
                        decision:[],
                        buy_time: {
                            smart:[],
                            tablet:[],
                            laptop:[],
                            computer:[]
                        }
                    },
                    tv: {
                        tvhome:[],
                        tvcable:[],
                        tvsputnic:[]
                    },
                    car: {
                        carexist:[],
                        gasyear:[],
                        gasoften:[],
                        bus:[],
                        oil:[]
                    },
                    money: {
                        services_now:[],
                        services_desicion:[],
                        realestate:[],
                        insurance:[],
                        insurance_decision:[]
                    },
                    antivirus:[],
                    timeusage: {
                        time_week: {
                            net:[],
                            book:[],
                            sport:[],
                            hobby:[],
                            shops:[],
                            sport_events:[]
                        },
                        visit:[],
                        visit_time: {
                            centre:[],
                            cinema:[],
                            fitness:[],
                            yoga:[]
                        }
                    }
            };
            var regions = {
                region:[],
                fedregion:[]
            }
        }
        
        // function getSelectedSports(){
        //     return getSelectedParamsRec(parameters.sport);
        // }
        //
        // function getSelectedInterest(){
        //     // return {
        //     //     sport: getSelectedParamsRec(parameters.sport),
        //     //     interest: getSelectedParamsRec(parameters.interest)
        //     // }
        //     return getSelectedParamsRec(parameters.interest);
        // }
        //
        // function getSelectedInterest(){
        //
        // }




        function getParams(){
            return padamsDefer.promise;
        }


        var me = {
            getParams: getParams,
            getSelectedParams: getSelectedParams,
            getSelectedAudience: getSelectedAudience
            //getSelectedAudience: getSelectedAudience,
            //getSelectedSports: getSelectedSports,
            

            // getDemography: function(){return parameters.demography;},
            // getConsume: function(){return parameters.consume;},
            // getSport: function(){return parameters.sport;},
            // getInterest: function(){return parameters.interest;},
            // getRooting: function(){return parameters.rooting;},
            // getInvolve: function(){return parameters.involve;},
            // getImage: function(){return parameters.image;}
        };


        return me;
    }
}());
(function () {
    "use strict";
    /**
     * @desc
     * @example
     */
    angular.module('SportsensusApp')
        .directive('headerDir', headerDir);

    headerDir.$inject = [
        '$rootScope',
        'ApiSrv'
    ];

    function headerDir(
        $rootScope,
        ApiSrv
    )    {
        return {
            restrict: 'E',
            scope: {
            },
            templateUrl: '/views/widgets/header/header.html',
            link: function ($scope, $el, attrs) {},

            controller: [
                '$scope',
                '$routeParams',
                '$location',
                '$window',
                'ApiSrv',
                function(
                    $scope,
                    $routeParams,
                    $location,
                    $window,
                    ApiSrv
                ) {
                    $scope.loggedIn = false;
                    
                    $scope.menu = [{
                            'name': 'О проекте',
                            visible: function(){return !$scope.loggedIn;}
                        }, {
                            'name': 'Зарегистрироваться',
                            visible: function(){return !$scope.loggedIn;}
                        },{
                            'name': 'Войти',
                            visible: function(){return !$scope.loggedIn;},
                            onClick: function(){$scope.setPath('/login/');}
                        },{
                            'name': 'Техническая поддержка',
                            visible: function(){return !$scope.loggedIn;},
                            onClick: function(){$scope.setPath('/infobox/');}
                        },
                        {
                            'name': 'Получить информацию',
                            visible: function(){return $scope.loggedIn;}
                        },{
                            'name': 'Проанализировать',
                            visible: function(){return $scope.loggedIn;}
                        },{
                            'name': 'Спланировать',
                            visible: function(){return $scope.loggedIn;}
                        },{
                            'name': 'Оценить',
                            visible: function(){return $scope.loggedIn;}
                        }
                    ];

                    
                    $scope.$watch( function () { return ApiSrv.getUser().sid; }, function (sid) {
                        $scope.loggedIn = !!sid;
                    }, true);
                    
                    $scope.setPath = function(path){
                        $location.path(path);
                    };
                
                    $scope.logout = function(){
                        ApiSrv.logout();
                        $scope.setPath('/');
                    };
                }]
        };
    }
}());

(function () {
    "use strict";
    /**
     * @desc
     * @example
     */
    angular.module('SportsensusApp')
        .directive('homeDir', homeDir);

    homeDir.$inject = [
        '$rootScope'
    ];

    function homeDir(
        $rootScope
    )    {
        return {
            restrict: 'E',
            scope: {
            },
            templateUrl: '/views/widgets/home/home.html',
            link: function ($scope, $el, attrs) {},

            controller: [
                '$scope',
                '$routeParams',
                '$location',
                '$window',
                function(
                    $scope,
                    $routeParams,
                    $location,
                    $window
                ){

                }]
        };
    }
}());

(function () {
    "use strict";
    /**
     * @desc
     * @example
     */
    angular.module('SportsensusApp')
        .directive('infoboxDir', infoboxDir);

    infoboxDir.$inject = [
        '$rootScope'
    ];

    function infoboxDir(
        $rootScope
    )    {
        return {
            restrict: 'E',
            scope: {
            },
            templateUrl: '/views/widgets/infobox/infobox.html',
            link: function ($scope, $el, attrs) {},

            controller: [
                '$scope',
                '$routeParams',
                '$location',
                '$window',
                'ParamsSrv',
                function(
                    $scope,
                    $routeParams,
                    $location,
                    $window,
                    ParamsSrv
                ) {
                    $scope.audienceCountText = null;

                    $scope.audienceMenu = [{
                        id:'demography',
                        text:'Социальная демография'
                    },{
                        id:'consume',
                        text:'Потребительское поведение'
                    },{
                        id:'regions',
                        text:'География'
                    }];
                    
                    $scope.sportinfoMenu = [{
                        id:'sport',
                        text:'Спорт'
                    },{
                        id:'interest/interest',
                        // id:'interest/interestGraph',
                        text:'Степень интереса'
                    },{
                        id:'rooting/rooting',
                        // id:'rooting/rootingGraph',
                        text:'Сила боления'
                    },{
                        id:'involve/involve',
                        text:'Причастность к видам спорта'
                    },{
                        id:'image/image',
                        // id:'image/imageGraph',
                        text:'Восприятие видов спорта'
                    }];

                    $scope.pages = {};
                    ['image/imageGraph','allGraphs', 'expressSport/expressSport','expressAudience/expressAudience'].forEach(function(page){
                        $scope.pages[page] = {id:page};
                    });
                    


                    ParamsSrv.getParams().then(function(params){
                        $scope.parameters = params;
                    });


                    $scope.activePage = null;
                    $scope.activeMenuItem = null;
                    $scope.setActiveMenuItem = function(item){
                        $scope.activeMenuItem = item;
                        $scope.activePage = item;
                    };

                    

                    // $scope.$watch('activePage', function(page){
                    //     if (page && page.id == 'demography')
                    //        $scope.checkButtonText = 'Экспресс результат';
                    //     else if (page && page.id == 'sport')
                    //         $scope.checkButtonText = 'Экспресс результат';
                    //     else
                    //         $scope.checkButtonText = 'Показать результат';
                    // });
                    
                    
                    
                    // возвращает все наборы параметров, включая вложенные в виде линейной структуры
                    $scope.getAllSubchildren = function(item){
                        if (!item) return;
                        var finalItems = [];
                        if (!item.lists || item.lists.every(function(subitem){ return !subitem.lists; }))
                            finalItems.push(item);
                        else item.lists.forEach(function(subitem){
                            finalItems = finalItems.concat($scope.getAllSubchildren(subitem));
                        });
                        return finalItems;
                    };

                    // $scope.pathClick = function(){
                    //     $scope;
                    //     var a = 10;
                    // };



                    
                    $scope.$on('ApiSrv.countError', function(){
                        $scope.audienceCountText = 'Болельщики: ошибка загрузки';
                    });

                    $scope.$on('ApiSrv.countLoaded', function(event, result){
                        if (result.is_valid_count)
                            $scope.audienceCountText = 'Болельщики: ' + result.audience_count.toLocaleString();
                        else
                            $scope.audienceCountText = 'Болельщики: недостаточно данных';// + ' ' + result.audience_count.toLocaleString();
                    });


                    $scope.$on('ParamsSrv.paramsChanged', function(event, type, newValue, oldValue){
                        var demography = ParamsSrv.getSelectedParams('demography');
                        var consume = ParamsSrv.getSelectedParams('consume');
                        var regions = ParamsSrv.getSelectedParams('regions');
                        var audienceSelected = !!(demography || regions || consume);

                        var sport = ParamsSrv.getSelectedParams('sport');
                        var interest = ParamsSrv.getSelectedParams('interest');
                        var rooting = ParamsSrv.getSelectedParams('rooting');
                        var involve = ParamsSrv.getSelectedParams('involve');
                        var image = ParamsSrv.getSelectedParams('image');
                        var sportSelected = !!sport;

                        var filtersSelected = !!(interest || rooting || involve || image);

                        if (audienceSelected && !sportSelected && !filtersSelected){
                            $scope.checkButtonText = 'Экспресс результат';
                            $scope.checkButtonPage = 'expressAudience/expressAudience';
                        } else if (sportSelected && !audienceSelected && !filtersSelected){
                            $scope.checkButtonText = 'Экспресс результат';
                            $scope.checkButtonPage = 'expressSport/expressSport';
                        } else {
                            $scope.checkButtonText = 'Показать результат';
                            $scope.checkButtonPage = 'allGraphs';
                        }
                    });

                    $scope.checkButtonText = '';
                    $scope.checkButtonPage = null;
                    $scope.checkButtonClick = function(){
                        //if ($scope.activeMenuItem && $scope.activeMenuItem.id == 'image'){
                        // $scope.activePage = $scope.pages.imageGraph;
                        //$scope.activePage = $scope.pages.allGraphs;

                        //}
                        // if ($scope.activeMenuItem && $scope.activeMenuItem.id == 'demography'){
                        //     $scope.activePage = $scope.pages['expressAudience/expressAudience'];
                        // } else if ($scope.activeMenuItem && $scope.activeMenuItem.id == 'sport'){
                        //     $scope.activePage = $scope.pages['expressSport/expressSport'];
                        // } else {
                        //     $scope.activePage = $scope.pages.allGraphs;
                        // }
                        $scope.activePage = $scope.pages[$scope.checkButtonPage];

                        //var a = 10;
                    };
                    
                    // снимает выделение с соседний radio
                    $scope.selectCheckbox = function(collection, item){
                        ParamsSrv.getParams().then(function(params){
                            var a = params;
                        });

                        if (collection.type != 'radio') return;
                        angular.forEach(collection.items, function(_item) {
                            if (item != _item) {
                                _item.selected = false;
                            }
                        });
                    };

                    // кнопки левого меню
                    function a() {
                        iApp.Utils.bind(this.dom.button_menu, 'click', function (event) {
                            var button = event.target;
                            var id = button.getAttribute('data-id');

                            iApp.Utils.each(this.dom.button_menu, function (item) {
                                item.classList.remove('l-board__menu-button_active');
                            });

                            this.dom.body.style.display = '';
                            this.dom.express.style.display = '';
                            iApp.Utils.each(this.dom.box, function (item) {
                                if (item.getAttribute('data-id') == id) {
                                    item.style.display = 'flex';
                                } else {
                                    item.style.display = '';
                                }
                            });

                            button.classList.add('l-board__menu-button_active');
                        }.bind(this));

                        // кнопка Показать результаты
                        this.dom.check_button_result.addEventListener('click', function () {
                            var data = new FormData(this.dom.form);
                            var list_data = {};
                            var names = [];
                            data.forEach(function (value, key) {
                                list_data[key] = value;
                                names.push(key);
                            });

                            names = names.join('||');

                            if (Object.keys(list_data).length) {
                                this.dom.body.style.display = 'none';
                                this.dom.express.style.display = 'block';

                                console.log(this.is_info_sportinterest(names))

                                if (this.is_info_sportinterest(names)) {
                                    iApp.post('/infobox/info_sportinterest/', data, function (response) {
                                        response = iApp.Utils.parse_json(response);
                                        console.log(response)
                                        this.dom.express.innerHTML = response.template;
                                        iApp.define(iApp.blocks.gInfo, this.dom.express);
                                    }.bind(this));
                                    return;
                                }

                                if (this.is_info_fan_involvment(names)) {
                                    iApp.post('/infobox/info_fan_involvment/', data, function (response) {
                                        response = iApp.Utils.parse_json(response);
                                        console.log(response);
                                        this.dom.express.innerHTML = response.template;
                                        iApp.define(iApp.blocks.gInfo, this.dom.express);
                                    }.bind(this));
                                    return;
                                }

                                if (names.indexOf('image') > -1) {
                                    iApp.post('/infobox/info_sportimage/', data, function (response) {
                                        response = iApp.Utils.parse_json(response);
                                        //console.log(response);
                                        this.dom.express.innerHTML = response.template;
                                        //iApp.define(iApp.blocks.gInfo, this.dom.express);
                                        iApp.define(iApp.blocks.lBoardChartRadar, this.dom.express);
                                    }.bind(this));
                                    return;
                                }
                                var path = '/infobox/express/';
                                if (
                                    names.indexOf('sport') > -1 ||
                                    names.indexOf('interest') > -1 ||
                                    names.indexOf('involve') > -1 ||
                                    names.indexOf('image') > -1
                                ) {
                                    path = '/infobox/express_sport/';
                                }

                                iApp.post(path, data, function (response) {
                                    response = iApp.Utils.parse_json(response);

                                    if (response.status) {
                                        console.log(response)
                                        this.dom.express.innerHTML = response.template;

                                        iApp.Utils.bind(this.dom.express.querySelectorAll('.l-board__chart-panel-hide'), 'click', function (event) {
                                            event
                                                .currentTarget
                                                .parentNode
                                                .parentNode
                                                .querySelector('.l-board__chart-box-body')
                                                .classList
                                                .toggle('l-board__chart-box-body_hide')
                                        });

                                        iApp.define(iApp.blocks.lBoardCharts, this.dom.express);
                                        iApp.define(iApp.blocks.lBoardCircleChart, this.dom.express);
                                        iApp.define(iApp.blocks.lBoardDubleChart, this.dom.express);
                                        iApp.define(iApp.blocks.lBoardCustomChart, this.dom.express);
                                        iApp.define(iApp.blocks.lBoardChartCareer, this.dom.express);


                                        if (response.express) {
                                            //this.create_charts(response.express);
                                            iApp.Utils.each(
                                                this.dom.express.querySelectorAll('canvas'),
                                                function (canvas) {
                                                    var data = iApp.Utils.parse_json(canvas.getAttribute('data-data'));
                                                    var type = canvas.getAttribute('data-type') || 'doughnut';

                                                    this.create_canvas(canvas, data, type);
                                                }.bind(this));

                                        } else if (response.express_sport) {

                                            iApp.Utils.each(
                                                this.dom.express.querySelectorAll('canvas'),
                                                function (canvas) {
                                                    var data = iApp.Utils.parse_json(canvas.getAttribute('data-init'));
                                                    var type = canvas.getAttribute('data-type') || 'doughnut';

                                                    this.create_canvas(canvas, data, type);
                                                }.bind(this));
                                            //this.create_charts(response.express_sport);
                                        } else if (response.image) {
                                            //this.create_charts(response.express);
                                            iApp.Utils.each(
                                                this.dom.express.querySelectorAll('canvas'),
                                                function (canvas) {
                                                    var data = iApp.Utils.parse_json(canvas.getAttribute('data-init'));
                                                    var type = canvas.getAttribute('data-type') || 'doughnut';

                                                    this.create_canvas(canvas, data, type);
                                                }.bind(this));
                                        }
                                    }

                                }.bind(this));
                            }
                        }.bind(this));
                    }
                }]
        };
    }
}());

(function () {
    "use strict";
    /**
     * @desc
     * @example
     */
    angular.module('SportsensusApp')
        .directive('saveAsPdfDir', saveAsPdfDir);

    saveAsPdfDir.$inject = [
        '$rootScope',
        '$q'
    ];

    function saveAsPdfDir(
        $rootScope,
        $q
    )    {
        //var el;

        /*function saveAsPdf(){
            console.log(el[0]);
            // var canvas = document.createElement("canvas");
            // canvas.width = 1000;
            // canvas.height = 1000;
             html2canvas(el[0], {
            //html2canvas(el[0].children[0], {
                logging: true,
                allowTaint: 'true'
                 // canvas: canvas
                 // ,onrendered: function(canvas) {
                 //     var imgData = canvas.toDataURL('image/png');
                 //     var doc = new jsPDF('p', 'px', 'a0');
                 //     doc.addImage(imgData, 'PNG', 10, 10, canvas.width, canvas.height);
                 //     doc.save('sample-file.pdf');
                 // }
            }).then(function(canvas){
                // var imgData = canvas.toDataURL('image/png');
                var imgData = canvas.toDataURL('image/jpeg');
                var doc = new jsPDF('p', 'px', 'a0');
                // doc.addImage(imgData, 'PNG', 10, 10, canvas.width, canvas.height);
                doc.addImage(imgData, 'JPEG', 10, 10, canvas.width, canvas.height);
                doc.save('sample-file.pdf');
            });
        }*/

        // returns promise({svg:Element, canvas:Element})
        // canvas.replaceWith(svg);
        function svg2canvas(svg){
            return $q(function(resolve, reject){
                html2canvas(svg, {
                    logging:true,
                    allowTaint: true
                }).then(function(canvas){
                    var svgE = angular.element(svg);
                    var canvasE = angular.element(canvas);
                    svgE.replaceWith(canvasE);
                    resolve({
                        svg: svgE,
                        canvas: canvasE
                    })
                });
            });
        }

        // returns promise({svg:Element, canvas:Element})
        // canvas.replaceWith(svg);
        function svg2canvas2(svg){
            return $q(function(resolve, reject){

                var canvas = document.createElement("canvas");
                var xml = (new XMLSerializer()).serializeToString(svg);

                // Removing the name space as IE throws an error
                xml = xml.replace(/xmlns=\"http:\/\/www\.w3\.org\/2000\/svg\"/, '');
                canvg(canvas, xml);
                
                var svgE = angular.element(svg);
                var canvasE = angular.element(canvas);
                svgE.replaceWith(canvasE);
                resolve({
                    svg: svgE,
                    canvas: canvasE
                });
            });
        }


        

        function saveAsPdf(element) {
            // SVG рисуем отдельно от всего остального, потому что они портят текст...
            //var element = el;

            var elements = element.find('svg');

            var promises = Array.prototype.map.call(elements,function (item) {
                return svg2canvas2(item);
                /*return $q(function(resolve, reject){
                    html2canvas(item, {
                        logging:true,
                        allowTaint: true
                    }).then(function(canvas){
                        var svgE = angular.element(item);
                        var canvasE = angular.element(canvas);
                        svgE.replaceWith(canvasE);
                        resolve({
                            svg: svgE,
                            canvas: canvasE
                        })
                    });
                });*/
            });


            $q.all(promises).then(function(elements){
                render(elements);
            }, function(err){});


            function render(elements){
                html2canvas(element[0], {
                    useCORS: true,
                    allowTaint: true
                }).then(function (canvas) {
                    elements.forEach(function(element){
                        element.canvas.replaceWith(element.svg);
                    });

                    var imgData = canvas.toDataURL('image/png');
                    // 'a4': [595.28, 841.89],
                    var doc = new jsPDF('p', 'pt', 'a4', true);
                    
                    var scale = Math.min((595.28 - 20)/canvas.width, (841.89-20)/canvas.height);
                    // doc.addImage(imgData, 'PNG', 10, 10, canvas.width, canvas.height);
                    doc.addImage(imgData, 'PNG', 10, 10, canvas.width*scale, canvas.height*scale);
                    doc.save('sample-file.pdf');
                });
            }
        }

        return {
            restrict: 'A',
            link: function ($scope, $el, attrs) {
                //el = $el;

                // $scope.saveAsPdf = saveAsPdf;
                $scope.saveAsPdf = function(){return saveAsPdf($el);};
            }
        };
    }
}());

(function () {
    "use strict";
    /**
     * @desc
     * @example
     */
    angular.module('SportsensusApp')
        .directive('loginDir', loginDir);

    loginDir.$inject = [
        '$rootScope'
    ];

    function loginDir(
        $rootScope
    )    {
        return {
            restrict: 'E',
            scope: {
            },
            templateUrl: '/views/widgets/login/login.html',
            link: function ($scope, $el, attrs) {},

            controller: [
                '$scope',
                '$routeParams',
                '$location',
                '$window',
                'ApiSrv',
                function(
                    $scope,
                    $routeParams,
                    $location,
                    $window,
                    ApiSrv
                ){
                    $scope.vm={
                        login: null,
                        password: null,
                        error: null
                    };

                    $scope.login = function() {
                        $scope.vm.dataLoading = true;
                        $scope.vm.error = null;
                        ApiSrv.auth($scope.vm).then(function(){
                            $location.path('/infobox/');
                            $scope.vm.dataLoading = false;
                        }, function(){
                            $scope.vm.dataLoading = false;
                            $scope.vm.error = 'Неправильный логин или пароль';
                        });
                    };
                }]
        };
    }
}());
(function () {
    "use strict";
    /**
     * @desc
     * @example
     */
    angular.module('SportsensusApp')
        .directive('downloadDir', downloadDir);

    downloadDir.$inject = [
        '$rootScope'
    ];

    function downloadDir(
        $rootScope
    )    {
        return {
            restrict: 'E',
            replace: true,
            scope: true,
            templateUrl: '/views/widgets/buttons/downloadPDF/downloadPDF.html',
            link: function ($scope, $el, attrs) {},

            controller: [
                '$scope',
                
                function(
                    $scope
                    
                ) {
                    $scope.save = function(){
                        $scope.saveAsPdf && $scope.saveAsPdf();
                    };

                    $scope.print = function(){

                    };

                    $scope.send = function(){

                    };
                    
                }]
        };
    }
}());

(function () {
    "use strict";
    /**
     * @desc
     * @example
     */
    angular.module('SportsensusApp')
        .directive('legendDir', legendDir);

    legendDir.$inject = [
        '$rootScope'
    ];

    function legendDir(
        $rootScope
    )    {
        return {
            restrict: 'E',
            scope: {
                legend: '=',
                columnsCount: '@'
            },
            templateUrl: '/views/widgets/charts/legend/legend.html',
            link: function ($scope, $el, attrs) {},

            controller: [
                '$scope',
                '$routeParams',
                '$location',
                '$window',
                'ApiSrv',
                function(
                    $scope
                ){
                    $scope.legends = [];
                    $scope.$watch('legend', function(){
                        if (!$scope.legend || !$scope.legend.length) return;
                        $scope.columnsCount = Number.parseInt($scope.columnsCount) || 1;
                        var count = $scope.legend.length;
                        for (var col=1; col <= $scope.columnsCount; col++){
                            $scope.legends.push($scope.legend.slice(Math.ceil(count/$scope.columnsCount*(col-1)),Math.ceil(count/$scope.columnsCount*col)));
                        }
                    });
                    // $scope.legend = [{
                    //     name: 'text1',
                    //     color: "#ffcc00"
                    // },{
                    //     name: 'text2',
                    //     color: "#66ff33"
                    // },{
                    //     name: 'text3',
                    //     color: "#cc33ff"
                    // }];
                    
                    $scope.itemClick = function(item){
                        item.selected = !item.selected;
                    }
                }]
        };
    }
}());
/////////////////////////////////////////////////////////
/////////////// The Radar Chart Function ////////////////
/////////////// Written by Nadieh Bremer ////////////////
////////////////// VisualCinnamon.com ///////////////////
/////////// Inspired by the code of alangrafu ///////////
/////////////////////////////////////////////////////////

function RadarChart(id, data, options) {
    var cfg = {
        w: 600,				//Width of the circle
        h: 600,				//Height of the circle
        margin: {top: 20, right: 20, bottom: 20, left: 20}, //The margins of the SVG
        levels: 3,				//How many levels or inner circles should there be drawn
        maxValue: 0, 			//What is the value that the biggest circle will represent
        labelFactor: 1.25, 	//How much farther than the radius of the outer circle should the labels be placed
        wrapWidth: 60, 		//The number of pixels after which a label needs to be given a new line
        opacityArea: 0.35, 	//The opacity of the area of the blob
        dotRadius: 4, 			//The size of the colored circles of each blog
        opacityCircles: 0.1, 	//The opacity of the circles of each blob
        strokeWidth: 2, 		//The width of the stroke around each blob
        roundStrokes: false,	//If true the area and stroke will follow a round path (cardinal-closed)
        color: d3.scale.category10()	//Color function
    };

    //Put all of the options into a variable called cfg
    if('undefined' !== typeof options){
        for(var i in options){
            if('undefined' !== typeof options[i]){ cfg[i] = options[i]; }
        }//for i
    }//if

    //If the supplied maxValue is smaller than the actual one, replace by the max in the data
    var maxValue = Math.max(cfg.maxValue, d3.max(data, function(i){return d3.max(i.map(function(o){return o.value;}))}));

    var allAxis = (data[0].map(function(i, j){return i.axis})),	//Names of each axis
        total = allAxis.length,					//The number of different axes
        radius = Math.min(cfg.w/2, cfg.h/2), 	//Radius of the outermost circle
        //Format = d3.format('%'),			 	//Percentage formatting
        //Format = d3.format('.1f'),			 	
        Format = cfg.format,			 	
        angleSlice = Math.PI * 2 / total;		//The width in radians of each "slice"

    //Scale for the radius
    var rScale = d3.scale.linear()
        .range([0, radius])
        .domain([0, maxValue]);

    /////////////////////////////////////////////////////////
    //////////// Create the container SVG and g /////////////
    /////////////////////////////////////////////////////////

    //Remove whatever chart with the same id/class was present before
    d3.select(id).select("svg").remove();

    //Initiate the radar chart SVG
    var svg = d3.select(id).append("svg")
        .attr("width",  cfg.w + cfg.margin.left + cfg.margin.right)
        .attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
        .attr("class", "radar"+id);
    //Append a g element		
    var g = svg.append("g")
        .attr("transform", "translate(" + (cfg.w/2 + cfg.margin.left) + "," + (cfg.h/2 + cfg.margin.top) + ")");

    /////////////////////////////////////////////////////////
    ////////// Glow filter for some extra pizzazz ///////////
    /////////////////////////////////////////////////////////

    //Filter for the outside glow
    var filter = g.append('defs').append('filter').attr('id','glow'),
        feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation','2.5').attr('result','coloredBlur'),
        feMerge = filter.append('feMerge'),
        feMergeNode_1 = feMerge.append('feMergeNode').attr('in','coloredBlur'),
        feMergeNode_2 = feMerge.append('feMergeNode').attr('in','SourceGraphic');



    /////////////////////////////////////////////////////////
    /////////////// Draw the Circular grid //////////////////
    /////////////////////////////////////////////////////////

    //Wrapper for the grid & axes
    var axisGrid = g.append("g").attr("class", "axisWrapper");

    //Draw the background circles
    axisGrid.selectAll(".levels")
        .data(d3.range(1,(cfg.levels+1)).reverse())
        .enter()
        .append("circle")
        .attr("class", "gridCircle")
        .attr("r", function(d, i){return radius/cfg.levels*d;})
        .style("fill", "#CDCDCD")
        .style("stroke", "#CDCDCD")
        .style("fill-opacity", cfg.opacityCircles)
        .style("filter" , "url(#glow)");

    //Text indicating at what % each level is
    axisGrid.selectAll(".axisLabel")
        .data(d3.range(1,(cfg.levels+1)).reverse())
        .enter().append("text")
        .attr("class", "axisLabel")
        .attr("x", 4)
        .attr("y", function(d){return -d*radius/cfg.levels;})
        .attr("dy", "0.4em")
        .style("font-size", "10px")
        .attr("fill", "#737373")
        .text(function(d,i) { return Format(maxValue * d/cfg.levels); });

    /////////////////////////////////////////////////////////
    //////////////////// Draw the axes //////////////////////
    /////////////////////////////////////////////////////////

    //Create the straight lines radiating outward from the center
    var axis = axisGrid.selectAll(".axis")
        .data(allAxis)
        .enter()
        .append("g")
        .attr("class", "axis");
    //Append the lines
    axis.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", function(d, i){ return rScale(maxValue*1.1) * Math.cos(angleSlice*i - Math.PI/2); })
        .attr("y2", function(d, i){ return rScale(maxValue*1.1) * Math.sin(angleSlice*i - Math.PI/2); })
        .attr("class", "line")
        .style("stroke", "white")
        .style("stroke-width", "2px");

    //Append the labels at each axis
    axis.append("text")
        .attr("class", "legend")
        .style("font-size", "11px")
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .attr("x", function(d, i){ return rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice*i - Math.PI/2); })
        .attr("y", function(d, i){ return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice*i - Math.PI/2); })
        .text(function(d){return d})
        .call(wrap, cfg.wrapWidth);

    /////////////////////////////////////////////////////////
    ///////////// Draw the radar chart blobs ////////////////
    /////////////////////////////////////////////////////////

    //The radial line function
    var radarLine = d3.svg.line.radial()
        .interpolate("linear-closed")
        .radius(function(d) { return rScale(d.value); })
        .angle(function(d,i) {	return i*angleSlice; });

    if(cfg.roundStrokes) {
        radarLine.interpolate("cardinal-closed");
    }

    //Create a wrapper for the blobs	
    var blobWrapper = g.selectAll(".radarWrapper")
        .data(data)
        .enter().append("g")
        .attr("class", "radarWrapper");

    //Append the backgrounds	
    blobWrapper
        .append("path")
        .attr("class", "radarArea")
        .attr("d", function(d,i) { return radarLine(d); })
        .style("fill", function(d,i) { return cfg.color(i); })
        .style("fill-opacity", cfg.opacityArea)
        .on('mouseover', function (d,i){
            //Dim all blobs
            d3.selectAll(".radarArea")
                .transition().duration(200)
                .style("fill-opacity", 0.1);
            //Bring back the hovered over blob
            d3.select(this)
                .transition().duration(200)
                .style("fill-opacity", 0.7);
        })
        .on('mouseout', function(){
            //Bring back all blobs
            d3.selectAll(".radarArea")
                .transition().duration(200)
                .style("fill-opacity", cfg.opacityArea);
        });

    //Create the outlines	
    blobWrapper.append("path")
        .attr("class", "radarStroke")
        .attr("d", function(d,i) { return radarLine(d); })
        .style("stroke-width", cfg.strokeWidth + "px")
        .style("stroke", function(d,i) { return cfg.color(i); })
        .style("fill", "none")
        .style("filter" , "url(#glow)");

    //Append the circles
    blobWrapper.selectAll(".radarCircle")
        .data(function(d,i) { return d; })
        .enter().append("circle")
        .attr("class", "radarCircle")
        .attr("r", cfg.dotRadius)
        .attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
        .attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
        .style("fill", function(d,i,j) { return cfg.color(j); })
        .style("fill-opacity", 0.8);

    /////////////////////////////////////////////////////////
    //////// Append invisible circles for tooltip ///////////
    /////////////////////////////////////////////////////////

    //Wrapper for the invisible circles on top
    var blobCircleWrapper = g.selectAll(".radarCircleWrapper")
        .data(data)
        .enter().append("g")
        .attr("class", "radarCircleWrapper");

    //Append a set of invisible circles on top for the mouseover pop-up
    blobCircleWrapper.selectAll(".radarInvisibleCircle")
        .data(function(d,i) { return d; })
        .enter().append("circle")
        .attr("class", "radarInvisibleCircle")
        .attr("r", cfg.dotRadius*1.5)
        .attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
        .attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("mouseover", function(d,i) {
            newX =  parseFloat(d3.select(this).attr('cx')) - 10;
            newY =  parseFloat(d3.select(this).attr('cy')) - 10;

            tooltip
                .attr('x', newX)
                .attr('y', newY)
                .text(Format(d.value))
                .transition().duration(200)
                .style('opacity', 1);
                // .style('display', 'initial');
        })
        .on("mouseout", function(){
            tooltip.transition().duration(200)
                 // .style("opacity", 0);
                .style('display', 'none');
        });

    //Set up the small tooltip for when you hover over a circle
    var tooltip = g.append("text")
        .attr("class", "tooltip")
        .style("opacity", 0);
        // .style('display', 'none');

    /////////////////////////////////////////////////////////
    /////////////////// Helper Function /////////////////////
    /////////////////////////////////////////////////////////

    //Taken from http://bl.ocks.org/mbostock/7555321
    //Wraps SVG text	
    function wrap(text, width) {
        text.each(function() {
            var text = d3.select(this),
                words = text.text().split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                lineHeight = 1.4, // ems
                y = text.attr("y"),
                x = text.attr("x"),
                dy = parseFloat(text.attr("dy")),
                tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

            while (word = words.pop()) {
                line.push(word);
                tspan.text(line.join(" "));
                if (tspan.node().getComputedTextLength() > width) {
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];
                    tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                }
            }
        });
    }//wrap	

}//RadarChart
(function () {
    "use strict";
    /**
     * @desc
     * @example
     */
    angular.module('SportsensusApp')
        .directive('radarDir', radarDir);

    radarDir.$inject = [
        '$rootScope'
    ];

    function radarDir(
        $rootScope
    )    {
        return {
            restrict: 'E',
            scope: {
                chart: '='
            },
            templateUrl: '/views/widgets/charts/radar/radar.html',
            link: function ($scope, $el, attrs) {
                $scope.el = $el;
                $scope.$watch('chart', $scope.redrawChart);
            },

            controller: [
                '$scope',
                function(
                    $scope
                ){

                    
                    $scope.redrawChart = function(){
                        if (!$scope.chart || !$scope.chart.data || !$scope.chart.options) {
                            $scope.el.empty();
                            return;
                        }

                        var margin = {top: 50, right: 120, bottom: 100, left: 120};
                        var width = 700 - margin.left - margin.right;
                        var height = 700 - margin.top - margin.bottom;

                        
                        var options = {
                            w: width,
                            h: height,
                            margin: margin
                        };
                        options = angular.extend({},$scope.chart.options, options);
                        
                        RadarChart($scope.el[0], $scope.chart.data, options);
                    }
                    
                }]
        };
    }
}());
(function (factory) {
	"use strict";
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(['chart.js'], factory);
	} else if (typeof exports === 'object') {
		// Node/CommonJS
		module.exports = factory(require('chart.js'));
	} else {
		// Global browser
		factory(Chart);
	}
}(function (Chart) {
	"use strict";

	var helpers = Chart.helpers;

	var defaultConfig = {
		scaleBeginAtZero : true,

		//Boolean - Whether grid lines are shown across the chart
		scaleShowGridLines : true,

		//String - Colour of the grid lines
		scaleGridLineColor : "rgba(0,0,0,.05)",

		//Number - Width of the grid lines
		scaleGridLineWidth : 1,

        //Boolean - Whether to show horizontal lines (except X axis)
		scaleShowHorizontalLines: true,

		//Boolean - Whether to show vertical lines (except Y axis)
		scaleShowVerticalLines: true,

		//Boolean - If there is a stroke on each bar
		barShowStroke : true,

		//Number - Pixel width of the bar stroke
		barStrokeWidth : 2,

		//Number - Spacing between each of the X value sets
		barValueSpacing : 5,

		//Boolean - Whether bars should be rendered on a percentage base
		relativeBars : false,

		//String - A legend template
		legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].fillColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>",

		//Boolean - Show total legend
		showTotal: false,

		//String - Color of total legend
		totalColor: '#fff',

		//String - Total Label
		totalLabel: 'Total',

		//Boolean - Hide labels with value set to 0
		tooltipHideZero: false
	};

	Chart.Type.extend({
		name: "StackedBar",
		defaults : defaultConfig,
		initialize:  function(data){
			//Expose options as a scope variable here so we can access it in the ScaleClass
			var options = this.options;

			// Save data as a source for updating of values & methods
			this.data = data;





			this.ScaleClass = Chart.Scale.extend({
				offsetGridLines : true,
				calculateBarX : function(barIndex){
					return this.calculateX(barIndex);
				},
				calculateBarY : function(datasets, dsIndex, barIndex, value){
					var offset = 0,
						sum = 0;

					for(var i = 0; i < datasets.length; i++) {
						sum += datasets[i].bars[barIndex].value;
					}
					for(i = dsIndex; i < datasets.length; i++) {
						if(i === dsIndex && value) {
							offset += value;
						} else {
							offset = +offset + +datasets[i].bars[barIndex].value;
						}
					}

					if(options.relativeBars) {
						offset = offset / sum * 100;
					}

					return this.calculateY(offset);
				},
				calculateBaseWidth : function(){
					if (options.barWidth)
						return options.barWidth;
					else
						return (this.calculateX(1) - this.calculateX(0)) - (2*options.barValueSpacing);
				},
				calculateBaseHeight : function(){
					return (this.calculateY(1) - this.calculateY(0));
				},
				calculateBarWidth : function(datasetCount){
					//The padding between datasets is to the right of each bar, providing that there are more than 1 dataset
					return this.calculateBaseWidth();
				},
				calculateBarHeight : function(datasets, dsIndex, barIndex, value) {
					var sum = 0;

					for(var i = 0; i < datasets.length; i++) {
						sum += datasets[i].bars[barIndex].value;
					}

					if(!value) {
						value = datasets[dsIndex].bars[barIndex].value;
					}

					if(options.relativeBars) {
						value = value / sum * 100;
					}

					return this.calculateY(value);
				}
			});

			this.datasets = [];

			//Set up tooltip events on the chart
			if (this.options.showTooltips){
				helpers.bindEvents(this, this.options.tooltipEvents, function(evt){
					var activeBars = (evt.type !== 'mouseout') ? this.getBarsAtEvent(evt) : [];

					this.eachBars(function(bar){
						bar.restore(['fillColor', 'strokeColor']);
					});
					helpers.each(activeBars, function(activeBar){
						activeBar.fillColor = activeBar.highlightFill;
						activeBar.strokeColor = activeBar.highlightStroke;
					});
					this.showTooltip(activeBars);
				});
			}

			//Declare the extension of the default point, to cater for the options passed in to the constructor
			this.BarClass = Chart.Rectangle.extend({
				strokeWidth : this.options.barStrokeWidth,
				showStroke : this.options.barShowStroke,
				ctx : this.chart.ctx
			});

			//Iterate through each of the datasets, and build this into a property of the chart
			helpers.each(data.datasets,function(dataset,datasetIndex){

				var datasetObject = {
					label : dataset.label || null,
					fillColor : dataset.fillColor,
					//fillColor : dataset.fillColor instanceof Array ? dataset.fillColor[datasetIndex] : dataset.fillColor,
					strokeColor : dataset.strokeColor,
					bars : []
				};

				this.datasets.push(datasetObject);

				helpers.each(dataset.data,function(dataPoint,index){
					if(!helpers.isNumber(dataPoint)){
						dataPoint = 0;
					}
					//Add a new point for each piece of data, passing any required data to draw.
					//Add 0 as value if !isNumber (e.g. empty values are useful when 0 values should be hidden in tooltip)
					datasetObject.bars.push(new this.BarClass({
						value : dataPoint,
						label : data.labels[index],
						//datasetLabel: dataset.label,
						datasetLabel: dataset.label instanceof Array ? dataset.label[datasetObject.bars.length] : dataset.label,
						strokeColor : dataset.strokeColor,
						//fillColor : dataset.fillColor,
						fillColor : dataset.fillColor instanceof Array ? dataset.fillColor[datasetObject.bars.length] : dataset.fillColor,
						//highlightFill : dataset.highlightFill || dataset.fillColor,
						highlightFill : dataset.highlightFill || dataset.fillColor instanceof Array ? dataset.fillColor[datasetObject.bars.length] : dataset.fillColor,
						highlightStroke : dataset.highlightStroke || dataset.strokeColor
					}));
				},this);

			},this);

			this.buildScale(data.labels);




			var paddings = this.scale.xScalePaddingLeft + this.scale.xScalePaddingRight;
			var datas = data.labels.length * this.options.barWidth + data.labels.length * this.options.barValueSpacing;
			var width = paddings + datas;

			this.chart.width = width;
			this.chart.canvas.width = width;

			var height = this.options.barHeight - (this.scale.endPoint - this.scale.startPoint) + this.chart.height;

			this.chart.height = height;
			this.chart.canvas.height = height;
			
			helpers.retinaScale(this.chart);
			this.buildScale(data.labels);



			this.eachBars(function(bar, index, datasetIndex){
				helpers.extend(bar, {
					base: this.scale.endPoint,
					height: 0,
					width : this.scale.calculateBarWidth(this.datasets.length),
					x: this.scale.calculateBarX(index),
					y: this.scale.endPoint
				});
				bar.save();
			}, this);




			this.render();
		},
		showTooltip : function(ChartElements, forceRedraw){
			// Only redraw the chart if we've actually changed what we're hovering on.
			if (typeof this.activeElements === 'undefined') this.activeElements = [];

			helpers = Chart.helpers;

			var isChanged = (function(Elements){
				var changed = false;

				if (Elements.length !== this.activeElements.length){
					changed = true;
					return changed;
				}

				helpers.each(Elements, function(element, index){
					if (element !== this.activeElements[index]){
						changed = true;
					}
				}, this);
				return changed;
			}).call(this, ChartElements);

			if (!isChanged && !forceRedraw){
				return;
			}
			else{
				this.activeElements = ChartElements;
			}
			this.draw();
			if(this.options.customTooltips){
				this.options.customTooltips(false);
			}
			if (ChartElements.length > 0){
				// If we have multiple datasets, show a MultiTooltip for all of the data points at that index
				if (this.datasets && this.datasets.length > 1) {
					var dataArray,
					dataIndex;

					for (var i = this.datasets.length - 1; i >= 0; i--) {
						dataArray = this.datasets[i].points || this.datasets[i].bars || this.datasets[i].segments;
						dataIndex = helpers.indexOf(dataArray, ChartElements[0]);
						if (dataIndex !== -1){
							break;
						}
					}
					var tooltipLabels = [],
					tooltipColors = [],
					medianPosition = (function(index) {

						// Get all the points at that particular index
						var Elements = [],
						dataCollection,
						xPositions = [],
						yPositions = [],
						xMax,
						yMax,
						xMin,
						yMin;
						helpers.each(this.datasets, function(dataset){
							dataCollection = dataset.points || dataset.bars || dataset.segments;
							if (dataCollection[dataIndex] && dataCollection[dataIndex].hasValue()){
								Elements.push(dataCollection[dataIndex]);
							}
						});

						var total = {
							datasetLabel: this.options.totalLabel,
							value: 0,
							fillColor: this.options.totalColor,
							strokeColor: this.options.totalColor
						};

						helpers.each(Elements, function(element) {
							if (this.options.tooltipHideZero && element.value === 0) {
								return;
							}

							xPositions.push(element.x);
							yPositions.push(element.y);

							total.value += element.value;

							//Include any colour information about the element
							tooltipLabels.push(helpers.template(this.options.multiTooltipTemplate, element));
							tooltipColors.push({
								fill: element._saved.fillColor || element.fillColor,
								stroke: element._saved.strokeColor || element.strokeColor
							});

						}, this);

						if (this.options.showTotal) {
							tooltipLabels.push(helpers.template(this.options.multiTooltipTemplate, total));
							tooltipColors.push({
								fill: total.fillColor,
								stroke: total.strokeColor
							});
						}

						yMin = helpers.min(yPositions);
						yMax = helpers.max(yPositions);

						xMin = helpers.min(xPositions);
						xMax = helpers.max(xPositions);

						return {
							x: (xMin > this.chart.width/2) ? xMin : xMax,
							y: (yMin + yMax)/2
						};
					}).call(this, dataIndex);

					new Chart.MultiTooltip({
						x: medianPosition.x,
						y: medianPosition.y,
						xPadding: this.options.tooltipXPadding,
						yPadding: this.options.tooltipYPadding,
						xOffset: this.options.tooltipXOffset,
						fillColor: this.options.tooltipFillColor,
						textColor: this.options.tooltipFontColor,
						fontFamily: this.options.tooltipFontFamily,
						fontStyle: this.options.tooltipFontStyle,
						fontSize: this.options.tooltipFontSize,
						titleTextColor: this.options.tooltipTitleFontColor,
						titleFontFamily: this.options.tooltipTitleFontFamily,
						titleFontStyle: this.options.tooltipTitleFontStyle,
						titleFontSize: this.options.tooltipTitleFontSize,
						cornerRadius: this.options.tooltipCornerRadius,
						labels: tooltipLabels,
						legendColors: tooltipColors,
						legendColorBackground : this.options.multiTooltipKeyBackground,
						title: ChartElements[0].label,
						chart: this.chart,
						ctx: this.chart.ctx,
						custom: this.options.customTooltips
					}).draw();

				} else {
					helpers.each(ChartElements, function(Element) {
						var tooltipPosition = Element.tooltipPosition();
						new Chart.Tooltip({
							x: Math.round(tooltipPosition.x),
							y: Math.round(tooltipPosition.y),
							xPadding: this.options.tooltipXPadding,
							yPadding: this.options.tooltipYPadding,
							fillColor: this.options.tooltipFillColor,
							textColor: this.options.tooltipFontColor,
							fontFamily: this.options.tooltipFontFamily,
							fontStyle: this.options.tooltipFontStyle,
							fontSize: this.options.tooltipFontSize,
							caretHeight: this.options.tooltipCaretSize,
							cornerRadius: this.options.tooltipCornerRadius,
							text: helpers.template(this.options.tooltipTemplate, Element),
							chart: this.chart,
							custom: this.options.customTooltips
						}).draw();
					}, this);
				}
			}
			return this;
		},
		update : function(){

			//Iterate through each of the datasets, and build this into a property of the chart
			helpers.each(this.datasets,function(dataset,datasetIndex){

				helpers.extend(this.datasets[datasetIndex], {
					label : dataset.label || null,
					fillColor : dataset.fillColor,
					strokeColor : dataset.strokeColor,
				});

				helpers.each(dataset.data,function(dataPoint,index){
					helpers.extend(this.datasets[datasetIndex].bars[index], {
						value : dataPoint,
						label : this.data.labels[index],
						datasetLabel: dataset.label,
						strokeColor : dataset.strokeColor,
						fillColor : dataset.fillColor,
						highlightFill : dataset.highlightFill || dataset.fillColor,
						highlightStroke : dataset.highlightStroke || dataset.strokeColor
					});
				},this);

			},this);


			this.scale.update();
			// Reset any highlight colours before updating.
			helpers.each(this.activeElements, function(activeElement){
				activeElement.restore(['fillColor', 'strokeColor']);
			});

			this.eachBars(function(bar){
				bar.save();
			});
			this.render();
		},
		eachBars : function(callback){
			helpers.each(this.datasets,function(dataset, datasetIndex){
				helpers.each(dataset.bars, callback, this, datasetIndex);
			},this);
		},
		getBarsAtEvent : function(e){
			var barsArray = [],
				eventPosition = helpers.getRelativePosition(e),
				datasetIterator = function(dataset){
					barsArray.push(dataset.bars[barIndex]);
				},
				barIndex;

			for (var datasetIndex = 0; datasetIndex < this.datasets.length; datasetIndex++) {
				for (barIndex = 0; barIndex < this.datasets[datasetIndex].bars.length; barIndex++) {
					if (this.datasets[datasetIndex].bars[barIndex].inRange(eventPosition.x,eventPosition.y)){
						helpers.each(this.datasets, datasetIterator);
						return barsArray;
					}
				}
			}

			return barsArray;
		},
		buildScale : function(labels){
			var self = this;

			var dataTotal = function(){
				var values = [];
				helpers.each(self.datasets, function(dataset) {
					helpers.each(dataset.bars, function(bar, barIndex) {
						if(!values[barIndex]) values[barIndex] = 0;
						if(self.options.relativeBars) {
							values[barIndex] = 100;
						} else {
							values[barIndex] = +values[barIndex] + +bar.value;
						}
					});
				});
				return values;
			};

			var scaleOptions = {
				templateString : this.options.scaleLabel,
				height : this.chart.height,
				width : this.chart.width,
				ctx : this.chart.ctx,
				textColor : this.options.scaleFontColor,
				fontSize : this.options.scaleFontSize,
				fontStyle : this.options.scaleFontStyle,
				fontFamily : this.options.scaleFontFamily,
				valuesCount : labels.length,
				beginAtZero : this.options.scaleBeginAtZero,
				integersOnly : this.options.scaleIntegersOnly,
				calculateYRange: function(currentHeight){
					var updatedRanges = helpers.calculateScaleRange(
						dataTotal(),
						currentHeight,
						this.fontSize,
						this.beginAtZero,
						this.integersOnly
					);
					helpers.extend(this, updatedRanges);
				},
				xLabels : this.options.xLabels || labels,
				font : helpers.fontString(this.options.scaleFontSize, this.options.scaleFontStyle, this.options.scaleFontFamily),
				lineWidth : this.options.scaleLineWidth,
				lineColor : this.options.scaleLineColor,
				gridLineWidth : (this.options.scaleShowGridLines) ? this.options.scaleGridLineWidth : 0,
				gridLineColor : (this.options.scaleShowGridLines) ? this.options.scaleGridLineColor : "rgba(0,0,0,0)",
                showHorizontalLines : this.options.scaleShowHorizontalLines,
				showVerticalLines : this.options.scaleShowVerticalLines,
				padding : ((this.options.showScale) ? 0 : (this.options.barShowStroke) ? this.options.barStrokeWidth : 0) + (this.options.padding  ? this.options.padding : 0),
				showLabels : this.options.scaleShowLabels,
				display : this.options.showScale
			};

			if (this.options.scaleOverride){
				helpers.extend(scaleOptions, {
					calculateYRange: helpers.noop,
					steps: this.options.scaleSteps,
					stepValue: this.options.scaleStepWidth,
					min: this.options.scaleStartValue,
					max: this.options.scaleStartValue + (this.options.scaleSteps * this.options.scaleStepWidth)
				});
			}

			this.scale = new this.ScaleClass(scaleOptions);
		},
		addData : function(valuesArray,label){
			//Map the values array for each of the datasets
			helpers.each(valuesArray,function(value,datasetIndex){
				if (helpers.isNumber(value)){
					//Add a new point for each piece of data, passing any required data to draw.
					//Add 0 as value if !isNumber (e.g. empty values are useful when 0 values should be hidden in tooltip)
					this.datasets[datasetIndex].bars.push(new this.BarClass({
						value : helpers.isNumber(value)?value:0,
						label : label,
						x: this.scale.calculateBarX(this.scale.valuesCount+1),
						y: this.scale.endPoint,
						width : this.scale.calculateBarWidth(this.datasets.length),
						base : this.scale.endPoint,
						strokeColor : this.datasets[datasetIndex].strokeColor,
						fillColor : this.datasets[datasetIndex].fillColor
					}));
				}
			},this);

			this.scale.addXLabel(label);
			//Then re-render the chart.
			this.update();
		},
		removeData : function(){
			this.scale.removeXLabel();
			//Then re-render the chart.
			helpers.each(this.datasets,function(dataset){
				dataset.bars.shift();
			},this);
			this.update();
		},
		reflow : function(){
			helpers.extend(this.BarClass.prototype,{
				y: this.scale.endPoint,
				base : this.scale.endPoint
			});
			var newScaleProps = helpers.extend({
				height : this.chart.height,
				width : this.chart.width
			});
			this.scale.update(newScaleProps);
		},
		
		draw : function(ease){
			var easingDecimal = ease || 1;
			this.clear();

			//var innerWidth = this.chart.width - (this.scale.xScalePaddingLeft + this.scale.xScalePaddingRight);
			//var valueWidth = innerWidth/Math.max((this.valuesCount - ((this.offsetGridLines) ? 0 : 1)), 1);
			//var valueOffset = (valueWidth * index) + this.xScalePaddingLeft;

			/*if (this.chart.width != 200) {
				this.chart.canvas.width = this.chart.width = 200;
				//this.chart.ctx.canvas.width = 200;
				this.chart.canvas.style.width = 200 + "px";

				//this.chart.canvas.height = this.chart.height = newHeight;
				//this.resize(this.render, true);
				this.render(true);
				// if (instance.options.responsive) {
				// 	instance.resize(instance.render, true);
				// }
				return;
			}*/
			var ctx = this.chart.ctx;

			this.scale.draw(easingDecimal);

			//Draw all the bars for each dataset
			helpers.each(this.datasets,function(dataset,datasetIndex){
				helpers.each(dataset.bars,function(bar,index){
					var y = this.scale.calculateBarY(this.datasets, datasetIndex, index, bar.value),
						height = this.scale.calculateBarHeight(this.datasets, datasetIndex, index, bar.value);

					//Transition then draw
					if(bar.value > 0) {
						bar.transition({
							base : this.scale.endPoint - (Math.abs(height) - Math.abs(y)),
							x : this.scale.calculateBarX(index),
							y : Math.abs(y),
							height : Math.abs(height),
							width : this.scale.calculateBarWidth(this.datasets.length)
						}, easingDecimal).draw();
						
						ctx.font = this.scale.font;
						ctx.fillStyle = this.scale.textColor;
						ctx.textAlign = "center";
						ctx.textBaseline = "bottom";

						if (this.options.showLabels !== false)
							if (this.options.showLabels instanceof Function)
								ctx.fillText(this.options.showLabels(bar.value), bar.x, bar.y - 3);
							else
								ctx.fillText(bar.value, bar.x, bar.y - 3);
					}


				},this);
				
				/*var ctx = this.chart.ctx;
		
				ctx.font = this.scale.font;
				ctx.fillStyle = this.scale.textColor
				ctx.textAlign = "center";
				ctx.textBaseline = "bottom";

				this.datasets.forEach(function (dataset) {
					dataset.bars.forEach(function (bar) {
						ctx.fillText(bar.value, bar.x, bar.y - 3);
					});
				})*/
			},this);
		}
	});
}));

(function () {
    "use strict";
    /**
     * @desc
     * @example
     */
    angular.module('SportsensusApp')
        .directive('stackedBarDir', stackedBarDir);

    stackedBarDir.$inject = [
        '$rootScope'
    ];

    function stackedBarDir(
        $rootScope
    )    {
        return {
            restrict: 'E',
            scope: {
                chart: '='
            },
            templateUrl: '/views/widgets/charts/stackedBar/stackedBar.html',
            link: function ($scope, $el, attrs) {
                $scope.el = $el;
                $scope.$watch('chart', $scope.redrawChart);
            },
            replace: true,
            controller: [
                '$scope',
                function(
                    $scope
                ){


                    $scope.redrawChart = function(){
                        //$scope.el.empty();
                        if ($scope.chartObj){
                            $scope.chartObj.clear();
                            $scope.chartObj.destroy();
                            //delete $scope.chartObj;
                        }
                        if (!$scope.chart || !$scope.chart.data || !$scope.chart.options) {
                            //$scope.el.empty();
                            return;
                        }

                        var chartData = $scope.chart.data;
                        var chartOptions = $scope.chart.options || {};
                        // var chartData = {
                        //     labels: ["Не интересен", "Интересен"],
                        //     //labels: ["", ""],
                        //     datasets: [
                        //         {
                        //             //label: "Совершенно неинтересен",
                        //             label: ["Совершенно неинтересен", "Скорее неинтересен"],
                        //             fillColor: ["#FF6384", "#FFCE56"],
                        //             data: [60, 80]
                        //         },
                        //         {
                        //             //label: "Скорее неинтересен",
                        //             label: ["Скорее интересен", "Очень интересен"],
                        //             fillColor: ["#37E9ED","#4BC0C0"],
                        //             data: [56, 31]
                        //         }
                        //     ]
                        // };
                        //var ctx = document.getElementById("myChart1").getContext("2d");
                        var barWidth = 30;
                        var barValueSpacing = 5;
                        
                        var ctx = $scope.el.find('canvas')[0].getContext("2d");
                        $scope.chartObj = new Chart(ctx).StackedBar(chartData, angular.extend({
                            showLabels: false,
                            showTooltips: true,
                            stacked: true,
                            barWidth: 30,
                            barHeight: 100,
                            padding: 20,
                            barValueSpacing: 20,
                            //scaleLabel: "<%=value%>M",
                            scaleLabel: function(obj){
                                return obj.value > 1000*1000 ? obj.value/1000/1000+'M' : obj.value > 1000 ? obj.value/1000+'K' : obj.value;
                            },
                            //customTooltips:customTooltips,
                            tooltipHideZero: true,
                            maintainAspectRatio: false
                            //responsive: true
                            //barStrokeWidth: 40
                            //barValueSpacing: 40
                        }, chartOptions));

                        function customTooltips(tooltip) {
                            //var tooltipEl = $('#chartjs-tooltip');
                            var tooltipEl = angular.element(document.querySelector( '#chartjs-tooltip' ));

                            if (!tooltip) {
                                tooltipEl.css({ opacity: 0});
                                //tooltipEl.style.opacity = 0;
                                return;
                            }

                            tooltipEl.removeClass('above below');
                            tooltipEl.addClass(tooltip.yAlign);

                            // split out the label and value and make your own tooltip here
                            //var parts = tooltip.text.split(":");
                            //var innerHtml = '<span>' + parts[0].trim() + '</span> : <span><b>' + parts[1].trim() + '</b></span>';
                            var innerHtml = '12345';
                            tooltipEl.html(innerHtml);

                            tooltipEl.css({
                                opacity: 1,
                                left: tooltip.chart.canvas.offsetLeft + tooltip.x + 'px',
                                top: tooltip.chart.canvas.offsetTop + tooltip.y + 'px',
                                fontFamily: tooltip.fontFamily,
                                fontSize: tooltip.fontSize,
                                fontStyle: tooltip.fontStyle
                            });
                        }

                    }

                }]
        };
    }
}());
(function () {
    "use strict";
    /**
     * @desc
     */
    angular.module('SportsensusApp')
        .controller('baseGraphCtrl', baseGraphCtrl);

    baseGraphCtrl.$inject = [
        '$scope',
        '$rootScope'
    ];

    function baseGraphCtrl($scope,
                          $rootScope)
    {
        
        $scope.getSportLegend = function (options) {
            options = options || {};
            var selected = false;
            var legend = $scope.parameters.sport.lists.map(function (list) {
                selected = selected || list.interested;
                var result = {
                    id: list.id,
                    name: list.name,
                    key: list.key,
                    color: options.color ? options.color : list.chartColor,
                    selected: list.interested
                };
                if (options.clubs){
                    var clubsObj = list.lists.filter(function(child){return child.id == 'clubs';});
                    if (clubsObj.length){
                        var clubs = clubsObj[0].lists.map(function(list){
                            return {
                                id: list.id,
                                name: list.name,
                                color: options.color ? options.color : list.chartColor,
                                selected: list.selected
                            }
                        });
                        result.clubs = clubs;
                    }

                }
                return result;
            });
            if (!selected && options.selectAll !== false) legend.forEach(function(item){item.selected = true;});
            return legend;
        };
        
        $scope.getInterestLegend = function(options){
            options = options || {};
            var selected = false;
            var legend = $scope.parameters.interest.lists.map(function (list) {
                selected = selected || list.selected;
                return {
                    id: list.id,
                    name: list.name,
                    color: options.color ? options.color : list.chartColor,
                    selected: list.selected
                };
            }).reverse();
            if (!selected) legend.forEach(function(item){item.selected = true;});
            return legend;
        };
        
        $scope.getImageLegend = function(options){
            options = options || {};
            var selected = false;
            var legend = $scope.parameters.image.lists.map(function (list) {
                selected = selected || list.selected;
                return {
                    id: list.id,
                    name: list.name,
                    color: options.color ? options.color : list.chartColor,
                    selected: list.selected
                };
            }).reverse();
            if (!selected) legend.forEach(function(item){item.selected = true;});
            return legend;
        };

        $scope.getInvolveLegend = function(options){
            options = options || {};
            var selected = false;
            var legend = $scope.parameters.involve.lists.map(function (list) {
                selected = selected || list.selected;
                return {
                    id: list.id,
                    name: list.name,
                    color: options.color ? options.color : list.chartColor,
                    selected: list.selected
                };
            });//.reverse();
            if (!selected) legend.forEach(function(item){item.selected = true;});
            return legend;
        };

        $scope.formatValue = function(value){
            //value = value * 1000*1000;
            var multiplier = value > 1000*1000 ? 1000*1000 : value > 1000 ? 1000 : 1;
            //if (value > 1000*1000) multiplier = 1000*1000;
            //else if (value > 1000) multiplier = 1000;
            value = value / multiplier;
            value = value >= 100 ? Math.round(value) : value > 10 ? Math.round(value * 10) / 10 : Math.round(value * 100) / 100;
            //if (value >= 100) value = Math.round(value);
            //else if (value > 10) value = Math.round(value * 10) / 10;
            //else value = Math.round(value * 100) / 100;
            return value + (multiplier == 1000*1000 ? 'M' : multiplier == 1000 ? 'K' : '');
        }


        
    }
}());

(function () {
    "use strict";
    /**
     * @desc
     */
    angular.module('SportsensusApp')
        .controller('expressAudienceCtrl', expressAudienceCtrl);

    expressAudienceCtrl.$inject = [
        '$scope',
        '$controller',
        'ParamsSrv',
        'ApiSrv'
    ];

    function expressAudienceCtrl(
        $scope,
        $controller,
        ParamsSrv,
        ApiSrv
    ) {

        $controller('baseGraphCtrl', {$scope: $scope});

        ParamsSrv.getParams().then(function (params) {
            $scope.parameters = params;
            $scope.prepareLegends();
            // requestData();
            //requestData($scope.sportLegend[0]);
        });

        $scope.sportDatas = {};

        function requestData(sport) { // sport from legend
            var audience = ParamsSrv.getSelectedAudience();
            
            //var clubs = sport.clubs ? sport.clubs.filter(function(club){return club.selected;}).map(function(club){return club.id; }) : [];
            //
            // var sports = {};
            // $scope.parameters.sport.lists.forEach(function (list) {
            //     sports[list.id] = {interested: true}
            // });
            // var images = $scope.parameters.image.lists.map(function (list) {
            //     return list.id;
            // });
            // var sportimage = { // все спорты и все интересы
            //     sport: sports, // ParamsSrv.getParams().sport //ParamsSrv.getSelectedParams('sport'),
            //     image: images // [1, 2, 3, 4, 5, 6, 7] // ParamsSrv.getSelectedParams('image')
            // };
            ApiSrv.getExpressSport(audience).then(function (data) {
                //$scope.prepareData(data);
                var a = data;
                
                //$scope.updateGraph();
            }, function () {
            });
        }

        // $scope.prepareLegends = function () {
        //     $scope.sportLegend = $scope.getSportLegend({color:'#555555', clubs:true, selectAll:false});
        //     //    .filter(function(sport){return !!sport.clubs;});
        //
        //     $scope.sportLegend.forEach(function(sport){
        //         $scope.$watch(function(){return sport;}, function(sport, oldValue){
        //             if (sport.selected){
        //                 requestData(sport);
        //             } else {
        //                 $scope.sportDatas[sport.key] = null;
        //             }
        //         }, true);
        //     });
        //
        //     //$scope.$watch('sportLegend', $scope.updateGraph, true);
        // };
        

        /*

         $scope.prepareData = function (data) {

         var images = {};
         $scope.parameters.image.lists.forEach(function (list) {
         images[list.id] = {
         id: list.id,
         name: list.name,
         count: 0
         }
         });

         var sports = {};
         $scope.parameters.sport.lists.forEach(function (list) {
         sports[list.key] = angular.merge({
         data: angular.merge({}, images)
         }, list);
         });

         var legendIndexes = {};
         data.legends.forEach(function(item, index){
         legendIndexes[item.name] = index;
         });
         var maxValue = 0;
         data.data.forEach(function (item) {
         var sportId = item.legend[legendIndexes['sport']];
         var imageId = item.legend[legendIndexes['image']];
         sports[sportId].data[imageId].count += item.count;
         maxValue = Math.max(maxValue, sports[sportId].data[imageId].count);
         }, this);
         var multiplier = maxValue > 1000*1000 ? 1000*1000 : maxValue > 1000 ? 1000 : 1;

         // $scope.sportDatas = {};
         $scope.chartsData = {
         multiplier: multiplier,
         maxValue: maxValue,
         sports: sports
         };



         };

         $scope.updateGraph = function () {
         if (!$scope.chartsData) return;

         var sports = $scope.sportLegend.filter(function(item) {
         return item.selected;
         });

         var images = $scope.imageLegend;
         // var image = $scope.imageLegend.filter(function(item) {
         //     return item.selected;
         // });




         /!*Object.keys(sports).forEach(function (sportId) { // цикл по спортам
         var sport = sports[sportId];
         var maxValue = 0;
         var axisData = [];
         Object.keys(sport.data).forEach(function (imageId) { // цикл по восприятиям
         var value = sport.data[imageId].count / 1000 / 1000;
         value = Math.round(value * 10) / 10;
         axisData.push({axis: images[imageId].name, value: value});
         maxValue = Math.max(maxValue, value);
         }, this);
         //graph.push(axisData);
         //localColors.push(sport.chartColor);

         var sportData = {
         axisData: axisData,
         maxValue: maxValue
         };
         $scope.sportDatas[sport.id] = sportData;
         }, this);
         *!/

         var chartData = [];
         var localColors = [];
         var maxValue = 0;
         //$scope.sportLegend.forEach(function (item) {
         //if (!item.selected) return;
         sports.forEach(function(sport){
         //var maxValue = 0;
         var axisData = [];
         var data = $scope.chartsData.sports[sport.key].data;
         images.forEach(function(image){
         //Object.keys(images).forEach(function (imageId) { // цикл по восприятиям
         // var value = sport.data[imageId].count / 1000 / 1000;
         var value = $scope.chartsData.sports[sport.key].data[image.id].count;
         //var value = sport.data[imageId].count;
         //value = Math.round(value * 10) / 10;
         //axisData.push({axis: images[imageId].name, value: value});
         axisData.push({axis: image.name, value: value});
         maxValue = Math.max(maxValue, value);
         }, this);
         //graph.push(axisData);
         //localColors.push(sport.chartColor);

         // var sportData = {
         //     axisData: axisData,
         //     maxValue: maxValue
         // };
         // $scope.sportDatas[sport.id] = sportData;

         //chartData.push($scope.sportDatas[item.id].axisData);
         chartData.push(axisData);
         localColors.push(sport.color);
         //maxValue = Math.max(maxValue, $scope.sportDatas[item.id].maxValue);
         });

         // округляем до 5 в большую сторону
         //maxValue = Math.ceil(maxValue / 5) * 5;
         var multiplier = 1;
         while (maxValue > 100){
         multiplier *= 10;
         maxValue /= 10;
         }
         maxValue = Math.ceil(maxValue / 5) * 5 * multiplier;

         var radarChartOptions = {
         //w: width,
         //h: height,
         //margin: margin,
         maxValue: maxValue,
         levels: 5,
         wrapWidth: 100,
         labelFactor: 1.32,
         roundStrokes: true,
         //color: color
         format: $scope.formatValue,
         color: function (i) {
         return localColors[i];
         }
         };

         if (chartData && chartData.length)
         $scope.chart = {data: chartData, options: radarChartOptions};
         else $scope.chart = null;
         };
         */

    }

}());

(function () {
    "use strict";
    /**
     * @desc
     */
    angular.module('SportsensusApp')
        .controller('expressSportCtrl', expressSportCtrl);

    expressSportCtrl.$inject = [
        '$scope',
        '$controller',
        'ParamsSrv',
        'ApiSrv'
    ];

    function expressSportCtrl(
        $scope,
        $controller,
        ParamsSrv,
        ApiSrv
    ) {

        $controller('baseGraphCtrl', {$scope: $scope});
        
        ParamsSrv.getParams().then(function (params) {
            $scope.parameters = params;
            $scope.prepareLegends();
            // requestData();
            //requestData($scope.sportLegend[0]);
        });

        $scope.sportDatas = {};
        
        function requestData(sport) { // sport from legend
            var audience = ParamsSrv.getSelectedAudience();
            var clubs = sport.clubs ? sport.clubs.filter(function(club){return club.selected;}).map(function(club){return club.id; }) : [];
            


            //
            // var sports = {};
            // $scope.parameters.sport.lists.forEach(function (list) {
            //     sports[list.id] = {interested: true}
            // });
            // var images = $scope.parameters.image.lists.map(function (list) {
            //     return list.id;
            // });
            // var sportimage = { // все спорты и все интересы
            //     sport: sports, // ParamsSrv.getParams().sport //ParamsSrv.getSelectedParams('sport'),
            //     image: images // [1, 2, 3, 4, 5, 6, 7] // ParamsSrv.getSelectedParams('image')
            // };
            ApiSrv.getExpressSport(audience, sport.key, clubs).then(function (data) {

                $scope.sportDatas[sport.key] = data;
                var a = data;
                //$scope.prepareData(graphData);
                //$scope.updateGraph();
            }, function () {
            });
        }

        $scope.prepareLegends = function () {
            $scope.sportLegend = $scope.getSportLegend({color:'#555555', clubs:true, selectAll:false});
            //    .filter(function(sport){return !!sport.clubs;});

            $scope.sportLegend.forEach(function(sport){
                $scope.$watch(function(){return sport;}, function(sport, oldValue){
                    if (sport.selected){
                        requestData(sport);
                    } else {
                        $scope.sportDatas[sport.key] = null;
                    }
                }, true);
            });

            //$scope.$watch('sportLegend', $scope.updateGraph, true);
        };

        $scope.checkSport = function(item){
            item.selected = !item.selected;
        };

/*

        $scope.prepareData = function (data) {

            var images = {};
            $scope.parameters.image.lists.forEach(function (list) {
                images[list.id] = {
                    id: list.id,
                    name: list.name,
                    count: 0
                }
            });

            var sports = {};
            $scope.parameters.sport.lists.forEach(function (list) {
                sports[list.key] = angular.merge({
                    data: angular.merge({}, images)
                }, list);
            });

            var legendIndexes = {};
            data.legends.forEach(function(item, index){
                legendIndexes[item.name] = index;
            });
            var maxValue = 0;
            data.data.forEach(function (item) {
                var sportId = item.legend[legendIndexes['sport']];
                var imageId = item.legend[legendIndexes['image']];
                sports[sportId].data[imageId].count += item.count;
                maxValue = Math.max(maxValue, sports[sportId].data[imageId].count);
            }, this);
            var multiplier = maxValue > 1000*1000 ? 1000*1000 : maxValue > 1000 ? 1000 : 1;

            // $scope.sportDatas = {};
            $scope.chartsData = {
                multiplier: multiplier,
                maxValue: maxValue,
                sports: sports
            };



        };

        $scope.updateGraph = function () {
            if (!$scope.chartsData) return;

            var sports = $scope.sportLegend.filter(function(item) {
                return item.selected;
            });

            var images = $scope.imageLegend;
            // var image = $scope.imageLegend.filter(function(item) {
            //     return item.selected;
            // });




            /!*Object.keys(sports).forEach(function (sportId) { // цикл по спортам
             var sport = sports[sportId];
             var maxValue = 0;
             var axisData = [];
             Object.keys(sport.data).forEach(function (imageId) { // цикл по восприятиям
             var value = sport.data[imageId].count / 1000 / 1000;
             value = Math.round(value * 10) / 10;
             axisData.push({axis: images[imageId].name, value: value});
             maxValue = Math.max(maxValue, value);
             }, this);
             //graph.push(axisData);
             //localColors.push(sport.chartColor);

             var sportData = {
             axisData: axisData,
             maxValue: maxValue
             };
             $scope.sportDatas[sport.id] = sportData;
             }, this);
             *!/

            var chartData = [];
            var localColors = [];
            var maxValue = 0;
            //$scope.sportLegend.forEach(function (item) {
            //if (!item.selected) return;
            sports.forEach(function(sport){
                //var maxValue = 0;
                var axisData = [];
                var data = $scope.chartsData.sports[sport.key].data;
                images.forEach(function(image){
                    //Object.keys(images).forEach(function (imageId) { // цикл по восприятиям
                    // var value = sport.data[imageId].count / 1000 / 1000;
                    var value = $scope.chartsData.sports[sport.key].data[image.id].count;
                    //var value = sport.data[imageId].count;
                    //value = Math.round(value * 10) / 10;
                    //axisData.push({axis: images[imageId].name, value: value});
                    axisData.push({axis: image.name, value: value});
                    maxValue = Math.max(maxValue, value);
                }, this);
                //graph.push(axisData);
                //localColors.push(sport.chartColor);

                // var sportData = {
                //     axisData: axisData,
                //     maxValue: maxValue
                // };
                // $scope.sportDatas[sport.id] = sportData;

                //chartData.push($scope.sportDatas[item.id].axisData);
                chartData.push(axisData);
                localColors.push(sport.color);
                //maxValue = Math.max(maxValue, $scope.sportDatas[item.id].maxValue);
            });

            // округляем до 5 в большую сторону
            //maxValue = Math.ceil(maxValue / 5) * 5;
            var multiplier = 1;
            while (maxValue > 100){
                multiplier *= 10;
                maxValue /= 10;
            }
            maxValue = Math.ceil(maxValue / 5) * 5 * multiplier;

            var radarChartOptions = {
                //w: width,
                //h: height,
                //margin: margin,
                maxValue: maxValue,
                levels: 5,
                wrapWidth: 100,
                labelFactor: 1.32,
                roundStrokes: true,
                //color: color
                format: $scope.formatValue,
                color: function (i) {
                    return localColors[i];
                }
            };

            if (chartData && chartData.length)
                $scope.chart = {data: chartData, options: radarChartOptions};
            else $scope.chart = null;
        };
*/

    }

}());

(function () {
    "use strict";
    /**
     * @desc
     */
    angular.module('SportsensusApp')
        .controller('imageGraphCrtl', imageGraphCrtl);

    imageGraphCrtl.$inject = [
        '$scope',
        '$controller',
        'ParamsSrv',
        'ApiSrv'
    ];

    function imageGraphCrtl(
        $scope,
        $controller,
        ParamsSrv,
        ApiSrv
    ) {

        $controller('baseGraphCtrl', {$scope: $scope});
        
        ParamsSrv.getParams().then(function (params) {
            $scope.parameters = params;
            $scope.prepareLegends();
            requestGraph();
        });

        function requestGraph() {
            var audience = ParamsSrv.getSelectedAudience();
            var sports = {};
            $scope.parameters.sport.lists.forEach(function (list) {
                sports[list.id] = {interested: true}
            });
            var images = $scope.parameters.image.lists.map(function (list) {
                return list.id;
            });
            var sportimage = { // все спорты и все интересы
                sport: sports, // ParamsSrv.getParams().sport //ParamsSrv.getSelectedParams('sport'),
                image: images // [1, 2, 3, 4, 5, 6, 7] // ParamsSrv.getSelectedParams('image')
            };
            ApiSrv.getImageGraph(audience, sportimage).then(function (graphData) {
                $scope.prepareData(graphData);
                $scope.updateGraph();
            }, function () {
            });
        }

        $scope.prepareLegends = function () {
            $scope.sportLegend = $scope.getSportLegend();
            $scope.imageLegend = $scope.getImageLegend();
            $scope.$watch('sportLegend', $scope.updateGraph, true);
        };


        $scope.prepareData = function (data) {

            var images = {};
            $scope.parameters.image.lists.forEach(function (list) {
                images[list.id] = {
                    id: list.id,
                    name: list.name,
                    count: 0
                }
            });

            var sports = {};
            $scope.parameters.sport.lists.forEach(function (list) {
                sports[list.key] = angular.merge({
                    data: angular.merge({}, images)
                }, list);
            });

            var legendIndexes = {};
            data.legends.forEach(function(item, index){
                legendIndexes[item.name] = index;
            });
            var maxValue = 0;
            data.data.forEach(function (item) {
                var sportId = item.legend[legendIndexes['sport']];
                var imageId = item.legend[legendIndexes['image']];
                sports[sportId].data[imageId].count += item.count;
                maxValue = Math.max(maxValue, sports[sportId].data[imageId].count);
            }, this);
            var multiplier = maxValue > 1000*1000 ? 1000*1000 : maxValue > 1000 ? 1000 : 1;

            // $scope.sportDatas = {};
            $scope.chartsData = {
                multiplier: multiplier,
                maxValue: maxValue,
                sports: sports
            };



        };

        $scope.updateGraph = function () {
            if (!$scope.chartsData) return;

            var sports = $scope.sportLegend.filter(function(item) {
                return item.selected;
            });

            var images = $scope.imageLegend;
            // var image = $scope.imageLegend.filter(function(item) {
            //     return item.selected;
            // });




            /*Object.keys(sports).forEach(function (sportId) { // цикл по спортам
                var sport = sports[sportId];
                var maxValue = 0;
                var axisData = [];
                Object.keys(sport.data).forEach(function (imageId) { // цикл по восприятиям
                    var value = sport.data[imageId].count / 1000 / 1000;
                    value = Math.round(value * 10) / 10;
                    axisData.push({axis: images[imageId].name, value: value});
                    maxValue = Math.max(maxValue, value);
                }, this);
                //graph.push(axisData);
                //localColors.push(sport.chartColor);

                var sportData = {
                    axisData: axisData,
                    maxValue: maxValue
                };
                $scope.sportDatas[sport.id] = sportData;
            }, this);
*/
            
            var chartData = [];
            var localColors = [];
            var maxValue = 0;
            //$scope.sportLegend.forEach(function (item) {
                //if (!item.selected) return;
            sports.forEach(function(sport){
                //var maxValue = 0;
                var axisData = [];
                var data = $scope.chartsData.sports[sport.key].data;
                images.forEach(function(image){
                //Object.keys(images).forEach(function (imageId) { // цикл по восприятиям
                    // var value = sport.data[imageId].count / 1000 / 1000;
                    var value = $scope.chartsData.sports[sport.key].data[image.id].count;
                    //var value = sport.data[imageId].count;
                    //value = Math.round(value * 10) / 10;
                    //axisData.push({axis: images[imageId].name, value: value});
                    axisData.push({axis: image.name, value: value});
                    maxValue = Math.max(maxValue, value);
                }, this);
                //graph.push(axisData);
                //localColors.push(sport.chartColor);

                // var sportData = {
                //     axisData: axisData,
                //     maxValue: maxValue
                // };
                // $scope.sportDatas[sport.id] = sportData;

                //chartData.push($scope.sportDatas[item.id].axisData);
                chartData.push(axisData);
                localColors.push(sport.color);
                //maxValue = Math.max(maxValue, $scope.sportDatas[item.id].maxValue);
            });

            // округляем до 5 в большую сторону
            //maxValue = Math.ceil(maxValue / 5) * 5;
            var multiplier = 1;
            while (maxValue > 100){
                multiplier *= 10;
                maxValue /= 10;
            }
            maxValue = Math.ceil(maxValue / 5) * 5 * multiplier;

            var radarChartOptions = {
                //w: width,
                //h: height,
                //margin: margin,
                maxValue: maxValue,
                levels: 5,
                wrapWidth: 100,
                labelFactor: 1.32,
                roundStrokes: true,
                //color: color
                format: $scope.formatValue,
                color: function (i) {
                    return localColors[i];
                }
            };

            if (chartData && chartData.length)
                $scope.chart = {data: chartData, options: radarChartOptions};
            else $scope.chart = null;
        };

    }

}());

(function () {
    "use strict";
    /**
     * @desc
     */
    angular.module('SportsensusApp')
        .controller('interestGraphCrtl', interestGraphCrtl);

    interestGraphCrtl.$inject = [
        '$scope',
        '$controller',
        'ParamsSrv',
        'ApiSrv'
    ];

    function interestGraphCrtl(
        $scope,
        $controller,
        ParamsSrv,
        ApiSrv
    ) {

        $controller('baseGraphCtrl', {$scope: $scope});

        ParamsSrv.getParams().then(function (params) {
            $scope.parameters = params;
            $scope.prepareLegends();
            requestGraph();
        });

        $scope.showCharts = false;

        function requestGraph() {
            var audience = ParamsSrv.getSelectedAudience();
            var sports = {};
            $scope.parameters.sport.lists.forEach(function (list) {
                sports[list.id] = {interested: true}
            });
            var interests = $scope.parameters.interest.lists.map(function (list) {
                return list.id;
            });
            var sportinterest = { // все спорты и все интересы
                sport: sports, // ParamsSrv.getParams().sport //ParamsSrv.getSelectedParams('sport'),
                interest: interests // [1, 2, 3, 4, 5, 6, 7] // ParamsSrv.getSelectedParams('image')
            };
            ApiSrv.getInterestGraph(audience, sportinterest).then(function (graphData) {
                $scope.prepareData(graphData);
                $scope.updateGraph();
            }, function () {
            });
        }

        $scope.prepareLegends = function () {
            $scope.sportLegend = $scope.getSportLegend({color:'#555555'});
            $scope.interestLegend = $scope.getInterestLegend();
            
            $scope.$watch('sportLegend', $scope.updateGraph, true);
            $scope.$watch('interestLegend', $scope.updateGraph, true);
        };
        

        $scope.prepareData = function (data) {

            var interests = {};
            $scope.parameters.interest.lists.forEach(function (list) {
                interests[list.id] = {
                    id: list.id,
                    name: list.name,
                    count: 0
                }
            });
            
            var sports = {};
            $scope.parameters.sport.lists.forEach(function (list) {
                sports[list.key] = angular.merge({
                    data: angular.merge({}, interests)
                }, list);
            });

            var legendIndexes = {};
            data.legends.forEach(function(item, index){
                legendIndexes[item.name] = index;
            });

            var maxValue = 0;
            data.data.forEach(function (item) {
                var sportId = item.legend[legendIndexes['sport']];
                var interestId = item.legend[legendIndexes['sportinterest']];
                sports[sportId].data[interestId].count += item.count;
                maxValue = Math.max(maxValue, sports[sportId].data[interestId].count);
            }, this);
            var multiplier = maxValue > 1000*1000 ? 1000*1000 : maxValue > 1000 ? 1000 : 1;

            $scope.chartsData = {
                multiplier: multiplier,
                maxValue: maxValue,
                sports: sports
            };

        };

        $scope.updateGraph = function () {
            if (!$scope.chartsData) return;

            var sports = $scope.sportLegend.filter(function(item) {
                return item.selected;
            });

            var interests = $scope.interestLegend.filter(function(item) {
                return item.selected;
            });
            // используем stack только если не выбран пункт "ни то ни сё"
            var useStack = interests.every(function(item){return item.id != 3;});

            var charts = [];
            sports.forEach(function(sport){
                var chartData = {labels:[],datasets:[]};

                if (useStack){
                    var interestA = [];
                    var notInterestA = [];
                    interests.forEach(function(interest){
                        if ($scope.chartsData.sports[sport.key].data[interest.id].count == 0) return;
                        if (interest.id < 3) interestA.push(interest);
                        if (interest.id > 3) notInterestA.push(interest);
                    });
                    var twoCols = interestA.length && notInterestA.length;

                    var firstDs = { label:[], fillColor:[], data:[] };
                    var secondDs = { label:[], fillColor:[], data:[] };

                    [[notInterestA[0],firstDs],[interestA[0],firstDs],
                    [notInterestA[1],secondDs],[interestA[1],secondDs]].forEach(function(item){
                        if(item[0]){
                            item[1].label.push(item[0].name);
                            item[1].fillColor.push(item[0].color);
                            item[1].data.push($scope.chartsData.sports[sport.key].data[item[0].id].count);
                        } else if (twoCols){
                            item[1].label.push('');
                            item[1].fillColor.push('');
                            item[1].data.push(0);
                        }
                    });

                    chartData.labels.push('');
                    if (twoCols) chartData.labels.push('');

                    if (firstDs.label.length) {
                        chartData.datasets.push(firstDs)
                    }
                    if (secondDs.label.length) {
                        chartData.datasets.push(secondDs)
                    }
                } else { // not use bars
                    var dataDs = { label:[], fillColor:[], data:[] };
                    var emptyDs = { label:[], fillColor:[], data:[] };

                    interests.forEach(function(interest){
                        var value = $scope.chartsData.sports[sport.key].data[interest.id].count;
                        if (value == 0) return;
                        
                        dataDs.label.push(interest.name);
                        dataDs.fillColor.push(interest.color);
                        dataDs.data.push($scope.chartsData.sports[sport.key].data[interest.id].count);

                        emptyDs.label.push(interest.name);
                        emptyDs.fillColor.push(interest.color);
                        emptyDs.data.push(0);

                        chartData.labels.push('');
                    });

                    chartData.datasets.push(dataDs);
                    chartData.datasets.push(emptyDs);
                }

                charts.push({
                    sport:sport,
                    chartData:{data:chartData, options:{
                        showLabels: useStack && chartData.datasets.length > 1 ? false : $scope.formatValue,
                        scaleLabel: function(obj){return $scope.formatValue(obj.value);}

                    }}
                })
            });

            $scope.showCharts = !!charts.length && !!interests.length;
            $scope.charts = charts;


            // Combine all sports in one graph
            var combineChart = {data:{labels:[], datasets:[]}, options:{
                scaleLabel: function(obj){return $scope.formatValue(obj.value);},
                barWidth: 40,
                barHeight: 300,
                barValueSpacing: 30
            }};
            combineChart.data.labels = sports.map(function(item){return item.name.replace(' ','\n');});
            interests.forEach(function(interest){
                var ds = { label:[], fillColor:[], data:[] };
                sports.forEach(function(sport) {
                    ds.label.push(interest.name);//item[0].name);
                    ds.fillColor.push(interest.color);
                    ds.data.push($scope.chartsData.sports[sport.key].data[interest.id].count);
                });
                combineChart.data.datasets.push(ds);
            });
            $scope.combineChart = (combineChart.data.labels.length > 1 ? combineChart : null);


        };

    }

}());

(function () {
    "use strict";
    /**
     * @desc
     */
    angular.module('SportsensusApp')
        .controller('involveGraphCrtl', involveGraphCrtl);

    involveGraphCrtl.$inject = [
        '$scope',
        '$controller',
        'ParamsSrv',
        'ApiSrv'
    ];

    function involveGraphCrtl(
        $scope,
        $controller,
        ParamsSrv,
        ApiSrv
    ) {

        $controller('baseGraphCtrl', {$scope: $scope});

        ParamsSrv.getParams().then(function (params) {
            $scope.parameters = params;
            $scope.prepareLegends();
            requestGraph();
        });

        $scope.showCharts = false;

        function requestGraph() {
            var audience = ParamsSrv.getSelectedAudience();
            var sports = {};
            $scope.parameters.sport.lists.forEach(function (list) {
                sports[list.id] = {interested: true}
            });
            var involve = $scope.parameters.involve.lists.map(function (list) {
                return list.id;
            });
            var sportInvolve = { // все спорты и все интересы
                sport: sports, // ParamsSrv.getParams().sport //ParamsSrv.getSelectedParams('sport'),
                involve: involve // [1, 2, 3, 4, 5, 6, 7] // ParamsSrv.getSelectedParams('image')
            };
            ApiSrv.getInvolveGraph(audience, sportInvolve).then(function (graphData) {
                $scope.prepareData(graphData);
                $scope.updateGraph();
            }, function () {
            });
        }

        $scope.prepareLegends = function () {
            $scope.sportLegend = $scope.getSportLegend({color:'#555555'});
            $scope.involveLegend = $scope.getInvolveLegend();

            $scope.$watch('sportLegend', $scope.updateGraph, true);
            $scope.$watch('involveLegend', $scope.updateGraph, true);
        };



        $scope.prepareData = function (data) {

            var involves = {};
            $scope.parameters.involve.lists.forEach(function (list) {
                involves[list.id] = {
                    id: list.id,
                    name: list.name,
                    count: 0
                }
            });

            var sports = {};
            $scope.parameters.sport.lists.forEach(function (list) {
                sports[list.key] = angular.merge({
                    data: angular.merge({}, involves)
                }, list);
            });


            var legendIndexes = {};
            data.legends.forEach(function(item, index){
                legendIndexes[item.name] = index;
            });

            var maxValue = 0;
            data.data.forEach(function (item) {
                var sportId = item.legend[legendIndexes['sport']];
                var involveId = item.legend[legendIndexes['involve']];
                sports[sportId].data[involveId].count += item.count;
                maxValue = Math.max(maxValue, sports[sportId].data[involveId].count);
            }, this);
            var multiplier = maxValue > 1000*1000 ? 1000*1000 : maxValue > 1000 ? 1000 : 1;


            $scope.chartsData = {
                multiplier: multiplier,
                maxValue: maxValue,
                sports: sports
            };
            

        };

        $scope.updateGraph = function () {
            if (!$scope.chartsData) return;
            

            var sports = $scope.sportLegend.filter(function(item) {
                return item.selected;
            });

            var involves = $scope.involveLegend.filter(function(item) {
                return item.selected;
            });

            var charts = [];
            sports.forEach(function(sport){
                // if (!sport.selected) return;
                //charts.push(sport);
                var chartData = {labels:[],datasets:[]};

                    var dataDs = { label:[], fillColor:[], data:[] };
                    var emptyDs = { label:[], fillColor:[], data:[] };

                    involves.forEach(function(involve){
                        var value = $scope.chartsData.sports[sport.key].data[involve.id].count;
                        if (value == 0) return;

                        dataDs.label.push(involve.name);
                        dataDs.fillColor.push(involve.color);
                        dataDs.data.push($scope.chartsData.sports[sport.key].data[involve.id].count);

                        emptyDs.label.push(involve.name);
                        emptyDs.fillColor.push(involve.color);
                        emptyDs.data.push(0);

                        chartData.labels.push('');
                    });

                    chartData.datasets.push(dataDs);
                    chartData.datasets.push(emptyDs);
                // }


                charts.push({
                    sport:sport,
                    chartData:{data:chartData, options:{
                        showLabels: $scope.formatValue,
                        scaleLabel: function(obj){return $scope.formatValue(obj.value);}
                    }}
                })
            });

            $scope.showCharts = !!charts.length && !!involves.length;
            $scope.charts = charts;

            // Combine all sports in one graph
            var combineChart = {data:{labels:[], datasets:[]}, options:{
                scaleLabel: function(obj){return $scope.formatValue(obj.value);},
                barWidth: 40,
                barHeight: 300,
                barValueSpacing: 30
            }};
            combineChart.data.labels = sports.map(function(item){return item.name;});
            involves.forEach(function(involve){
                var ds = { label:[], fillColor:[], data:[] };
                sports.forEach(function(sport) {
                    ds.label.push(involve.name);//item[0].name);
                    ds.fillColor.push(involve.color);
                    ds.data.push($scope.chartsData.sports[sport.key].data[involve.id].count);

                });
                combineChart.data.datasets.push(ds);
            });
            $scope.combineChart = (combineChart.data.labels.length > 1 ? combineChart : null);
        };

    }

}());

(function () {
    "use strict";
    /**
     * @desc
     */
    angular.module('SportsensusApp')
        .controller('rootingGraphCrtl', rootingGraphCrtl);

    rootingGraphCrtl.$inject = [
        '$scope',
        '$controller',
        'ParamsSrv',
        'ApiSrv'
    ];

    function rootingGraphCrtl(
        $scope,
        $controller,
        ParamsSrv,
        ApiSrv
    ) {

        $controller('baseGraphCtrl', {$scope: $scope});

        ParamsSrv.getParams().then(function (params) {
            $scope.parameters = params;
            $scope.prepareLegends();
            requestGraph();
        });

        $scope.showCharts = false;

        function requestGraph() {
            var audience = ParamsSrv.getSelectedAudience();
            var sports = {};
            $scope.parameters.sport.lists.forEach(function (list) {
                sports[list.id] = {interested: true}
            });
            var involve = $scope.parameters.involve.lists.map(function (list) {
                return list.id;
            });
            var sportInvolve = { // все спорты и все интересы
                sport: sports, // ParamsSrv.getParams().sport //ParamsSrv.getSelectedParams('sport'),
                involve: involve // [1, 2, 3, 4, 5, 6, 7] // ParamsSrv.getSelectedParams('image')
            };
            ApiSrv.getInvolveGraph(audience, sportInvolve).then(function (graphData) {
                $scope.prepareData(graphData);
                $scope.updateGraph();
            }, function () {
            });
        }

        $scope.prepareLegends = function () {
            $scope.sportLegend = $scope.getSportLegend({color:'#555555', clubs:true, selectAll:false})
                .filter(function(sport){return !!sport.clubs;});
            
            $scope.involveLegend = $scope.getInvolveLegend();

            $scope.$watch('sportLegend', $scope.updateGraph, true);
            $scope.$watch('involveLegend', $scope.updateGraph, true);
        };

        $scope.checkSport = function(item){
            item.selected = !item.selected;
        };


        $scope.prepareData = function (data) {

            var involves = {};
            $scope.parameters.involve.lists.forEach(function (list) {
                involves[list.id] = {
                    id: list.id,
                    name: list.name,
                    count: 0
                }
            });

            var sports = {};
            $scope.parameters.sport.lists.forEach(function (list) {
                sports[list.key] = angular.merge({
                    data: angular.merge({}, involves)
                }, list);
            });


            var legendIndexes = {};
            data.legends.forEach(function(item, index){
                legendIndexes[item.name] = index;
            });

            var maxValue = 0;
            data.data.forEach(function (item) {
                var sportId = item.legend[legendIndexes['sport']];
                var involveId = item.legend[legendIndexes['involve']];
                sports[sportId].data[involveId].count += item.count;
                maxValue = Math.max(maxValue, sports[sportId].data[involveId].count);
            }, this);
            var multiplier = maxValue > 1000*1000 ? 1000*1000 : maxValue > 1000 ? 1000 : 1;


            $scope.chartsData = {
                multiplier: multiplier,
                maxValue: maxValue,
                sports: sports
            };


        };

        $scope.updateGraph = function () {
            if (!$scope.chartsData) return;


            var sports = $scope.sportLegend.filter(function(item) {
                return item.selected;
            });

            var involves = $scope.involveLegend.filter(function(item) {
                return item.selected;
            });

            var charts = [];
            sports.forEach(function(sport){
                // if (!sport.selected) return;
                //charts.push(sport);
                var chartData = {labels:[],datasets:[]};

                var dataDs = { label:[], fillColor:[], data:[] };
                var emptyDs = { label:[], fillColor:[], data:[] };

                involves.forEach(function(involve){
                    var value = $scope.chartsData.sports[sport.key].data[involve.id].count;
                    if (value == 0) return;

                    dataDs.label.push(involve.name);
                    dataDs.fillColor.push(involve.color);
                    dataDs.data.push($scope.chartsData.sports[sport.key].data[involve.id].count);

                    emptyDs.label.push(involve.name);
                    emptyDs.fillColor.push(involve.color);
                    emptyDs.data.push(0);

                    chartData.labels.push('');
                });

                chartData.datasets.push(dataDs);
                chartData.datasets.push(emptyDs);
                // }


                charts.push({
                    sport:sport,
                    chartData:{data:chartData, options:{
                        showLabels: $scope.formatValue,
                        scaleLabel: function(obj){return $scope.formatValue(obj.value);}
                    }}
                })
            });

            $scope.showCharts = !!charts.length && !!involves.length;
            $scope.charts = charts;

            // Combine all sports in one graph
            var combineChart = {data:{labels:[], datasets:[]}, options:{
                scaleLabel: function(obj){return $scope.formatValue(obj.value);},
                barWidth: 40,
                barHeight: 300,
                barValueSpacing: 30
            }};
            combineChart.data.labels = sports.map(function(item){return item.name;});
            involves.forEach(function(involve){
                var ds = { label:[], fillColor:[], data:[] };
                sports.forEach(function(sport) {
                    ds.label.push(involve.name);//item[0].name);
                    ds.fillColor.push(involve.color);
                    ds.data.push($scope.chartsData.sports[sport.key].data[involve.id].count);

                });
                combineChart.data.datasets.push(ds);
            });
            $scope.combineChart = (combineChart.data.labels.length > 1 ? combineChart : null);
        };

    }

}());
