angular
	.module('SportsensusApp', [
		//'ngMaterial',
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
     * ParamsSrv.highlightItem
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

            // var a = [
            //     'FootballClubsKnown', // - футбольные клубы
            //     'HockeyClubsKnown', // - хоккейные команды
            //     'BasketballClubsKnown', // - баскетбольные команды
            //     'CarKnown', // - соревнования автоспорта
            //
            //     'MobileProvider', // - мобильные операторы
            //     'TvCableProvider', // - операторы кабельного тв
            //     'TvSputnicProvider', // - операторы спутникого тв
            //     'GasStationPeriod', // - АЗС
            //     'GamingPlatform' // - игровые платформы
            // ];

            /*function getItem(items, id){
                var finded;
                items.some(function(item){
                    if (item.id == id){
                        finded = item;
                        return true;
                    }
                });
                if (!finded) return;
                var selected = finded.items.filter(function(item){return item.selected;}).map(function(item){return item.id;});
                return selected.length ? selected : undefined;
            }*/


            function getElement(id){
                function isNumber(n) {
                    return !isNaN(parseFloat(n)) && isFinite(n);
                }
                function recFillTranslations(item){
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

                }
                
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
                recFillTranslations(item);
                return item;
                
                // translations.translates = {}
            }

            //getItem(parameters.demography, 'age')
            ['demography','consume','regions','sport','interest','rooting','involve','image'].forEach(function(type){
                parameters[type] = getElement(type);
            });
            

            //$rootScope.$watchGroup([parameters.demography,parameters.consume,parameters.regions], refreshCount);
            //$rootScope.$watchCollection(parameters.demography, refreshCount);
            $rootScope.$watch(function(){return [parameters.demography,parameters.consume,parameters.regions]}, refreshCount, true);

            function refreshCount(newValue, oldValue){
                var audience = getAudience();
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

        function getAudience(){

            function getParamsRec(item){
                if (item.lists.every(function(subitem){return !subitem.lists; })){ // терминальный лист (age)
                    var selectedA = item.lists.filter(function(subitem){return subitem.selected; })
                        .map(function(subitem){return subitem.id});
                    if (selectedA.length){
                        return selectedA.length ? selectedA : undefined;
                    }
                } else {
                    var res = {};
                    item.lists.forEach(function(subitem){
                        var subitemList = getParamsRec(subitem);
                        if (subitemList){
                            res[subitem.id] = subitemList;
                        } //else res[subitem.id] = []; //  TODO comment this line
                    });
                    return Object.keys(res).length ? res : undefined;
                }
            }

            var demography = getParamsRec(parameters.demography);
            var consume = getParamsRec(parameters.consume);


            return {
                demography:demography,
                consume:consume
                //regions:regions
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

        function getParams(){
            return padamsDefer.promise;
        }


        var me = {
            getParams: getParams,

            getDemography: function(){return parameters.demography;},
            getConsume: function(){return parameters.consume;},
            getSport: function(){return parameters.sport;},
            getInterest: function(){return parameters.interest;},
            getRooting: function(){return parameters.rooting;},
            getInvolve: function(){return parameters.involve;},
            getImage: function(){return parameters.image;}
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
                        id:'interest',
                        text:'Степень интереса'
                    },{
                        id:'rooting',
                        text:'Сила боления'
                    },{
                        id:'involve',
                        text:'Причастность к видам спорта'
                    },{
                        id:'image',
                        text:'Восприятие видов спорта'
                    }];


                    ParamsSrv.getParams().then(function(params){
                        $scope.parameters = params;
                    });
                    
                    /*$scope.demography = ParamsSrv.getDemography();
                    $scope.consume = ParamsSrv.getConsume();
                    $scope.sport = ParamsSrv.getSport();
                    $scope.interest = ParamsSrv.getInterest();
                    $scope.rooting = ParamsSrv.getRooting();
                    $scope.involve = ParamsSrv.getInvolve();
                    $scope.image = ParamsSrv.getImage();*/
                    
                    $scope.activeMenuItem = null;
                    $scope.setActiveMenuItem = function(item){
                        $scope.activeMenuItem = item;
                    };
                    
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

                    $scope.pathClick = function(){
                        $scope;
                        var a = 10;
                    };

                    $scope.checkButtonClick = function(){
                        $scope;
                        var a = 10;
                    };

                    
                    $scope.$on('ApiSrv.countError', function(){
                        $scope.audienceCountText = 'Болельщики: НЕДОСТАТОЧНО ДАННЫХ';
                    });

                    $scope.$on('ApiSrv.countLoaded', function(event, result){
                        if (result.is_valid_count)
                            $scope.audienceCountText = 'Болельщики: ' + result.audience_count;
                        else
                            $scope.audienceCountText = 'Болельщики: НЕДОСТАТОЧНО ДАННЫХ ' + result.audience_count;
                    });
                    
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