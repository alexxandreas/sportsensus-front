(function () {

    "use strict";
    
    angular
	.module('SportsensusApp', [
		'ngMaterial',
		'ngRoute',
		'ngCookies',
		'Views',
		'ckeditor'
	])
	// .config(function($mdThemingProvider) {
	// 	$mdThemingProvider.theme('dark-grey').backgroundPalette('grey').dark();
	// })
	.config(['$locationProvider', function($locationProvider){
		$locationProvider.hashPrefix('!');
	}])
	.config(['$routeProvider', configRoutes])
	.factory('routeSrv', ['$rootScope', '$location', function($rootScope, $location){
		$rootScope.$on("$routeChangeError", 
             function (event, current, previous, rejection) {
        		//console.log("failed to change routes");
        		$location.path('/');
             }
		)
		return {};
	}])
	.run(['routeSrv', function(routeSrv) {}])
	.controller('ActivateController', function($scope, $routeParams) {
		var init = function () {
			alert($routeParams.code)
		};

		// fire on controller loaded
		init();
	})
	.config(function($mdThemingProvider) {
		// $mdThemingProvider.theme('blue')
		// 	.primaryPalette('blue');
		$mdThemingProvider.theme('default')
			.primaryPalette('blue')
			.warnPalette('red')
			.accentPalette('blue');
	})
	.run(['ConfigSrv', function (ConfigSrv) {
		var config = window.appConfig;
		ConfigSrv.set(config);
	}]);
	
	
	configRoutes.$inject = [
        '$routeProvider',
        '$q'
    ];
	
	function getUserAuthResolver() {
		return {
			userAuthResolver: ['ApiSrv', function(ApiSrv) {
				return ApiSrv.getUserAuthPromise()
			}]
		};
	}
	
	function configRoutes($routeProvider) {
			

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
				template: '<infobox-dir type="infobox"></infobox-dir>',
				resolve: getUserAuthResolver(),
				controller: function($scope, $location, ApiSrv) {
					if (!ApiSrv.getUser().sid || ApiSrv.getUser().userRights.admin)
						$location.path('/');
				}
			})
			.when('/analytics/', {
				//template: '<infobox-dir type="analytics"></infobox-dir>',
				template: '<analytics-dir></analytics-dir>',
				resolve: getUserAuthResolver(),
				controller: function($scope, $location, ApiSrv) {
					if (!ApiSrv.getUser().sid || ApiSrv.getUser().userRights.admin)
						$location.path('/');
				}
			})
			.when('/articles/', { 
				template: '<articles-dir></articles-dir>',
				resolve: getUserAuthResolver(),
				controller: function($scope, $location, ApiSrv) {
					if (!ApiSrv.getUser().sid || ApiSrv.getUser().userRights.admin)
						$location.path('/');
				}
			})
			.when('/articles/:articleId', { 
				template: '<article-dir></article-dir>',
				resolve: getUserAuthResolver(),
				controller: function($scope, $location, ApiSrv) {
					if (!ApiSrv.getUser().sid || ApiSrv.getUser().userRights.admin)
						$location.path('/');
				}
			})
			.when('/login/', { 
				template: '<login-dir></login-dir>'
			})
			.when('/activate/', {
				//template: '<login-dir></login-dir>'
				template: ' ',
				// controller: 'ActivateController'
				controller: function($scope, $location, $mdDialog, ApiSrv) {
					//alert($routeParams.code)
					var code = $location.search().code;
					if (code){
						ApiSrv.activate(code).then(function(){
							//alert('Activated');
							showAlert('Учётная запись успешно активирована');
							$location.search('code', undefined);
							$location.path('/');
						}, function(){
							//alert('Activation error');
							showAlert('Ошибка активации учётной записи');
							$location.search('code', undefined);
							$location.path('/');
						})
					} else {
						$location.path('/');
					}

					function showAlert(text) {
						// Appending dialog to document.body to cover sidenav in docs app
						// Modal dialogs should fully cover application
						// to prevent interaction outside of dialog
						$mdDialog.show(
							$mdDialog.alert()
								//.parent(angular.element(document.querySelector('#popupContainer')))
								//.clickOutsideToClose(true)
								.title('Активация учетной записи')
								.textContent(text)
								//.ariaLabel('Alert Dialog Demo')
								.ok('OK')
								//.targetEvent(ev)
						);
					}
				}
			})
			
			.when('/admin/', {
				template: '<admin-dir></admin-dir>',
				resolve: getUserAuthResolver(),
				controller: function($scope, $location, ApiSrv) {
					if (!ApiSrv.getUser().userRights || !ApiSrv.getUser().userRights.admin)
						$location.path('/');
				}
			})
			
			.when('/admin/articles/', {
				template: '<admin-articles-dir></admin-articles-dir>',
				resolve: getUserAuthResolver(),
				controller: function($scope, $location, ApiSrv) {
					if (!ApiSrv.getUser().userRights || !ApiSrv.getUser().userRights.admin)
						$location.path('/');
				}
			})
			
			.when('/admin/profiles/', {
				template: '<admin-profiles-dir></admin-profiles-dir>',
				resolve: getUserAuthResolver(),
				controller: function($scope, $location, ApiSrv) {
					if (!ApiSrv.getUser().userRights || !ApiSrv.getUser().userRights.admin)
						$location.path('/');
				}
			})
			
			.when('/admin/cases/', {
				template: '<admin-cases-dir></admin-cases-dir>',
				resolve: getUserAuthResolver(),
				controller: function($scope, $location, ApiSrv) {
					if (!ApiSrv.getUser().userRights || !ApiSrv.getUser().userRights.admin)
						$location.path('/');
				}
			})
			
			.when('/admin/cases/:caseId', {
				template: '<admin-case-dir></admin-case-dir>',
				resolve: getUserAuthResolver(),
				controller: function($scope, $location, ApiSrv) {
					if (!ApiSrv.getUser().userRights || !ApiSrv.getUser().userRights.admin)
						$location.path('/');
				}
			})
			
			.when('/account/', {
				template: '<account-dir></account-dir>',
				resolve: getUserAuthResolver(),
				controller: function($scope, $location, ApiSrv) {
					if (!ApiSrv.getUser().userRights)
						$location.path('/');
				}
			})
			
			
			//.otherwise('/');
			
		}
	// .config(function($mdIconProvider) {
	// });
	
}());
(function () {
    "use strict";
    angular.module('SportsensusApp')
        .filter('trustAsHtmlFltr', trustAsHtmlFltr);

    trustAsHtmlFltr.$inject = ['$sce'];

    function trustAsHtmlFltr($sce)
    {
        return function trustAsHtml(value) {
            return $sce.trustAsHtml(value);
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
		.directive('preloaderDir', preloaderDir);

	preloaderDir.$inject = [
		'$rootScope',
		'$compile'
	];

	function preloaderDir(
		$rootScope,
		$compile
	)    {
		return {
			restrict: 'A',
			scope: {
				preloaderDir: '='
			},
		
			link: function ($scope, $el, attrs) {
			    var divTemplate = '<div layout="row" layout-align="center center" '+
			        'style="background-color: rgba(49, 37, 37, 0.2);top: 0;left: 0;height: 100%;width: 100%;position: absolute;">'+
			        '<md-progress-circular md-mode="indeterminate" ></md-progress-circular>'+
			        '</div>'
				
                var div = angular.element(divTemplate);
                $compile(div)($scope);
                
                $el.css( "position", "relative" );
				
				$scope.$watch('preloaderDir', function(value){
    				if (value === true) {
    				    $el.append(div);
    				} else {
    				    //$el.remove(div);
    				    div.remove();
    				}
    			});
			
			}
		};
	}
}());

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


        var articles = [{
                id:1,
                title: "Тестовая статья",
                image: 'data:image/png;base64,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',
                content: '<p style="text-align:center"><span style="font-size:20px"><strong>Заголовок статьи</strong></span></p><p><strong>Картинки:</strong></p><p><img alt="" border="0" hspace="0" src="data:image/jpeg;base64,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" style="border:0px solid black; height:256px; margin-bottom:0px; margin-left:0px; margin-right:0px; margin-top:0px; width:256px" vspace="0" />&nbsp;&nbsp;&nbsp;<img alt="" border="0" hspace="0" src="data:image/jpeg;base64,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" style="border:0px solid black; height:256px; margin-bottom:0px; margin-left:0px; margin-right:0px; margin-top:0px; width:256px" vspace="0" />&nbsp;&nbsp;&nbsp;<img alt="" border="0" hspace="0" src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAgAAZABkAAD/7AZlRHVja3kAAQAEAAAAUQACBlAAAAMmAGUAcABhADAAMAA2ADUANwAwADEANwAgAEEAIABjAGEAdAAgAHcAYQBsAGsAcwAgAG8AbgAgAGEAIABiAG8AYQByAGQAdwBhAGwAawAgAGkAbgAgAFMAYwBoAGEAcAByAG8AZABlACAAbwBuACAAdABoAGUAIABuAG8AcgB0AGgAZQByAG4AIABpAHMAbABhAG4AZAAgAG8AZgAgAFIAdQBlAGcAZQBuACwAIABHAGUAcgBtAGEAbgB5ACwAIABXAGUAZABuAGUAcwBkAGEAeQAsACAAMAAxACAATQBhAHIAYwBoACAAMgAwADAANgAuACAAUABlAHQAIABvAHcAbgBlAHIAcwAgAHcAaQBsAGwAIABoAGEAdgBlACAAdABvACAAawBlAGUAcAAgAHQAaABlAGkAcgAgAGMAYQB0AHMAIABpAG4AZABvAG8AcgBzACAAYQBuAGQAIABkAG8AZwBzACAAbwBuACAAYQAgAGwAZQBhAHMAaAAgAGkAbgAgAGEAcgBlAGEAcwAgAG8AZgAgAEcAZQByAG0AYQBuAHkAIABoAGkAdAAgAGIAeQAgAGIAaQByAGQAIABmAGwAdQAsACAAYQBjAGMAbwByAGQAaQBuAGcAIAB0AG8AIABuAGUAdwAgAG0AZQBhAHMAdQByAGUAcwAgAGEAZwByAGUAZQBkACAAbwBuACAAVwBlAGQAbgBlAHMAZABhAHkAIAB0AG8AIABjAG8AbQBiAGEAdAAgAHQAaABlACAAcwBwAHIAZQBhAGQAIABvAGYAIAB0AGgAZQAgAGQAaQBzAGUAYQBzAGUALgAgAFQAaABlACAAYQBjAHQAaQBvAG4AIAB3AGEAcwAgAG8AcgBkAGUAcgBlAGQAIABiAHkAIABhACAAZwBvAHYAZQByAG4AbQBlAG4AdAAtAGEAcABwAG8AaQBuAHQAZQBkACAAcABhAG4AZQBsACAAYQAgAGQAYQB5ACAAYQBmAHQAZQByACAAYQAgAGYAbwByAG0AIABvAGYAIABIADUATgAxACAAYgBpAHIAZAAgAGYAbAB1ACAAdwBhAHMAIABmAG8AdQBuAGQAIABpAG4AIABhACAAZABlAGEAZAAgAGMAYQB0ACAAbwBuACAAdABoAGUAIABuAG8AcgB0AGgAZQByAG4AIABpAHMAbABhAG4AZAAgAG8AZgAgAFIAdQBlAGcAZQBuACAAaQBuACAAdABoAGUAIABmAGkAcgBzAHQAIABwAG8AcwBpAHQAaQB2AGUAIABpAGQAZQBuAHQAaQBmAGkAYwBhAHQAaQBvAG4AIABvAGYAIAB0AGgAZQAgAHYAaQByAHUAcwAgAGkAbgAgAGEAIABtAGEAbQBtAGEAbAAgAGkAbgAgAEUAdQByAG8AcABlAC4AIABUAGgAZQAgAGQAaQByAGUAYwB0AGkAdgBlACAAYQBwAHAAbABpAGUAcwAgAHQAbwAgAHAAZQB0ACAAbwB3AG4AZQByAHMAIABpAG4AIAByAGUAcwB0AHIAaQBjAHQAZQBkACAAYQByAGUAYQBzACAAbwBmACAAZgBpAHYAZQAgAEcAZQByAG0AYQBuACAAcwB0AGEAdABlAHMAIAB3AGgAaQBjAGgAIABoAGEAdgBlACAAYgBlAGUAbgAgAGgAaQB0ACAAYgB5ACAAYgBpAHIAZAAgAGYAbAB1ACAAcwBpAG4AYwBlACAAdABoAGUAIABkAGkAcwBlAGEAcwBlACAAZgBpAHIAcwB0ACAAYQBwAHAAZQBhAHIAZQBkACAAaQBuACAARQB1AHIAbwBwAGUAJwBzACAAbQBvAHMAdAAgAHAAbwBwAHUAbABvAHUAcwAgAGMAbwB1AG4AdAByAHkAIABlAGEAcgBsAHkAIABsAGEAcwB0ACAAbQBvAG4AdABoAC4AIABQAGUAbwBwAGwAZQAgAGMAYQB1AGcAaAB0ACAAdgBpAG8AbABhAHQAaQBuAGcAIAB0AGgAZQAgAG4AZQB3ACAAcgBlAGcAdQBsAGEAdABpAG8AbgBzACAAYwBvAHUAbABkACAAZgBhAGMAZQAgAGEAIABmAGkAbgBlAC4AIAAgAEUAUABBAC8ASgBFAE4AUwAgAEIAVQBFAFQAVABOAEUAUgAA/+4ADkFkb2JlAGTAAAAAAf/bAIQAAgICAgICAgICAgMCAgIDBAMCAgMEBAQEBAQEBAYEBQUFBQQGBgcHBwcHBgkJCgoJCQwMDAwMDAwMDAwMDAwMDAECAwMFBAUJBgYJDQoICg0PDg4ODg8PDAwMDAwPDwwMDAwMDA8MDAwMDAwMDAwMDAwMDAwMDAwM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" style="border:0px solid black; height:256px; margin-bottom:0px; margin-left:0px; margin-right:0px; margin-top:0px; width:256px" vspace="0" /></p><p><strong>Презентация:</strong></p><p><iframe frameborder="0" height="400" scrolling="no" src="https://www.slideshare.net/slideshow/embed_code/49289" width="600"></iframe></p><p><strong>Youtube:</strong></p><p><iframe allowfullscreen="" frameborder="0" height="360" src="https://www.youtube.com/embed/w0ffwDYo00Q" width="640"></iframe></p><p>&nbsp;</p><p>&nbsp;</p>',
                tags: ['tag1','tag2']
            },{
                id:2,
                title: "title2",
                content: "content2",
                tags: ['tag3']
            },{
                id:3,
                title: "title3",
                content: "content3",
                image: "data:image/png;base64,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"
            }];
            
            
        function getArticles(){
            var data = prepareRequestData("cms.get_articles", {sid: sid});
            return request(data, 'data.result.articles');
            
            
            // var articlesDefer = $q.defer();
            // articlesDefer.resolve(articles);
            // return articlesDefer.promise;
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
(function () {

    "use strict";
    angular.module('SportsensusApp')
        .factory('ArticlesSrv', ArticlesSrv);

    // инициализируем сервис
    angular.module('SportsensusApp').run(['ArticlesSrv', function(ArticlesSrv) {

    }]);

    // angula
    // r.module('SportsensusApp').run(ArticlesSrv.init);

    ArticlesSrv.$inject = [
        '$rootScope',
        '$q',
        'ApiSrv'
    ];


    function ArticlesSrv(
        $rootScope,
        $q,
        ApiSrv
    ) {
        
        //var articles = [];
        //var allTags = [];
        
        var tags = {
            // ungrouped: []
        };
        
        var articlesLoaded = false;
        var articlesDefer = $q.defer();

        function addTags(newTags, allTags){
            angular.forEach(newTags, function(tag){
                var parts = tag.split('::');
                var group = null;
                
                if (parts.length > 1) {
                    tag = parts.slice(1).join('::');
                    group = parts[0];
                } else {
                    group = 'ungrouped'
                }
                
                allTags[group] = allTags[group] || [];
                
                if (allTags[group].indexOf(tag) < 0)
                    allTags[group].push(tag);
            });
        }
    
        
        function getTags() {
            return getArticles().then(function(articles){
                return tags;
            });
        }
        
        function getArticles(){
            if (!articlesLoaded){
                articlesLoaded = true;
                
                ApiSrv.getUserAuthPromise().then(function(){
                    ApiSrv.getArticles().then(function(articles){
                        //articles = newArticles;
                        angular.forEach(articles, loadArticleTags);
                        
                        articlesDefer.resolve(articles);
                        return articles;
                    }, function(){
                        articlesDefer.reject();
                    }); 
                });
            }
            
            return articlesDefer.promise;
        }
        
        // загрузка тегов из tags в groupedTags
        function loadArticleTags(article) {
            article.groupedTags = {};
            if (!article.tags) return;
            addTags(article.tags, article.groupedTags);
            addTags(article.tags, tags);
        }
        
        // сохранение тегов из groupedTags в tags
        function saveArticleTags(article) {
            article.tags = [];
            angular.forEach(article.groupedTags, function(group, groupName){
                angular.forEach(group, function(tag){
                    article.tags.push((groupName == 'ungrouped' ? '' : groupName + '::') + tag);
                })
            });
            addTags(article.tags, tags);
        }
        
        function getArticle(id) {
    
            //return ApiSrv.getArticle(id);
            
            return getArticles().then(function(articles){
                
                // var oldArticle = articles.filter(function(art){
                //     return art.id == id;
                // })[0];
                // return oldArticle;
            
               
                
                return ApiSrv.getArticle(id).then(function(article){
                    loadArticleTags(article);
                    return article;
                });
            });
        }

        function setArticle(article){
        
            return getArticles().then(function(articles){
                saveArticleTags(article);
                var method = article.id !== undefined ?  ApiSrv.editArticle : ApiSrv.createArticle;
                
                return method(article).then(function(newArticle){
                    //var newArticle = angular.extend({id: id}, article);
                    //delete newArticle.content;
                    
                    var oldArticle = articles.filter(function(art){
                        return art.id == newArticle.id;
                    })[0];
                    
                    if (oldArticle)
                        angular.extend(oldArticle, newArticle)
                    else 
                        articles.push(newArticle);
                        
                    //addTags(newArticle.tags);
                    
                    return newArticle;
                })
            });
            
        }
        
        function removeArticle(article){
            if (!article.id)
                return $q.reject();
            
            return getArticles().then(function(articles){
                return ApiSrv.removeArticle(article.id).then(function(result){
                    if (result === true)
                        articles.splice(articles.indexOf(article), 1);
                });
            });
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
     * ParamsSrv.paramsChanged type newValue oldValue. type in ['demography','consume','regions','region','sport','interest','rooting','involve','image','career]
     */
    function ParamsSrv(
        $rootScope,
        $http,
        $q,
        ApiSrv,
        ConfigSrv
    ) {

        var padamsDefer = $q.defer();

        var parametersNames = ['demography','consume','regions','region','sport','interest','rooting','involve',
            'image','watch','walk','tvhome', 'tvcable','electronics','electronics_exist','gasoften','career',
            'decision', 'timeusage', 'time_week', 'visit_time', 'net','gamingplatform', 'gamingtime'];
        var parameters = {}; // все параметры
        var selected = {}; // выбранные параметры

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
            extendTranslations();
            prepareParams();
            setParamsWatchers();
            padamsDefer.resolve(parameters);
        }, function(){
            padamsDefer.reject();
        });

        function extendTranslations(){
            return;
          
        }


        // подписка на изменение параметров, для перезапроса count
        function setParamsWatchers(){

        }

        function prepareParams() {

            function isNumber(n) {
                return !isNaN(parseFloat(n)) && isFinite(n);
            }

          

            function getElement(key){
                function recFind(items){
                    var finded;
                    items.some(function(item){
                        //if (item.id && item.id == id){
                        if (item.key && item.key == key){
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

            parametersNames.forEach(function(type){
                parameters[type] = getElement(type);
                $rootScope.$watch(function(){return parameters[type]; }, function(newValue, oldValue){
                    selected[type] = getSelectedParamsRec(newValue);

                    $rootScope.$broadcast('ParamsSrv.paramsChanged', type, selected[type]);

                    if (['demography','consume','regions'].indexOf(type) >= 0){
                        ApiSrv.getCount(getSelectedAudience());
                    }
                }, true);
            });

            
            // проставляем спортам клубы
            parameters.sport.lists.forEach(function(item){
                
                prepareChildren('clubs');
                prepareChildren('leagues');
                prepareChildren('playgrounds');
                
                function prepareChildren(type){
                    var childObj = item.lists.filter(function(child){return child.key == type;});
                    if (childObj.length && childObj[0].lists && childObj[0].lists.length)
                        item[type] = childObj[0].lists;
                    else item[type] = [];
                }

                // проставляем для каждой лиги клубы
                item.leagues.forEach(function(league){
                   league.clubs = league.clubs.map(function(clubId){
                       for(var i=0; i < item.clubs.length; i++)
                           if(item.clubs[i].id == clubId)
                               return item.clubs[i];
                       return null;
                   }).filter(function(club){return !!club; });
                    
                    
                    // TODO хардкодим, какие лиги показываются в аналитике!!!
                    if(league.name == "КХЛ" || league.name == "РФПЛ")
                        league.showInAnalytics = true;
                });
                item.disableSelectionInAnalytics = true;
            });



            var colorGenerator = d3.scale.category10();
            parametersNames.forEach(function(type){
            //['sport','interest','involve','watch','walk'].forEach(function(type){
                parameters[type].lists.forEach(function(item){
                    var id = item.id;
                    id = Number.parseInt(id) % 10;
                    if(!Number.isNaN(id)) {
                        item.chartColor = colorGenerator(id);
                        //console.log(id + ' ' + typeof(id) + ' ' + item.chartColor);
                    }
                });
            });
            parameters.region.lists.forEach(function(item){
                item.chartColor = '#777777';
            })

        }

        function clearSelection(type){
            clearRec(parameters[type]);
            
            function clearRec(item) {
                if (item.selected) item.selected = false;
                if (item.interested) item.interested = false;

                item.lists && item.lists.forEach(function (subitem) {
                    clearRec(subitem);
                });
            }
        }

        function selectAll(type){
            var lists = parameters[type] && parameters[type].lists;
            if (!lists) return;
            lists.forEach(function (item) {
                if (item.interested !== undefined) item.interested = true;
                else item.selected = true;
            });
            /*
            selectRec(parameters[type]);

            function selectRec(item) {
                if (item.selected !== undefined) item.selected = true;
                if (item.interested !== undefined) item.interested = true;

                item.lists && item.lists.forEach(function (subitem) {
                    selectRec(subitem);
                });
            }*/
        }

        function getSelectedParamsRec(item){
            if (item.lists && item.lists.some(function(subitem){return !subitem.lists; })){ // терминальный лист (age, clubs)
                var selectedA = item.lists.filter(function(subitem){return subitem.selected; })
                    .map(function(subitem){return subitem.id});
                if (selectedA.length){
                    return selectedA.length ? selectedA : undefined;
                }
            } else {
                var res = {};
                // проходим по дочерним, только если текущий не отмечен, как выбранный
                if (item.selected !== false && item.interested !== false) {
                    /*item.lists && */item.lists.forEach(function (subitem) {
                        if (!subitem.key) return;
                        var subitemList = getSelectedParamsRec(subitem);
                        if (subitemList) {
                            res[subitem.key] = subitemList;
                        } //else res[subitem.id] = []; //  TODO comment this line
                    });
                }
                if (item.interested) // хардкодим для спорта
                    res.interested = true;
                return Object.keys(res).length ? res : undefined;
            }
        }

        function getSelectedParams(itemName){
            //return getSelectedParamsRec(parameters[itemName]);
            //return selected[itemName];
            if (itemName)
                return selected[itemName];
            else 
                return selected;
        }

        function getSelectedAudience(){
            // return {
            //     demography: getSelectedParams('demography'),
            //     regions: getSelectedParams('regions'),
            //     consume: getSelectedParams('consume')
            // };
            var regions = selected['regions'];
            return {
                demography: selected['demography'],
                // regions: selected['regions'],
                regions: regions,// ? {region:regions} : undefined,
                consume: selected['consume']
            };
        }
        
        function isAudienceSelected(){
            return !!selected['demography'] || !!selected['regions'] || !!selected['consume'];
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


        function getSelectedDemographyCaption(){
            var demography =parameters.demography;
            var results = [];
            demography.lists.forEach(function(list){
                var selected = list.lists.filter(function(sublist){
                   return sublist.selected;
                }).map(function(sublist){
                    return sublist.name;
                }).join(', ');
                if (selected)
                    results.push({
                        name: list.name,
                        data: selected
                    });
            });

            var result = results.map(function(obj){
                return obj.name + ': ' + obj.data;
            }).join('<br>');
            if (result)
                result = 'Профиль болельщика: <br>' + result;
            return result;
        }


        function getSelectedSportCaption(includeEmptySports){
            var sport = parameters.sport;
            var results = [];
            sport.lists.forEach(function(list){
                //var interestedObj = list.lists.filter(function(child){return child.id == 'clubs';});
                if (!list.interested) return;
                //var clubsObj = list.lists.filter(function(child){return child.id == 'clubs';});

                var selected = list.clubs.length && list.clubs.filter(function(sublist){
                //var selected = clubsObj.length && clubsObj[0].lists.filter(function(sublist){
                    return sublist.selected;
                }).map(function(sublist){
                    return sublist.name;
                }).join(', ');
                if (selected)
                    results.push({
                        name: list.name,
                        data: selected
                    });
                else if (includeEmptySports){
                    results.push({
                        name: list.name
                    });
                }
            });

            var result = results.map(function(obj){
                return obj.name + (obj.data ? ': ' + obj.data : '');
            }).join('<br>');
            if (result)
                result = 'Профиль спорта: <br>' + result;
            return result;
        }

        function getParams(){
            return padamsDefer.promise;
        }


        var me = {
            getParams: getParams,
            getSelectedParams: getSelectedParams,
            getSelectedAudience: getSelectedAudience,
            isAudienceSelected: isAudienceSelected,

            clearSelection: clearSelection,
            selectAll: selectAll,
            getSelectedDemographyCaption: getSelectedDemographyCaption,
            getSelectedSportCaption: getSelectedSportCaption

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
    angular.module('SportsensusApp')
        .factory('PreloaderSrv', PreloaderSrv);

    // инициализируем сервис
    angular.module('SportsensusApp').run(['PreloaderSrv', function(PreloaderSrv) {

    }]);

    // angula
    // r.module('SportsensusApp').run(PreloaderSrv.init);

    PreloaderSrv.$inject = [
        '$rootScope'
    ];


    function PreloaderSrv(
        $rootScope
    ) {
        
        function showWait(parent){
            $mdDialog.show({
                controller: waitCtrl,
                template: '<md-dialog style="background-color:transparent;box-shadow:none">' +
                            '<div layout="row" layout-sm="column" layout-align="center center" aria-label="wait" style="overflow: hidden">' +
                                '<md-progress-circular md-mode="indeterminate" ></md-progress-circular>' +
                            '</div>' +
                         '</md-dialog>',
                parent: parant || angular.element(document.body),
                clickOutsideToClose:false,
                fullscreen: false
            })
            .then(function(answer) {
            
            });
            
            function waitCtrl($rootScope, $mdDialog) {
                $rootScope.$on("PreloaderSrv.hideWait", function (event, args) {
                    $mdDialog.cancel();
                });
            }

		}
   
        function hideWait(){
            $rootScope.$emit("PreloaderSrv.hideWait"); 
        }
        
        var me = {
            
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
		.directive('accountDir', accountDir);

	accountDir.$inject = [
		'$rootScope',
		'analyticsSrv'
	];

	function accountDir(
		$rootScope,
		analyticsSrv
	)    {
		return {
			restrict: 'E',
			scope: {
				type: '@'
			},
			templateUrl: '/views/widgets/account/account.html',
			link: function ($scope, $el, attrs) {

			},

			controller: [
				'$scope',
				'$controller',
				'$routeParams',
				'$location',
				'$window',
				'$mdDialog',
				'ParamsSrv',
				'ApiSrv',
				function(
					$scope,
					$controller,
					$routeParams,
					$location,
					$window,
					$mdDialog,
					ParamsSrv,
					ApiSrv
				) {

					$controller('baseInfoboxCtrl', {$scope: $scope});

					$scope.topMenu = [{
						id:'personalData',
						tpl:'personalData',
						text:'Личные данные'
						// isSelected: $scope.checkSelected.bind(null, 'consume'),
						//footer: 'analytics'
					},{
						id:'address',
						tpl:'address',
						text:'Адрес'
						// isSelected: $scope.checkSelected.bind(null, 'consume'),
						//footer: 'analytics'
					},{
						id:'bank',
						tpl:'bank',
						text:'Банковские реквизиты'
						// isSelected: $scope.checkSelected.bind(null, 'consume'),
						//footer: 'analytics'
					},{
						id:'password',
						tpl:'password',
						text:'Смена пароля'
						// isSelected: $scope.checkSelected.bind(null, 'consume'),
						//footer: 'analytics'
					}];


					$scope.pages = {};

					[$scope.topMenu/*, $scope.bottomMenu, $scope.extPages*/].forEach(function(collection) {
						collection.forEach(function (item) {
							$scope.pages[item.id] = item;
						});
					});

					$scope.setActiveMenuItem($scope.topMenu[0]);


					// Личные данные
					// Адрес
					// Банковские реквизиты
					// Смена пароля

					$scope.params1 = {
						'first_name': {title: 'Имя'},
						'last_name': {title: 'Фамилия'},
						'phone': {title: 'Телефон'},
						'company_name': {title: 'Название компании'},
						'legal_status': {
							title: 'Юридический статус',
							type: 'combo',
							items: [
								{value: 0, name: 'Физическое лицо'},
								{value: 1, name: 'Юридическое лицо'}
							]
						},
						'company_type': {
							title: 'Тип компании',
							type: 'combo',
							items: [
								{value: 0, name: 'Спонсор'},
								{value: 1, name: 'Правообладатель'},
								{value: 2, name: 'Агенство'}
							]
						}
					};

					$scope.params2 = {
						'city_address': {title: 'Город'},
						'street_address': {title: 'Улица'},
						'house_address': {title: 'Дом'},
						'address_type': {
							title: 'Тип адреса',
							type: 'combo',
							items: [
								{value: 0, name: 'Офис'},
								{value: 1, name: 'Дом'}
							]
						}
					};

					$scope.params3 = {
						'legal_address': 	{title: 'Юридический адрес'},
						'inn': 				{title: 'Инн'},
						'kpp':	 			{title: 'Кпп'},
						'okpo': 			{title: 'Код окпо'},
						'okonh': 			{title: 'Код оконх'},
						'bank_account': 	{title: 'Банковский счет'},
						'corr_account': 	{title: 'Корр. счет'},
						'bic': 				{title: 'Бик'}
					};


					getProfile();

					function getProfile(){
						ApiSrv.getProfile().then(function(data){
							$scope.profile = data;
							$scope.originalProfile = angular.extend({}, data);
						}, function(){});
					}


					$scope.isProfileChanged = function(){
						return !angular.equals($scope.profile, $scope.originalProfile);
					};

					$scope.saveProfile = function(){
						ApiSrv.editProfile($scope.profile).then(function(){
							$scope.originalProfile = angular.extend({}, $scope.profile);	
						}, function(){
							$mdDialog.show($mdDialog.alert()
								.title('Ошибка сохранения')
								.textContent('Невозможно сохранить изменения')
								.ok('OK'));
						});
						
					};

					$scope._newPassword = null;
					$scope.newPassword = function(pass){
						if (arguments.length)
							$scope._newPassword = pass;
						return $scope._newPassword;
					};
					
					$scope.savePassword = function(){
						ApiSrv.changePassword($scope.newPassword()).then(function(){
							$scope.newPassword(null);
						}, function(){
							$mdDialog.show($mdDialog.alert()
								.title('Ошибка сохранения')
								.textContent('Невозможно сохранить новый пароль')
								.ok('OK'));
						})

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
		.directive('oldAdminDir', adminDir);

	adminDir.$inject = [
		'$rootScope'
	];

	function adminDir(
		$rootScope
	)    {
		return {
			restrict: 'E',
			scope: {
				type: '@'
			},
			templateUrl: '/views/widgets/admin/admin.html',
			link: function ($scope, $el, attrs) {
				//$scope.init();
			},

			controller: [
				'$scope',
				'$routeParams',
				'$location',
				'$window',
				'$mdDialog',
				'ParamsSrv',
				'ApiSrv',
				function(
					$scope,
					$routeParams,
					$location,
					$window,
					$mdDialog,
					ParamsSrv,
					ApiSrv
				) {

					

					$scope.menu = [{
						id:'profiles',
						text:'Пользователи'
					},{
						id:'leagues',
						text:'Лиги'
					},{
						id:'email',
						text:'Шаблоны писем'
					},{
						id:'other',
						text:'Другое'
					}];


					// $scope.pages = {};
					// [
					// 	'profiles',
					// 	'leagues',
					// 	'email',
					// 	'other'
					// ].forEach(function(page){
					// 	$scope.pages[page] = {id:page};
					// });
					
					

					ApiSrv.getProfilesList().then(function(profiles){
						$scope.profiles = profiles;
					}, function(){});

					$scope.saveProfile = function(profile){
						var acl = {
							"admin": profile.admin_role,
							"sponsor":  profile.sponsor_role,
							"rightholder":  profile.rightholder_role,
							"demo":  profile.demo_role
						};
						ApiSrv.addRole(profile.user_id, acl).then(function(acl){
							profile.admin_role = acl.admin;
							profile.sponsor_role = acl.sponsor;
							profile.rightholder_role = acl.rightholder;
							profile.demo_role = acl.demo;
							profile.dirty = false;
						}, function(){
							$mdDialog.show($mdDialog.alert()
								.title('Ошибка')
								.textContent('Невозможно применить изменения')
								.ok('OK'));
						});

					};
					// ParamsSrv.getParams().then(function(params){
					// 	$scope.parameters = params;
					// 	//$scope.regionsLegend = {};
					// });


					$scope.activePage = null;
					$scope.activeMenuItem = null;
					$scope.setActiveMenuItem = function(item){
						$scope.activeMenuItem = item;
						$scope.activePage = item;
					};


					$scope.setActiveMenuItem($scope.menu[0]);


					// $scope.checkButtonClick = function(){
					// 	$scope.activePage = $scope.pages[$scope.checkButtonPage];
					// };


					/*$scope.init = function(){
						if ($scope.type == 'infobox'){
							$scope.bottomMenu = $scope.sportinfoMenu;
						} else if ($scope.type == 'analytics'){
							$scope.bottomMenu = $scope.analyticsMenu;
						}
					}*/

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
		.directive('adminDir', adminDir);

	adminDir.$inject = [
		'$rootScope'
	];

	function adminDir(
		$rootScope
	)    {
		return {
			restrict: 'E',
			scope: {
				type: '@'
			},
			templateUrl: '/views/widgets/admin/admin.html',
			link: function ($scope, $el, attrs) {
				//$scope.init();
			},

			controller: [
				'$scope',
				'$routeParams',
				'$location',
				'$window',
				'$mdDialog',
				'ParamsSrv',
				'ApiSrv',
				function(
					$scope,
					$routeParams,
					$location,
					$window,
					$mdDialog,
					ParamsSrv,
					ApiSrv
				) {

					

					$scope.menu = [{
						id:'profiles',
						text:'Пользователи',
						visible: function(){return $scope.loggedIn && $scope.isAdmin;},
                        onClick: function(){$scope.setPath('/account/');}
					},{
						id:'leagues',
						text:'Лиги',
						visible: function(){return $scope.loggedIn && $scope.isAdmin;},
                        onClick: function(){$scope.setPath('/account/');}
					},{
						id:'email',
						text:'Шаблоны писем',
						visible: function(){return $scope.loggedIn && $scope.isAdmin;},
                        onClick: function(){$scope.setPath('/account/');}
					},{
						id:'other',
						text:'Другое',
						visible: function(){return $scope.loggedIn && $scope.isAdmin;},
                        onClick: function(){$scope.setPath('/account/');}
					},{
					    
					}];

                    $scope.selectMenuItem = function(item) {
                        
                    }
					

					ApiSrv.getProfilesList().then(function(profiles){
						$scope.profiles = profiles;
					}, function(){});

					$scope.saveProfile = function(profile){
						var acl = {
							"admin": profile.admin_role,
							"sponsor":  profile.sponsor_role,
							"rightholder":  profile.rightholder_role,
							"demo":  profile.demo_role
						};
						ApiSrv.addRole(profile.user_id, acl).then(function(acl){
							profile.admin_role = acl.admin;
							profile.sponsor_role = acl.sponsor;
							profile.rightholder_role = acl.rightholder;
							profile.demo_role = acl.demo;
							profile.dirty = false;
						}, function(){
							$mdDialog.show($mdDialog.alert()
								.title('Ошибка')
								.textContent('Невозможно применить изменения')
								.ok('OK'));
						});

					};
				

					$scope.activePage = null;
					$scope.activeMenuItem = null;
					$scope.setActiveMenuItem = function(item){
						$scope.activeMenuItem = item;
						$scope.activePage = item;
					};


					$scope.setActiveMenuItem($scope.menu[0]);


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
		.directive('analyticsDir', analyticsDir);

	analyticsDir.$inject = [
		'$rootScope',
		'analyticsSrv'
	];

	function analyticsDir(
		$rootScope,
		analyticsSrv
	)    {
		return {
			restrict: 'E',
			scope: {
				type: '@'
			},
			templateUrl: '/views/widgets/analytics/analytics.html',
			link: function ($scope, $el, attrs) {

			},

			controller: [
				'$scope',
				'$controller',
				'$routeParams',
				'$location',
				'$window',
				'$mdDialog',
				'ParamsSrv',
				'ApiSrv',
				function(
					$scope,
					$controller,
					$routeParams,
					$location,
					$window,
					$mdDialog,
					ParamsSrv,
					ApiSrv
				) {

					$controller('baseInfoboxCtrl', {$scope: $scope});


					$scope.audienceMenu = [{
						id:'demography',
						tpl:'demography',
						text:'Социальная демография',
						isSelected: $scope.checkSelected.bind(null, 'demography'),
						footer: 'analytics'
					},{
						id:'consume',
						tpl:'consume/consume',
						text:'Потребительское поведение',
						isSelected: $scope.checkSelected.bind(null, 'consume'),
						footer: 'analytics'
					},{
						id:'regions',
						tpl:'regions',
						text:'География',
						isSelected: $scope.checkSelected.bind(null, 'regions'),
						footer: 'analytics'
					}];
					$scope.topMenu = $scope.audienceMenu;


					function checkSportAnalyticsSelected(){
						var selected = analyticsSrv.getSelected();
						return !!(selected.sport || selected.league || selected.club);
					}

					$scope.bottomMenu = [
						{
							id:'sportAnalytics/sportAnalytics',
							tpl:'sportAnalytics/sportAnalytics',
							text:'Спорт',
							footer: 'analytics',
							isSelected: checkSportAnalyticsSelected
						}
					];


					$scope.extPages = [{
						id:'analytics/analytics',
						tpl:'analytics/analytics',
						footer: 'infoboxResult'
					}];

					$scope.pages = {};

					[$scope.audienceMenu, $scope.bottomMenu, $scope.extPages].forEach(function(collection) {
						collection.forEach(function (item) {
							$scope.pages[item.id] = item;
						});
					});

					$scope.setActiveMenuItem($scope.audienceMenu[0]);
					

					

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
		.directive('articleDir', articleDir);

	articleDir.$inject = [
		'$rootScope'
	];

	function articleDir(
		$rootScope
	)    {
		return {
			restrict: 'E',
			scope: {
				type: '@'
				//articleId: $routeParams.articleId
			},
			templateUrl: '/views/widgets/article/article.html',
			link: function ($scope, $el, attrs) {

			},

			controller: [
				'$scope',
				'$controller',
				'$location',
				'$window',
				'$mdDialog',
				'$routeParams',
				'ParamsSrv',
				'ArticlesSrv',
				function(
					$scope,
					$controller,
					$location,
					$window,
					$mdDialog,
					$routeParams,
					ParamsSrv,
					ArticlesSrv
				) {
					//$scope.articleId = $routeParams.articleId;
					$scope.articleId = Number.parseInt($routeParams.articleId);
                    //if (Number.isNaN($scope.articleId)){
					
					$scope.showPreloader = true;
                    ArticlesSrv.getArticle($scope.articleId).then(function(article){
                        // $location.path('/admin/cases/');
                        $scope.showPreloader = false;
                        $scope.article = article;
                    }, function(){
                    	$scope.showPreloader = false;
                        $mdDialog.show(
                          $mdDialog.alert()
                            .clickOutsideToClose(false)
                            .title('Ошибка')
                            .textContent('Ошибка загрузки')
                            .ok('OK')
                        );
                    });
                    

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
		.directive('articlesDir', articlesDir);

	articlesDir.$inject = [
		'$rootScope'
	];

	function articlesDir(
		$rootScope
	)    {
		return {
			restrict: 'E',
			scope: {
				type: '@'
				//articleId: $routeParams.articleId
			},
			templateUrl: '/views/widgets/articles/articles.html',
			link: function ($scope, $el, attrs) {

			},

			controller: [
				'$scope',
				'$controller',
				'$location',
				'$window',
				'$mdDialog',
				'$routeParams',
				'ParamsSrv',
				'ArticlesSrv',
				function(
					$scope,
					$controller,
					$location,
					$window,
					$mdDialog,
					$routeParams,
					ParamsSrv,
					ArticlesSrv
				) {
					//$scope.articleId = $routeParams.articleId;
					
					$scope.showPreloader = true;
					ArticlesSrv.getArticles().then(function(articles){
						$scope.showPreloader = false;
                        $scope.articles = articles;
                        $scope.filteredArticles = articles;
                        $scope.tags = ArticlesSrv.getTags();
                    }, function(){
                    	$scope.showPreloader = false;
                        $mdDialog.show(
                          $mdDialog.alert()
                            .clickOutsideToClose(false)
                            .title('Ошибка')
                            .textContent('Ошибка загрузки')
                            .ok('OK')
                        );
                    });
                    
                    $scope.openArticle = function(article) {
                    	$location.path('/articles/' + article.id);
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
                '$anchorScroll',
                'ApiSrv',
                function(
                    $scope,
                    $routeParams,
                    $location,
                    $window,
                    $anchorScroll,
                    ApiSrv
                ) {
                    $scope.loggedIn = false;
                    $scope.isAdmin = false;
                    
                    $scope.menu = [/*{
                            'name': 'О проекте',
                            visible: function(){return !$scope.loggedIn;},
                            onClick: function(){$scope.scrollTo('about');}
                        },*/ {
                            'name': 'Зарегистрироваться',
                            visible: function(){return !$scope.loggedIn;},
                            onClick: function(){$scope.scrollTo('registration');}
                        },{
                            'name': 'Войти',
                            visible: function(){return !$scope.loggedIn;},
                            onClick: function(){$scope.setPath('/login/');}
                        },/*{
                            'name': 'Техническая поддержка',
                            visible: function(){return !$scope.loggedIn;},
                            onClick: function(){$scope.setPath('/infobox/');}
                        },*/
                        {
                            'name': 'Получить информацию',
                            visible: function(){return $scope.loggedIn && !$scope.isAdmin;},
                            onClick: function(){$scope.setPath('/infobox/');}
                        },{
                            'name': 'Проанализировать',
                            visible: function(){return $scope.loggedIn && !$scope.isAdmin;},
                            onClick: function(){$scope.setPath('/analytics/');}
                        },{
                            'name': 'Спланировать',
                            visible: function(){return $scope.loggedIn && !$scope.isAdmin;}
                        },{
                            'name': 'Оценить',
                            visible: function(){return $scope.loggedIn && !$scope.isAdmin;}
                        },{
                            'name': 'Кейсы',
                            visible: function(){return $scope.loggedIn && !$scope.isAdmin;},
                            onClick: function(){$scope.setPath('/articles/');}
                        },{
                            'name': 'Личный кабинет',
                            visible: function(){return $scope.loggedIn && !$scope.isAdmin;},
                            onClick: function(){$scope.setPath('/account/');}
                        },
                        
                        
                        {
                            'name': 'Панель администрирования',
                            visible: function(){return $scope.isAdmin;},
                            onClick: function(){$scope.setPath('/admin/');}
                        }
                    ];

                    
                    $scope.$watch( function () { return ApiSrv.getUser().sid; }, function (sid) {
                        $scope.loggedIn = !!sid;
                        $scope.isAdmin = ApiSrv.getUser().userRights && !!ApiSrv.getUser().userRights.admin;

                    }, true);
                    
                    $scope.setPath = function(path){
                        $location.path(path);
                    };
                
                    $scope.logout = function(){
                        ApiSrv.logout();
                        $scope.setPath('/');
                    };

                    $scope.scrollTo = function(id) {
                        var old = $location.hash();
                        $location.hash(id);
                        $anchorScroll();
                        //reset to old to keep any additional routing logic from kicking in
                        $location.hash(old);
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
                '$anchorScroll',
                '$window',
                'ApiSrv',
                function(
                    $scope,
                    $routeParams,
                    $location,
                    $anchorScroll,
                    $window,
                    ApiSrv
                ){
                    
                    $scope.regData = {
                        first_name:  '',
                        last_name: '',
                        company_name: '',
                        phone: '',
                        login: '',
                        company_type: null, // 0 - спонсор, 1 - правообладатель, 2 - агенство
                        legal_status: 0, // 0 - физ, 1 - юр
                        lang: "ru"
                    };

                    $scope.companyTypes = [
                        //{value: null, name: 'Тип компании', selected:true},
                        {value: 0, name: 'Спонсор'},
                        {value: 1, name: 'Правообладатель'},
                        {value: 2, name: 'Агенство'}
                    ];
                    
                    $scope.companyTypeFiz = function(fiz) {
                        if (arguments.length)
                            return $scope.regData.legal_status  = fiz ? 0 : 1;
                        else
                            return $scope.regData.legal_status  == 0 ? true : false;
                    };

                    $scope.companyTypeYur = function(yur) {
                        if (arguments.length)
                            return $scope.regData.legal_status  = yur ? 1 : 0;
                        else
                            return $scope.regData.legal_status  == 0 ? false : true;
                    };

                    
                    $scope.register = function(){
                        ApiSrv.register($scope.regData);
                    }
                    
                    $scope.scrollToRegistration = function(){
                        $scope.scrollTo('registration'); 
                    }
                    
                    $scope.scrollTo = function(id) {
                        var old = $location.hash();
                        $location.hash(id);
                        $anchorScroll();
                        //reset to old to keep any additional routing logic from kicking in
                        $location.hash(old);
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
(function () {
	"use strict";
	angular.module('SportsensusApp')
		.controller('baseInfoboxCtrl', baseInfoboxCtrl);

	baseInfoboxCtrl.$inject = [
		'$scope',
		'$controller',
		'ParamsSrv',
		'ApiSrv'
	];

	function baseInfoboxCtrl(
		$scope,
		$controller,
		ParamsSrv,
		ApiSrv
	) {

		ParamsSrv.getParams().then(function(params){
			$scope.parameters = params;
		});
		
		$scope.checkSelected = function(type){
			return !!ParamsSrv.getSelectedParams(type);
		};

		$scope.clearSelection = function(type){
			ParamsSrv.clearSelection(type);
		};

		$scope.selectAll = function(type){
			ParamsSrv.selectAll(type);
		};

		$scope.activePage = null;
		$scope.activeMenuItem = null;
		$scope.setActiveMenuItem = function(item){
			$scope.activeMenuItem = item;
			$scope.setActivePage(item);
		};



		$scope.setActivePage = function(item){
			$scope.activePage = item;
			$scope.activeFooter = item.footer + 'Footer';
		};


		$scope.setActiveMenuItemById = function(id){
			var item = $scope.pages[id];
			$scope.setActiveMenuItem(item);
		};
		
		$scope.setActivePageById = function(id){
			var item = $scope.pages[id];
			$scope.setActivePage(item);
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
                type: '@'
            },
            templateUrl: '/views/widgets/infobox/infobox.html',
            link: function ($scope, $el, attrs) {
               
            },

            controller: [
                '$scope',
                '$controller',
                '$routeParams',
                '$location',
                '$window',
                'ParamsSrv',
                'ApiSrv',
                function(
                    $scope,
                    $controller,
                    $routeParams,
                    $location,
                    $window,
                    ParamsSrv,
                    ApiSrv
                ) {

                    $controller('baseInfoboxCtrl', {$scope: $scope});

                 

                    $scope.audienceMenu = [{
                        id:'demography',
                        tpl:'demography',
                        text:'Социальная демография',
                        isSelected: $scope.checkSelected.bind(null, 'demography'),
                        footer: 'infobox'
                    },{
                        id:'consume/consume',
                        tpl:'consume/consume',
                        text:'Потребительское поведение',
                        isSelected: $scope.checkSelected.bind(null, 'consume'),
                        footer: 'infobox'
                    },{
                        id:'regions',
                        tpl:'regions',
                        text:'География',
                        isSelected: $scope.checkSelected.bind(null, 'regions'),
                        footer: 'infobox'
                    }];

                    $scope.topMenu = $scope.audienceMenu;
                    
                    
                    function isSportSelected(){return $scope.sportSelected}
                    $scope.sportinfoMenu = [{
                        id:'sport',
                        tpl:'sport/sport',
                        text:'Спорт',
                        isSelected: $scope.checkSelected.bind(null, 'sport'),
                        footer: 'infobox'
                    },{
                        id:'interest/interest',
                        tpl:'interest/interest',
                        // id:'interest/interestGraph',
                        enabled: isSportSelected,
                        text:'Степень интереса',
                        isSelected: $scope.checkSelected.bind(null, 'interest'),
                        footer: 'infobox'
                    },{
                        id:'rooting/rooting',
                        tpl:'rooting/rooting',
                        // id:'rooting/rootingGraph',
                        enabled: isSportSelected,
                        text:'Сила боления',
                        isSelected: $scope.checkSelected.bind(null, 'rooting'),
                        footer: 'infobox'
                    },{
                        id:'involve/involve',
                        tpl:'involve/involve',
                        enabled: isSportSelected,
                        text:'Причастность к видам спорта',
                        isSelected: $scope.checkSelected.bind(null, 'involve'),
                        footer: 'infobox'
                    },{
                        id:'image/image',
                        tpl:'image/image',
                        // id:'image/imageGraph',
                        enabled: isSportSelected,
                        text:'Восприятие видов спорта',
                        isSelected: $scope.checkSelected.bind(null, 'image'),
                        footer: 'infobox'
                    }];
                    $scope.bottomMenu = $scope.sportinfoMenu;

                    

                    $scope.extPages = [{
                        id:'image/imageGraph',
                        tpl:'image/imageGraph',
                        footer: 'infoboxResult'
                    },{
                        id:'allGraphs',
                        tpl:'allGraphs',
                        footer: 'infoboxResult'
                    },{
                        id:'expressSport/expressSport',
                        tpl:'expressSport/expressSport',
                        footer: 'infoboxResult'
                    },{
                        id:'expressAudience/expressAudience',
                        tpl:'expressAudience/expressAudience',
                        footer: 'infoboxResult'
                    }];

                    $scope.pages = {};

                    [$scope.audienceMenu, $scope.sportinfoMenu,  $scope.extPages, /*$scope.analyticsMenu*/].forEach(function(collection) {
                        collection.forEach(function (item) {
                            $scope.pages[item.id] = item;
                        });
                    });

                    $scope.setActiveMenuItem($scope.audienceMenu[0]);
                    

                    $scope.sportSelected = false; // показывает, выбран ли какой-либо вид спорта
                    
                    $scope.$on('ParamsSrv.paramsChanged', paramsChanged);
                    paramsChanged();

                    function paramsChanged() {
                        $scope.sportSelected = !!ParamsSrv.getSelectedParams('sport');
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
        '$q',
        '$timeout',
        '$mdDialog',
        'ApiSrv'
    ];

    function saveAsPdfDir(
        $rootScope,
        $q,
        $timeout,
        $mdDialog,
        ApiSrv
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
                try {
					/*canvg(canvas, xml);
					var svgE = angular.element(svg);
					var canvasE = angular.element(canvas);
                    svgE.replaceWith(canvasE);*/

					var svgE = angular.element(svg);
					var canvasE = angular.element(canvas);
					svgE.after(canvasE);
					canvg(canvas, xml);
					svgE.remove();

                } catch(err){}
                resolve({
                    svg: svgE,
                    canvas: canvasE
                });
            });
        }


        

        function saveAsPdf(element) {
            return $q(function(resolve, reject) {
                // SVG рисуем отдельно от всего остального, потому что они портят текст...
                var elements = element.find('svg');

                var promises = Array.prototype.map.call(elements, function (item) {
                    return svg2canvas2(item);
                });

                $q.all(promises).then(function (elements) {
                    render(elements);
                }, reject);


                function render(elements) {
                    html2canvas(element[0], {
                        useCORS: true,
                        allowTaint: true
                    }).then(function (canvas) {
                        elements.forEach(function (element) {
                            element.canvas.replaceWith(element.svg);
                        });

                        var imgData = canvas.toDataURL('image/png');
                        // 'a4': [595.28, 841.89],
                        var doc = new jsPDF('p', 'pt', 'a4', true);

                        var scale = Math.min((595.28 - 20) / canvas.width, (841.89 - 20) / canvas.height);
                        // doc.addImage(imgData, 'PNG', 10, 10, canvas.width, canvas.height);
                        doc.addImage(imgData, 'PNG', 10, 10, canvas.width * scale, canvas.height * scale);

                        resolve(doc);
                        //doc.save('sample-file.pdf');
                    }, reject);
                }
            });
        }

        return {
            restrict: 'A',
            link: function ($scope, $el, attrs) {
                //el = $el;

                // $scope.saveAsPdf = saveAsPdf;
                $scope.savePdf = function(options){
                    $scope.$broadcast('printStart');
                    $timeout(function() {
                        saveAsPdf($el).then(function (doc) {
                                doc.save(options && options.filename ? options.filename + '.pdf' : 'sportsensus-report.pdf');
                            }, function () {
                                alert('Ошибка записи в PDF');
                            })
                            .finally(function () {
                                $scope.$broadcast('printEnd');
                            });
                    },50);
                };
                $scope.sendPdf = function(options){
                    $scope.$broadcast('printStart');
                    $timeout(function() {
                        saveAsPdf($el).then(function (doc) {
                                var confirm = $mdDialog.prompt()
                                    .title('Отправка на почту')
                                    .textContent('Введите почту, на которую нужно отправить письмо')
                                    .placeholder('e-mail')
                                    .ariaLabel('e-mail')
                                    //.initialValue('Buddy')
                                    //.targetEvent(ev)
                                    .ok('OK')
                                    .cancel('Отмена');
                                $mdDialog.show(confirm).then(function(result) {
                                    if (!result) return;

                                    //var data = doc.output('datauristring');
                                    var data = btoa(doc.output());
                                    ApiSrv.sendEmail({
                                        address: result,
                                        // theme: 'Отчет',
                                        
                                        theme: options.title || 'Отчет с портала sportsensus.ru',
                                        // message: 'Получите файлик',
                                        message: options.message || '',
                                        attachments: [{
                                            filename: options && options.filename ? options.filename + '.pdf' : 'sportsensus-report.pdf',
                                            data: data
                                        }]
                                    }).then(function(){
                                        $mdDialog.show($mdDialog.alert()
                                            .title('Отправка на почту')
                                            .textContent('Письмо успешно отправлено на ' + result)
                                            .ok('OK'));
                                    }, function(){
                                        $mdDialog.show($mdDialog.alert()
                                            .title('Отправка на почту')
                                            .textContent('Ошибка отправки письма на ' + result)
                                            .ok('OK'));
                                    });
                                    //$scope.status = 'You decided to name your dog ' + result + '.';
                                }, function() {
                                    //$scope.status = 'You didn\'t name your dog.';
                                });
                            //doc.save(options && options.filename || 'sportsensus-report.pdf');
                            }, function () {
                                alert('Ошибка записи в PDF');
                            })
                            .finally(function () {
                                $scope.$broadcast('printEnd');
                            });
                    },50)
                };
                $scope.printPdf = function(options){
                    $scope.$broadcast('printStart');
                    $timeout(function() {
                        saveAsPdf($el).then(function(doc){
                                doc.autoPrint();
                                //doc.output('dataurlnewwindow');
                                window.open(doc.output('bloburl'), '_blank');
                            }, function(){alert('Ошибка записи в PDF');})
                            .finally(function(){$scope.$broadcast('printEnd');});
                    },50);
                };
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
            //scope: true,
            scope: {
                title: '@',
                subtitle: '@'
                //savePdf: '&savePdf'
            },
            transclude: true,
            templateUrl: '/views/widgets/buttons/downloadPDF/downloadPDF.html',
            link: function ($scope, $el, attrs) {},

            controller: [
                '$scope',
                
                function(
                    $scope
                    
                ) {
                    $scope.save = function(){
                        $scope.$parent.savePdf && $scope.$parent.savePdf({filename: $scope.filename || $scope.title});
                    };

                    $scope.print = function(){
                        $scope.$parent.printPdf && $scope.$parent.printPdf({filename: $scope.filename || $scope.title});
                    };

                    $scope.send = function(){
                        $scope.$parent.sendPdf && $scope.$parent.sendPdf({
                            title: $scope.title,
                            filename: $scope.title,
                            message: ($scope.subtitle || '' ) + '<br>'
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
        .directive('doughnutDir', doughnutDir);

    doughnutDir.$inject = [
        '$rootScope'
    ];

    function doughnutDir(
        $rootScope
    )    {
        return {
            restrict: 'E',
            scope: {
                chart: '='
            },
            templateUrl: '/views/widgets/charts/doughnut/doughnut.html',
            link: function ($scope, $el, attrs) {
                $scope.el = $el;
                $scope.tooltipEl = $el.find('div');
                //$scope.draw();
                $scope.$watch('chart', $scope.redrawChart);
            },
            replace: true,
            controller: [
                '$scope',
                function(
                    $scope
                ){
                    

                    $scope.redrawChart = function(){
                      
                        if ($scope.chartObj){
                            $scope.chartObj.clear();
                            $scope.chartObj.destroy();
                        }
                        if (!$scope.chart || !$scope.chart.chartData){//} || !$scope.chart.options) {
                            //$scope.el.empty();
                            return;
                        }
                        

                        var chartData = $scope.chart.chartData;
                        var chartOptions = $scope.chart.options || {};



                        var ctx = $scope.el.find('canvas')[0].getContext("2d");

                       
                        $scope.chartObj = new Chart(ctx).Doughnut(chartData, angular.extend({
                            /*showLabels: false,
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
                            //barValueSpacing: 40*/
                            customTooltips:customTooltips,
                            tooltipTemplate: function(bar){
                                //return bar;
                                //return '<div class="line"><div class="color" style="background-color:'+ bar.fillColor+';"></div><b>'+bar.label + ': </b>' + bar.value.toLocaleString('en-US')+'</div>';
                                return '<div class="line"><div class="color" style="background-color:'+ bar.fillColor+';"></div><span>'+bar.label + '</span></div>';
                            }
                        }, chartOptions));

                        function customTooltips(tooltip) {
                            $scope.$apply(function () {
                                var tooltipEl = $scope.tooltipEl;

                                if (!tooltip) {
                                    //tooltipEl.css({ opacity: 0});
                                    $scope.tooltipVisible = false;
                                    return;
                                }
                                $scope.tooltipVisible = true;

                                //tooltipEl.removeClass('above below');
                                //tooltipEl.addClass(tooltip.yAlign);

                                var innerHtml = tooltip.text;
                                tooltipEl.html(innerHtml);

                                tooltipEl.css({
                                    //opacity: 1,
                                    left: tooltip.chart.canvas.offsetLeft + tooltip.x + 'px',
                                    top: tooltip.chart.canvas.offsetTop + tooltip.y + 'px',
                                    fontFamily: tooltip.fontFamily,
                                    fontSize: tooltip.fontSize,
                                    fontStyle: tooltip.fontStyle
                                });
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
     * @example
     */
    angular.module('SportsensusApp')
        .directive('mapDir', mapDir);

    mapDir.$inject = [
        '$rootScope'
    ];

    function mapDir(
        $rootScope
    )    {
        return {
            restrict: 'E',
            scope: {
                chart: '=',
                regions: '=',
                selectable: '=?',
                selectedColor: '=?',
                highlightedColor: '=?'
            },
            templateUrl: '/views/widgets/charts/map/map.html',
            link: function ($scope, $el, attrs) {
                $scope.el = $el;
                
                
                $scope.$watch('regions', $scope.updateRegions);
            },

            controller: [
                '$scope',
                function(
                    $scope
                ){

/*
                    $scope.svgRegions = {
                        "da": {
                            "path": "m64.939,403.74,2.6516,1.2627,3.6618,0.50507,1.7678-2.0203,2.1466,2.0203,2.3991-1.6415,0.25254-1.7678,1.6415-2.1466,3.0305,0.50508,3.7881-2.9042-0.50508-1.894-4.7982-0.50508,0.75762-3.1567-1.0102-0.63134,0.63135-2.2728-3.1567-2.7779,1.5152-0.50508,3.9143,0.88388,0-1.389-1.0102-1.2627,8.3338-0.25254,4.9245,5.4296,1.2627,1.894-0.37881,2.2728-5.3033-0.3788,0.50508,2.5254,1.5152,3.0304-1.0102,3.5355-2.3991,2.7779-1.2627,0.25254,4.5457,0.75761-5.5558,2.1466-0.50508,2.0203-0.75762,0.50508-3.0305,0.50507-0.25254,4.7982-1.2627,0.88388-1.1364,13.132-9.0914-0.12627-3.6618-2.2728-1.389-0.88388,0-11.617-3.283-5.9346,0.37881-2.9042,1.2627-0.37881z",
                            "name": "Республика Дагестан",
                            "id": [25]
                        },
                        "cr": {
                            "name": "Республика Крым",
                            "path": "m7.63 300.28 3.08 -4.47 -2.39 -5.96 -2.32 -1.30 -0.26 -1.56 5.37 0.27 5.62 1.13 3.78 3.17 -0.68 -4.60 2.99 3.45 0.38 1.58 3.51 3.18 1.69 4.34 -1.36 3.53 -0.62 6.67 2.20 0.60 1.62 -0.23 0.49 2.00 2.15 0.47 2.86 3.79 -3.47 0.05 -1.26 2.11 -4.89 -4.06 -1.13 -2.79 -2.69 -0.25 -5.54 -2.16 -3.75 -1.18 -4.89 0.14z",
                            "id": [26]
                        },
                        "sa": {
                            "path": "M701.25,126.75l-1.44,1.06-1.25,1.63s1.44,0.87,2.16,0.87c0.71,0,2.69-1.97,2.69-1.97l-2.16-1.59zm18.47,12.09c-0.18-0.01-0.4,0.02-0.63,0.07-1.78,0.35-4.81,1.93-4.81,1.93s-1.41,1.1-2.12,1.1c-0.72,0-2.35-0.38-2.35-0.38-0.71,0-2.5,1.25-2.5,1.25l-1.4,1.78s-1.1-0.51-1.1,0.38-0.35,1.96,0.72,2.5c1.07,0.53,1.61,1.06,2.5,1.06s3.22-0.72,3.22-0.72l1.97-0.87,1.97,1.06s0.51-0.9,1.4-1.44c0.9-0.53,3.4-2.31,3.75-3.03,0.36-0.71,0.72-3.22,0.72-3.22s-0.11-1.36-1.34-1.47zm-19.81,7.1c-0.15,0.01-0.29,0.05-0.44,0.09-1.25,0.36-2.85,0.19-3.56,0.19-0.72,0-0.91,0.19-0.91,0.19s-0.88,1.58-1.59,1.93c-0.72,0.36-1.99,0.74-3.07,0.57-1.07-0.18-3.75-1.25-3.75-1.25s-1.93-0.02-1.93,1.59,3.03,3.41,3.03,3.41l1.06,1.4s-2.51,0.73-3.41,0.38c-0.89-0.36-2.65-2.16-2.65-2.16l-3.22-0.72s-2.88,0.2-2.88,1.1c0,0.89-0.68,2.67-0.68,3.56s-0.9,3.04,0.53,3.94c1.43,0.89,1.79,3.03,1.97,3.75,0.17,0.71,0.7,1.77,2.84,2.31,2.14,0.53,4.29,0.53,5,1.06,0.71,0.54,1.77,1.07,2.84,0.53,1.08-0.53,1.82-2.65,1.82-2.65l2.12-1.97s1.61-1.44,2.5-2.16c0.89-0.71,2.7-0.54,4.13-1.44,1.42-0.89,2.31-3.75,2.31-3.75v-5l-0.38-4.43s-0.68-0.58-1.68-0.47zm106.25,5.62c-0.45,0.09-0.75,4.1-0.75,4.1l-7.32,1.65-3.28,0.63-4.53-6.06-7.84-0.13-0.38,0.87-5.68,1.66-1.76,2.13-6.06,6.31v2.78l-2.15,1.91-3.29,5.03-4.93-2.38-3.41-0.37-1.75,2h-4.56l-3.41,1.78-1.75-1.53,4.28-2.91-2.28-1.62-3.03-0.13-8.84,4.03,1.9,5.44-0.87,4.78-2.66,2.91-1.65-2.13,3.03-7.47-1.75-0.37-2.66,4.03-3.03,2.03-1-0.75,1-3.16,2.28-0.74,2.91-2.66-7.1,1.75-9.22,5.31-6.68,0.25,3.65,3.66-3.65,3.4-0.5,3.03,0.37,1.16,3.91-1.78-1,4.03,4.81,2.91-0.91,2.9-2-1.37-3.68,1,1.28,3.41,2.4-0.26-1.03,2.66-3.9-0.5-4.28-1.66-3.53,0.26-2.41,3.15-0.63,4.06h-6.46l-1.76-1.53-2.4-2-0.5,4.41,0.87,0.87-0.12,1.41,1.65,0.87-0.9,2.54,1.66,6.18-3.29-1.4-1,1.15-9.87-5.31v-4.94l-2.25,0.13-1.78,2.41-2-3.41,3.65-0.63-0.5-2.9-4.43-1.66,0.75-0.87,0.12-2.53-5.28-4.04-5.31-2.53-1,3.66-7.35,0.65-2.37-1.65-4.19,2.15v2.13l4.19,4.69-10.94,5.31-10.28-1.16,0.44-4.4-12.07,0.19-3.96,3.78h-2.85l-1.09,1.09,2.66,2.87h-2.13l-2.91-2.06,1.19-2.09-0.87-1.38-1.54-1.78,0.07,2.28-1.5,1.07-3.85-1.32s-2.9,3.53-2.84,3.78c0.06,0.26,2.66,3.29,2.66,3.29l-1.41,3.34,1.59,2.09,0.19,2.78,7.38,5.82-0.32,5.47,2.53,1.9,1.63,2.53-2.53,2.72-4.41,3.03-0.69,2.63-4.81,2.78,0.25,6.12-2.25,1.1-2.97-1.28-5.65,4.75-4.44,0.09,0.06,1.97,5.38,6.59,1.78,20.1-6.35,1.97,4.19,3.4-1.78,4.19v1.25l7.16,8.84-4.57,6.69,0.97,1.6-2.4,1.87,0.09,2.25,5.63,0.34,0.71,0.72,9.1,0.19,3.31,3.31-0.53,1.6-3.31,0.34,0.19,3.94,4.03-1.06,5.06,6.59-0.53,5.53,3.84,5.19-1.97,3.4,0.53,2.13,7.69,6.53v4.37l-3.75,6.44,0.28,10.78,3.85,4.13,3.37-3.94,3.75,0.09,1.88-1.34,2.68-0.62,2.41-2.07,3.56,3.85,0.38,2.31,4-5.06,0.09-4.13,5.38-2.75-0.29-6.25,2.32-4.12,3.84-1.5,4.91,1.06,6.15,4.91,0.57,3.84,1.31,0.87,4.03-1.4,2.5-2.06,2.69,1.06,0.87,4.47,3.13,4.56,2.15,1.78v3.03l2.32,1.35,0.71,4.71,3.94,0.19,0.97,1.35,1.53,4.09,8.38-0.25,3.31-1.97,5.53,1.16,3.56,1.97,11-0.72,5.54,3.75,2.21,0.53,5.19-2.6h2.6l3.03,2.26,2.78-0.19,3.22-3.94,5.68-0.06,2.5-1.97h7.88l0.19-3.75,10.68-5.09,0.82-3.04-4.28-4.12,2.31-1.69,0.62-4.03-1.34-1.69-2.41,0.38-2.03-1.44,2.75-4.03-2.84-1.6,0.25-1.87,1.53-1.97-1.44-1.44-3.47-1.15-0.53-1.6,3.38-1.43-1.88-0.91-0.19-5.25-0.87-0.62-0.19-1.88,2.78-1.25-1.62-1.25v-2.94l5.47-1.97,3.12,0.16,0.25-1.78,6.53,0.09v-2.75l-1.25-1.53,1.16-1.25,3.47-0.62,3.31-2.22,1.34-6,5-0.44,0.1-2.06s-5.29-4.9-5.47-5.25c-0.18-0.36-0.88-3.94-0.88-3.94l-3.56-2.59v-5.97l2.94-7.16-1.69-9.19,0.78-3.12,13.5,0.72,0.25-5.28,5.19-1.16,3.47,1.87,0.81-2.31-2.41-3.69,1.69-0.62,0.19-2.75-7.16-8.5,0.1-4.37-3.13-1.5-0.09-4.04-1.78-1.15,1.09-2.13,3.81-0.47,1.35-1.78,4.28,0.38,0.09-2.44-3.37-1.5,0.15-3.31,5.47-0.53v-3.57l5.63,0.44,5.62-8.03,0.44-2.5-6.06-6.06-0.19-1.88,2.31-3.4-0.97-1.79-3.31,0.19-1.5-2.34,4.72-1.41-0.09-1.53-2.07-0.97-0.25-1.34,2.13-3.75,5.72-1.97-0.78-3.56,5.15,0.68-0.62-5.43,1.34,0.28,0.19-3.59-2.69-0.63-2.94-4.53-7.59-0.28-4.19-1.88,0.72-3.47h-3.12l-0.19-1.62,8.12-10.44,1.07-7.84s-9.81-5.72-10.25-5.63zm-135.1,8.56c-0.12,0.03-0.23,0.08-0.34,0.19-0.89,0.9-1.07,1.79-0.53,2.5,0.53,0.72,1.06,1.63,1.78,2.35,0.71,0.71,2.31,1.25,2.31,1.25s0.71-1.1,0.53-1.82c-0.18-0.71-1.97-2.84-1.97-2.84s-0.94-1.78-1.78-1.63zm28.94,7.35l-2.31,0.34s-1.07,0.91-1.25,1.63c-0.18,0.71-0.9,1.24,0,1.78,0.89,0.53,3.75,1.25,3.75,1.25s1.6-0.02,1.78,0.87c0.18,0.9,0.18,1.8,0,2.69s-0.53,1.78-0.53,1.78l0.72,0.72,1.93-0.53s0.74-0.72,1.82-0.72h2.65s1.44-0.53,1.97-1.25c0.54-0.71,1.97-1.25,1.97-1.25h2.69s1.41-0.52,0.87-1.59c-0.53-1.07-1.76-1.62-2.65-2.16-0.9-0.53-3.22-2.31-3.22-2.31h-2.5l-3.6,0.34-2.84,0.38-1.25-1.97zm-17,10.15c-0.12,0-0.22,0.01-0.31,0.04-0.72,0.17-1.44,1.4-1.44,1.4s0.37,1.78,2.16,1.78c1.78,0,2.3,0.55,2.65-0.34,0.36-0.89-0.87-2.31-0.87-2.31s-1.37-0.55-2.19-0.57z",
                            "name": "Республика Саха (Якутия)"
                        },
                        "so": {
                            "path": "m75.583,387.43-2.2728,2.6516-4.1669-2.6516-2.0203,1.1364-0.37881,5.8084-1.1364,1.389-2.2728-0.12627-5.9346-2.6516-3.0305-3.283,0.12627-4.9245,4.672,0.75761,0.37881-0.88388,2.5254-0.12627,3.283,1.5152,4.0406-1.894s-0.12627-3.5355,0.75761-2.7779c0.88388,0.75762,1.389,1.2627,1.389,1.2627l0.25254,3.5355z",
                            "name": "Республика Северная Осетия"
                        },
                        "kb": {
                            "path": "m50.982,375.86c0.26786,0.35715,2.5893,4.7322,2.5893,4.7322l0.98214,3.9286,4.6429,1.1607,2.8571-1.0714,3.2143,1.5179,4.375-1.875,0.26786-3.125-5.9821-2.3214-1.875-5.0893-2.2321-1.1607-4.375,0.71429z",
                            "name": "Республика Кабардино-Балкария"
                        },
                        "kc": {
                            "path": "m43.482,361.39,2.2321,8.4821,5.0893,6.25,4.375-2.6786,5.3571-0.89286,0.08929-3.3928,3.75-1.0714-6.6964-7.2321-2.2321,2.4107-2.8571,0.26786-1.6071-4.5536,0.44643-2.1429z",
                            "name": "Карачаево-Черкесия"
                        },
                        "st": {
                            "path": "m63.929,367.73-3.4821,0.98215,0.17857,3.75,1.5179,1.25,1.7857,4.6428,6.5179,3.0357,1.3393,1.3393,0.08929,3.0357,3.8393,1.7857,1.6071,2.5893,3.2143,0.625,0.71429-1.4286-2.8571-3.125,1.5179-0.53572,3.5714,0.80357,0.17857-1.1607-0.98214-1.3393,7.7679-0.0893,1.6964-1.5179,0.26786-3.5714-5.2679-7.5-0.17857-9.4643-3.4821-6.0714-4.9107-0.98214-1.5179-2.7679-5.0893-5.7143-0.98214-0.625-1.5179,1.3393-2.7679-2.0536-1.4286,0.80357-0.80357,1.0714-0.08929,1.6071,0.35714,1.3393,0.35714,1.1607-0.71429,1.6071-0.98214,1.4286-1.9643,2.2322-1.875,1.0714-0.71428,0.98214-0.98214,2.3214z",
                            "name": "Ставропольский край",
                            "id": [33]
                        },
                        "ks": {
                            "path": "m51.607,356.48-0.08929,2.0536,0.98214,3.8393,0.35714,0.80357,2.2321,0.0893,3.75-4.5536,1.4286-1.9643,1.9643-1.0714,2.6786-4.0178-0.26786-3.3929,0.17857-1.6964,0.89286-1.5179,1.3393,0,1.7857,1.5179,1.3393,0,2.5893-3.0357,0.08929-1.9643-0.89286-0.98214-2.2321-1.3393,0.17857-2.9464,2.8571-3.125,0.08929-1.4286-2.7679-2.9464-3.75-0.71428-0.80357-0.89286,1.6071-1.25,0.17857-2.4107-2.1429-1.6072-2.5893-0.80357-1.6071-1.6964-1.25-0.98214-0.89286-0.0893-1.3393,2.2322-0.625,0.98214,1.0714,1.4286-0.35714,1.5179-0.80357,0.625-2.7679-0.26786-0.89286-0.89286-1.9643,0.0893-1.875,0.71429-3.0357,1.7857-1.6964,0-1.3393-1.4286-1.6071-0.625-1.1607-1.4286,0-2.6786-2.2321-0.26786-1.25,0.625-0.35714,2.9464-0.089286,13.214,0.71429,5.8929,0.98214,3.6607-0.089286,2.3214-0.625,2.7679-0.089286,2.4107,0.17857,2.0536,1.5179,0.89285,0.71429,0.625,1.6071,1.5179,0.89286,1.0714,0.89286,0.89286l7.947-4.27-0.804-1.25-0.357-1.43-5.089,2.68h-1.875l-1.25-1.875,0.35714-3.5714,6.25-1.4286,2.7679-2.3214,0.71429-2.5893-1.3393-0.80357-1.9643,0.44642-1.1607-1.5178-0.71429-2.6786-1.3393-1.7857-0.17857-1.25,0.08929-1.1607,1.3393-0.80357,1.3393,0.625,1.0714,1.3393,1.0714,1.9643,1.3393,1.7857,2.3214,1.3393,1.6964,0.89285s0.625,0.26786,0.71429,0.625c0.08929,0.35715,0.89286,2.6786,0.89286,2.6786v4.0178l-0.08929,1.3393-1.0714,1.0714-1.875,1.5178-1.6071,1.4286z",
                            "name": "Краснодарский край",
                            "id": [12]
                        },
                        "ro": {
                            "path": "m67.5,323.45,2.0536,0.98214,1.4286-0.17857,0.625-0.89286-0.44643-1.1607-1.25-0.89286-1.9643-1.3393-0.89286-1.1607-0.35714-0.71428,1.0714-1.4286l2.231-1.08,1.6071-0.26786,1.0714,0.35714,1.4286,1.3393,1.5179,0.35714,1.6964-0.89286,0.89286,0.44643,1.072,1.06,1.339,1.79,0.268,1.33,1.607-0.08,1.3393-0.80358,1.6964-0.0893,1.3393-0.0893,0.35714-1.5178,0.53571-1.4286,1.25-1.6071,1.3393-1.0714,1.6964,1.0714,0.71429,0.35714,0.89286-1.875,0.44643-0.71428,2.6786-0.26786,1.875-1.6964,2.3214-0.17857,2.0536,1.1607,2.1429,1.25,0.98214,0.53571,3.9286,0.0893h2.2321l1.5179-0.98215h1.3393l0.71429,0.625,0.26786,1.6964-0.08929,1.9643v1.875l-0.08929,1.0714-0.981,1.34-1.25,0.98214-1.25,0.71429-0.80357,0.35714-0.35714,1.25-0.44643,1.6072-0.08929,1.4286-0.44643,1.1607-0.625,1.4286-1.4286,1.5179-1.6964,0.53571h-3.125l-1.608-0.36-1.518,0.53-0.625,1.97-0.982,0.62-0.80357,0.53572,0.17857,0.89285,1.3393,1.4286,0.71429,1.4286-1.1607,1.4286-1.3393,0.89285-0.80357,1.7857-0.08929,0.80357,0.98214,0.53571,1.1607,1.1607,0.625,1.0714,0.80357,0.80357,0.71429,1.3393v1.0714l-0.71429,0.80357,0.53572,0.625,1.4286,0.35715,0.625-0.53572,0.71429-0.0893,0.35714,0.98214v1.4286l-1.3393,1.3393-2.1429,1.0714-2.0536,1.1607-3.3929,0.0893-0.80357,0.80357-1.3393,0.80357-1.696,0.46-1.429-0.71-1.696-0.71-0.893-0.9-0.178-2.23-0.179-1.52-1.696-2.14-1.1607-0.80357-0.17857-1.25-0.80357-0.89286-1.7857-0.0893h-2.7679l-2.8571-0.0893-1.3393-0.17857-1.6071-1.7857-0.98214-0.71429v-0.89286l1.3393-1.5178v-1.5179l-0.625-1.25-1.875-1.4286-0.71429-0.625,0.26786-2.2322,2.7679-3.2143,0.08928-1.6071-1.9643-2.2322-1.3393-0.89285-2.411-0.55-1.0714-0.35714-0.08929-0.71429,1.0714-1.0714,0.26786-1.1607z",
                            "name": "Ростовская область",
                            "id": [28]
                        },
                        "kk": {
                            "path": "m74.554,348.71,0.98214,1.6071,1.1607,1.0714,1.1607,1.6964,0.80357,1.1607,1.1607,0.71429,2.5893,0.44643,1.3393,0.625,0.98214,1.6071s0.98214,1.7857,1.25,2.2321c0.26786,0.44643,0.98214,2.4107,0.98214,2.4107l0.17857,4.9107v3.2143l0.89286,2.2321,3.3036,4.1964,1.25,2.0536-0.17857,2.5893-1.4286,1.875,0.89286,1.3393,4.375,4.7321,0.53571,1.25,0.35714,0.98215,0.89286,0.53571,1.4286,0.0893,1.6071-0.26786,1.7857-0.53572,2.2321-0.89285,2.3214-0.26786,0.713-0.71,0.625-2.15-0.268-1.16-2.232-1.34-0.982-0.71,0.08928-1.3393,1.0714-0.625,1.7857,0.0893,1.4286-1.25-0.53572-0.71428-0.71428-2.0536-0.268-1.7-0.179-1.16h1.0714l1.6964,1.25,1.7857,0.80357,2.6786-0.17857h0.89286l0.53571-1.1607-0.17857-2.4107-0.08929-3.8393v-6.3393-0.98214l-0.08929-2.2321,2.9464-2.8572,0.17857-1.3393-1.4286-0.625v-3.2143l-1.0714-1.1607-1.1607-0.35715-2.5-0.17857-0.625-1.4286-0.17857-0.80357-1.25,0.26786-0.625,1.0714h-1.3393l-1.25-0.0893-1.071-0.98-0.804-0.71-2.321-0.27-0.98214,0.35715-0.71429,0.80357-0.71429,0.35714-0.26786,1.1607-0.35714,0.80357,0.35714,0.625,1.0714,0.35714,1.0714-0.44643,0.89286,0.35714,0.08929,0.98215-0.44643,1.5178-5,3.125-3.3929,0.26786-2.3214,1.3393-1.5179,0.53571-3.8393-1.7857-0.53571-0.35715-0.08929-3.3928-0.71429-1.4286-2.3214-2.2322-0.625-1.25-1.9643-0.80357h-3.5714z",
                            "name": "Республика Калмыкия"
                        },
                        "as": {
                            "path": "m116.873,350.94,1.6415-1.389,1.1364-0.63135,1.7678,1.2627,2.0203,0.63135,2.2728,0.50508,0.88388,1.0102,2.1466,0.88388,0.75761,1.1364,0.63134,1.1364,0,1.389,0,0.88389-1.5152,0.3788-1.1364,1.389-0.12627,1.0102,0.63134,1.389,1.0102,1.1364-0.37881,2.1466-0.75762,1.0102-1.7678,0.88389-0.25254,1.1364,0.50508,0.88388,1.7678,1.1364,2.2728,1.5152,1.389,1.6415,0.63134,1.0102,0,1.5152-1.0102,1.1364-0.25254,2.0203-1.0102,1.0102,0,2.2728,0,2.7779-0.75761,0.3788-1.7678-0.3788-1.894-0.75762-0.63134,0.37881-0.37881,2.1466,1.6415,2.1466,1.1364,1.2627,0.88388,1.0102,0.50508,0.63134,0.12627,1.2627-3.9143,0.25253-3.0305,0.63135-2.1466,0-1.894-1.2627-2.0203-1.5152-5.4296,0-1.0102-0.37881-1.1364-1.1364,0.37881-2.9042-0.88388-1.0102-2.2728-1.6415,0-1.6415,1.0102-0.3788,1.5152,0,1.389-1.0102-0.63134-1.389-0.75761-4.0406,0.63134-0.3788,1.2627,0.75761,2.9042,1.389,2.0203-0.25254,1.2627-0.12627,0.50508-1.6415-0.25254-5.4296,0.12627-5.0508-0.25254-4.2931,2.1466-2.2728,1.0102-1.1364,0.12627-1.389-1.2627-0.50508-0.25254-2.1466z",
                            "name": "Астраханская область"
                        },
                        "ad": {
                            "path": "m51.786,356.21,2.4107-1.4286,2.5-2.6786,0.35714-2.1428-0.26786-3.9286-1.0714-2.7679-2.9464-0.98214l-2.412-1.78-2.232-3.75-1.5179-1.1607-1.3393,0.71428-0.17857,2.1429,1.6071,1.875,0.80357,2.5893,1.1607,1.6964,1.6071-0.35714,1.5179,0.44643-0.44643,2.9464-2.9464,2.3214-3.394,0.71-2.8571,0.35715-0.17857,3.8393,1.0714,1.7857h1.7857l5.3571-2.9464,0.35714,1.7857z",
                            "name": "Республика Адыгея"
                        },
                        "vl": {
                            "path": "m115.893,313.18,1.5179-0.98214,1.875-0.0893,1.1607-1.0714,1.1607-1.6072,0-1.25,1.1607-0.98214,1.9643,1.25,2.5,1.9643,3.3036,2.1428,3.9286,1.5179,1.4286,1.5179,0.625,2.1428,0.44643,1.4286,2.8571,0.35714,0.44643,1.4286,2.5893,0.80357,1.7857,1.7857,1.6964,1.6964,0.17857,2.2322-1.5179,1.25-1.6071,2.2321-1.4286,1.3393-0.26786,1.25,0.89286,2.2321,2.9464,1.875,1.6964,1.875,1.7857,1.1607,1.25,3.3036,1.0714,1.875,0.0893,1.25-0.71428,0.53572-1.3393,0.44643-0.71429,0.53571-2.8571,0.26786-4.6429-0.0893-1.6964,0.26786-0.71429,1.6071,0,2.8572-0.17857,1.1607-1.6964,1.25-1.3393,0.98214-4.0178-0.0893-1.0714-0.0893-1.3393-3.0357-1.4286-1.0714-1.875-1.0714-1.0714-0.625l-2.256-0.46-2.054-1.25-1.071-0.18-1.1607,0.625-0.98214,0.71429-1.25,0.26785-2.1429-0.0893-0.89286-1.1607-0.35714-1.25-1.4286,0.26786-0.89286,1.1607h-1.25l-1.875-0.71428-1.25-0.80357-1.3393-0.35715-1.4286,0.17858-1.4286,1.25h-0.89286l-1.4286-2.5-1.25-1.4286-1.0714-0.71428,0.448-1.44,0.893-1.52,1.607-1.43,0.179-0.89-1.6964-2.1429-0.44643-1.0714,1.4286-0.80358,0.625-1.875,0.625-0.53571,1.25-0.35714,1.6071,0.0893h3.0357l1.7857-0.625,1.9643-2.5893,0.89286-4.0179,0.625-1.4286,2.8571-2.0536,1.1607-1.6964,0.35714-3.3036v-2.2322z",
                            "name": "Волгоградская область",
                            "id": [6]
                        },
                        "vn": {
                            "path": "m100.089,310.77,0-6.0714,0.08929-1.1607,3.75-3.2143,2.5-3.6607,1.3393-1.4286,0.35714-1.875,2.4107-0.71428,0.35714-2.5893,0.625-1.7857,1.0714-0.35714,0.625-2.0536,1.3393-1.7857,1.1607-1.0714,0.98214-0.53571,0.89286,1.1607,0.44643,0,0.71429-1.0714,0.53571-0.71428,1.1607-0.17857,0.89286,0.89285,1.25,1.1607,1.4286,1.4286,1.1607,1.5179,0.80357,0.89285-0.26786,2.1429,0,1.6071,1.875,1.0714,2.3214,1.3393,0.80357,1.3393-0.0893,1.7857-0.89285,1.5178-0.44643,0.98215,1.5179,1.25,1.875,1.7857,1.9643,2.2321,1.3393,1.6964,1.1607,1.9643-0.26786,2.3214,0,2.0536-2.1429,1.0714-0.71428,0.17857-4.2857-1.875-2.6786-1.7857-2.1429-1.4286-1.6964-1.1607-0.53571-0.17857-0.71429,0.80357-0.44643,1.25-1.4286,1.9643-1.6964,0.44643-2.8571,0.80357-3.5714,1.1607-3.2143,0.0893-2.5-0.17857-2.3214-1.25-2.3214-1.0714z",
                            "name": "Воронежская область",
                            "id": [8]
                        },
                        "bl": {
                            "path": "m93.304,272.29-5.4464,3.3036,0.08928,2.6786,1.6964,1.875,0.08929,3.125,0.44643,1.6964,2.8571,1.6071,2.8571,0.44643l1.608,2.23-2.5,3.3036-0.35714,2.1429,1.0714,1.6071,2.3214,1.5179,0.17857,2.9464,1.1607,1.5179,0.71428,0.89285,4.7321-4.375,3.75-5.4464,2.0536-0.89285,0.80357-4.1072,1.0714-0.89285,0.53571-1.3393-2.5-2.8571-3.5714-4.1071-2.7679-0.26786-2.9464-1.1607-2.6786-1.6964-2.5893-1.6072-1.9643-1.6071z",
                            "name": "Белгородская область",
                            "id": [3]
                        },
                        "ky": {
                            "path": "m93.482,271.84,0-4.6429l-0.357-1.61-1.786-1.97-0.714-1.07,1.3393-1.0714,3.75-1.3393,2.7679-1.3393,2.6786,0.0893,0.53571,1.0714,1.25-0.0893,1.7857-1.1607h0.80357l0.98214,0.44643,1.4286,1.6071,0.53571,0.80357,0.08929,1.6964,1.0714,0.89286,1.0714,0.71428h0.89286l1.0714,1.25,0.17857,3.2143v2.4107l-0.89286,0.98214v1.5179,1.1607l1.0714,1.25,1.1607,0.98214,0.89286,0.17857,1.5179,0.53571,1.0714,1.6072,1.6071,1.5178-0.71429,1.1607-0.80357,0.89286-0.89286-0.80358-1.9643,1.25-1.4286,1.1607-0.53571,0.80357-3.4821-4.1071-2.2321-2.3214-0.98214-0.53572-3.3036-0.625-2.8571-1.5178-3.6607-2.1429-2.4107-1.9643z",
                            "name": "Курская область"
                        },
                        "or": {
                            "path": "m104.732,258.27,1.0714-1.875,2.2321-0.26786,0.89286-1.6071,0.89286-0.53572,1.9643,0.89286,1.6964-0.0893,1.6071-0.71429,1.0714-1.5179,0.89286-0.53571,0.98214,0.17857,1.3393,0.98214,1.9643,0.89286,1.1607,0.89286,0.35714,0.89285,0.71429,1.3393,0.17857,2.0536,0,3.6607,0.98214,1.7857,1.4286,1.875,0.80357,1.25,0.71429,1.7857-0.26786,1.5179-3.9286,1.875-1.9643,0.98214-1.0714,2.1429-1.875,1.0714-1.875,1.0714-2.4107-0.89286-1.9643-1.6071-0.44643-1.6964,0.44643-1.9643,0.44643-0.89285,0.08928-4.4643-0.89286-1.6964-1.7857-0.53571-1.7857-1.4286-0.08929-1.6072-1.3393-1.5178-1.6071-1.6964z",
                            "name": "Орловская область"
                        },
                        "lp": {
                            "path": "m116.875,278.45,1.5179,1.875,1.0714,0.89286,1.1607,0.71428,1.1607,1.0714,2.5,2.2321,1.25,1.5179,0.625,1.4286-0.44643,2.5893,0.53572,0.625,2.5,1.3393,1.875,1.7857,1.0714-0.17857,1.0714-0.625,0.44643-0.80357,0.0893-5.8036,0.35714-0.71428,1.4286-0.80357,2.3214-0.17857,2.0536-1.1607,1.3393-0.44643,0.17857-1.6964,0.625-1.3393,1.25-1.5179-0.80357-1.1607-2.6786-0.98215-0.53571-0.53571-0.17858-0.71429,1.0714-1.3393,0-1.6071-2.1428-0.35715-1.0714,0.44643-1.6072,0.80357-0.98214,0.89286-1.1607,0.625-1.4286,0.0893-1.3393-1.5179-1.6964-1.6964-0.80357-0.98214-2.4107,0.89285-3.125,1.6964-1.1607,1.6072-1.6071,1.4286z",
                            "name": "Липецкая область"
                        },
                        "tl": {
                            "path": "m123.482,256.3,3.2143-2.0536,0.98214-0.17857,1.6071,0.80357,0.98215-0.80357,0.71428-1.0714,3.125,0,1.6072,0.625,2.0536,0.35714,1.4286,0.80358,2.4107,0.35714,1.4286,0.71428,0.53572,1.0714,0.98214,1.0714,1.25,1.4286,0.71429,1.6072-0.35715,1.6964-0.98214,1.1607-0.71428,1.6964-1.3393,1.9643-1.6964,2.0536-1.0714,1.875-0.71428,0.98215-0.53572,0.35714-1.7857,0-2.5,0.89286-1.5179,1.0714-1.3393,0.26785-2.0536-1.3393-2.0536-2.5893-0.26786-2.0536-0.53571-1.4286-1.6071-2.5l-1.413-2.14-0.179-2.23z",
                            "name": "Тульская область",
                            "id": [35]
                        },
                        "bn": {
                            "path": "m97.679,258.62,0.26786-1.7857,2.3214-1.5179,0.44643-1.1607,0-1.4286-1.6071-1.9643-1.7857-2.1429-1.6964-1.9643-2.3214-1.875-1.5179-0.89286-1.6964-0.26786-0.89286-1.1607,0.17857-2.3214,1.3393-1.6071,3.125-2.1429,2.6786-1.875,0.89286-1.7857,0.98214-0.71428,1.6964,0.26786,0.625,1.25,0.625,1.5178,1.0714,2.2322,1.1607,0.80357,5.8929,0.26785,2.1429-0.35714,1.4286,0.53572,3.125,0.89285,2.3214,0,0.71429,1.9643,0,2.2321-0.17857,1.1607-0.98214,1.5178-0.71429,0.53572-0.26786,1.4286,0.26786,1.5179,0,1.25-0.80357,1.4286-1.4286,1.5178-1.7857,0.71429-1.6964,0.17857-1.7857-0.71428-1.4286,0.71428-0.26786,0.89286-2.4107,0.80357-1.0714,1.4286-1.3393,1.25-1.4286,0.17857-1.4286-0.71428z",
                            "name": "Брянская область",
                            "id": [4]
                        },
                        "kj": {
                            "path": "m119.196,239.61,1.6071-1.25,1.6071-1.3393l1.161-0.27,1.429,0.63,0.80357,1.4286,1.0714,1.25,1.7857,0.80357,1.7857,0.35715,3.125,0.0893,1.875-0.0893,1.6071-1.0714,2.4107-0.0893,1.4286,0.44643,0.98214,2.0536,0.26786,1.4286,1.25,0.625,1.6071,0.98215,0.98214,0.80357,0.53572,1.25-0.53572,2.0536-1.0714,1.7857-1.4286,1.9643-1.1607,1.25-0.89286,0.44643-3.75-1.25-2.6786-1.0714-2.6786,0.0893-1.875,0.44642-1.0714,1.25-1.5179-0.44642-1.0714,0.0893-1.0714,0.80357-2.0536,1.0714-0.89286-0.89286-1.0714-0.80357-1.9643-1.25-1.5179-0.89285-0.89286-0.44643v-1.0714-2.4107l-0.08929-0.625,1.1607-1.6964,1.0714-1.875v-1.7857l-0.26786-1.6071z",
                            "name": "Калужская область"
                        },
                        "sm": {
                            "path": "M109.375,237.55,110,235.95,110.179,234.52,109.732,233l-0.08928-1.4286,1.5179-1.3393,0.71429-1.6071,0.08929-3.125,0.35714-1.875,2.4107-2.5,2.5-1.9643,1.875-1.7857s1.875-1.3393,2.2321-1.5179c0.35714-0.17857,2.5-1.5178,2.5-1.5178l2.5,0.0893,3.0357,3.4822,1.875,3.4821,2.5,3.6607,1.4286,0.89286,2.7679,0.53571h2.0536l0.80357,0.71429,1.1607,1.875,1.1607,1.3393,1.25,1.6071,1.0714,1.4286,0.17857,1.3393-0.98214,1.25-1.875,0.89285-1.875,0.53572-0.89286,1.25-0.44643,0.89285-1.875,0.44643-1.7857,0.625-1.6072,0.35715h-3.0357l-3.75-0.80358-1.7857-1.7857-1.4286-1.3393-1.1607-0.26785-1.1607,0.71428-2.2321,1.5179-1.1607,0.44643-1.7857-0.44643-4.1071-0.98214-2.4107-0.35715z",
                            "name": "Смоленская область"
                        },
                        "mc": {
                            "path": "m146.07,234.16,3.5714,0.26785,2.3214-0.89285,1.4286-0.44643,0.53571,0.625,0.0893,1.7857,0,1.1607-0.17857,1.3393,1.5178,0.89286,2.9464,0.44643,1.7857,0.89285,2.0536,0.89286,2.7678,0.89286,1.7857,0.26786,1.25,0.53571,0.26786,1.6071-0.0893,1.5179-0.44643,1.6964-1.5179,0.625-2.1428,1.1607-1.6072,1.3393-0.0893,1.25-0.625,1.7857-1.1607,1.5179-0.35714,1.6071,0.17857,1.6072,0.0893,0.89285,1.1607,1.0714,1.0714,0.625,1.1607-1.0714,0.625,0.44643,0,1.5179-0.0893,3.2143-0.44643,1.1607-1.3393-0.44643-1.875-0.17857-1.6072,0.17857-0.80357,0.89286-2.0536,0.0893-1.6071-0.35714-1.25-0.71429-1.0714-1.1607-1.6071-0.625-1.6964,0-0.44643,0.80357-0.17857,1.1607-1.0714,0.53571-1.4286,0.0893-0.80357-0.80358-0.17858-0.625,1.1607-2.4107,0.26786-1.9643-0.53572-1.6964-1.1607-1.5179-1.1607-1.5179-1.0714-0.89286,0.625-1.25,2.5-2.9464,1.1607-2.6786-0.71429-1.7857-1.6071-1.6071-1.6071-0.98215-0.53572-0.35714-0.625-1.875-0.80357-1.25-0.80357-0.80357,0.625-1.5179,2.5893-1.3393z",
                            "name": "Москва и Московская область",
                            "id": [15,16]
                        },
                        "rz": {
                            "path": "m144.55,265.59-1.9643,2.6786-2.1429,3.125-0.625,2.7679-0.80357,1.7857,0.17857,0.80357,1.6964,0.71429,1.9643,1.3393,0.44643,1.5179-0.26786,0.89286,1.4286,1.1607,1.9643,0,1.1607,0.71429,0.0893,1.875,0.44643,1.1607,1.25,0.44643,1.5179-0.625,1.9643,0,1.5179,0.98214,0.625,1.7857,1.0714,1.1607,2.6786-0.17857,3.125,0,2.9464-2.0536,3.0357-2.9464,1.5179-2.2321,1.0714-1.7857-0.98214-2.2321-0.53572-3.125-2.0536-2.0536-1.25-1.6964-0.44643-2.8571-0.53571-1.6072-0.35715-0.98214-2.1428-0.35714-3.4822,0.26786-0.625,0.80357-2.1428-0.17857-1.875-0.71429-1.875-1.0714-1.9643-0.89286-1.0714,0.35715-0.80357,1.4286-1.4286,0.89286-1.6071-0.44643z",
                            "name": "Рязанская область"
                        },
                        "tb": {
                            "path": "m142.77,279.43-1.6964,2.1429-0.35714,1.7857-0.80358,0.89286-2.6786,0.98214-1.875,0.44643-1.5178,0.71429-0.71429,1.4286,0,2.1429,0.26786,2.3214-0.71429,1.875-1.5179,0.53571-0.44642,1.4286-0.44643,1.6964-0.625,1.1607,0.08928,0.625,2.3214,2.1429,2.2321,2.1429,1.6072,2.2321,1.4286,2.0536,0.98214,0,2.1429,0,1.9643-1.25,2.5-1.25,1.6964-1.0714,4.0179-0.26785,1.0714-0.98215v-3.6607c0-0.35714,0.0893-2.3214,0.0893-2.3214l1.5179-1.1607s0.71429-0.71429,0.80357-1.0714c0.0893-0.35714-0.26785-4.6429-0.26785-4.6429l1.4286-1.0714-0.80357-2.1428-1.7857-1.4286-2.3214,0.26786-0.89285,0.625-1.1607-0.80357-0.89286-1.3393v-1.3393l-1.875-0.80357h-1.3393l-0.89286-1.0714-0.26786-1.3393z",
                            "name": "Тамбовская область"
                        },
                        "kn": {
                            "path": "m74.107,152.55,0,2.2322,0.53571,2.5,2.0536,5.1786,1.4286,3.4821,1.9643,3.6607,2.5,1.0714,3.75-0.44642,1.9643-1.3393,0.625-1.7857-0.44643-4.2857-0.89286-2.8571-1.5179-1.6071-2.4107-0.53572-0.98214-0.71428,0-3.0357-0.80357-1.4286-1.6964-1.6071-1.6071-0.26786-0.35714,1.25-0.625,1.3393-0.625,0.89285-1.4286-0.35714z",
                            "name": "Калининградская область"
                        },
                        "ps": {
                            "path": "m125.268,213.98,0.35714-2.1428-0.26786-2.1429-1.4286-1.875-1.3393-1.4286-0.08929-1.6964,0.98214-0.71429,0.17857-1.6964-0.89286-0.98215-1.25-1.875,0-4.1964,1.5179-0.89285,3.75-2.2322,0.80357-2.4107,0.53572-1.7857,1.875-1.25,2.4107-0.0893,1.3393-1.6071,0.98214-1.6964s1.25-0.625,1.6072-0.80357c0.35714-0.17857,2.8571-0.71429,2.8571-0.71429l1.5179-0.0893,1.0714,0.53571-0.625,1.5179-0.71428,0.89285-0.17857,0.98215,1.6071,0.26785,1.25-1.7857,0.98214-2.0536,1.1607-1.5179,1.6071-0.71428h1.6071l1.5179-1.5179,1.1607-0.625h1.4286l0.98214,0.98214,0.625,1.5179,0.98214,1.6071-0.26786,1.6964-0.89285,0.98214-0.35715,1.3393-0.80357,1.6071-0.17857,1.1607h-1.4286-0.80357l-0.71429-0.53572-0.80357,0.53572-0.625,0.80357-0.53571,1.5178-0.53572,2.1429-0.0893,2.5-0.35715,1.875-1.1607,1.25-1.3393,0.98214h-1.7857l-1.5179,1.3393-0.53571,1.7857-1.3393,0.53572-0.44643,1.0714-0.17857,1.4286-1.7857,0.89286-1.7857,0.80357-0.625,1.6964,0.625,1.5178,0.625,0.625-0.26785,1.4286s-0.0893,0.44643-0.44643,0.80358c-0.35714,0.35714-1.1607,1.3393-1.1607,1.3393l-1.4286,0.80357-2.3214,0.89286-1.0714,0.0893-1.1607-0.89286-0.89286-0.89286z",
                            "name": "Псковская область"
                        },
                        "no": {
                            "path": "m153.12,188.27,1.5179,1.25,2.1428,0.35714,2.1429,0.17857,1.25,1.1607,2.5,0.53571,2.3214-0.0893,1.0714-0.89286,0.44643,0.625,0.0893,1.7857,2.1429-0.53571,2.3214,0.0893,0.80357,0.80358,0.17857,2.5,0.17857,2.5,0.53572,1.0714,1.3393,0.17858,1.3393,0.44642,0.26785,2.1429,0.71429,1.6964,0.98214,0.80357,0.44643,2.9464,0.0893,2.2321,0.89285,1.4286-0.53571,0.98215-0.71429,0.53571,0,1.6071,0.17858,1.5179,1.4286,1.3393,0.625,0.53571,0.0893,1.9643,0,1.9643-0.17857,1.3393-1.25,0.53571-0.71428-0.26785-0.625-0.80358-0.71429-0.80357-0.17857-1.1607-0.98214-0.80357-0.80358-0.625-2.0536,0-1.5178-0.53572-0.53572-0.35714-1.5178-0.53571-0.71429-0.26786,0-0.44643s-0.26786-1.25-0.26786-1.6964c0-0.44643-0.0893-2.0536-0.0893-2.0536l-0.625-0.98214h-1.7857l-0.89285-0.44643-0.44643-0.98214-0.98215-0.625-0.53571,0.625-0.89286,1.0714-1.6964,1.4286h-2.1428c-0.35715,0-1.5179,0.0893-1.5179,0.0893l-0.71429-1.0714-1.0714-0.71428-2.3214-0.17857-2.6786-0.0893-1.5179-0.44643-1.3393-0.98214-2.3214-0.44643h-2.1428l-0.89286-1.1607-1.25-1.0714-0.53571-0.71429-1.1607-0.71428,0.98214-2.7679,0.71429-0.44643,1.1607-1.5179,1.0714-1.0714,2.0536-0.625,2.5-1.9643,0.625-1.9643,0.0893-3.5714,0.98214-2.5893,1.0714-1.25,1.1607,0.26786z",
                            "name": "Новгородская область"
                        },
                        "tr": {
                            "path": "m128.661,216.66,3.2143-0.625,2.2321-1.6072,1.3393-1.6071,0.17857-1.4286-0.80357-1.4286-0.26786-1.3393,0.35714-0.89286,1.4286-0.89285,1.6964-0.625,1.1607,0.44643,1.5179,1.5178,1.0714,0.98215,0.98215,0.53571,1.6964,0.17857,2.4107,0.35714,1.3393,0.98215,1.3393,0.26785,3.2143,0.44643,1.5178,0,1.25,0.71429,0.80358,0.71428,1.875,0.35715,1.7857-0.17857,1.875-1.6072,1.25-1.25,0.71429,0.44643,0.625,0.80357,1.4286,0.44643,1.4286,0.17857,0.53571,1.5179,0.17857,2.4107,0.35715,0.80358,1.1607,0.71428,1.4286,0.80357,1.0714,0.26786,1.875,0.35714,0.98214,0.26786,1.25,1.0714,0.44643,1.3393,0.98214,1.0714,0.80358,0.53572,1.7857-0.35715,1.3393,0.0893,1.25,0.71429,1.6071,0.89285,0,1.5179-0.625,1.6964-1.25,1.6071-1.6071,0.44643-1.25,0.98214-1.5179,1.3393-0.89286,1.0714-0.44643,0.71428-0.26785,1.5179-0.44643,1.0714-1.25,1.4286-0.53572,1.4286-0.35714,2.0536-2.0536,1.9643-2.0536,1.3393-1.0714,0.17858-0.53571-0.71429-0.26786-1.7857-1.6964-0.71429-3.8393-0.89286-3.8393-1.6071-3.0357-0.80357-1.5178-1.0714-0.0893-3.0357-0.35714-1.6964-3.3036,0.80357-3.4822,0.26786-1.3393-0.89286-3.4821-4.4643-1.5179-2.0536-3.3036-0.625-2.7679-0.53571-1.4286-1.7857z",
                            "name": "Тверская область",
                            "id": [34]
                        },
                        "vm": {
                            "path": "m167.41,247.73,1.6072,1.7857,2.0536,1.25,1.1607,1.0714,1.3393,0.35714,0.80357,0.89286,0.0893,1.5178-0.89285,1.7857-0.35715,1.0714,1.25,0.625,1.7857,0.26785,1.0714,1.1607,0.17857,1.9643,0.98214,1.875,1.0714,1.25,1.3393,1.25,1.3393,1.3393,1.3393,1.1607,1.7857,1.875,0.89286,1.3393-0.17857,0.98214-0.89286,0.71429l-0.18,0.98,0.53571,0.71429,0.44643,0.71428,0.0893,1.6072-1.7857,0.53571-2.2321-0.0893-1.1607-1.0714-4.4643-0.0893h-5.1786l-1.7857,0.53571-0.71429-1.6964-1.6964-1.9643-1.6071-2.6786-0.80357-4.1964-0.0893-4.1071-0.17857-2.0536-0.44643-0.44643-0.71428,0.44643-1.1607,0.26785-1.4286-1.25-0.26786-2.5893,0.71429-2.0536,1.1607-2.0536,0.44643-1.7857,1.3393-1.0714z",
                            "name": "Владимирская область",
                            "id": [5]
                        },
                        "pz": {
                            "path": "m157.05,289.96,1.6964,1.7857,2.0536,1.5179,1.25,0.98214,1.6964,0.625,1.25,1.875,0.71429,1.6071,0.26785,1.9643,0.98215,0.98214,1.0714,1.0714,2.6786,0.17857,1.6964,0.0893,0.625,2.1429,0.89286,1.7857,1.6964,0.71429,2.1429,0.26785,1.4286,1.0714,0.625,1.0714-1.5179,0.89286-0.89286,0.98214,0.0893,4.1071-0.26786,3.4822-2.7679,1.25-1.0714-0.0893-0.89286,1.6071-1.9643,0.98215-1.1607-1.7857-0.98214-0.98214-5.9822-0.0893-1.1607-1.875-0.89286-0.89285-3.125-0.71429-0.98214-1.6071-1.25-1.6964-2.1429-0.71429-2.4107-1.3393-1.6071-1.0714-2.5,0.0893-0.71429-1.875,0.26786-2.5,1.1607-0.89285,3.8393-0.80357,0.89285-2.4107,0-3.4821,1.3393-1.6964,1.3393-1.6071-0.26786-2.5893,0-1.9643,1.1607-0.89286z",
                            "name": "Пензенская область",
                            "id": [21]
                        },
                        "sr": {
                            "path": "m137.23,308.27-0.17857,3.0357-0.26786,1.25-2.2321,1.1607,1.4286,1.6964,1.0714,3.2143,2.2321,0.71429,0.98215,0.80357,0.89285,1.0714,1.7857,0.625,2.5893,2.5,0.89286,1.0714,0,1.875-1.5179,2.0536-2.4107,2.8571-0.44643,1.25,0.44643,1.6964,0.71429,0.89286,2.1428,1.1607,4.0179,3.9286,1.7857,4.5536,1.25,1.4286,1.25,1.3393,0.26786,1.9643-0.71428,2.5-0.53572,2.4107,0.26786,1.7857,0.89286,1.0714,1.6071,0.44643,1.6964,0,1.6964-1.1607,1.25-1.0714,0.44642-2.6786,0.0893-1.875,2.2321-0.625,3.3036,1.25,1.6964,0.35714,1.6072,0,1.3393-1.5179,0.44643-0.53571,1.6071,0.35714,1.3393,1.0714,1.5178,0.89286,4.6429,0,1.1607-1.1607,1.3393,0.17857,0.89286,0.80358,1.6071-0.53572,0-1.7857-0.89286-1.9643-0.35714-1.3393-0.17857-3.9286-0.0893-2.0536-0.71428-1.25,0.0893-2.8571-0.35714-1.6071,0-2.5-0.80357-1.3393-1.1607-1.6071-2.5-1.0714-1.6072-2.0536-2.5893-0.0893-1.0714-0.35714-1.7857-1.6964-0.625-1.25-0.44642-0.89286-1.7857-2.4107-5.625-0.26786-0.53571-0.17857-1.9643-2.5893-3.125-0.89286-2.2321-2.9464-6.1607-3.3036-2.3214,0-1.0714-1.6964,0.44643-2.5-0.80357-0.35714-3.8393,2.1428-1.5179,0.35715z",
                            "name": "Саратовская область"

                        },
                        "mr": {
                            "path": "m157.59,290.05,1.875,2.1429,2.6786,1.7857,1.7857,1.1607,1.7857,2.7679,0.44642,2.4107,2.0536,2.1429,2.5893,0.0893,1.6071,0.26786,0.89286,2.2321,0.71429,1.4286,2.0536,0.89286,1.7857,0.35714,1.25,0.625,0.53572,0.80358,5.8928,0.17857,2.6786-3.5714,0.35715-0.53572,0.71428-1.3393,0.0893-2.1429-0.0893-1.9643-1.7857-0.98215-0.35714-2.5-0.0893-0.80357-1.6964,0,0,0.17857-0.80357,0.89286-1.3393,0.80357-5.2678,0-2.5893-2.3214,0.17857-3.5714-1.1607-1.0714-0.17857-0.80358,1.0714-1.0714,0-1.6072-2.5893-0.53571-1.7857-0.0893-0.80357-1.25-0.71429-1.6964-1.25,1.1607-2.1429,2.3214-2.4107,1.5178-1.5179,0.98215-2.9464,0.26785z",
                            "name": "Республика Мордовия"
                        },
                        "cu": {
                            "path": "m189.11,299.07,1.3393-0.89286,2.9464,0.44643,1.3393,0.44643,1.0714-1.3393,0.26786-1.7857,2.2321-1.1607,2.2321-2.2322,3.125,0.0893,2.6786,0,1.25,1.5179,0.35715,2.9464-0.17857,1.5179,0.35714,1.25,0.71428,1.1607-0.0893,0.71428-1.3393,0.625-4.1071-0.0893-1.3393,0.53571-0.80357,0.80357,0,0.89286,1.1607,0.71428-0.17857,0.89286-1.3393,1.1607-1.7857,1.25-2.1429,0.98214-1.3393,0.44643-1.3393-1.3393-2.5-0.44643-0.98215-0.625-0.98214-1.3393-0.80357-0.80357,0.80357-3.5714z",
                            "name": "Чувашская Республика",
                            "id": [43]
                        },
                        "ul": {
                            "path": "m188.57,305.32-1.875,2.6786-0.98215,1.4286-4.8214-0.26785-0.80358,0.26785-1.7857,1.4286-0.80357,1.1607,0,2.3214,0,2.5893,0,1.6964-1.7857,1.4286-1.0714,0.26786-0.89286,0-1.25,1.25-1.25,1.0714-0.625,0.26786,0.89286,1.9643,1.6071,1.6071,2.3214,0.44643,1.5178,0.17857,1.25,1.6072,1.5179,0.80357,2.1429,0.17857,0.89286-0.625,0.0893-1.875,0.17857-1.6964,1.0714-1.6964,0.35714-1.3393,1.3393-0.26786,0.80357,0.53571,1.3393,0.625,1.875-0.17857,1.3393-0.98214,1.0714,0.17857,1.6964,1.4286,2.0536,1.875,1.5179,1.6072,0.80357,1.4286,2.3214,0.17857,1.1607-1.5179,2.8572-2.0536,2.0536-1.1607,0.26785-2.3214,0-3.5714-1.875-1.1607-3.6607-0.0893-2.0536-1.4286-0.98214-1.1607-2.5-0.26785-0.98215-1.5179-3.0357-1.5179-0.80357-1.5179-0.625-2.0536z",
                            "name": "Ульяновская область",
                            "id": [38]
                        },
                        "ss": {
                            "path": "m180.98,329.96,1.3393,2.1428,0.71428,2.8572,0.44643,2.8571,0,2.1429,0.625,2.3214-0.0893,2.8571,0.35714,2.4107,0.53571,2.1429,0.625,1.9643,0.71429,0.98214,5.8929,0.0893,3.0357-1.6071,1.25-1.9643,1.9643-0.35715,1.6964-0.0893,2.1429-1.4286,1.4286-0.89286,1.25-0.17857,1.6072,0.625,1.7857-0.17857,0.80357-1.875,1.0714-2.3214,4.375-2.5893,1.7857-1.4286,1.1607-2.0536-0.625-1.5179-0.80357-1.7857-0.35715-2.5-1.1607-1.25-0.71429-2.4107-3.6607-0.26785-2.3214-1.6964-1.4286-0.80357-3.5714,2.3214-1.9643,2.2322-2.4107,0.0893-0.98214-0.98214-2.2321-2.4107-2.4107-1.875-1.0714-1.0714-0.89285,0.26785-1.6072,0.71429-1.6964-0.0893-1.5178-0.80357-1.0714,0-0.625,0.98215-0.53572,1.0714-0.80357,1.5179-0.17857,1.3393,0,0.98214-0.0893,0.71429z",
                            "name": "Самарская область",
                            "id": [29]
                        },
                        "ob": {
                            "path": "m185.89,352.82,0.53571,1.4286,0.71429,1.6071-1.0714,1.6072,1.0714,1.4286,3.0357,0.17857,1.9643-0.35714,2.5,0,0.17857,2.3214-0.89286,2.6786,0.35714,1.0714,3.5714,1.6071,2.1429,1.4286,0.17857,3.5714,0,4.1071,0,1.4286-1.25,0.89286,0,1.9643,0,0.71428,0.71429,1.0714,1.0714,0.89286,1.7857-2.5,0-1.4286,0.89286-0.89286,1.4286,0,1.0714,2.3214-0.17858,1.4286-0.71428,1.25-0.35714,1.4286l0.36,1.43,1.25,0.89286,2.3214,1.25,1.7857,0.89286h1.9643,2.5l1.4286-1.0714,1.6071,0.17857,1.9643,1.0714,0.89285,1.6071,0.35715,1.7857,1.0714,1.25h1.7857l0.89286-0.89285h1.25l1.6071,0.53571,1.25,1.4286,0.53571,2.6786-0.17857,3.5714,1.7857,1.6072,1.4286,0.89285,1.0714,1.6072,1.0714,0.53571,1.6071-0.71429,1.4286-0.17857,1.6071,1.4286v1.25l1.9643,1.7857,1.25,0.71428,2.1429,0.35715h2.6786l1.4286-0.17857,1.25-0.89286,1.25-1.0714,0.89286-0.89286-0.17858-1.25-2.3214-3.2143-1.0714-1.25v-3.75l-0.71429-2.1429-0.17857-2.1429,1.0714-2.3214,1.9643-1.4286-1.4286-1.7857-3.0357-2.8571-1.9643,0.35714-1.4286-0.17857-0.89286-1.25h-2.3214l-1.4286,1.25-1.0714,1.25-0.53572,1.0714h-2.5l-1.0714-2.5-3.2143-0.17858-2.8572-0.35714-0.89285-2.5-1.08,0.33-1.79,0.89h-1.4286l-0.17857-1.0714,1.4286-1.7857,2.5-2.5-0.53-1.78-0.71-0.36v-0.89286l2.5-1.9643,0.35715-1.0714v-2.1429h-1.7857l-2.1429,0.71429-1.6071,0.17857-1.4286-1.9643-0.53571-2.3214,1.25-1.7857,1.0714-0.89286v-1.6071l-0.35714-2.3214,1.0714-0.89285,0.17857-3.0357-1.25-1.9643-1.7857-1.7857-0.17857-1.6071,1.0714-2.8571,1.6072-2.5,0.89285-1.7857-0.53571-1.25-2.1429-1.6071-1.4286-2.1429-1.25-1.4286-1.6071,1.7857-1.4286,1.4286-4.1072,2.5-1.4286,1.9643-0.35714,1.9643-0.53571,0.35714-1.9643,0.17857-2.1429-0.35714-1.9643,0.53571-1.9643,1.4286-2.8571,0.53572-1.0714,0.71428-1.4286,1.7857-2.1429,1.25h-2.5z",
                            "name": "Оренбургская область",
                            "id": [20]
                        },
                        "nn": {
                            "path": "m186.25,271.57,4.2857-0.53571,2.5-1.4286,3.5714-0.71428,2.6786-1.0714,1.25-0.17857,2.3214,1.25,1.7857,1.0714,2.6786-0.17857,1.4286,0,2.6786-1.0714,1.25,0.17857,1.4286,1.9643,1.0714,2.1429,2.5,0.17857,2.5,1.7857,1.0714,1.25,0.89286,2.5,1.25,1.4286-0.17858,1.6071-1.25,0.89286-1.7857,0.17857-0.71429,0.89286-1.6071,0-0.71428-0.89286-1.7857-1.0714-1.6071,0.71429,0,1.6071-1.25,1.4286-1.25,0.53572-2.1429-0.89286-2.1429-1.6071-3.0357-0.89286-1.7857,0-1.0714,0.89286-0.71429,1.7857,0,2.8571-0.17857,2.8572,0.53571,1.0714-1.0714,1.4286-2.3214,1.4286-1.4286,0.89285,0,1.4286-0.35715,0.89285-0.89285,0.71429-2.8572-0.35714-1.0714-0.17858-0.89285,0-0.71429,0.53572-0.38692,0.34215-0.69448-0.12626-0.44194-0.50508-0.50508-3.0936-1.5784-0.12627-1.5784,1.4521-2.2097,0.44194-3.9775-0.25253-2.0834-2.0203,0.1894-3.3461-1.2627-1.389-0.0631-0.75761,1.0102-1.4521-0.0631-1.0733-3.7249-0.63135-1.1996-0.75761-1.0733-2.7148,1.1364-2.336-1.1996-3.3461,2.0203-0.50507,3.283-0.12627,5.9978,0.12627,1.2627,0.88388,2.0203,0.1894,2.0203-0.75761,0.12627-1.5152-0.94702-1.4521,0.63135-1.0733z",
                            "name": "Нижегородская область",
                            "id": [17]
                        },
                        "ml": {
                            "path": "m211.51,286.29,2.2728,2.336,2.4622,2.0834,2.7779,1.1364,2.9673,0.0631,2.4622,2.0834,1.5784,1.6415,0.44194,1.3258,0.63134,0.94702-0.3788,1.6415-0.56821,1.1364-0.0631,1.8309-1.5152,1.389-0.88388,0.56821-1.4521-0.12627-1.1996-1.5152-1.1996-0.44194-1.389-0.82075-1.7046-0.12627-0.50508,0.88389-1.7046,0.88388-2.5885,0.12627-1.9572-0.82075-1.1364-0.69448-0.88388-3.0305-0.37881-4.7351-1.1996-1.4521-4.0406-0.0631-1.3258-0.1894-0.63134-1.0733,0-2.0834,0.0631-3.0936,0.37881-1.8309,1.0102-1.0733,0.82075-0.63134,2.5885,0.3788,2.2728,0.88389,2.9673,1.7678z",
                            "name": "Республика Марий Эл"
                        },
                        "ta": {
                            "path": "m190.93,308.14,0.0631,1.1364,0.44194,1.0733,0.88389,1.0102,1.5152,0.63134,1.8309,1.4521,1.5152,0.75762,1.389,0.44194,1.4521,1.0733,1.389,1.0102,2.4622,0.44194,1.4521,0.0631,1.7046,0.88388,0.12627,2.2097-0.37881,2.9042,0.44195,1.4521,2.0834,1.1996,1.0733,0.75761,2.9042,0.18941,0.82075,0.69448,0.56821,1.7046,1.3258,2.1466,0.63134,2.5885,0.88389,1.7678,1.6415,1.894,1.389,2.2728,1.6415,1.1364,0.88388,0.88388,1.1996,0.0631,2.9042-1.8309,2.9042-2.7148,0.44194-0.63135,0-1.894-1.0102-1.0102-0.0631-0.88388,1.8309-0.25254,1.2627,0.31567,0.75762,0.56822,1.3258,0.3788,1.6415-0.31567,1.1996-0.69448,2.9042-0.12627,1.5152-0.37881,0-0.94701-0.37881-1.2627-1.1996-1.5784-0.63134-1.2627-1.5152-0.44194-0.88389-1.2627s1.2627-1.0102,1.5784-1.1364c0.31567-0.12627,2.2728-0.75762,2.2728-0.75762l0.0631-1.4521s-1.1364-0.18941-1.389-0.50508c-0.25254-0.31567-0.69448-0.94702-0.69448-0.94702l2.0203-1.3258,2.0203-1.389,0.12626-1.1364-0.69447-0.82075h-1.5152l-0.69448,0.0631-1.1364,1.3258-0.56821,0.69448h-1.894l-0.12627,0.88388-0.12627,1.3258-0.82075,1.1364-1.5152-0.12627-0.75761-1.4521-1.1364-0.94702-0.82075,1.0102-1.7678-0.31567-0.56821-2.2728-1.4521-0.88388-0.63135-1.2627,0.12627-1.3258-1.1364-1.3258,0.0631-2.6516,0.12627-3.0936,0.63135-0.94702-0.25254-1.0102-0.69448-1.0733-0.56821-0.56821-1.0102,0.44194-0.88388,0.37881-1.0102-0.12627-1.0733-0.88389-0.88388-0.82074-1.8309-0.69448-1.4521-0.44195-0.94702,0.94702-1.8309,0.75762-1.8309,0.1894-1.6415-0.31567-1.9572-1.0733-1.389,0.50508h-2.7148l-2.0834,0.0631-1.389,1.1364-0.0631,0.88389,0.69448,0.50507,0.12627,0.82075-0.82075,1.0733-1.5152,1.2627-2.6516,1.0733-1.5784,0.69448-1.1364-0.75762-2.0834-0.82075z",
                            "name": "Республика Татарстан",
                            "id": [27]
                        },
                        "iv": {
                            "path": "m174.26,252.7,2.0203-1.1364s0.94702-0.50507,1.1996-0.50507c0.25254,0,2.5885,0.31567,2.5885,0.31567l2.7148,1.1364,2.3991,1.1364,1.2627,1.1996s1.4521,1.0102,1.7046,1.1996c0.25254,0.18941,1.4521,1.2627,1.4521,1.2627l1.7046,0.63135,1.1364-0.88388h0.88388l0.50508,0.82074,0.1894,1.1996,1.0102,0.75762,1.5152,0.82074,1.0102,0.63135,0.44194,1.0102-0.69448,1.0733-0.12626,0.88388,0.75761,0.37881,0.88388-0.56821,1.389,0.63134,0.69448,0.94702,0.25254,1.2627-0.25254,0.50508-1.894,0.69448-2.9673,0.82075-3.0936,0.50507-2.3991,1.5152-3.4724,0.50508-0.94702-0.12627-1.7678-2.3991-3.5987-3.4724-2.7148-3.3461-0.82075-2.7779-0.88388-1.0102-2.1466-0.44195-0.69448-0.56821,0.50507-1.4521,0.56821-1.3258z",
                            "name": "Ивановская область"
                        },
                        "yr": {
                            "path": "m184.11,228.33,1.7678,1.5784,1.9572,0.50507,1.7678,0.50508,1.3258,1.6415,1.9572,1.5784,1.5784,0.0631,1.0733-0.69448,0.82075,0.31568,0.3788,1.4521,0.12627,3.4093-0.0631,2.6516,0.25254,1.5152,0.88388,1.0102,0.56821,0.94702-0.37881,1.0733-1.7046,1.1364-2.7148,1.3258-3.283,2.2097-1.6415,1.0733-3.3461,0.88388-2.4622-0.1894-2.1466-0.63135-2.6516-0.69448-2.1466,0.63135-1.8309,1.0733-1.7046-0.88388-1.4521-1.0102-1.894-1.1364-1.1364-1.1996-0.25254-1.3258,0.56821-1.4521,2.0203-0.88388,2.2097-1.1996,1.6415-2.7779,1.0102-2.9673,1.1996-1.2627,0.75762-2.4622,1.6415-1.8309,1.9572-1.8309,2.7148-1.5152z",
                            "name": "Ярославская область",
                            "id": [44]
                        },
                        "kt": {
                            "path": "m198.7,245,1.389,0.12627,1.2627-0.75762,1.5152-1.389,1.894-0.75762,1.894,1.1364,1.894,1.5152,2.5254,0.12627,0.63135-0.75761,0.75761,0.50507,1.2627,2.1466,2.2728,2.2728,1.5152,1.5152,1.1364,1.894,0.3788,2.2728,1.2627,1.7678,1.5152,1.6415,2.5254,1.389,1.7678,1.5152,1.7678,1.894,2.0203,0.88388,1.894,0.12627,2.0203-2.0203,1.6415-0.3788,0.63135,1.894,1.1364,1.0102-0.12627,1.6415-1.6415,1.5152-0.12627,1.894-0.3788,2.5254s-1.7678,0.75761-2.3991,0.75761c-0.63134,0-6.3134-0.12626-6.3134-0.12626l-3.1567,0.12626-1.1364,1.1364-1.2627,0.50507-2.0203-0.75761-1.5152-0.75762-2.0203-0.3788-1.0102-1.5152-0.88388-1.6415-0.75762-0.63135-1.1364-0.12627-0.88388,0.50508-2.1466,0.75762-3.283-0.25254-1.7678-0.50508-2.0203-1.2627-0.50508-0.50508,0.25254-0.63134v-1.1364l-1.389-1.2627-0.88389-0.50508-0.63134,0.37881-0.38556,0.10695-0.53571-0.35714,0.0893-0.89286,0.71429-0.625,0.0893-0.98214-0.89285-0.71429-1.7857-1.0714-0.98214-0.98215-0.26786-0.98214-0.71428-0.89286h-0.98215l-0.89285,0.625-0.625,0.0893-1.25-0.71429-1.4286-0.80357-1.3393-1.25-1.7857-1.3393-0.69-0.57,1.07-0.71,2.05-0.54,2.3214-0.71428,2.8571-2.0536,3.3036-1.6964z",
                            "name": "Костромская область"
                        },
                        "le": {
                            "path": "m153.49,177.57,1.7678-1.6415,1.5152,0,2.2728-1.894,2.5254-0.50507,2.2728,0.63134,2.9042,2.1466,2.7779,1.5152,0.75761,2.5254,0.12627,1.389,1.0102,1.1364,1.1364-0.37881,0.75761-2.0203-0.12627-2.3991-0.88388-1.6415-0.88388-1.894,0.12626-2.0203,1.1364-1.2627-0.25254-1.894-0.75762-1.0102,0-0.37881,1.2627-0.25254,3.283,0.25254,3.5355,1.2627,2.2728,0.12627,1.894,0.12627,1.2627,1.1364,0.63135,1.2627,0,1.7678-0.37881,1.6415-0.25254,2.1466-0.63134,1.7678-2.1466,1.2627-0.75761,1.0102-1.0102,1.894-1.0102,1.1364-1.7678,1.1364-0.63135,1.2627,0.25254,1.1364,1.389,0.75762,2.1466,0.25253,1.0102,0.88389,0.25254,1.6415,1.0102,0.75762,2.1466,0.12627,1.1364-0.50508,3.4093-0.25254,1.7678-0.63134,2.0203-0.25254,1.5152,0.75761,1.0102,1.6415,1.1364-1.2627,1.389-1.7678,0.75762,0.88388,0.50507,2.0203,0.63135,2.2728,2.1466,0.50507,1.2627,0.75762,1.1364,1.0102,0.12626,1.2627,0.12627,1.6415-0.12627,1.7678-1.2627,0.75761-2.2728-0.25254-1.389-0.88388-1.389-0.25254-0.75761,0.88388-1.5152,1.0102-3.0305,0-1.5152,0.3788-2.7779,3.0305-1.0102,1.389-0.37881,2.1466-1.6415,1.0102-1.1364,0.12627-0.3788,1.2627-1.2627,0.63134-0.63135-1.0102-1.1364-1.1364-2.2728-0.12627-0.75761,0-1.1364-3.0305,0-2.9042-1.0102-1.5152-0.88389-1.894-0.12627-1.6415-2.2728-0.88388-0.88388-0.63135s-0.37881-1.0102-0.37881-1.5152c0-0.50507-0.25254-3.4093-0.25254-3.4093l-0.75761-1.1364-2.3991-0.25254-1.389,0.75761-0.75762-0.50507-0.12627-1.2627-0.63134-0.88389-1.0102,0.63135-2.1466,0.3788-2.7779-0.88388-1.5152-0.88388-3.283-0.37881-1.2627-0.88388-1.0102-0.75762,0.63135-1.2627,0.88388-2.1466,0.88388-1.389,0.12627-1.2627z",
                            "name": "Санкт-Петербург и Ленинградская область",
                            "id": [30,14]
                        },
                        "ki": {
                            "path": "m237.59,265.33,1.2627-0.88388,0.12627-2.0203,0-2.0203-1.0102-1.389-0.12627-1.6415,1.5152-0.37881,3.9143,0.25254,2.5254-0.88388,2.6516-1.1364,0.63134-1.389,1.1364-0.63134,2.7779,0.25254,1.389,1.7678,0.12627,2.7779-0.63134,3.0305-1.0102,1.389-0.75761,2.7779-1.894,0.75762-2.0203,0.12626-1.6415,1.7678-0.63134,1.6415-1.0102,0.63134-0.75761,0.88389,0.75761,1.389,1.6415,0.88388,1.0102,1.389-1.6415,1.894,0.12626,1.894,1.1364,0.88389,1.2627,0.50507,0.88388-1.389,0.88388-1.894,2.7779,0,3.1567,0.3788,4.2932,1.2627,1.7678,2.2728,2.1466-0.12627,2.1466-1.6415,1.6415,0.37881,1.2627,1.0102,0.75762,1.894s1.0102,1.5152,1.389,1.7678c0.3788,0.25254,2.5254,1.894,2.5254,1.894l0.25254,1.5152-0.88389,2.0203-2.0203,1.1364-3.5355,0.25253-1.2627,0.63135-1.2627,1.5152-0.25254,1.389,1.0102,1.389,0.12627,1.1364-1.5152,1.1364-0.75762,1.389-0.12627,2.1466-1.2627,1.0102-2.7779,0.12627-1.1364-1.2627-1.0102-2.5254-2.0203-0.12627-1.389-0.3788v-1.894l-2.0203-1.1364-3.1567,0.75761-1.7678,1.389s-1.2627,1.0102-1.2627,1.5152c0,0.50508-0.3788,2.2728-0.50507,2.7779-0.12627,0.50508-1.6415,1.5152-1.6415,1.5152l-2.5254,1.1364-1.894-0.50507-1.2627-1.389-1.5152,0.25253s-0.75761,0.50508-1.0102,1.389c-0.25254,0.88389-0.12627,2.7779-0.12627,2.7779l0.12627,1.894-2.0203,0.63135-3.4093,0.3788-0.25254,1.1364v1.389l-0.3788,1.389-1.7678,0.88389h-0.63135l-0.63134-1.5152-0.50508-0.37881,0.12627-2.5254,0.25254-2.5254,0.50508-1.5152-0.88389-1.6415-0.25254-1.2627,0.75762-2.9042,0.63134-2.5254-1.0102-1.5152-1.6415-2.5254-2.1466-1.5152-0.88388-0.63134-3.9144-0.12627-1.7678-1.2627-1.6415-1.5152-1.6415-1.5152-0.50507-0.50508,0.50507-1.0102,1.2627-1.6415,0.25254-1.0102,1.1364-0.75761,1.5152,0.50507,1.894,1.389,1.389-0.75761,2.1466-0.63135,1.389-1.2627v-1.5152l-1.2627-1.894-0.63135-1.5152s-0.78918-1.1049-0.85231-1.2627c-0.0631-0.15784,0.56821-0.69448,0.56821-0.69448l0.97858-0.63135,0.75762-0.75761s2.2728-0.0316,2.8095-0.0316c0.53664,0,3.1567,0.0631,3.8828,0.0631,0.72605,0,3.7881-0.44194,3.7881-0.44194l1.4521-0.59978s0.12626-1.5784,0.15783-1.7993c0.0316-0.22097,0.47351-2.4938,0.47351-2.4938l2.0203-2.3991z",
                            "name": "Кировская область",
                            "id": [11]
                        },
                        "bs": {
                            "path": "m241.5,329.86,2.3991-1.6415,2.5254-1.6415,1.5152-0.25254,1.894,2.6516,2.2728,2.2728,2.9042,0,2.6516,2.5254,1.7678,2.5254,1.1364,1.7678,1.7678,0,1.2627,2.1466,2.6517,2.3991,2.2728,1.6415,2.0203,1.7678,1.2627,1.1364,0.88389,1.389-0.37881,1.1364-1.6415,0.63134-0.88388,1.2627,0.25254,1.389,1.389,0.63135-0.63135,1.2627-1.5152,0.50508-1.2627-0.75762-2.3991,0.37881,0,1.0102-1.5152-0.25254-0.50508-0.88388-1.5152-1.0102-4.5457,0-1.1364-0.37881,0-1.2627,1.7678-1.2627,0.12627-1.389-1.0102-0.88389-1.6415-1.1364-2.5254,0.25254-1.0102,2.1466-1.7678,2.6516-0.88388,2.0203,0.50508,3.0305,1.894,1.0102,2.0203-0.75761,1.6415,0.75761,1.0102,2.0203,2.5254,0.12627,2.0203,0.75761,2.7779,0,1.7678-0.50508,1.5152,1.1364-0.63135,1.389-1.894,1.5152-1.2627,1.1364-1.0102,1.389-1.2627,0-1.2627-0.63134-2.1466-0.75762-1.6415-0.3788-1.6415,1.2627-0.3788,1.5152-0.63135,1.389-2.3991,2.6516-1.6415,2.3991-3.9143,3.6618-1.894,1.5152-0.25254,2.0203-0.63134,1.5152-2.9042-0.25254-1.6415,1.7678-1.2627,1.389-0.50507,0.63135-2.0203,0-1.1364-2.0203-0.50508-0.63134-5.4296-0.63135-1.389-2.1466-2.7779,0.88388-1.2627-0.12627,0-0.50507,3.4093-4.4194,0-1.6415-0.88389-0.63134,0-1.1364,1.7678-1.1364,1.0102-1.389,0-2.0203-0.25253-0.50508-1.894-0.12627-2.2728,1.2627-1.7678-1.1364-1.1364-2.3991,1.2627-2.3991,1.0102-1.894-0.25254-2.5254,0-0.75761,0.88389-1.5152,0-3.1567-2.5254-2.9042-0.12627-2.0203,1.0102-2.6516,2.0203-4.1669,2.9042-2.1466,3.9143-3.1567,1.0102-2.1466-0.88389-1.389-0.12627-0.12627,0-0.75761,1.389-0.25254,2.3991,0.75762,1.389,0.12626,1.7678-0.63134,2.6516-0.25254,1.7678-0.12627,0.88388-0.63134,0-1.7678z",
                            "name": "Республика Башкортостан",
                            "id": [24]
                        },
                        "cl": {
                            "path": "m272.18,347.66,1.7678-0.88388,2.7779,0.50507,2.3991,2.1466,2.3991,1.7678,3.0305,1.894,2.9042,0,1.5152,1.6415,1.6415,2.3991,0.75761,1.894-0.63135,3.1567,0,2.7779-0.88388,1.389-1.7678,0.63135-1.6415,1.1364-0.75762,1.2627-2.0203,0.63135-1.894,1.5152,0,1.1364,1.5152,1.5152,2.0203,2.0203,1.1364,2.3991-0.37881,2.7779-0.75762,1.7678-2.3991-0.63135-2.6516-0.50507-3.283-0.37881-2.0203-0.50508-1.5152-1.7678-2.0203-1.7678-1.1364-1.1364-1.1364,0.50508-1.5152,1.1364-0.88388,1.0102,0,1.894,1.6415,1.2627-0.37881,0.75761-2.2728,0.63135v1.0102c0,0.50508,0.75761,2.0203,0.75761,2.0203l2.0203,1.7678,0.12627,1.894-1.5152,0.63134-1.5152-1.5152-1.389-1.2627-2.2728-0.63134-3.283,0.12627-1.5152,0.25253-0.63134,1.2627,1.0102,1.389-0.37881,1.894-1.0102,1.6415-4.5457,0.25254-1.6415-0.88389-1.6415-0.63134,0.50507-2.0203,1.6415-0.88388-0.75761-1.7678-2.0203-2.3991-1.6415-1.0102-1.894,0.12627-1.389-0.63135,0.63134-2.7779,1.7678-2.6516,4.4194-4.1669,3.7881-4.672,1.2627-2.9042,1.389-0.88389,2.5254,0.25254,2.0203,1.0102h2.0203l1.894-2.2728,2.2728-1.894,0.50508-1.389-1.5152-1.2627-2.1466,0.50507h-3.0304l-2.7779-0.88388h-1.5152l-0.88388-1.894-1.389-0.50507-1.7678,0.63134-1.0102-0.37881-0.88389-0.63134-0.63134-1.894-0.12627-1.6415,3.6618-5.6821,0.75762-0.63135,1.7678,0.37881,1.7678,0.88388,0.63134,1.1364-0.3788,0.75762-1.2627,1.1364v1.1364l-0.12627,0.12627,0.75761,0.63135,2.6516,0.12627h2.2728l1.5152,1.0102,1.2627,1.1364,1.1364-0.63135,0.50507-0.75761,2.0203,0.12627,1.7678,0.37881,1.1364-1.2627-0.37881-1.0102-0.75761-0.88388,0.25253-1.5152,1.5152-1.0102,0.63135-1.1364z",
                            "name": "Челябинская область",
                            "id": [41]
                        },
                        "ud": {
                            "path": "m261.7,302.33-0.12627,1.389-2.0203,2.7779-1.5152,1.389,0.12626,1.389-1.6415,1.0102-1.1364,1.5152-1.5152,2.3991-0.50508,1.894-0.50508,3.1567-2.0203,1.0102-2.2728,0.12627-0.63135,1.1364-0.37881,3.0304-0.12627,1.389-3.0304,2.0203-2.2728,1.389-1.0102,0-1.2627-1.5152-1.7678-0.75762-0.63134-1.2627,1.389-1.1364,2.0203-0.75761,0.50508-1.1364-0.37881-0.50508-1.5152-0.88388,0.25254-0.88389,2.7779-1.7678,1.0102-1.1364-0.50507-1.0102-0.75762-0.63134-2.0203,0.63134-1.1364,1.389-1.5152,0.63135-1.0102,0.25253-0.3788,1.5152-0.63135,0.75762-0.88388,0.25254-0.75762-1.0102-1.389-1.2627-0.75761,0.37881-1.2627,0.37881-0.88388-0.88389-0.63135-1.1364-1.0102-1.0102-0.63135-1.0102,0-1.1364,1.6415-0.88389,1.1364-1.1364,0.25254-2.0203,0.25254-1.0102,3.1567-0.50507,1.6415-0.50508,0.37881-4.4194s0-1.2627,0.63135-1.5152c0.63134-0.25253,1.2627-0.3788,1.2627-0.3788l1.2627,0.63134s1.6415,1.894,2.3991,1.389c0.75761-0.50507,1.894-0.88388,1.894-0.88388s2.3991-1.0102,2.2728-1.6415c-0.12627-0.63134,0.25254-1.6415,0.25254-1.6415l0.3788-1.389,2.1466-2.2728,1.2627-0.75761,2.2728-0.50508,1.6415,0.37881,0.88388,1.1364v0.75761l0.25254,0.63135,1.0102,0.12627,1.6415,0.3788,0.63135,0.50508,0.63134,1.6415,0.75762,0.75761z",
                            "name": "Удмуртская Республика",
                            "id": [37]
                        },
                        "pe": {
                            "path": "M272.06,274.03l-2.28,1.16,0.5,1.5-0.5,3.53,0.5,1.28,1.41,2.41,2.25,1.62,0.65,1.66-1.4,2.12-2.41,1.03-2.87,0.63-1.66,0.87-1.13,1.54,0.5,1.24,0.63,1.38-0.13,1.03-1.9,1.63-0.38,2.4-0.87,1.6-0.13-0.19-1,0.12-1.28,2.5-2,2.29-0.15,1.53-0.88,0.87-2,2.03-1.91,3.41-0.62,3.9-1.28,0.88-2.25,0.38-1.28,0.78-0.63,4.9,2.53,2.66,2.13,2.28,2.53,0.25,2.28,1.5,3.41,4.94,1,0.37,1.28-0.12,1.12-1.25,0.88-1.28,1.03-1.75,1.25-1.66,1.28,0.88,1.5,1.28h2.41l2.03-0.91,0.5-1.75,0.25-1.91,0.87-0.75,0.88-1,0.78-0.5,2.5,2.75h3.69l0.87-1,0.5-1.5,0.25-1.65,0.88-1.25,4.69-0.38,2.15-0.78,0.63-1.5-0.63-0.62-0.12-1.41,1.12-1.38,0.75-1.03v-1.37l-0.5-0.88-0.62-1.03,0.25-1.75,1-1.53,2.03-1.5,3.15-0.5,1.88-1.91,2.28-1.62,2.28-1.66,2.28-1.65,0.88-0.75,0.5-1.25,1-1.78s0.9-1.12,1.53-1.75c0.63-0.64,1.62-1.91,1.62-1.91l1.16-1.37,0.25-1.66-2.41-0.38-2.65-0.75-2.66-1.65-2.75-1.38-2.66-1.28-2.53,0.66-3.15,0.12-3.66-0.9-2.9-1.63-1.63,0.85-0.41-0.22-1.9-1.25-1.38-2.03-1.12-1.13-2.28-0.78-0.13-1.63-1.12-1.28-1.41-1.5-1.91-0.5-2.62-0.25-2.41-0.78z",
                            "name": "Пермский край",
                            "id": [22]
                        },
                        "sv": {
                            "path": "m316.13,291.72,1.7678-1.1364,1.1364,1.389,0.88388,2.3991,2.6516,1.5152,2.9042,2.1466,1.2627,2.3991,2.2728,2.7779,0.12627,1.7678,0.63135,2.0203,0.75761,1.5152-0.63134,1.7678-1.894,1.894-0.63135,1.7678-0.25253,4.7982,0.3788,2.7779,0.63135,1.0102-1.0102,2.9042-1.5152,1.7678-0.37881,2.3991,2.0203,1.2627,2.3991,2.0203,0.75761,2.0203,0.12627,2.6516-0.63134,1.6415,0,2.9042,0.75761,2.3991-0.25254,1.894s-0.88388,0.88388-0.88388,1.389c0,0.50508-0.50508,2.7779-0.50508,2.7779l-1.2627,1.2627-2.0203,0.12627-1.1364,0.88388h-3.0304l-1.5152-0.88388-2.1466,0.25254-1.389,1.1364-0.88388,1.389-0.25254,2.9042-0.75761,1.1364-1.1364,1.0102-1.7678,0.50508-3.0305,0.25254-2.0203,0.25254-1.0102,0.88388-1.894-0.37881-1.389-1.1364-1.894-1.894-2.5254-1.6415-1.5152-0.63135-2.2728,0.37881-1.894,0.3788-1.389-0.12626-1.6415-1.389-1.894-2.2728h-2.2728c-0.50508,0-1.6415-0.75761-1.6415-0.75761l-4.672-3.1567-1.6415-1.7678-2.9042-0.3788-1.389,0.12627-0.88389,0.12627-1.2627-1.2627-3.9143-3.283-3.1567-3.0305-0.50507-1.389,2.0203-2.9042,1.389-2.7779,0.75762-0.25253,1.6415,1.1364,1.1364,0.75761h2.7779l1.5152-1.389,0.50507-1.7678,0.12627-1.7678,2.5254-1.7678,1.7678,2.0203,1.2627,0.63134h2.3991l1.6415-1.1364,0.75761-2.0203,0.50508-1.894,3.7881-0.75762,2.5254-0.3788,1.389-1.2627v-1.0102l-0.88388-1.389,1.7678-2.1466,0.25254-1.1364v-1.389l-1.0102-1.6415,1.0102-2.5254,2.1466-1.6415,3.283-0.88388,1.1364-0.75762,8.0812-6.1872,0.88388-1.6415,1.6415-2.7779,2.1466-2.5254z",
                            "name": "Свердловская область",
                            "id": [32]
                        },
                        "ku": {
                            "path": "m285.69,383.01,2.3991,1.894,3.283,0.88388,4.2932,1.2627,3.1567,0.75762,4.1669-0.50508,2.5254,0.25254,2.9042,1.0102,3.5355,1.1364,3.5355,0.88388,3.283,1.0102,3.4093-0.12627,2.3991-1.2627,3.6618,0,1.0102-1.5152,0-1.894-1.5152-2.1466-1.389-2.7779s-1.5152-0.12627-2.1466-0.37881c-0.63135-0.25254-2.2728-1.6415-2.2728-1.6415l-0.75761-3.1567-1.389-1.7678-2.6516-1.2627-1.5152-1.6415-1.2627-2.2728-1.6415-1.5152-1.389-1.2627-1.0102-1.389,0.50508-2.3991,1.389-1.2627,1.1364-1.894-2.5254,0.37881-3.0305,0.12627-1.389,0.50507-0.75762,0.50508-1.2627-0.37881-2.0203-1.0102-1.7678-1.7678-2.0203-1.389-1.7678-0.75761h-1.2627l-3.0305,0.63134-1.7678-0.12627v1.1364l0.63135,0.88388-0.50508,2.2728v2.2728l-0.25253,2.1466-0.88389,1.1364-2.5254,1.1364-1.389,1.1364-1.5152,1.2627-1.7678,0.88388-0.50507,1.2627,0.63134,1.1364,1.894,1.894,1.389,1.389,0.63134,1.7678v1.894l-0.50507,1.7678z",
                            "name": "Курганская область"
                        },
                        "ko": {
                            "path": "m254.63,259.27,2.1466-0.63134,0.63134-0.88388,1.894,0.12627,1.6415,1.894,2.1466,0.25254,2.1466-0.50508,1.5152-1.894,0.50508-1.5152-0.63135-0.88389,0.63135-1.5152,2.1466-1.2627,4.5457-1.894,2.6516-1.1364,0.25254-1.5152-0.50508-2.5254-2.1466-0.88389-3.283,0.12627-2.3991,1.6415-2.3991-0.75761s-0.50508-1.0102-1.2627-1.0102-1.5152-0.25253-1.5152-0.25253l0.50507-3.0305,1.7678-0.37881,1.389-1.5152,0.50508-1.894,2.1466-0.50508,2.2728,0.12627,0.63135-1.7678-0.63135-0.63134-0.63134-2.1466,0.63134-1.389,4.5457-2.0203v-1.2627l-1.0102-2.5254-0.63135-1.6415-1.6415-1.7678-0.63134-1.1364,0.25254-1.6415,1.2627-0.63134,1.7678,0.75761,1.5152,2.1466,1.6415,1.5152,2.2728,1.894,2.6516,1.2627,1.7678,1.1364,0.50508,1.7678,1.5152,1.5152,3.1567,0.3788,1.894,1.2627,2.9042,0.50507,0.88388,1.2627h2.0203l1.0102-0.63134-0.25254-1.5152-0.75761-1.5152,0.50507-1.0102,0.88389-1.5152s0.25253-1.1364-0.12627-1.6415c-0.37881-0.50508-1.1364-1.1364-1.1364-1.1364v-0.88388l2.7779-3.283,3.1567-2.1466,1.894-2.0203,1.0102-0.88388,2.3991,0.63134,3.4093,0.12627,2.5254,0.75762,4.2932,0.50507,2.1466,0.63135,3.283,0.12627,2.3991-0.50508,1.5152,0.12627,0.12627,1.894,1.2627,1.0102,2.1466,2.1466,5.3033,4.672,7.4499,4.672,6.4397,3.7881,5.177,3.0305,5.5558,3.283,2.7779,1.894,2.2728,0.25254h3.283l2.1466-1.0102,2.5254-2.3991,1.6415-1.2627,2.7779,0.25253,2.3991-0.12626,2.0203-0.63135,1.5152-0.88388,1.6415-0.37881,3.1567,0.12627,1.6415,0.25254-0.50508,1.5152-0.88388,1.1364-1.1364,0.63134-0.50508,1.894,1.2627,1.7678,1.2627,1.389,0.12627,1.894-1.1364,1.389-0.88388,0.25254-0.75762,1.389-2.0203,0.25254-2.3991-0.12627-2.1466,0.88388-2.5254,1.389-1.389,1.1364-3.0305-0.12627-2.1466-0.50507h-3.1567-2.0203l-1.0102,0.3788-1.389,1.5152-0.75762,0.88389-2.1466,1.6415-1.5152,0.50508h-2.3991l-2.3991-0.25254-1.5152,0.50508-2.9042,2.0203-2.2728,1.2627-1.5152,1.0102-1.5152,0.3788-1.2627-0.12626-1.2627-1.0102-0.12626-1.894-0.63135-1.389-1.6415,0.88388-1.5152,1.389-1.0102,1.2627-0.88388,0.50508-1.2627,0.50507-0.75762,0.37881-0.12627,1.7678-0.3788,1.7678-0.63135,1.389-0.88388,1.1364-1.0102,1.6415-1.894,1.6415-1.6415,1.389-1.2627,0.75762-2.7779,3.283-1.894,2.6516-1.1364,3.0305-0.50507,1.6415-1.5152,1.6415-2.0203,0.88388-1.5152,0.63134-1.7678,1.0102h-2.2728l-3.1567-1.0102-3.1567-1.6415-4.4194-2.1466-0.75761-0.3788-2.5254,0.50507h-3.283l-3.0305-0.88388-2.9042-1.389-1.0102,0.25254-1.6415-0.12627-1.5152-1.2627-2.2728-2.3991-1.894-0.88388-0.63135-1.5152-2.2728-3.0305-5.8084-1.1364-1.389-0.63134-1.7678,0.63134-0.75761,0.75762v0.75761l0.37881,0.88389v1.6415,1.0102l-0.50508,0.3788-1.389-0.63134-0.88388-0.37881-1.1364,0.25254-1.5152,0.88388-1.5152,0.50508-1.1364-0.25254-0.88389-1.389-0.88388-0.63135-2.2728-0.88388-6.0609-1.1364-1.2627,0.25254-1.1364,1.1364-0.63135,1.5152-1.1364,0.37881-1.6415-1.389v-1.1364l1.0102-1.389,0.50507-0.75761-0.50507-1.0102-1.1364-1.0102-1.1364-1.0102-0.3788-0.75761,1.5152-1.2627,1.1364-2.5254,1.6415-1.0102,1.6415-0.3788,1.894-1.2627,0.88388-2.3991,1.2627-1.2627z",
                            "name": "Республика Коми"
                        },
                        "mu": {
                            "path": "m247.31,136.92,1.1364-1.5152,1.5152-0.75761,2.9042,0,4.2932,0.12626,2.1466-0.50507,2.5254-1.6415,0.88388-2.0203,0.12627-3.5355,1.5152-3.4093,1.0102-1.0102,4.7982,0,2.3991-0.63134,1.0102-1.2627,1.7678-0.12627,2.3991,1.0102,3.0305,1.894,2.2728,1.894,2.6516,0,2.2728-0.25253,0.25254,2.3991,1.894,0.3788,1.7678,1.0102,0,2.2728,0,1.7678-1.0102,0.63134-1.5152-0.3788-0.75761-1.1364-0.25254-0.63134-0.88388,1.0102-0.25254,0.63135,0.50508,1.1364,1.1364,0.88388,0.50507,0.75762-0.3788,1.0102-1.0102,0.63134,0,0.75762,1.1364,1.2627,0.88388,1.5152,0.88388,1.7678,2.0203,2.1466,0.75761,1.7678,0,1.7678,0,1.1364-0.50507,1.1364-0.25254,2.0203-0.12627,5.5558,0,5.5558-0.75762,1.389-0.25253,1.894,0.63134,0.88389,0.63135,1.0102-0.12627,4.0406,0,3.5355-0.63135,1.389-1.7678,1.1364-0.88389,0.88388,0,1.0102-0.25254,0.88389-1.1364,0.88388-2.7779,0.75761-3.6618,0.12627-3.1567,0.50508-1.6415,0.37881-2.5254-0.50508-2.0203-0.75761-1.894-1.389-1.894-2.2728-1.7678-2.2728-1.1364-1.894-0.63135-2.2728-0.3788-2.3991-1.2627-2.6516-1.1364-2.0203-0.3788-1.6415-0.37881-3.9143,0-1.7678,0-1.389-0.88388-0.88389-0.12627-2.9042,0-2.1466,0.75761-1.5152,0.12627-1.1364,0-1.5152-0.88388,0-0.63135,0.88388-0.88388,1.389-0.75762,1.894-0.25253,0.63135-3.5355,0-2.6516-0.25254-0.75761-1.5152,1.389-2.0203,1.1364-0.75761,0.25254-1.0102-1.7678-2.2728-1.5152-1.7678-1.2627-2.7779-1.2627-1.2627z",
                            "name": "Мурманская область"
                        },
                        "kl": {
                            "path": "M246.94,136.91l-2.28,1.53,0.12,1.62-1,2.28-1.9,2.04-1.88,0.87-4.31-0.13-0.88,1-2.28,2.16h-2.91l-2.4,0.38-0.13,4.03-0.62,1.9-2.91,0.38-1.87,0.25,0.12,1.4,0.88,1.5-1.78,1.29-1.25,0.5-3.41-0.91-1.66,1.16-0.37,2.9-0.13,4.16-1.25,2.28-2.65,1.62-3.41,1.16-8.72-0.12-3.53-0.91-5.19-0.75-4.28-0.75,0.88,1.87-0.13,1.54,0.07,0.53-0.94,5.65-2.53,1.5-2.03,3.32-2.91,1.87-0.13,1.66,2.66,1.25,1.91,0.75,1,2.4,2.9,0.25,5.07-0.75,1.65-0.9,2.25,0.53,1.78,1.37,1.38-1.62,1.12-0.78,1.78,4.69,1.5,0.62,2.91,1.53,0.06,0.69-0.12,2.69,0.06,1.78-1.63,1.53,1,1.12,2.29,0.5,1.75-0.62,2.53-1,0.62-0.5,1.91,1.5,1,1.9,1.03,1.88,3.16,0.25,3.28-3.03,0.75-1.5,1.25-1.38,2.4-1.28,2.03-1.75,0.5-1.15-0.37-1.25-1.91-0.63-1-1.03,0.13-1.63,1.37-2.4,1.78-1.91,1.66-1.87,1.25-2.16,1.38,0.25,1.78,1.53h1.9l0.88-0.53,0.12-2,1.5-2.03,0.25-1.75-0.25-3.16-0.5-1.53,0.63-1.78,1.4-0.87,1.38-0.63,3.03-2.53,0.5-1.13,0.53-1.28h1.38l3.4-0.62,2.16-1,1.5-1.28v-1.88-3.4l0.25-2.54,1.03-0.87v-1.16l-0.12-2-0.78-1.15-2-0.38-1.41-0.37-0.63-0.88v-0.75l0.63-1.15,1.28-1,0.75-0.63-0.38-1.03-1.65-2.37-1.88-2.29-1.4-2.15-1.75-2.53z",
                            "name": "Республика Карелия"
                        },
                        "vo": {
                            "path": "m215.36,208.76c0.12627,2.5254-1.389,5.0508-1.389,5.0508l-1.5152,1.894s-0.3788,1.0102-0.3788,1.7678c0,0.75762,0.12626,1.389,0.12626,1.389s0.63135,1.389,1.894,2.1466c1.2627,0.75761,2.0203,2.7779,2.0203,2.7779l1.0102,1.894,1.5152,1.2627,1.2627,1.0102,1.1364,1.894,1.2627,0.37881,3.1567,0.50508,1.5152,2.2728,1.0102,1.894,1.7678,0.63135,0.25254,0.63135,1.0102,2.2728,1.2627,0.75761,2.6516,0.25254,1.5152,0.12627,0.50507,2.7779,1.2627,2.0203,2.7779,1.389,1.389,0.12627,1.0102-0.63134,1.389,0.12627,1.0102,0.50507,0.75761,1.0102-0.63134,1.5152-0.75762,1.389,0.25254,0.75762,1.2627,1.1364,0.75761,0.50508,1.0102,0.50507,0.3788,0.63135v1.0102l-1.5152,1.5152-2.0203,0.63135-2.0203,0.75761-4.2931-0.25254-1.2627,0.88389,0.25253,1.1364,0.88389,1.2627v2.6516,1.1364l-1.0102,1.1364-0.75761-0.63134-1.1364-1.0102-0.37881-1.5152-1.0102-0.12626-1.6415,1.0102-1.0102,1.0102h-1.7678l-3.0305-1.5152-2.1466-2.1466-2.0203-1.1364-1.894-1.6415-2.0203-2.7779v-1.894l-1.894-2.7779-2.5254-2.2728-1.5152-2.0203-1.2627-1.7678-0.63135,0.75761-1.6415,0.12627-1.6415-0.25254-2.2728-1.894-0.88388-0.50508-1.2627,0.63135-2.7779,1.7678-0.63135,0.37881-1.2627,0.12627-0.88388-0.50508-0.50508-1.2627-0.63134-1.894,0.25254-4.0406-0.50508-2.5254-0.50508-1.2627-1.2627,0.12627-1.2627,0.37881-0.88388-0.25254-1.389-1.2627-1.6415-1.7678-4.0406-1.0102-1.2627-1.1364-0.50508-1.0102,0.63135-2.0203-0.50508-0.88388-1.0102-0.75761-1.1364-0.63135-1.894-0.37881-0.25254-0.12627,0.50508-2.7779-0.50508-1.6415-0.63134-1.2627-0.88388-0.88389-0.37881-0.50507-0.12627-1.0102-0.25254-1.5152,0.63135-0.88388,0.75761-0.88388,1.389-0.25254h1.6415l0.88388,1.2627,1.0102,0.88388,1.1364-0.50507,0.25253-1.1364,1.2627-0.25254,1.1364-0.63135,0.75761-1.1364,0.12627-1.5152,3.283-3.6618,1.2627-0.88388h1.7678l2.0203-0.37881,1.389-0.75762,0.88388-0.63134h1.1364l1.5152,0.88388h1.2627l0.88389,0.75762,0.50507,0.88388,1.389,0.63134h1.1364l1.389-0.3788,1.5152-0.50508,1.1364-0.37881,0.63135-0.25253,0.88388,0.12627,1.0102,0.88388,1.2627,1.6415,0.50507,1.2627z",
                            "name": "Вологодская область",
                            "id": [7]
                        },
                        "ar": {
                            "path": "M421.06,151.03l-3.56,1.06-2.16,0.91-3.56,0.19-1.59,0.87s-1.26-1.07-1.97-1.25c-0.72-0.18-0.91,1.1-0.91,1.1l-1.78,2.65-2.69,1.63-3.03,0.87-2.31,1.78s-2.15,0.37-3.22,0.72c-1.07,0.36-2.5,0.19-2.5,0.19l-1.59,0.72,1.06,1.78-2.16,1.25,0.38,0.72,1.25,1.44,1.78,1.59,1.78,1.78,0.91,1.63,1.4-0.72,0.91-1.97,2.16-0.72,1.25-0.53,1.93-0.19,0.91-1.59h1.97l1.25,0.87,1.59-1.25,1.1-1.25,2.65-0.15,0.72-0.57,3.41,0.72,1.78-1.06,0.34-1.44,2.69-0.34s1.07-0.01,2.5-1.44l0.72,1.06,2.84-0.68s1.98-0.19,2.69-0.19,3.03-0.38,3.03-0.38h2.31l2.35,1.25,1.78,0.91,1.25-0.72,0.72-0.87,4.28,1.06,1.97-1.44,3.22,0.19,4.09-0.72,1.25-1.59,1.97-2.88s-1.26-0.89-1.97-1.25-2.69-1.44-2.69-1.44l-3.22,0.57-4.43,1.59-4.32-0.91-2.5-0.15-3.18-0.72-1.63-0.91-1.59-1.78-1.44,0.72-1.97,1.06-2.5-0.15-3.22-0.91-2.5-0.72zm-35.53,14.47l-2.5,0.53-1.78,1.63-2.5-0.38s-1.44-1.06-1.44-0.34v1.78l0.72,1.59-2.12,1.25-2.88,1.1-1.06,1.25h-2.16l-0.72-1.1-1.59-0.87-2.69,2.12-0.15,3.03,1.93,2.69,1.44,2.16s1.26,2.14,0.91,3.03c-0.36,0.89-4.28,2.5-4.28,2.5l1.06,2.5,1.25,1.59v1.97l2.31,0.53,2.88,1.97,2.12,2.31,1.97,0.38s1.06-1.07,1.06-1.78c0-0.72-0.15-4.48-0.15-5.38,0-0.89,1.59-8.37,1.59-8.37l0.34-1.44,4.13-2.69s0.88-1.07,2.31-1.97c1.43-0.89,4.66-3.03,4.66-3.03l1.78-1.4s0.71-1.64,0-1.82c-0.72-0.17-1.62-0.53-2.16-1.25-0.53-0.71-3.03-2.65-3.03-2.65l-1.25-1.44zm-132.28,14.34l-0.63,0.63-2.28,0.25-0.87-0.13-1.78,0.91v1.38l-0.63,1.65-1.15,0.75-0.13,1.38,0.91,0.78,0.87,0.87-0.12,1.25-1.25,1.28-1.66,1.5-1.65,0.13-1.38-1-0.62-1.53-1.41-2-1.25-1.03-2.03,0.53h-1l-2.41-1.66-1,0.38-1.66,2.15-1.37,2-1.66,1.78-1.25,2.66,0.38,1,1,1.28,1.78,0.25,0.12,1-0.12,1-2.78,2.41-2.16,0.87-1.87,3.03-2.53,2.53-2.91,0.5-1.13,0.13-0.5,0.91-0.28,1.87-0.87,2.16-1.75,2.03-0.13,1.87,1.25,2.79,1.5,1.28,2.04,3.53,3.78,4.15,1.28,0.75,3.15,0.38,0.38,0.65,1.37,1.38,1.66,2.53,1.38,0.5,0.5,1.66,0.9,1.5,3.28,0.5,1.63,0.25,0.78,1.4,0.37,2.13,0.75,1.15,2.41,0.88,1.5,0.75,1.28-0.5,1.13-0.25,1.37,0.75,0.91,1.66-1.03,1.25-0.13,1.53,0.66,1,1.25,0.75,1,1.03,1.03,0.62,0.75-0.37,1.25-0.25,1.41,0.5,1,1.37,0.5,0.91,0.24,2,0.26,1.03h0.65l0.88-0.16,0.87-0.5,0.63-0.37h1.03l0.75,0.75,0.62,0.91,0.88,0.25,1.4,0.25,1.88-0.5,1.41-0.5,1.37-1.79v-0.87l-0.37-0.66-0.26-0.5,0.26-1,0.5-0.5,2.78-1.28,2.4-1,1.66-1.12,1.87-0.78,0.5-0.75,0.13-1.38-0.75-1.53-1.13-0.87-2.15-0.13h-1.5l-1.53,0.5-1,0.75h-1.28l-0.63-0.12-1-1.13-1.53-0.37-0.75-0.38,0.25-1.53v-1.13l1.66-0.5,0.74-0.78,0.76-0.87,0.62-1.63,0.53-0.37,1.5-0.53,1.78,0.25,1-0.5-0.12-1.38-0.5-0.87-0.5-1.66,0.25-0.88,0.87-0.62,1-0.53,1.41-0.63,1.37-0.75,0.38-0.75v-0.5l-0.88-1.9-0.75-1.41-0.9-1.62-1-0.75-0.63-1.28,0.38-1.88,0.62-0.5h1.28l0.88,0.38,1,0.87,1.41,2.16,2.65,2.37,1,0.91s1.65,0.49,2.28,0.75c0.63,0.25,1.38,1,1.38,1l0.5,0.62,0.37,1.03,0.53,1,1,0.63,1.38,0.37h1.41l1.12,0.53,0.88,0.88,2.03,0.5h1.37l0.28,0.88,1,0.53,1,0.25,0.88-0.54,0.78-0.74-0.13-1.26-1.03-1.03,0.38-0.87,0.78-1,0.37-1.53-0.25-1-1.15-0.75-0.13-1.28,0.91-0.88,3.15-3.28,1.88-1.12,1.91-1.79,0.25-1.25-0.63-0.5-1.65-0.9-1.63-1-2.16-0.25-1.25,0.62h-1.4l-1.5-1.12-1.03-1.78-0.75-1.75-1.5-3.16-1.41-2.28-0.75-1.41-0.88-2.25-0.12-1.15-2.41,0.25-0.75-0.63-1.53-1.12s0.25-0.5,0.88-0.5,1.02-0.41,1.53-0.66c0.5-0.25,0.25-0.87,0.25-0.87s-0.37-1-0.88-1.76c-0.5-0.75-0.77-0.77-1.28-1.15-0.5-0.38-0.75-1.75-0.75-1.75l-1.25-0.41-2.03-0.5-1.66,0.13-1.5,0.53-1.9,0.12-0.88-0.65-1.62-1-2.03-0.13h-2.78-2.53l-1.63,0.75-0.91,0.75-0.37,1.66-1.13,1.37-1.12,2.04-1.28,0.87h-2.41c-0.63,0-1.75-1-1.75-1l-1.03-1c-0.51-0.51,0-2.03,0-2.03s0.13-1.53,0-2.16-1.5-1-1.5-1l-2.03-0.87s1.65-0.78,2.16-1.16c0.5-0.38,0.37-1,0.37-1v-2.28c0-0.63-0.25-2-0.25-2l-0.75-1.91zm110.16,1l-0.19,1.1,0.53,1.78,1.44,0.72,0.53-0.72v-1.63l-0.38-1.25h-1.93zm-28.22,6.19l-2.35,0.78-1.4,2.07-2.88,1.43-0.25,1.07,1.78,1.43,2.13,0.97,3.22-0.44,3.5-0.9,0.25-1.6-0.78-1.96-1.1-1.88-2.12-0.97z",
                            "name": "Архангельская область",
                            "id": [2]
                        },
                        "tu": {
                            "path": "m329.02,389.7,2.0536,0.80357,2.1428,1.1607,1.6072,1.3393,1.6071,1.5179,1.7857,0.71428,2.3214,0.17858,0.89286-1.0714,1.6071-1.875,0.53572-2.3214,0.625-2.1429,2.2321-1.7857,1.875-0.44643,1.25-2.5,1.6964-1.0714,2.9464,0.26786,1.6071-1.6072s0.625-2.3214,0.53571-2.6786c-0.0893-0.35714-0.80357-2.5893-0.80357-2.5893l-0.89285-1.875-0.625-3.3036-0.71429-2.2322v-1.7857l1.5179-1.9643,2.2321-2.5,1.4286-1.4286,3.125-0.26786,0.35714,1.4286-0.89285,1.6071-1.6964,1.6964-0.17857,1.25,2.5,0.35714,4.0178,0.35714,1.9643,1.6072,3.0357,1.7857,1.5179-1.25,2.9464-0.17857,2.1429,1.4286,3.3928,1.0714s2.5-0.98214,2.9464-1.1607c0.44643-0.17857,3.5714-0.44642,3.5714-0.44642l0.89286-0.98215-0.53572-1.0714-1.6964-1.25-2.9464-2.2321-1.0714-1.4286s-1.6964-0.44643-2.3214-0.44643-2.6786-0.80357-2.6786-0.80357l-0.17857-2.6786-0.26786-2.4107-1.3393-1.3393-0.44642-2.2321-0.53572-3.5714-0.35714-0.89286-2.4107-2.7679-1.1607-0.71428s-2.6786-0.26786-2.9464-0.26786h-5.0893l-0.98215-0.26786s-0.625-1.5178-0.625-1.875c0-0.35714-0.98214-1.5178-0.98214-1.5178l-1.875-0.35715-1.25,1.25-2.4107,1.875-2.1429,0.89286h-3.0357l-4.6428,0.0893-2.9464,0.26785s-1.4286,0.53572-1.7857,0.625c-0.35714,0.0893-4.375,0.0893-4.375,0.0893l-3.0357-0.0893-1.4286,0.35715-0.89286,1.5178-0.53571,2.3214-0.89286,1.3393-2.3214,0.71428-1.6071,0.53572-1.5179,0.35714-1.7857-0.17857-1.3393-0.625-1.4286,0.17857c-0.35714,0.17857-1.6964,1.0714-1.6964,1.0714l-1.1607,2.1429-0.35715,2.4107-1.6071,2.3214-2.1429,2.5893-0.98214,1.5179,0.26786,1.25,0.71428,1.3393,1.5179,1.25,1.25,1.6071,1.6964,1.875,1.0714,1.6964s3.0357,0.98214,3.0357,1.5179c0,0.53571,1.6964,2.9464,1.6964,2.9464l0.625,1.875,1.6071,1.4286,1.875,0.71428,1.0714,0.80357,1.4286,2.3214,1.0714,1.4286v1.6072z",
                            "name": "Тюменская область",
                            "id": [36]
                        },
                        "ne": {
                            "path": "m290.27,198.54,1.6071-0.89286,1.4286-1.1607,2.0536-1.0714,1.1607-1.25,0.625-3.3929,1.1607-1.6071s1.4286-0.80358,2.4107-1.0714c0.98215-0.26786,2.3214-0.26786,2.6786-0.26786,0.35714,0,1.5178-0.98214,2.0536-1.5179,0.53571-0.53571,3.0357-2.5,3.0357-2.5l0.71429-1.0714v-2.2321l1.25-1.9643s0.89285,0.17857,0.98214,0.625c0.0893,0.44642,0.26786,1.5178,0.625,1.6964,0.35714,0.17858,1.875,1.4286,1.875,1.4286l1.6964,1.1607,0.98214,0.89286-0.0893,1.3393-0.625,1.4286-0.44643,1.7857v1.6964l-0.26786,1.0714-0.44643,0.80357-0.26786,1.25-1.25,0.71428-1.3393-0.625-1.25-0.98214-0.625-0.80357-2.3214-0.53572h-3.0357c-0.44643,0-2.1429,1.1607-2.1429,1.1607l-0.80357,1.4286,0.17857,1.0714s0.53571,0.89286,0.625,1.25c0.0893,0.35714-0.71429,1.1607-0.71429,1.1607l-0.89285,1.6072s-0.26786,1.1607-0.0893,1.4286c0.17857,0.26785,0.625,0.80357,1.1607,1.25,0.53572,0.44643,1.875,1.5178,2.1429,1.6964,0.26786,0.17857,1.875,0.89285,1.875,0.89285s2.3214,0.17857,2.8571,0.17857c0.53572,0,1.9643-0.26785,1.9643-0.26785s1.5179-0.98215,1.875-1.1607c0.35714-0.17857,1.9643-1.1607,1.9643-1.1607s1.0714-0.44643,1.4286-0.35714c0.35714,0.0893,1.3393,0.98214,1.3393,0.98214l2.3214,0.17857s0.35714-0.44643,0.71429-0.80357c0.35714-0.35714,0.53571-0.71429,0.98214-0.35714,0.44643,0.35714,1.875,1.3393,1.875,1.3393l1.7857,0.44643h5.0893l2.5893,0.0893s0.80357,0.80357,1.25,0.89285c0.44642,0.0893,3.3928,0.53572,3.3928,0.53572l1.5179,1.4286,0.71429,1.9643,1.1607,0.17858,0.71429-1.5179,0.89285-1.0714,1.875-0.17857,0.89286,0.53571,2.1429,0.17857,2.5893,0.44643-0.44643,0.80357-0.98214,0.80358-1.6964,0.625-0.80357,0.98214-0.71428,0.98214-1.6964,0.71429-0.26786,1.0714,1.3393,0.98214,1.25,0.53571,0.625,2.0536,0.71428,0.35715,1.6964-0.80357s1.3393-0.89286,1.6071-0.89286c0.26786,0,3.3036,0.53571,3.3036,0.53571l2.6786,1.3393,1.5178,1.3393,1.4286,0.89286,4.4643,0.17857,0.71429,0.71429,1.5178-0.26786,2.5893-0.35714,1.7857-1.3393,0.625-1.7857s0.53572,0.625,0.53572,1.1607c0,0.53572-1.6964,2.7679-1.6964,2.7679l-0.71429,1.7857v1.0714l-1.1607,1.1607-0.89286,0.625-0.44643,0.98214,0.44643,0.80357h1.4286l0.80357-1.6071,0.17858-0.53572,1.5178-0.0893,1.5179,1.25,2.3214,0.35714,1.1607-0.89286,1.3393-1.1607,0.53571-0.89286-0.71428-1.0714-0.35715-1.4286,1.5179-1.1607,0.71429-1.875-0.53572-1.6964-1.25-0.80357-0.71428-3.3929-0.26786-3.125s-0.26786-0.89286,0.0893-1.25c0.35714-0.35714,2.2321-1.6964,2.2321-1.6964l1.3393,0.17857,1.1607,1.4286,1.0714,1.9643,0.35714,2.1429-0.89286,3.3036,0.89286,1.0714,2.8571,2.4107,2.7679,2.8572,3.3929,2.5893,2.1428,3.3036,1.6964,3.3929,0.80357,1.875,0.17858,1.6071-1.0714,1.1607-0.98215,2.0536-0.98214,1.5179h-2.5c-0.44643,0-3.6607-0.17858-3.6607-0.17858l-2.1429,0.98215-2.7679,0.71428h-3.0357l-1.7857-0.17857-2.4107,1.875-3.0357,2.4107-1.6072,0.53571-2.7678-0.0893-2.0536-0.53571-4.2857-2.4107-23.036-13.929-7.6786-6.875-1.25-1.1607v-1.3393l-0.98214-0.625-2.4107,0.625-5.0893-0.44642-5.625-0.98215-5.1786-0.80357-3.125-0.26786-4.1071-2.3214-2.0536-0.44643-1.7857,0.625-1.7857-0.26786-1.5179-1.7857-4.2857-8.4822-0.98215-2.4107z",
                            "name": "Ненецкий автономный округ"
                        },
                        "om": {
                            "path": "m388.39,368.89,0.71428,2.5-1.25,1.6071-1.25,1.9643,0.53572,1.6071,0.71428,1.9643-1.25,1.9643s-1.0714,1.25-1.0714,2.1429c0,0.89286,0.17857,3.0357,0.17857,3.0357l1.7857,1.6072,0.35714,2.3214-0.53571,3.3929-1.9643,0.89286-1.25,1.6071,0.71429,2.3214-0.35715,1.9643-3.9286,0.17857s-1.4286-0.89286-2.3214-1.0714c-0.89285-0.17857-3.3928,2.8571-3.3928,2.8571l-2.5,2.1429-0.89286,4.2857,0.53571,0.89286,1.9643,2.1429,0.35714,2.6786-1.6071,2.6786-1.0714,1.7857-0.17857,3.0357-2.5,2.1429s-2.3214,1.0714-3.0357,1.0714h-4.8214l-1.6072-0.71428c-2.1428,1.4286-3.75,0-3.75,0l-1.6071-0.71429-1.9643-0.35714h-1.0714l0.35714-1.7857,1.7857-1.0714,0.71429-1.4286-2.3214-1.25-2.1429-2.3214-1.9643,0.89285-0.89286-0.71428v-3.75l-1.4286-0.89286-2.8571,0.35714-2.8572-0.89285-0.89285-0.53572-0.17857-2.1428,2.1428-2.6786,0.71429-2.3214,0.35714-2.6786v-4.1071l0.71429-2.1429,1.4286-3.9286,1.6071-2.5,2.3214-0.53571,1.0714-1.25,1.0714-1.7857,1.6071-0.89285h2.6786l1.6071-1.4286,0.89286-3.9286-1.4286-3.2143-0.71429-3.0357-1.25-3.3928,0.35715-1.6072,4.4643-4.6428,1.0714-0.89286h2.6786l0.17857,1.6071-1.25,1.6072-1.7857,1.25-0.17857,1.4286,1.4286,0.35714,3.2143,0.35714,2.3214,0.17857,2.1429,1.4286,1.9643,1.4286,1.0714,0.35714,1.0714-0.71429,1.9643-0.35714,2.3214,0.35714,3.5714,1.6072h2.5l2.1428-1.0714h2.1429z",
                            "name": "Омская область",
                            "id": [19]
                        },
                        "ht": {
                            "path": "m359.64,260.32,0,3.75-0.53572,3.2143-1.6071,2.3214-2.3214,2.3214-0.89286,1.25,1.9643,1.9643,1.7857,2.3214,5,1.9643,4.8214,0.17857,3.5714,1.4286,2.3214,2.6786,0,1.4286-2.1429,1.7857,1.4286,1.4286,2.3214,2.8572,1.9643,1.0714,2.1428-1.0714,1.7857-0.89286s1.6071,0.71429,1.9643,0c0.35715-0.71429,0.89286-2.1429,0.89286-2.1429l1.6071,2.1429,1.4286,2.8571,1.9643,1.6072s0.35714,2.1428,0.35714,2.8571v4.6429l1.9643,3.3928s0.35714,0.17857,0.71429,0.89286c0.35714,0.71429,0,2.1429,0,2.1429l1.0714,1.25,2.5,0.53571,3.75,0.71429,1.4286,0.89285s2.8571,2.1429,3.5714,2.6786c0.71429,0.53571,1.25,1.6071,2.1429,1.9643,0.89286,0.35714,3.5714,0.53572,3.5714,0.53572l2.8571,0.35714,0.89286,1.0714s0.35714,1.6071,0.71428,2.6786c0.35715,1.0714,1.4286,1.7857,1.4286,1.7857l3.0357,0.17857,1.7857,0.53572,0.35715,1.9643,0.35714,1.4286,1.0714,2.5c1.9643,0.17857,2.5,0.17857,3.5714,0.17857s3.3928,1.0714,3.3928,1.0714l1.9643,0.71428,2.8571,0.35714,2.8572-1.0714,3.2143-1.9643,3.0357,0.53571,1.9643,2.6786s0.35714,1.7857,1.0714,2.1428c0.71429,0.35715,2.8571,0.53572,2.8571,0.53572l2.3214,1.6071,0.71429,2.3214,1.9643,0.71428,2.6786-0.89285,1.9643,1.6071,1.0714,3.0357v2.3214l-0.35714,1.6072-0.53572,1.9643,3.0357,1.9643,2.5,1.7857,0.35714,2.3214v1.0714l-3.75,1.7857-2.6786,0.53572-3.2143,0.17857-3,0.15-1.61-1.07-1.7857-0.71428-2.3214,0.35714-2.3214,1.6071-2.6786,1.0714-2.1429-1.9643s-2.8571-0.35714-3.5714-0.35714c-0.71429,0-2.3214-1.7857-2.3214-1.7857l-0.89286-1.25-3.9286,0.17857h-3.5714l-1.6071-2.5s-1.25-0.89286-2.1429-0.89286c-0.89286,0-4.4643-1.25-4.4643-1.25l-2.5-2.3214h-1.25c-0.71428,0-2.3214,1.25-2.3214,1.25l-2.5,2.1429-1.7857,2.6786-2.8571,2.5-1.6071,3.3929-4.4643,1.6071-3.5714,0.89286-0.35714,2.1429-0.71429,2.1428-2.6786,1.25h-2.8571l-5.8929-5.5357-3.9286-0.89286-1.0714-1.4286-0.53571-4.1071-1.0714-1.25-1.0714-5.3572-0.53571-1.7857-3.5714-3.2143h-5.5357l-3.0357-0.35714-1.9643-2.8571-1.6071-0.53572-4.4643,3.0357-3.3929,0.71428h-5.1786l-5,0.71429-4.2857,0.53571h-3.5714l-1.4286-0.17857-0.53571-2.8571-0.35714-3.2143,0.89285-3.2143-0.89285-3.2143-2.3214-2.1428-1.0714-0.89286-1.0714-1.0714,1.25-2.6786,1.4286-2.3214-0.17857-2.1429-0.71429-3.2143,0.71429-5.5357,1.4286-1.7857,1.4286-2.1429-0.71428-2.3214-1.0714-3.5714-1.9643-2.6786-2.3214-3.3928-3.3928-2.1429-1.7857-1.9643-1.0714-2.6786,3.3929-2.1429,1.6071-2.6786,2.3214-4.8214,2.1429-2.6786,2.5-1.9643,3.5714-3.3929,1.6071-1.7857,1.7857-3.3929-0.17858-1.7857,0.89286-1.0714,2.1429-1.0714,1.4286-1.9643,1.6071-1.0714,1.25,0.17857,0.89286,2.3214,0.35714,1.0714,1.4286,0.35714,2.5-0.71428,3.0357-1.6071,1.4286-1.25,1.25-1.0714,2.5-0.53572z",
                            "name": "Ханты-Мансийский автономный округ",
                            "id": [40]
                        },
                        "ya": {
                            "path": "m396.25,234.25,1.4286,2.6786,1.6071,1.7857,1.6072,2.6786,1.0714,3.0357,0.89286,2.8572,3.0357,0.17857,1.7857-1.6072,1.4286-1.25-0.53571-3.2143s-0.89286-1.4286-0.53572-2.3214c0.35715-0.89286,1.7857-2.5,1.7857-2.5v-2.3214l-2.1429-1.6071-1.25-2.5s0.71429-1.6071,1.4286-1.9643c0.71429-0.35714,3.75-2.3214,3.75-2.3214s1.6071-3.75,1.9643-4.4643c0.35714-0.71429,0.35714-4.8214,0.35714-4.8214l0.89286-1.4286,7.5-2.1429,4.8214-3.5714,5.7143-6.0714,3.2143-2.1429,2.1428-0.71429,1.7857,2.3214,3.3928,0.35714,1.7857,1.25,1.0714,2.6786,0.17857,1.7857-0.89286,3.75-2.1429,2.6786-2.3214,2.8571-3.0357,1.6072-1.25,1.0714-0.35714,1.9643,1.0714,2.1429,0.17857,2.8571-0.89286,2.8571-2.1429,2.6786-1.7857,3.2143-2.6786,4.4643-1.25,3.5714-0.89286,2.1429-0.17857,2.5,0.35714,2.6786,0.71429,2.3214-0.71429,1.4286-3.0357,2.1429-1.0714,3.2143-0.89286,3.2143h-3.2143l-2.3214,1.25-2.1429,3.3929-3.5714,0.53571-2.3214,1.25-1.4286,1.4286h-3.5714l-1.4286-1.0714-1.0714-2.6786-0.71429,0.53572v1.6071l-1.9643-1.4286-0.71428-1.9643-1.0714,0.71429-0.17857,1.9643,1.7857,2.1428,2.5,2.1429,2.5,1.25,3.2143,1.0714,2.1429,1.25,2.1428-0.89286,3.5714-1.7857,3.0357-0.71429,3.75-1.0714,2.3214-3.0357,3.2143-2.6786,3.3929-1.6072,2.1428-1.7857-0.17857-2.1429-0.89286-2.3214-0.17857-1.7857,2.1429-2.1429,4.2857-0.89285h3.3929l1.4286,1.4286,1.25,3.0357v2.8571,3.0357l-1.6071,1.4286-1.25,2.5,0.17857,3.5714,1.7857,1.25,3.2143,0.71428,2.1429,2.8572,1.9643,3.2143,0.53572-0.71428-0.53572-4.1072-2.5-3.2143-3.75-1.0714v-2.8571l2.3214-3.0357s1.7857-0.35714,1.9643-1.0714c0.17857-0.71428,0.17857-3.5714,0.17857-3.5714l-0.89286-3.9286-2.6786-2.6786-2.6786-3.2143-0.89286-1.4286h-2.1428s-0.53572,1.25-1.4286,1.25c-0.89285,0-2.6786-1.25-2.6786-1.25l-1.6071-1.0714-0.53571-2.5,1.4286-3.75,2.3214-3.2143,2.1428-2.6786,3.0357-1.25,0.17857-4.4643-0.17857-3.0357v-3.0357l0.17857-2.3214,1.7857-2.3214,1.4286-1.4286,2.1429-0.35715,3.2143-0.53571,2.3214-2.5,1.7857-1.0714,1.25,2.1429-1.9643,2.3214-0.89285,1.4286-1.0714,4.4643-1.25,2.5,1.25,1.7857,2.6786,2.1429h2.8571l1.4286,2.1428,2.3214,2.5,1.7857,0.35715-1.4286-2.1429v-2.5s-1.25-1.25-1.9643-1.6071c-0.71429-0.35715-3.5714-2.8572-3.5714-2.8572l-1.25-3.5714-0.17857-1.4286s1.9643-0.71428,2.6786-0.71428c0.71429,0,3.2143,0.89285,3.2143,0.89285l0.89285,1.7857,1.6072,0.17857,1.25-0.71429-0.35715-1.9643,0.17858-1.9643,1.4286-0.35714,1.6071,0.71429,1.7857,1.4286,1.25,1.0714,0.89286,1.7857-0.35714,1.7857-2.3214,2.5-3.0357,1.25,1.0714,1.4286,2.6786,2.1428,0.35714,2.8572,0.17857,3.3928-0.71429,2.6786-2.5,1.4286-2.6786,1.4286-3.5714,1.7857-2.1428,2.1429,0.35714,2.6786,1.4286,2.5,1.25,2.5,1.6071,1.0714h3.3929,2.5l1.7857,1.6071,0.53571,3.0357,0.17857,3.3928v2.8572l-1.9643,3.2143-1.7857,2.5h-2.6786l-0.71429,0.53572,0.53572,1.9643,0.71428,1.7857-0.53571,2.5-0.89286,1.25,2.3214,3.3928,0.53572,1.7857,0.35714,1.7857-1.25,1.7857-1.0714,1.25,0.89286,2.1428-0.17857,2.5-1.6072,1.6072,1.6072,1.7857,2.1428,1.9643,1.6072,1.4286-0.17858,3.3928-1.4286,2.3214-0.17857,2.6786,2.3214,2.1429,4.6429,0.89286,0.89285,1.4286-1.4286,2.1429-0.53571,3.3928-0.89286,2.3214-2.6786,1.4286s-0.89286,0.53572-1.6071,1.0714c-0.71429,0.53572-1.7857,2.8572-1.7857,2.8572l1.9643,1.7857,0.17857,2.3214-1.4286,2.1429-1.25,2.5-2.6786,2.3214-2.8572,2.8572-0.89285-1.7857-1.6072-2.1428-1.7857-1.0714-1.9643,0.71428-1.9643-0.71428-0.71429-1.6072-1.25-1.25-2.5-0.89285-2.1428-0.89286-0.71429-1.6071-0.89286-1.7857-1.4286-1.4286-2.8571-0.17857-2.5,1.4286-2.5,1.0714-2.6786,0.17857-4.1072-1.6071-3.5714-0.35714-2.1429-0.17858-0.89286-1.9643-1.0714-2.3214v-1.4286l-3.3928-0.71429-2.3214-0.53571-0.89286-2.5-0.71429-2.3214s1.4286-0.17857-1.0714-0.35714-5.5357-1.0714-5.5357-1.0714l-1.4286-0.53572-3.2143-2.5-2.5-1.6071-2.8572-1.0714-3.2143-1.25-1.25-0.89285-0.17857-2.1429-2.8572-3.9286,0.17857-6.7857-1.25-1.7857-2.3214-2.8571-1.0714-2.1429-0.53572-0.53572-1.0714,1.25-0.53571,0.71429h-1.4286l-2.6786,0.89286-1.25,0.35714-1.6072-0.35714-2.1428-2.3214-1.7857-1.6071,0.53572-0.89286,1.4286-1.6071-0.35714-1.7857-2.5-2.3214-3.0357-1.4286-4.2857,0.35714-3.0357-1.25-2.6786-0.89285-3.3929-4.2857,2.3214-2.5,2.5-3.75,0.17857-5.3571,0.35715-1.4286,3.75-1.0714,2.6786-2.5,1.4286-1.4286h3.75,3.3929l3.9286,0.53571,1.7857-1.25,3.5714-1.6071,3.3929-0.53571,2.5-1.25,2.3214-1.25,0.35714-2.8572-2.1429-2.3214-0.71428-1.25,0.53571-1.6071,2.3214-1.4286,0.35714-1.25,1.92-2.87z",
                            "name": "Ямало-Ненецкий автономный округ"
                        },
                        "kr": {
                            "path": "M531.66,122.41c-0.45,0.04-1,0.37-1,0.37-0.9,0.72-1.25,0.77-0.94,1.13,0.31,0.35,0.19,0.55,0.9,0.78,0.72,0.22,0.91,0.49,1.44,0,0.54-0.49,0.77-1.24,0.41-1.69s-0.37-0.64-0.81-0.59zm11.56,0.65c-0.22,0.02-0.44,0.11-0.6,0.38-0.31,0.53-0.49,1.57-0.62,1.84s-0.2,0.74-0.78,0.88c-0.58,0.13-1.39,0.54-1.75,0.09s-1.03-1.51-1.25-1.69-1.04-0.74-1.13-0.03c-0.09,0.72,0.19,1.51,0.19,1.91s-0.18,0.99-0.4,1.12c-0.23,0.14-1.06,0.25-1.29,0.56-0.22,0.32-0.62,0.49-0.62,1.16s-0.27,1.67-0.31,1.94c-0.05,0.27-0.32,0.26-0.63,0.75s-1.09,1.87-1.09,1.87,0.89,0.62,1.15,0.85c0.27,0.22,0.42,0.77,0.38,1-0.05,0.22-0.13,1.05-0.53,1.19-0.4,0.13-1.43,0-1.78-0.13-0.36-0.13-1.01-0.48-1.5-0.44-0.49,0.05-1.01,0.23-1.19,0.63s-0.71,0.38-0.13,1.18c0.58,0.81,0.87,1.53,1,1.76,0.14,0.22,0.29,1.51,0.07,1.87-0.23,0.36-1,1.13-1.22,1.53-0.23,0.4-0.44,0.71-0.22,1.16,0.22,0.44,0.66,0.8,1.15,0.94,0.5,0.13,3.66,0.71,3.66,0.71s0.28-0.36,0.81-0.71c0.54-0.36,1.36-0.77,1.85-0.41s0.52,0.8,0.65,1.25c0.14,0.45,0.41,2.02,0.5,2.37,0.09,0.36,0.49,0.58,0.94,1.16s1.59,1.37,2.22,1.59c0.63,0.23,1.05,0.55,1.72,0.6,0.67,0.04,2.85,0.82,2.94,1.09s0.31,1,0.31,1,0.54,0.52,0.81,0.56c0.27,0.05,2.22,0.19,2.22,0.19,1.38-0.76,2.23-0.8,2.5-0.94,0.27-0.13,0.84-0.03,1.37-1.06,0.54-1.03,0.76-1.35,0.63-2.06-0.13-0.72-0.34-0.93-0.87-1.6-0.54-0.66-1.5-1.24-1.1-1.56,0.4-0.31,1.56-0.8,1.88-1.15,0.31-0.36,0.54-1.32,0.4-2.35-0.13-1.02-0.15-2.5-0.47-2.9-0.31-0.41-0.73-0.92-1.4-1.19s-1.23-0.67-1.81-0.53c-0.59,0.13-1.92,0.25-2.19,0.03s-0.62-0.83-0.85-1.5c-0.22-0.67-0.5-1.13-0.5-1.53s1.16-3.63,1.16-3.63,0.71-0.29,0.84-0.56c0.14-0.27,0.36-0.76,0.22-1.66-0.13-0.89-0.39-1.55-1.28-2.09s-2.09-1.72-2.09-1.72v-0.97c0-0.35-0.15-1.73-0.28-2-0.14-0.27-0.48-0.72-0.97-0.72-0.25,0-0.5-0.05-0.72-0.03zm17.72,22.91c-0.13,0.02-0.25,0.07-0.35,0.19-0.4,0.44-0.72,1.12-0.9,1.34s-0.51,0.09-0.91,0-0.89-0.43-1.16-0.03c-0.26,0.4-0.67,0.74-0.71,1.19-0.05,0.44,0.09,1.75,0.09,2.46,0,0.72,0.09,1.8,0,2.6s-0.2,1.3-0.78,1.66c-0.58,0.35-0.91,0.4-1.31,0.93-0.41,0.54-1.13,1.25-1.13,1.88,0,0.62,0.06,1.45-0.66,2.03-0.71,0.58-1.14,0.56-0.96,1.4,0.17,0.85,0.22,0.93,0.84,1.38s2.79,0.63,3.28,0.5,1.26-0.77,1.66-1.22,1.61-0.99,2.28-1.12c0.67-0.14,1.17-0.08,2.16-0.13,0.98-0.04,1.54-0.39,2.03-0.65,0.49-0.27,0.54-0.54,1.43-0.54,0.9,0,1.74,0,2.1-0.31,0.35-0.31,1.35-1.19,1.62-1.5s0.88-1.05,0.97-1.5,0.18-1.3,0-1.75,0.15-1.15-1.19-1.28-1.57,0.07-1.84-0.38c-0.27-0.44-1.03-0.88-1.03-1.37s0.08-1.02-0.19-1.37c-0.27-0.36-0.79-0.81-1.28-0.72s-1.31,0.58-1.53,0.62c-0.22,0.05-0.71-0.09-0.85-0.4-0.13-0.32-0.21-1.11-0.21-1.91s-0.25-1.63-0.25-1.63c-0.34-0.13-0.83-0.43-1.22-0.37zm5.22,20.03c-0.62,0.05-1.16,0.75-1.16,0.75s-1.62,1.95-2.16,2.84c-0.53,0.9-0.86,1.08-1.93,1.25-1.08,0.18-1.82,1.63-1.82,1.63s-0.51,1.23-0.68,2.12c-0.18,0.9-1.25,3.07-1.25,3.07v1.93l0.87,1.63s1.6,1.05,1.78,2.12c0.18,1.08-2.12-0.68-2.12-0.68s-2.14-0.73-3.03-0.91c-0.9-0.18-1.64,0.01-3.07,0.19-1.42,0.18-1.25,0.34-1.25,0.34l0.72,1.63s1.61,1.4,1.25,2.65c-0.35,1.25-1.4-0.53-1.4-0.53l-1.97-0.87s-1.98,0.16-2.88,0.87c-0.89,0.72-1.25,0.91-1.97,0.91-0.71,0-1.59-0.71-2.12-1.78-0.54-1.08-0.91-0.91-1.63-1.44-0.71-0.54-3.2,0-4.09,0s-2.32,1.79-3.75,1.97-1.78,0.53-1.78,0.53l0.34,2.12-1.97,1.1-2.12,0.53-2.16,0.53c-0.71,0.18-2.12-0.19-2.12-0.19l-1.97-0.34-1.44,0.87-0.53,0.57-2.84,0.15-2.16,0.91s-2.49,2.13-4.09,2.31c-1.61,0.18-0.19,0.53-0.19,0.53s1.06,0.91,1.06,1.63c0,0.71-0.7,0.87-0.87,1.4-0.18,0.54-1.45-0.33-2.35-0.68-0.89-0.36-1.25,0-1.25,0s0.2,1.04,0.38,1.93c0.18,0.9,1.06,1.28,1.06,2.35s-0.19,2.12-0.19,2.12,0.53,2.69,0.53,3.41v2.69c0,0.89-0.87,1.59-0.87,1.59s-1.25,0.72-3.03,0.72c-1.79,0-0.91-0.72-0.91-0.72l0.72-0.91-0.53-1.4-1.97-0.38-2.31,1.25-1.78-0.53h-3.22-3.94c-1.43,0-1.95-1.07-2.84-1.25-0.9-0.18-2.88-0.34-2.88-0.34s-2.14-0.02-3.03,0.34-1.97,1.06-1.97,1.06v3.07,3.03s-1.6,0.69-1.78,1.4c-0.18,0.72,0.01,2.68,0.19,3.75,0.18,1.08,1.05,0.72,2.12,1.25,1.07,0.54,2.16,1.25,2.16,1.25l0.53,0.57,0.34,1.78s0.57,1.94,0.57,2.65c0,0.72,1.25,1.97,1.25,1.97s0.68,1.63,0.68,2.35c0,0.71-0.51,1.22-0.87,1.93-0.36,0.72-0.73,1.61-0.91,2.5-0.18,0.9,0,2.16,0,2.16l0.38,2.84s-0.2,2.88-0.38,3.6c-0.18,0.71-0.89,1.42-1.78,1.78s-1.25,2.12-1.25,2.12,0.01,2.7,0.19,3.6c0.18,0.89,0.88,1.42,1.59,1.78,0.72,0.36,1.25,1.78,1.25,1.78l-0.87,1.78-1.78-0.34-1.44-1.78-0.91-1.82v-2.5s-0.54-1.76-1.97-2.65c-1.42-0.9,0.19-1.63,0.19-1.63s1.08-1.25,1.44-1.97c0.36-0.71,1.06-1.78,1.06-1.78s1.8-1.6,2.16-2.5c0.35-0.89-0.38-1.4-0.38-1.4l-1.06,0.68-1.78,1.82-1.78-0.91s0.69-1.25,0.87-1.78c0.18-0.54,0.54-1.79,0.72-2.5,0.18-0.72,0.35-1.6,1.06-2.31,0.72-0.72,2.35-0.19,2.35-0.19l1.25-1.25v-1.63l-1.1-1.59s-1.4-0.17-3.9-0.34c-2.5-0.18-0.72-1.25-0.72-1.25l-0.72-1.82s-0.72-1.76-1.44-2.12c-0.71-0.36-1.94-3.04-2.65-3.75-0.72-0.72-1.1-1.44-1.82-2.16-0.71-0.71-2.11-1.78-3.18-2.5-1.08-0.71-1.97-1.4-1.97-1.4l-1.63,0.34s-1.05,1.07-0.15,2.5c0.89,1.43,1.06,1.44,1.06,1.44l1.25-0.28,0.97,0.18,1.22,0.5,1.15,1.07,1.06,0.71,0.91,1.07,0.53,0.9,0.1,0.94-0.6,1.63-1.68,1.84-1.29,0.81-1.93,0.88,0.81,1.15s2.04,1.71,2.22,1.85c0.18,0.13,0.69,0.9,0.69,0.9l0.31,2.85,0.09,2.59s-0.33,2.1-0.37,2.28c-0.05,0.18-0.63,0.88-0.63,0.88l-7.09,3.97-1.44,0.9-1.25,0.94-0.66,0.81s0.3,2.37,0.35,2.6c0.04,0.22,0.64,1.18,0.69,1.4,0.04,0.23,1.28,2.69,1.28,2.69s1.15,1.2,1.46,1.69c0.32,0.49,2.16,0.31,2.16,0.31h3.44c0.4,0,1.34,0.5,1.34,0.5s1.3,0.98,1.35,1.16c0.04,0.17,0.37,1.31,0.37,1.31l0.38,3.34s0.09,3.42,0.09,3.69-0.5,1.56-0.5,1.56l-0.34,1.22c-0.04-0.01-0.07-0.03-0.1-0.06l-1.15,2.06-1.82,1.69-1.68,0.28-1.6,0.28,0.16,1.41s1,1.98,1,2.34-0.01,1.68-0.19,2.13c-0.18,0.44-0.81,1.68-0.81,1.68l0.47,1.19,1.15,1.69,0.88,2.41,0.47,1.68-1.16,1.97-1,1.63,0.72,1.93s0.08,1.53-0.09,1.97c-0.18,0.45-1.07,1.16-1.07,1.16l-0.43,1.19s4.1,3.63,5,4.53c0.89,0.89,0.15,1.52,0.15,2.06s-0.72,2.5-0.72,2.5l-1.25,2.22,0.1,1.87s1.54,1.46,1.72,1.82c0.17,0.35,1.68,0.78,2.22,0.87,0.53,0.09,2.78,0.38,2.78,0.38l1.25,1.31-0.19,0.81-1.16,1.63-0.72,3.28s-0.8,2.07-1.15,2.34c-0.36,0.27-1.44,1.16-1.44,1.16l-2.22,1.15-1.72,2.41,0.38,0.97,1.34,1,0.25,1.78-0.81,1.78-1.25,2.78-1.5,1.41-2.31,2.34-1.72,1.6-1.5,2.25s-0.9,2.92-0.81,4c0.08,1.07,0.96,0.72,0.96,0.72s1.62,1.07,2.16,1.34,1.51,0.99,1.78,1.34c0.27,0.36,1,1.24,1,1.69v1.53l-0.81,0.88-1.25,0.81-3.41,1.25-1.69,0.34-2.4-0.25s-1,0.43-0.91,0.78c0.09,0.36,0.72,1.63,0.72,1.63s0.45,1.24,0.63,1.69c0.17,0.44,0.27,0.88,0.72,1.06,0.44,0.18,0.09,2.97,0.09,2.97s-0.89,2.3-1.16,2.75c-0.27,0.44-0.46,1.25-0.37,1.87,0.09,0.63,0.72,1,0.72,1s1.7,0.69,2.06,0.78,2.94,1.1,2.94,1.1,3.13,0.72,3.84,0.72,2.58,0.06,3.56,0.15,2.5,1,2.5,1,1,0.87,1.53,1.41c0.54,0.53,0.25,4.64,0.25,5s2.88,0.19,3.5,0.28c0.63,0.09,2.32,0.81,2.32,0.81s0.43,1.33,0.43,1.69-0.43,1.88-0.43,1.88l-1.78,0.9-3.47,1.5-0.57,1.06s-1.13,4.74-1.4,5.19,0.53,1.88,0.53,1.88l1.5,0.62,2.25,1.06s3.47,2.25,4.09,2.79c0.63,0.53-0.09,0.96-0.09,0.96l-0.97,1.82-5.44,4.72-0.72,1.96-0.18,1.5s-0.44,3.58-0.44,3.94,0.34,1.53,0.34,1.53,1.81,1.15,2.25,1.5c0.45,0.36,1.88,1,1.88,1l0.72,1.41s0.79,1.54,1.06,2.34c0.27,0.81-0.72,0.97-0.72,0.97l-3.56,2.94-1.97,0.91s-1.35,1.33-1.44,1.87,0.81,0.97,0.81,0.97l0.97,1.44,1,1.34s1.95,0.73,2.75,0.91c0.81,0.17,1.63-0.57,1.63-0.57s1.42-1.95,2.4-2.22c0.99-0.26,0.53,0.46,1.07,0.72,0.53,0.27,1.96,0.61,2.59,0.88s2.22,1.34,2.22,1.34l0.81,2.06,1.78,7.41,0.82,2.5-1.26,4.13s0.1,2.05,0.19,2.4c0.09,0.36,0.8,1.24,1.07,1.6,0.26,0.35,0.43,2.15,0.43,2.15l-0.97,1.35-2.4,1.5-1.1,1.78s-2.3,3.32-2.65,3.59c-0.36,0.27-2.06,1.14-2.6,1.41-0.53,0.27-2.06,1.44-2.06,1.44s0.27,1.06,0.63,1.15c0.35,0.09,0.53,2.16,0.53,2.16l0.81,1.06,1.88-0.44,3.21,0.78,2.5,0.91s1.25,0.88,1.79,1.06c0.53,0.18,3.4-0.44,3.4-0.44s5.87-2.32,6.31-2.59c0.45-0.27,1.72-1.06,1.72-1.06s2.5-1.89,3.03-2.25c0.54-0.36,3.74-2.14,4.1-2.41,0.35-0.27,1.44-1.78,1.44-1.78l0.9-2.12s0.16-1.99,0.25-2.44,0.53-1.5,0.53-1.5l0.72-1.25,2.16-0.19,3.12,0.44,2.32,0.19s3.57,0.1,4.37-0.35c0.8-0.44,0.45-0.72,0.63-1.34,0.17-0.63-0.27-0.9-0.63-1.35-0.36-0.44-1-1.33-1.53-1.78-0.54-0.44-1.25-1.15-1.25-1.15s-2.31-4.22-2.31-4.75c0-0.54,0.81-1.15,2.15-1.69s3.91-0.97,3.91-0.97l2.06-1.19-0.09-2.65,0.47-1.78s1.16-2.8,1.25-3.07c0.09-0.26,1.51-2.93,1.68-3.56,0.18-0.62,0.62-1.79,1.07-2.59,0.44-0.81,1.62-1.68,2.15-2.03,0.54-0.36,1.68-1.91,2.13-2.44,0.44-0.54,1.09-2.22,1.09-2.22l-0.19-4.09s-2.13-2.42-2.4-3.22c-0.27-0.81,0.07-1.43,0.34-1.78,0.27-0.36,1.61-1.88,1.97-2.5,0.36-0.63,0.81-2.53,0.81-2.97,0-0.45,0.98-1.5,1.88-2.13,0.89-0.62,2.83-0.18,3.28,0s1.09,0.81,1.72,1.35c0.62,0.53,3.28,0.68,3.28,0.68s1.07-1.42,1.25-1.87,0.98-1.77,1.25-2.22,1.53-1.07,2.25-1.16c0.71-0.09,1.69,0.63,1.69,0.63s0.97,1.78,1.15,2.31c0.18,0.54,1.18,1.61,1.53,1.97,0.36,0.36,1.26,1.8,1.35,2.16,0.09,0.35,1.06,0.33,2.22,0.15s0.09-1.4,0.09-1.4v-2.16s-0.62-2.16-0.62-2.78c0-0.63,0.71-1.78,0.71-1.78s2.5-0.8,3.03-1.06c0.54-0.27-0.08-1.17,0.1-1.97,0.18-0.81,1.33-1.7,1.69-1.88,0.35-0.18,2.96-0.61,3.4-0.87,0.45-0.27,1.41-1.25,1.41-1.25l0.62-2.69,0.28-2.88s-0.02-0.11-0.03-0.12c0.09-0.06,0.32-0.22,0.32-0.22l1.31,0.19s0.6-0.58,1.31-0.94c0.72-0.36,0.79,0.03,0.97,0.03s0.68,1.11,0.81,1.47c0.14,0.36,0.36,1.26,0.41,1.53,0.04,0.27,1.38,0.68,1.56,0.72s1.55,0.47,1.81,0.56c0.27,0.09,1.66,1.08,1.97,1.44,0.32,0.36,1.04,0.45,2.38,0.94s1.53-0.28,1.53-0.28l0.65-0.63s0.23-1.4,0.32-1.94c0.09-0.53,0.72-0.87,0.72-0.87s1.51-1.22,1.87-1.63c0.36-0.4,0.5-0.87,0.5-0.87s0.34-2.99,0.16-3.13c-0.18-0.13-1.38-0.71-1.78-0.84-0.41-0.13-1.6-1.46-2-2.13-0.41-0.66,0.3-1.16,0.43-1.43,0.14-0.27,1.41-1.06,1.63-1.28,0.22-0.23,1.06-0.78,1.59-1,0.54-0.23,0.27-2.9,0.22-3.35-0.04-0.44-0.7-0.44-1.81-0.62-1.12-0.18-1.97-0.85-1.97-0.85s-1.52-1.52-2.19-2.28-0.22-2.76-0.22-3.03,0.17-4.1,0.13-4.9c-0.05-0.81,0.54-1.63,0.72-1.85s2.37-0.49,2.59-0.53,1.9-0.99,2.35-1.34c0.44-0.36,0.59-1.19,0.59-1.19s-0.37-1.3-0.5-1.75c-0.14-0.45,0.72-1.65,1.03-1.88,0.31-0.22,1.91-1.37,1.91-1.37s1.07-6.86,1.25-7.13c0.17-0.26-0.32-1.59-0.32-1.59s-1.19-3.62-1.28-3.84c-0.09-0.23-0.68-1.65-0.5-2.32s1.27-1.02,1.41-1.25c0.13-0.22,0.07-0.97-0.16-1.15-0.22-0.18-1.03-1.16-1.03-1.16s0.58-3.41,0.63-3.81c0.04-0.4,0.28-1.69,0.28-1.69l1.22-0.84s3.79-0.07,4.06-0.07,2.03-0.79,2.44-1.06c0.4-0.27,0.13-1.66,0-1.84-0.14-0.18-1.19-1.94-1.19-1.94h-2.28l-2.5,0.06-2.1-0.43-1.03-0.41s-2.49-0.25-2.72-0.25c-0.22,0-1.5-0.16-1.5-0.16l-0.65-0.25s-0.13-1.6-0.13-1.87,0.48-0.55,1.07-0.91c0.58-0.35,0.93-0.94,0.93-0.94s-0.17-0.98-0.43-1.34c-0.27-0.36-0.1-0.97-0.1-0.97s2.29-2.76,2.38-2.93c0.09-0.18,0.62-1.04,0.62-1.04s0.89-1.56,1.06-2.18c0.18-0.63-0.59-1.16-0.59-1.16s-3.42-4.04-3.78-4.44-1.14-1.64-1.31-1.9c-0.18-0.27-0.91-1.24-1-1.69s0.31-1.41,0.31-1.41l1.09-3.47-0.56-1.06s-1.07-0.96-1.16-1.09c-0.09-0.14-1-0.75-1-0.75s-0.63-0.55-0.5-0.91c0.14-0.36,1.36-0.56,1.63-0.56s2.31-0.69,2.31-0.69,1.39-0.56,1.56-0.78c0.18-0.22-0.03-1.16-0.03-1.16s-1.56-17.7-1.56-18.06-0.65-1.56-0.78-1.78c-0.14-0.22-2.19-2.34-2.19-2.34l-0.72-5.16h0.06s1.85,0.06,2.47,0.06c0.63,0,0.97-0.84,0.97-0.84l2.5-2.06,1.53-1.38s0.57-0.52,0.88-0.56c0.31-0.05,1.26,0.58,1.44,0.62,0.17,0.05,1.47,0.6,1.47,0.6s0.99-0.52,1.43-0.66c0.45-0.13,0.75-0.62,0.75-0.62l-0.31-5.94,4.16-2.16s0.93-1.1,0.93-1.28,0.57-1.87,0.57-1.87l4.47-3.1s1.78-2.23,2.18-2.5-0.03-0.62-0.03-0.62l-1.25-1.85s-1.07-1.29-1.78-1.47c-0.71-0.17-0.91-1.09-0.91-1.09l0.29-5-0.6-0.47-2.84-2.31-3.41-2.69-0.72-1.97-0.34-1.4-1.06-1.78,0.15-0.91,1.25-2.69-1.4-1.4-1.63-1.97-0.72,1.59s-1.43-0.53-2.5-0.53-1.06,1.44-1.06,1.44-1.95,0.71-2.84,1.25c-0.9,0.53-1.25,1.78-1.25,1.78s-1.45,1.25-2.16,1.25-2.14,0.01-3.03,0.19c-0.89,0.17-1.43,1.41-1.97,2.12-0.54,0.72-1.44,2.33-2.16,2.69-0.71,0.36-0.71,0.34-1.78,0.34s-0.16-0.7,0.38-2.31c0.53-1.61,1.95-1.79,2.31-2.5s0.72-1.78,0.72-1.78l2.5-0.91s0.54-3.02,1.44-3.37c0.89-0.36,3.75-0.53,3.75-0.53s1.22-1.63,1.4-2.35c0.18-0.71,1.44-1.58,1.97-2.65,0.54-1.08,0.72-1.79,0.72-2.5,0-0.72,0.91-1.82,0.91-1.82l2.5-2.12s1.58-1.6,1.93-2.31c0.36-0.72,2.16-1.97,2.16-1.97l2.16-1.97,2.31-2.5s0.19-1.44,0.19-2.16c0-0.71-0.72-1.78-0.72-1.78s-1.26-0.9-1.97-1.44c-0.72-0.53-1.78-0.7-1.78-1.59s0.16-0.72,0.34-1.44c0.18-0.71,0.72,0,0.72,0l1.44,1.1,0.15-1.25-0.15-2.35-0.53-1.97-2.69-0.68-1.78-1.1h-2.16c-0.71,0-0.52-0.69-0.87-1.4-0.36-0.72-0.37-1.62-0.91-2.69s-2.31-0.19-2.31-0.19l-1.78,0.91c-0.72,0.35-0.73,0.52-1.44,1.06-0.72,0.54-1.61-0.37-3.22-0.91-1.61-0.53-1.77,0.02-2.84,0.38-1.08,0.36,0.17,0.88,0.53,1.59,0.35,0.72,0,1.44,0,1.44l-2.35-0.19s-1.06-0.35-1.78-1.25c-0.71-0.89,0.19-1.06,0.19-1.06s1.25-1.43,1.25-2.5-0.72-1.25-0.72-1.25h-2.69c-1.25,0-1.96-0.17-3.03-0.34-1.07-0.18-1.25-0.37-1.97-1.44-0.71-1.07,0.57-0.53,0.57-0.53l1.4-1.25,1.25-0.72,2.69,0.34s0.9,0.56,1.97,0.38,0.19-0.72,0.19-0.72l-1.63-1.06s-1.77,0.34-2.84,0.34-2.16-0.72-2.16-0.72l-1.97-0.87s-1.41-1.45-2.12-1.63c-0.09-0.02-0.2-0.04-0.28-0.03zm-45.94,3.34c-0.85,0.32-1.23-0.03-1.5,0.82-0.27,0.84-0.34,0.96,0.16,1.18,0.49,0.23,0.87,0.53,1.4,0.44,0.54-0.09,1.24-0.47,1.06-1.09-0.17-0.63-1.12-1.35-1.12-1.35zm20.84,3.82c-0.33,0-0.47,0.12-0.94,0.56-0.62,0.58-1.62,1.37-1.71,1.9-0.09,0.54,0.12,0.96-0.19,1.54s-1.55,1.81-2,2.12-2.51,0.16-2.6,0.47c-0.08,0.31-0.37,0.52,0.04,0.87,0.4,0.36,2.91,0.63,3.72,0.54,0.8-0.09,3.3-0.3,3.74-0.35,0.45-0.04,0.71,0.28,0.66-0.43-0.04-0.72-0.72-1.36-0.4-1.85,0.31-0.49,0.6-0.65,0.78-0.97,0.17-0.31,0.49-1.06,0.31-1.47-0.18-0.4-0.72-0.95-0.72-1.53s-0.28-1.37-0.28-1.37c-0.18-0.01-0.3-0.04-0.41-0.03zm-45.53,6.62c-0.49,0-2.1,0.86-2.19,1.13-0.09,0.26-0.56,0.38,0.07,0.97,0.62,0.58,0.39,0.88,1.15,0.84,0.76-0.05,1.55-0.67,2.22-0.63,0.67,0.05,1,0.79,1.31,0.79,0.32,0,0.62-0.23,0.66-0.72s-0.42-0.89-0.59-1.07c-0.18-0.17-0.54-0.18-0.54-0.18-0.31-0.45-1.6-1.13-2.09-1.13zm-2.06,6.25c-0.54,0.18-1.01,0.45-1.5,0.63-0.49,0.17-0.81,0.17-1.13,0.43-0.31,0.27-0.72,0.46-0.72,0.82,0,0.35,0.15,0.5,0.6,0.81s0.52,0.62,1.19,0.62,1.89-0.5,2.03-0.81c0.13-0.31,0.48-0.94,0.53-1.25,0.04-0.31-1-1.25-1-1.25zm-51.31,9.13l-2.35,2.12-0.34,1.78,1.97,0.38,1.25,0.87h2.5l1.25-0.87v-1.78l-1.63-2.16-2.65-0.34zm59.09,4.4c-0.49,0.14-1.47,0.59-1.25,1.03,0.22,0.45,0.5,0.8,0.91,0.75,0.4-0.04,0.74-0.01,0.87-0.5,0.14-0.49-0.22-1.25-0.22-1.25l-0.31-0.03zm97.34,1.78c-0.09,0.01-0.18,0.07-0.28,0.22-0.38,0.6-0.53,1.69-0.4,2.1,0.12,0.41-0.42,0.87,0.12,1.31s0.62,1.22,1.53,1.25c0.92,0.03,1.9,0.47,2.63-0.06,0.72-0.54,1.43-1.69,1.65-2.19,0.22-0.51,0.32-1.22,0.07-1.53-0.26-0.32-0.62-0.81-1.13-0.88-0.5-0.06-1.19,0.16-1.19,0.16-1.07,0.31-0.99,0.66-1.78,0.31-0.59-0.26-0.92-0.72-1.22-0.69zm-135.37,0.22l-1.97,0.19-1.44,1.44,0.53,1.06,1.63-0.91,1.44,0.57,0.34,1.59,1.25,0.34,0.72-0.87-0.53-1.06-1.97-2.35zm27.09,1.13c-0.49,0.01-1.04,0.1-0.9,0.5,0.17,0.53,1.09,0.75,2.03,0.75s2.97,0.08,3.06,0.44c0.09,0.35,0.68,1.56,0.91,1.65,0.22,0.09,0.92,0.13,0.97-0.41,0.04-0.53-0.44-1.13-0.76-1.4-0.31-0.27-2.09-1.25-2.09-1.25-0.45-0.09-2.24-0.28-2.78-0.28-0.13,0-0.27-0.01-0.44,0zm10.31,1.12c-0.71,0.23-0.93,0.25-0.93,0.88,0,0.62-0.1,1.06,0.43,1.15,0.54,0.09,0.85,0.33,1.26,0.07,0.4-0.27,0.59-0.91,0.37-1.22s-1.13-0.88-1.13-0.88zm-44.71,1.16l-1.44,1.25,0.72,0.87,1.78-1.06-1.06-1.06zm6.4,2.31v1.78l2.35-0.53v-1.25h-2.35zm133.35,1.5c-1.05,0.29-1.25,0.28-2.07,0.6-0.82,0.31-1.49,0.24-1.87,0.74-0.38,0.51-0.44,0.28-0.66,1.29s-0.69,0.99,0.1,1.31c0.79,0.31,1.39,0.29,2.31-0.41,0.91-0.69,1.71-1.09,2.19-1.65,0.47-0.57,0.84-1.19,0.84-1.35s-0.84-0.53-0.84-0.53zm-122.41,0.5c-0.4,0.63-0.65,1.16-0.87,1.56-0.23,0.41-0.68,0.77-1.13,1.66s-0.81,1.32-0.81,2.03c0,0.72,0.24,1.18,0.68,1.41,0.45,0.22,0.34,0.5,0.57,0.5,0.22,0,0.82,0.09,1.31,0s1.03-0.19,1.03-0.5v-1.88c0-0.53-0.31-3.37-0.31-3.59s-0.47-1.19-0.47-1.19zm-16.47,0.69l-1.06,0.87v1.25l1.44,0.57,0.87-1.25-1.25-1.44z",
                            "name": "Красноярский край",
                            "id": [13]
                        },
                        "tm": {
                            "path": "m454.64,359.43,1.25,3.2143,1.25,2.3214s-0.53571,2.3214-0.71428,3.0357c-0.17857,0.71429-1.6071,3.0357-1.6071,3.0357s0.53571,1.25,1.6071,1.9643c1.0714,0.71429,5.8929,1.7857,5.8929,1.7857l5.3571,0.17857s3.75,0.89285,4.1071,1.6071c0.35714,0.71429,0.89286,1.0714,0.89286,2.1429,0,1.0714,0.35714,4.2857,0.35714,4.2857s1.25,0.35714,2.6786,0.35714,3.0357,0.35715,3.0357,0.35715,0.35714,2.1428,0.35714,2.6786c0,0.53571-0.89286,1.7857-1.9643,1.7857s-3.75,1.6072-3.75,1.6072-1.25,2.6786-1.25,3.75-0.89285,3.5714-0.53571,4.2857c0.35714,0.71429,4.4643,1.7857,5.1786,2.1429,0.71429,0.35714,3.2143,2.6786,3.2143,2.6786s-0.71429,1.6071-1.6072,2.6786c-0.89285,1.0714-4.1071,3.0357-5.3571,4.6429-1.25,1.6071-0.35714,2.8571-0.35714,2.8571l-0.71429,1.6071-3.2143,0.53572-3.2143,0.35714-1.4286-1.6071-1.9643-0.17857-4.66-0.57h-2.3214l-1.25,1.0714s-2.1429,1.0714-3.2143,1.25c-1.0714,0.17857-5.3571,1.25-6.0714,1.25-0.71428,0-6.4286,0.71429-6.4286,0.71429l-3.3928,1.4286h-2.3214l-0.35715-1.9643,0.71429-2.1429-0.35714-2.3214,1.7857-2.3214-0.53571-1.4286s-1.0714-0.17858-1.9643,0.53571c-0.89286,0.71429-4.4643,1.0714-4.4643,1.0714l-4.2857-0.17857-1.9643-2.3214-0.89286-3.0357s-1.25-1.0714-2.6786-0.71428c-1.4286,0.35714-1.6072,1.25-2.6786,1.25s-2.5,0-3.0357-0.89286c-0.53571-0.89286-0.89285-3.0357-0.89285-3.0357l-0.9-2.33s-1.6071-0.89286-2.5-1.6071c-0.89286-0.71429-3.2143-2.3214-3.2143-2.3214l-5.1786-2.3214-4.2857-1.9643-4.6429-1.7857-2.6786-1.0714-1.7857-2.5v-3.0357l1.6072-2.8572,0.35714-1.7857-0.53571-2.3214,1.25-3.0357,0.71428-3.3929,1.9643-1.0714,3.3928-2.8571s0-2.1429,0.71429-2.3214c0.71429-0.17857,5.7143-1.6071,5.7143-1.6071l1.9643-1.7857,1.25-2.6786,2.5-1.6071,1.6071-3.2143s1.0714-1.0714,1.7857-1.7857c0.71428-0.71429,2.1428-1.4286,2.1428-1.4286l1.9643-0.35715,2.1429,1.7857,2.1428,1.0714,2.5,0.35714,2.8572,1.4286,1.0714,1.6071,3.0357,0.89286h3.3929l2.1428,0.35714,1.25,1.6072,2.6786,0.71428,2.3214,0.71429,2.1429,1.7857,1.25-0.89286,1.7857-0.53571,2.1428-1.4286,2.1429-0.17857,1.6071,0.71428,1.7857,0.89286z",
                            "name": "Томская область"
                        },
                        "nv": {
                            "path": "m371.43,421.57,4.1071,0.71429l4.4643-0.17858c1.25-0.17857,2.1429-0.71428,2.1429-0.71428l-2.14,3.4h-3.0357l-0.89285,2.1428s1.0714,1.9643,1.7857,2.5c0.71429,0.53572,2.6786,3.0357,2.6786,3.0357l0.53572,2.1428,2.3214,0.35715h1.4286s2.6786,0.35714,3.3928,0.35714c0.71429,0,0.89286,0,1.9643-0.35714,1.0714-0.35715,3.2143-0.71429,4.6429-0.71429h3.5714s2.6786,0.17857,3.5714-0.35714c0.89286-0.53572,0.89286-1.0714,2.3214-1.25,1.4286-0.17857,3.0357-0.17857,3.9286-0.17857,0.89286,0,1.9643-0.17857,1.9643-0.17857s0,1.6071,0.89286,2.1428c0.89285,0.53572,4.1071,2.6786,4.1071,2.6786l0.71428,0.71429c0.17858,0.71429-0.17857,2.5-0.17857,3.2143,0,0.71428-1.0714,0.71428-0.17857,1.6071,0.89286,0.89286,1.9643,1.4286,1.9643,1.4286l2.3214-1.9643,2.3214-2.3214s2.1429-0.53572,2.8572-0.53572c0.71428,0,3.0357,0,3.75-0.17857,0.71428-0.17857,1.4286-0.71429,2.6786-0.17857,1.25,0.53571,2.3214,0.71428,3.3929,0.71428,1.0714,0,3.5714-1.25,3.5714-1.25s1.7857-2.1428,1.9643-2.8571c0.21-0.7-0.33-4.45-0.33-4.45v-3.75c0-0.71429,0.71428-2.3214,1.25-2.6786,0.53571-0.35714,1.7857-0.89285,1.7857-1.7857,0-0.89286-0.89286-1.6071-0.89286-1.6071s-0.89285-0.53572-0.89285-1.4286c0-0.89286,0.35714-3.2143-0.53572-3.0357-0.89285,0.17857-4.1071,1.7857-4.1071,1.7857s0,0.17857-1.4286,0.17857-2.5,0-2.6786-0.71429c-0.17857-0.71428,0.35714-5,0.35714-5l0.53571-2.6786,0.17858-2.1429-2.8572,1.4286s-1.6071,0.53572-2.5,0.71429c-0.9,0.18-4.47-0.71-4.47-0.71l-2.1429-0.71428-1.4286-2.1429-1.4286-2.8571s-2.5,0.53571-3.2143,0.71428c-0.71428,0.17858-1.9643,0.53572-1.9643,0.53572l-2.3214-1.25-1.0714-3.3929v-1.25l-3.0357-1.7857s-1.9643-1.6072-2.6786-2.1429c-0.71428-0.53571-3.3928-1.7857-3.3928-1.7857s-3.3929-1.25-4.1072-1.6072c-0.71428-0.35714-1.9643-1.25-2.6786-1.6071-0.71428-0.35714-3.9286-1.4286-3.9286-1.4286l-1.9643,0.17857s-0.35715,1.0714-0.53572,1.9643c-0.17857,0.89285-1.0714,2.3214-1.0714,2.3214l-1.4286,1.0714-0.89286,1.6072,0.17858,2.1428-0.71429,1.4286h-3.2143l-2.5-0.35714-2.1428,0.89286-2.1429,2.3214-1.4286,1.9643-0.71429,2.6786,0.71429,1.9643,1.7857,2.6786v1.7857l-2.1428,3.5714z",
                            "name": "Новосибирская область",
                            "id": [18]
                        },
                        "al": {
                            "path": "m381.25,435.14,1.7857,5,1.7857,5.1786,1.6071,6.7857,0.89286,8.5714,0.35714,8.2143,0.35714,2.8571,2.3214-0.53571,1.7857-0.53572,0.89285-0.53571,0.17857-1.9643,1.25-1.6071,1.25-0.35714,1.7857,0.53571,0.89286,1.9643,0.89285,2.8571,2.3214,2.8571,1.9643,1.6071,4.6428,0,3.3929-0.35714,2.5-0.89286,2.3214,0,3.3929,1.4286,1.0714,1.9643,2.3214,0.53572,2.3214-0.53572-0.17857-1.4286-1.6071-1.0714-1.0714-0.89286,0.35714-1.6071,0.71429-0.35714,2.5-0.35714,4.4643-0.71429,3.75-0.17857,2.6786-0.71429,2.3214-1.9643,1.0714-1.9643s0.53572-0.71428,1.25-0.71428c0.71429,0,3.3929-0.17858,3.3929-0.17858l1.9643-0.17857,1.0714-1.7857s0.53572-2.1429,1.25-2.5c0.71429-0.35714,0.89286-2.3214,0.89286-2.3214l0.71429-2.1429-0.35715-1.0714-0.71428-1.0714,0.71428-0.89286,1.25-0.53571-0.17857-1.0714-1.4286-1.6072-1.0714-1.0714c-0.17857-0.71429-0.89286-2.8572-0.89286-2.8572l-1.7857-1.7857-0.17857-0.89286-0.53572-2.1429-1.6071-1.4286-2.5-1.9643-1.74-1.79s-1.6072,1.0714-2.3214,1.4286c-0.71429,0.35715-1.7857,0.71429-1.7857,0.71429l-2.5,0.17857-2.5-0.35714-3.0357-0.17857-4.8214,0.71428-2.5,1.6072-1.6071,1.7857-1.0714,0.71429-0.89286,0.35714-1.4286-1.25-0.35714-0.89286,0.35714-0.89286,0.17857-1.7857-0.17857-1.4286-2.3214-1.6071-1.9643-1.25-1.0714-1.25-0.17857-0.89286-1.9643-0.17857-4.2857,0.17857-1.25,1.25-2.1429,0.53571-3.75-0.53571-4.2857,0.17857-2.6786,1.25h-2.5l-3.3929-0.17857z",
                            "name": "Алтайский край",
                            "id": [1]
                        },
                        "km": {
                            "path": "m472.14,414.79-0.71428,2.3214,0.89286,1.6072,2.5,1.4286,1.7857,1.6071,1.25,2.5,0.17857,0.89286s-0.89286,1.4286-1.6071,2.1429c-0.71429,0.71428-4.2857,2.3214-4.2857,2.3214l-1.7857,1.7857-1.7857,1.7857v1.6072l1.0714,1.7857,0.17858,1.7857-1.9643,2.5s-1.25,1.0714-1.0714,1.7857c0.17857,0.71428,1.0714,1.4286,1.7857,1.6071,0.71428,0.17857,2.8571,0.89286,2.8571,0.89286l-0.71429,1.4286-1.25,1.7857-0.53571,1.6072-1.7857,0.71428-1.4286,1.6072,0.71429,1.25,1.25,1.25-0.89286,2.5-1.25,1.6071,0.53572,1.25,1.7857,1.7857-0.35714,1.6072-1.6072,1.9643-2.5,2.1429h-1.9643l-0.71429-1.7857-1.9643-1.25-2.6786-0.35714-1.4286,1.0714-2.1428-1.4286-0.71429-2.3214-1.0714-0.71429,0.17857-2.5-0.53571-2.5,0.89286-1.9643,0.71428-1.6071-2.1428-2.6786-1.6072-2.6786-1.25-1.4286-0.71428-2.3214-0.89286-1.7857-2.3214-2.1429-1.7857-1.6071-0.71429-1.25v-1.7857l-0.35714-4.6428,0.17857-2.5,0.71429-2.3214,1.25-1.4286,0.71428-1.25-1.4286-1.9643v-0.89286l-0.35714-2.5,1.6071-0.35714,4.4643-0.53571,2.5-0.89286,3.0357-0.89286,1.0714-0.35714,0.71428-0.89286h1.6072,1.9643,2.5l1.7857,0.35715,1.4286,0.35714,0.89286,0.89286,1.9643,0.53571,1.6071-0.17857,2.5-0.71429z",
                            "name": "Кемеровская область",
                            "id": [10]
                        },
                        "lt": {
                            "path": "m422.32,478.89-0.44643,2.1428s-0.17857,1.875,0,2.5893c0.17857,0.71429,1.1607,2.3214,1.1607,2.3214l3.3036,0.89286s0.98215,1.1607,1.0714,1.6071c0.0893,0.44643,0.0893,3.3036,0.0893,3.3036s0.17857,0.89286,0.53571,1.6071c0.35715,0.71429,1.25,1.875,1.7857,2.2322,0.53571,0.35714,1.6071,1.25,2.4107,1.3393,0.80357,0.0893,3.125,0.0893,3.5714,0.0893,0.44643,0,4.0179,0.0893,4.0179,0.0893s1.0714,0.53572,1.6071,0.89286c0.53571,0.35714,1.4286,1.25,1.7857,1.875,0.35715,0.625,1.5179,1.6964,2.0536,1.9643,0.53571,0.26785,1.1607,0.80357,1.7857,1.1607,0.625,0.35714,1.6964,0.71429,2.4107,0.80357,0.71429,0.0893,2.9464-0.44643,3.3929-0.71428,0.44643-0.26786,2.3214-0.89286,3.4821-0.89286s4.7322-0.35714,5-0.44643c0.26786-0.0893,3.5714-1.3393,4.1964-1.3393s1.4286-0.89285,1.6071-1.25c0.17858-0.35714,0.625-1.9643,0.17858-2.7678-0.44643-0.80357-0.80358-1.0714-1.4286-1.4286-0.625-0.35715-1.4286-1.25-1.25-1.7857,0.17858-0.53571,1.9643-1.1607,2.4107-1.1607,0.44643,0,2.5,1.0714,2.5,0.26785,0-0.80357-1.6964-2.2321-1.6964-2.2321s-0.98214-1.3393-1.25-1.7857c-0.26786-0.44643-1.875-1.9643-1.875-1.9643s-2.2321-2.7679-2.0536-4.1071c0.17857-1.3393-0.0893-3.3929-0.0893-3.3929s-0.625-1.3393-0.71428-1.6964c-0.0893-0.35714-1.3393-0.17857-1.3393-0.17857l-1.5179,1.5179s-1.4286-0.26786-1.5178-0.80357c-0.0893-0.53572-0.71429-2.5893-0.71429-2.5893s-0.35714-1.7857-0.44643-2.1429c-0.0893-0.35714-0.17857-1.9643-0.17857-1.9643l1.6964-1.3393,2.8571-1.3393,0.35715-1.1607-1.3393-1.6071-0.80357-0.625-2.1429-0.53571-1.9643,0.98214s-1.0714-0.625-1.4286-0.80357c-0.35714-0.17857-1.0714-0.89286-1.0714-0.89286l-0.89286-1.7857s0-1.0714-0.71429-0.89286c-0.71428,0.17857-0.89285,0.71428-0.89285,0.71428s-1.1607,1.1607-1.1607,1.5179c0,0.35714-0.625,1.4286-0.625,1.4286l-0.98214,1.0714s-1.6071,0.44643-1.9643,0.44643h-3.0357c-0.35714,0-1.1607,0.71429-1.5179,1.0714-0.35714,0.35714-1.1607,1.9643-1.1607,1.9643l-1.5179,1.0714-0.98214,0.625-2.3214,0.71429h-2.3214l-4.1071,0.71428-4.1071,0.625-1.0714,0.625-0.0893,0.98215s0.0893,0.89285,0.53572,0.98214c0.44642,0.0893,1.6071,0.80357,1.6071,0.80357l0.44643,0.89286-0.0893,0.89286-1.875,0.625z",
                            "name": "Республика Алтай"
                        },
                        "tv": {
                            "path": "m461.96,477.02,0.26786-1.6964s0.89286-0.625,1.6071-0.625c0.71429,0,1.6964,0.71428,2.4107,0.89286,0.71428,0.17857,2.7678,0.71428,3.0357,0.71428,0.26786,0,1.0714-0.80357,1.3393-1.25,0.26785-0.44643,1.9643-2.6786,1.9643-2.6786s0-1.25,0.625-1.6071c0.625-0.35715,1.875-0.35715,2.3214-0.35715,0.44643,0,1.6071-0.17857,2.3214,0.26786,0.71429,0.44643,1.1607,3.0357,1.1607,3.0357s0.89286,0.89285,1.1607,0.89285c0.26786,0,2.1429-0.80357,2.1429-0.80357s1.4286,0.17857,1.7857,0.44643c0.35714,0.26786,3.0357,0.89286,3.0357,0.89286s1.6964,1.6071,2.2322,1.6071c0.53571,0,1.6964,0.26786,2.6786-0.0893,0.98214-0.35714,2.8571-0.80357,3.3929-1.25,0.53571-0.44642,5.5357-1.9643,5.9821-2.5,0.44643-0.53571,7.0536-5.9821,7.0536-5.9821l2.1429-2.8571s-0.17857-1.875-0.17857-2.9464,1.0714-2.3214,1.4286-2.5893c0.35714-0.26785,2.8571,0.0893,3.3036,0.17858,0.44643,0.0893,4.375,0.89285,4.7321,0.80357,0.35714-0.0893,4.2857-0.44643,4.2857-0.44643l2.4107-2.2321s1.5179-0.35715,2.4107,0.0893c0.89286,0.44643,3.6607,2.5,4.1964,2.7679,0.53572,0.26786,3.75,2.3214,3.75,2.3214l1.6072,1.5178s1.25,0.71429,1.7857,0.44643c0.53571-0.26785,2.3214-0.89285,2.3214-0.89285l1.6071,0.53571,0.35714,1.25s0.53572,0.89286,0.53572,1.25-0.89286,1.6071-0.89286,1.6071-0.71428,0.53572-0.80357,1.1607c-0.0893,0.625-0.26786,4.1071-0.26786,4.1071s-0.0893,2.3214-0.0893,2.7679c0,0.44643-0.71429,2.1428-0.71429,2.1428l-1.4286,2.4107s-1.5179,1.3393-1.875,1.875c-0.35714,0.53571-2.2321,1.3393-2.4107,1.6964-0.17858,0.35714-0.71429,1.875-0.71429,1.875s-0.71429,1.875-0.71429,2.4107c0,0.53572-0.0893,3.3929-0.0893,3.9286,0,0.53572,0.53571,2.5,1.0714,3.2143,0.53571,0.71428,1.25,1.6071,1.25,2.0536,0,0.44643-0.80357,2.3214-1.1607,2.7679-0.35714,0.44643-4.8214,4.1964-4.8214,4.1964l-2.0536,1.25-2.1428,0.17857s-1.7857-0.98215-2.1429-0.89286c-0.35714,0.0893-2.3214,0.17857-2.6786,0.17857-0.35715,0-1.7857-0.89286-1.7857-0.89286s-1.6964-0.35714-2.1428-0.625c-0.44643-0.26785-1.7857-1.1607-1.7857-1.1607s-2.7679-0.26786-3.2143-0.26786c-0.44643,0-2.8572-0.17857-3.2143-0.53571l-2.0536-2.0536s-0.71429-1.4286-0.80357-1.9643c-0.0893-0.53571-0.17857-2.5-0.17857-2.5s-0.80358-0.80357-1.3393-1.25c-0.53571-0.44643-2.1429-0.89286-2.9464-0.89286-0.80357,0-3.9286,0.17858-3.9286,0.17858s-1.9643,0.53571-2.2321,0.625c-0.26786,0.0893-1.25,0.71428-1.875,0.80357-0.625,0.0893-2.0536,0.0893-1.9643-0.80357,0.0893-0.89286,1.25-1.6964,1.3393-2.0536,0.0893-0.35714-0.0893-1.0714-0.71429-1.3393-0.625-0.26786-2.1429-0.17857-3.0357,0.0893-0.89286,0.26786-2.3214,0.80358-2.8572,0.89286-0.53571,0.0893-3.3928,0.71429-3.3928,0.71429s-2.1429,0.89285-2.6786,1.0714c-0.53572,0.17857-3.8393,1.1607-3.8393,1.1607l-3.0357,1.5179-2.4107,1.1607-2.5893-0.26786-2.1429-0.98214-1.5179-0.71428-1.25-1.25c0-0.44643,0.35714-0.98215,0.35714-0.98215l2.4107-0.44643,1.7857,0.53572s1.25-0.35714,0.17857-1.0714c-1.0714-0.71429-4.4643-5.0893-4.4643-5.0893l-1.48-2.44s-1.0714-1.4286-1.0714-1.7857v-2.5893z",
                            "name": "Республика Тыва"
                        },
                        "hk": {
                            "path": "m470.27,432.11c0.53572,0.35715,1.9643,1.875,1.9643,1.875l1.3393,1.6072s0.26785,0.625,1.1607,0.80357c0.89286,0.17857,2.0536,0.17857,2.0536,0.17857s0.35714-0.35714,0.80357-0.80357,0.625-0.98214,0.98215-1.25c0.35714-0.26786,0.89285-0.89286,1.3393-0.80357,0.44643,0.0893,0.71429,0.26785,1.3393,0.71428,0.625,0.44643,1.3393,1.25,2.2321,1.25,0.89286,0,2.5,0.80357,2.5,0.80357s0.44643,1.875,0.625,2.3214c0.17857,0.44643,0.53571,2.9464,0.53571,2.9464s0.35715,1.5179,0.71429,2.4107c0.35714,0.89285,0.98214,2.0536,1.0714,2.4107,0.0893,0.35714-0.0893,3.125-0.17857,3.3929-0.0893,0.26785-0.80357,1.875-0.89286,2.2321-0.0893,0.35714,0,2.5893,0,2.5893l1.5179,1.5179,0.625,1.875s-1.25,1.4286-1.4286,1.6964c-0.17858,0.26786-2.2322,1.3393-2.5893,1.875-0.35714,0.53571-1.4286,3.0357-1.4286,3.0357s-1.6071,1.9643-2.1429,2.2322c-0.53571,0.26785-2.8571,1.0714-3.125,1.5178-0.26786,0.44643-1.6964,1.6964-1.6964,1.6964l-2.7678,0.0893s-1.3393,0.17857-1.6072,0.625c-0.26785,0.44643-0.53571,1.4286-1.0714,1.875-0.53571,0.44643-1.0714,1.25-1.1607,1.6071-0.0893,0.35714-0.89286,1.0714-0.89286,1.0714s0.0893,0.71429-1.0714,0.625c-1.1607-0.0893-2.9464-0.35714-2.9464-0.35714l-1.7857-1.1607-1.6071,0.44643-0.625,0.80357-0.26786,0.89286-2.5,1.0714s-0.625,0.89286-1.1607,0.35714c-0.53572-0.53571-1.25-2.3214-1.25-2.3214l-0.625-2.5893v-1.5179s0.17857-1.0714,0.53571-1.25c0.35714-0.17857,2.5-1.6071,2.5-1.6071s1.3393-0.98215,1.6964-1.0714c0.35714-0.0893,2.1429-0.44643,2.1429-0.44643l1.9643-1.0714,1.5179-2.0536,1.3393-1.0714-0.44643-1.6071s-1.25-1.25-1.4286-1.6071c-0.17858-0.35715-0.44643-1.25-0.44643-1.25l1.6071-2.2322,0.0893-1.875s-1.0714-1.1607-1.1607-1.5178c-0.0893-0.35715-0.0893-1.25-0.0893-1.25l2.5893-1.5179,1.0714-1.875,1.1607-1.9643,0.53572-1.6964-3.5714-1.1607s-0.89286-1.25-0.71429-1.7857c0.17858-0.53572,1.7857-2.4107,1.7857-2.4107s0.89286-1.875,0.89286-2.3214c0-0.44642-1.0714-2.8571-1.0714-2.8571s0-0.71428,0.26785-1.1607c0.26786-0.44643,1.25-0.98215,1.25-0.98215z",
                            "name": "Республика Хакасия"
                        },
                        "ir": {
                            "path": "M599.41,325.78c-0.12,0.03-0.22,0.12-0.22,0.34,0,0.45,0.53,1.54,0.53,1.54l0.37,1.06s-0.26,0.88-0.62,1.06-1.78,0.63-1.78,0.63l-2.69,0.09s-1.61,0.26-1.88,0.44c-0.26,0.18-0.9,0.73-0.9,1.09s-0.44,1.96-0.53,2.31c-0.09,0.36-0.16,1.97-0.16,1.97s0.18,0.78,0.63,1.41c0.44,0.62,0.43,1.81,0.43,1.81l-1.25,1.16s0.26,1.67,0.35,2.03,1,3.4,1,3.4l0.43,2.5s-0.28,1.42-0.28,1.69-0.96,4.57-0.96,4.57-0.09,0.98-0.54,1.24c-0.44,0.27-2.06,1.88-2.06,1.88s-0.19,0.99-0.19,1.34c0,0.36,0.37,1.06,0.19,1.5-0.18,0.45-1.97,1.72-1.97,1.72l-2.59,0.72-1.31,0.88-0.29,3.84-0.09,2.22v1.81c0,0.36,0.27,1.34,0.72,1.78,0.45,0.45,2.16,1.97,2.16,1.97l2.21,0.53,1.16,0.78,0.1,2.25s-0.37,1.33-0.82,1.5c-0.44,0.18-2.75,1.82-2.75,1.82l-0.53,1.15,0.97,1.16,1.97,1.59s0.78,0.1,0.87,0.72c0.09,0.63-0.15,2.6-0.15,2.6l-0.47,1.43-1.25,1.07-1.41,1.43-0.19,1.6-1.24,0.81-2.79-0.28-1.59-1.35-1.78-0.68-2.25-0.63s-0.45-0.74-0.63-1.19c-0.17-0.44-0.34-1.68-0.34-1.68l-1.25-0.72-1.87,1-1.26,0.09-0.18,1.69-0.35,2.41-0.53,1.53-0.9,0.97-1.6,0.53s-1.89,0.28-2.25,0.37c-0.35,0.09-1.34,1.41-1.34,1.41s-0.53,0.8-0.44,1.15c0.09,0.36,0.19,1.25,0.19,1.25l-1.16,0.91-2.06,0.81s-0.44,0.9-0.44,1.25c0,0.36,0.16,1.97,0.16,1.97l0.37,1.5,0.1,1.63s0.7,0.7,0.43,1.06c-0.26,0.36-2.78,0.62-2.78,0.62l-1.93-2.78-1-1.5-1.07-2.34-1.06-0.69h-1.72l-1.59,1.69s-0.89,0.81-1.16,1.44c-0.27,0.62,0.01,1.78-1.15,1.78s-3.22-0.38-3.22-0.38l-1.25-1.15-1.97-0.44-1.34-0.19s-0.62,0.64-0.97,0.91c-0.36,0.27-1.35,1.25-1.35,1.25v0.62l-0.72,1.88-1.15,2.22-0.81,0.9-0.29,1.35,0.63,1.68s0.45,0.9,0.81,1.25c0.36,0.36,0.63,0.35,0.72,0.97,0.09,0.63,0.19,2.6,0.19,2.6l-0.38,2.4-0.97,1.88s-1.88,1.79-2.15,2.06-2.13,1.61-2.13,1.97-1.62,4.19-1.62,4.19l-1.25,2.25s-0.69,2.11-0.78,2.56-0.63,3.59-0.63,3.59-0.09,1.33-0.62,1.6c-0.54,0.26-3.69,0.81-3.69,0.81s-2.12,1.07-2.56,1.34c-0.45,0.27-0.72,0.63-0.72,0.63s-0.19,0.52-0.1,0.87c0.09,0.36,1.16,2.25,1.16,2.25l1.44,2.66,1.06,0.56,0.97,1.06,1.09,1.69v0.81l1.25-0.43s0.9-0.91,1.25-1c0.36-0.09,1.78,0.28,1.78,0.28l1.44,0.87s1.43,0.91,1.78,1c0.36,0.09,2.03,1.41,2.03,1.41l4.32,2.87s0.34,0.82,1.06,0.82c0.71,0,2.41-0.38,2.41-0.38l1.78-0.34,1.06,1.15,0.28,1.16,0.28,1.53,2.56-0.81,2.44-2.41s2.14-2.16,3.13-2.34c0.98-0.18,2.12,1.19,2.12,1.19s0.72,1.58,1.25,2.03c0.54,0.44,2.43,2.32,2.78,2.59,0.36,0.27,3.03,1.53,3.03,1.53l2.22,2.66c0.45,0.53,2.52,3.22,2.97,3.22s2.84,0.18,3.38,0.09c0.53-0.09,1.96,0.63,2.5,1.25,0.53,0.63,1.78,2.69,1.78,2.69s1.27,1.69,1.62,1.78c0.36,0.09,1.16,1.88,1.16,1.88s0.89,1.62,1.25,1.53,2.31-0.63,2.31-0.63,0.73,0.15,0.91,0.69c0.18,0.53,0.87,2.59,0.87,2.59s1.18,0.62,1.53,0.53c0.36-0.09,1.88-1.25,1.88-1.25s1.77-0.26,2.12-0.43c0.36-0.18,1.44-0.82,0.82-1.44-0.05-0.04-0.11-0.06-0.16-0.09,0.05-0.01,0.34-0.07,0.34-0.07l1.69-0.62,8.75-2.88s1-1.76,1-2.03,0.63-2.06,0.63-2.06l0.06-2.06,0.81-0.82,1.78-0.96,2.25-0.82,1.16-1.68,1.06-0.82,5.44-2.59,1.62-1.31,0.82-1.1,0.62-2.5,1.94-1.15s1.27-0.9,1.62-1.35c0.36-0.44,0.35-0.97,0.35-0.97l-0.63-0.81-1.25-1.25-0.34-0.81s0.18-0.96,0.62-1.41c0.45-0.44,0.71-0.63,1.07-0.72,0.35-0.09,1.25,0.35,1.25,0.35l1,1.09,0.87-0.47,0.63-1.78s0.81-2.14,0.9-2.5,0.25-1.69,0.25-1.69-0.25-3.05-0.25-3.5v-2.5s0.44-4.01,0.53-4.37,0.35-2.13,0.35-2.13l-0.1-1.87s-0.44-1.17-0.62-1.44-0.16-0.81-0.16-0.81,0.63-1.05,0.72-1.41c0.09-0.35-0.37-0.81-0.37-0.81s-0.54-0.71-0.72-1.06c-0.18-0.36-0.88,0.15-0.88,0.15l-1.44,0.91s-0.79,1.26-1.15,1.53-0.44,1.31-0.44,1.31l-0.28,4.38-0.81,1.34-1.53-0.09c-0.34-0.63-0.73-1.32-0.79-1.6-0.08-0.44-0.43-2.67-0.34-3.65s0.97-4.38,0.97-4.38l1.25-1.25s0.09-1.52-0.53-2.06c-0.63-0.53-1.87-1.07-2.41-1.34-0.53-0.27-1.72-1.35-1.72-1.97,0-0.63,0.92-1.77,1.19-2.13,0.27-0.35,3.93-1.51,4.28-1.78,0.36-0.27,3.57-2.15,3.57-2.15l3.65-1.07,2.78,0.25,2.13-0.34,1.34-2.5,2.88-0.81s1.87,1.25,2.4,1.25c0.54,0,2.22-0.72,2.22-0.72s1.07,0.64,1.25,1,1.63,1.34,1.63,1.34l1.93-0.37s1.35-0.44,2.07-0.35c0.71,0.09,1.7,0.98,2.06,1.07s2.75-0.72,2.75-0.72l1.09-1.5,2.5-1.16s1.35-1.08,1.35-1.53,0.15-3.22,0.15-3.22,1.25-0.61,1.88-0.97c0.62-0.35,2.15-0.18,2.15-0.18s0.17-1.34,0.35-1.79c0.18-0.44,1.33-1.34,1.78-1.43s2.44,0.37,2.44,0.37l1.15,0.97-1.34,1.44-0.72,1.15,0.72,0.72s2.31-0.45,2.94-0.72c0.62-0.26,2.24-0.44,2.78-0.53,0.53-0.09,2.84-1.15,2.84-1.15s0.91-1.08,0.91-1.44-0.2-1.71-0.38-2.16c-0.18-0.44-2.21-1.14-2.65-1.59-0.45-0.45-0.54-2.58-0.72-2.94s-0.9-1.9-0.63-2.44c0.27-0.53,1.06-1.78,1.06-1.78l-0.62-2.5s-0.01-2.48,0.34-2.84c0.36-0.36,2.07-1,2.07-1l2.93,0.81s0.9,1.15,1.35,1.06c0.44-0.09,2.15-0.53,2.15-0.53l0.25-3.56-0.87-1.16s-1.27-1.42-1.63-1.68c-0.35-0.27-1.25-1.25-1.25-1.25l-1.68-2.97-0.25-2.6-0.72-1.68-2.25-0.54-1.78,0.97-3.13,1.53-1.97,0.44-0.72-0.72-0.78-2.84-1-1.59-2.75-2.35-2.34-1.68-2.66-0.91-2.78-0.06s-2.49,0.8-2.84,1.15c-0.36,0.36-1.45,1.52-1.72,1.88-0.27,0.35-0.88,2.5-0.88,2.5l-0.28,2.12v2.5s-0.17,1.36-0.43,1.72c-0.27,0.36-3.94,2.03-3.94,2.03l-1.16,1.72-0.19,2.66-0.97,2.25-2.15,2.22s-0.6,0.63-0.69,0.09-0.62-2.22-0.62-2.22l-2.16-2.34s-0.44-1.23-1.06-0.78c-0.63,0.44-1.63,1.31-1.63,1.31l-3.28,1s-0.89,0.43-1.25,0.87c-0.36,0.45-2.97,0.72-2.97,0.72l-2.03,0.28-2.16,2.5s-0.62,1.26-1.24,0.82c-0.63-0.45-2.22-2.35-2.22-2.35l-0.82-1.59-0.53-2.94,0.16-5.56-0.06-2.56,1.5-2.6,1.87-3.03s0.44-1.61,0.44-2.06-0.53-3.03-0.53-3.03l-2.03-2.25-4.94-3.66s-0.63-0.71-0.63-1.25c0-0.53,0.1-2.31,0.1-2.31l1.15-1.97s0.63-0.35,0-1.06c-0.62-0.72-3.18-4.57-3.18-4.57l0.15-5.34s0.02-0.65-0.34-1.09c-0.36-0.45-2.59-3.28-2.59-3.28l-1.54-1.88s-0.24-0.62-0.68-0.62c-0.45,0-2.16,0.68-2.16,0.68s-1.17,0.82-1.44,0.29c-0.27-0.54-0.25-2.6-0.25-2.6s-0.29-1.16,0.16-1.25,1.62-0.44,1.62-0.44h1.5l0.29-1.43-1.79-1.97-1.53-1.35-1.4-0.06s-0.14-0.03-0.25,0z",
                            "name": "Иркутская область",
                            "id": [9]
                        },
                        "br": {
                            "path": "m543.39,476.39s1.6072,0.98214,2.3214,1.1607c0.71429,0.17857,2.8572,1.25,3.3929,1.3393,0.53571,0.0893,1.7857,0.71428,2.5,0.98214,0.71429,0.26786,1.875,0.98214,2.5893,1.3393,0.71428,0.35714,2.2321,0.53571,3.2143,0.625,0.98214,0.0893,2.8571,0.89285,3.4821,1.0714,0.625,0.17858,2.1429,1.0714,2.9464,1.1607,0.80357,0.0893,1.5179,0,2.7679,0.625s2.7679,1.3393,3.125,1.5179c0.35714,0.17857,0.71429,0.26785,0.80357,0.98214,0.0893,0.71428,0,2.6786,0.0893,3.0357,0.0893,0.35715,0.26785,1.6964,0.625,2.0536,0.35714,0.35715,1.6071,1.9643,2.5893,2.5893,0.98215,0.625,1.4286,1.6964,1.9643,2.1429,0.53571,0.44643,2.3214,1.875,2.8571,1.9643,0.53572,0.0893,2.3214,0.625,2.7679,0.625,0.44643,0,5.0893,0.44643,5.0893,0.44643s1.7857-0.80357,2.7679-1.25c0.98214-0.44643,4.0179-1.25,4.4643-1.5179,0.44643-0.26785,1.5178-0.98214,2.6786-1.0714,1.1607-0.0893,4.1964-0.0893,5.0893-0.0893,0.89286,0,4.1072,0.0893,4.1072,0.0893s2.3214-0.0893,3.125,0.44642c0.80357,0.53572,1.6071,1.6072,1.9643,2.1429,0.35715,0.53572,0.625,1.4286,1.0714,1.6071,0.44643,0.17858,1.4286,0.35715,1.875,0.35715,0.44643,0,2.1429-0.26786,2.5-0.35715,0.35714-0.0893,2.2321-0.44642,2.2321-0.44642l0.0893-2.6786s-0.0893-1.7857,0.53571-2.0536c0.625-0.26785,4.4643-1.5178,4.8214-1.6964,0.35715-0.17857,1.25-1.6071,1.25-1.6071s-2.5-0.625-3.3036-0.625c-0.80357,0-1.25-1.4286-1.25-1.4286l1.0714-1.5179,0.17857-1.9643,0.98214-1.0714,0.80358-1.3393s-0.625-0.98214-0.80358-1.3393c-0.17857-0.35715-0.0893-1.4286-0.0893-1.4286l2.2321-1.1607,3.125-0.35714,2.4107-1.1607,3.4821-2.4107,1.7857-0.625s1.4286,0.0893,1.875,0.26786c0.44643,0.17857,2.4107,0.53571,2.5893,0.17857,0.17857-0.35714,1.6071-1.9643,2.0536-2.3214,0.44643-0.35714,2.6786-2.1429,2.6786-2.1429l1.4286-1.1607s0.98215-1.25,1.4286-1.5179c0.44643-0.26786,1.875-1.0714,2.4107-1.0714,0.53571,0,0.98214,0,1.3393-0.26785,0.35715-0.26786,1.1607-1.25,1.3393-1.6072,0.17857-0.35714,1.0714-0.80357,1.6071-0.89285,0.53572-0.0893,5-1.3393,5-1.3393l2.6786-1.5179s1.875-1.5178,2.0536-1.875c0.17857-0.35714,1.6071-2.8571,1.6071-2.8571l0.98214-1.875s-0.26786-1.4286-0.71428-1.7857c-0.44643-0.35715-2.1429-1.6072-2.1429-1.6072l-2.5-1.25s-1.25-0.80357-1.1607-1.6071c0.0893-0.80357,7.5-5.625,7.5-5.625s0.98215-1.6964,1.0714-2.0536c0.0893-0.35714,0.89286-1.9643,1.25-2.3214,0.35715-0.35714,2.5-2.0536,2.5-2.0536s1.4286-0.625,1.875-0.71429c0.44643-0.0893,3.5714-1.5178,3.5714-1.5178l1.25-0.98215s0.44643-2.0536,0.44643-2.5893c0-0.53572-0.80357-3.8393-0.80357-3.8393s-1.0714-0.53571-1.4286-0.89285c-0.35715-0.35715-1.25-0.80358-2.1429-0.80358-0.89286,0-2.6786,0-3.125-0.625-0.44643-0.625-1.3393-1.25-1.6964-1.875-0.35714-0.625-1.1607-1.7857-1.25-2.2321-0.0893-0.44643-0.80357-2.4107-0.98214-2.7679-0.17857-0.35714-1.0714-2.3214-1.0714-2.3214l-2.0536-3.5714-1.0714-2.7679,0.26786-2.0536,1.0714-0.625,0.80357-1.25,1.4286-1.875,0.625-0.98214-2.3214-1.25s-1.875,0.44642-2.2321,0.71428c-0.35715,0.26786-0.98215,1.3393-0.98215,1.3393s0.35715,0.625,0,0.80357c-0.35714,0.17857-2.3214,0.44643-2.3214,0.44643l-1.25,0.89285-0.71429,1.9643v1.6071l-0.98214,0.98215-2.0536,1.0714-1.3393,0.98215-1.1607,1.3393s-1.6964,0.0893-2.0536,0.0893c-0.35714,0-2.0536-0.625-2.0536-0.625l-2.6786,0.17857-2.3214-0.0893-1.9643-1.4286-1.4286,0.26786-2.0536-0.35714s-0.80357-0.71429-1.1607-0.71429c-0.35714,0-2.1429,0.625-2.1429,0.625l-1.5178,1.3393-0.98215,1.0714-2.6786,0.26785-1.9643-0.0893-2.3214,0.44643-2.2322,1.1607-3.3928,1.7857-2.3214,0.98215-1.3393,0.89285-0.89285,1.1607s-0.0893,0.35714,0.0893,0.71428c0.17857,0.35715,0.98214,1.4286,0.98214,1.4286l1.6072,0.80357,0.98214,0.89285,0.83,0.91,0.0893,1.1607-1.6071,2.1428-0.35714,2.2322-0.35715,1.875v2.6786l0.80358,1.6071,1.1607,1.4286s0.26786-0.44643,0.71429-0.80357c0.44642-0.35714,1.1607-2.3214,1.1607-2.3214v-2.0536l0.0893-2.0536,0.98214-1.875,1.6964-1.25,1.1607-0.17857,0.89286,1.1607s-0.0893,1.25-0.26786,1.6964c-0.17857,0.44643-0.53571,0.98214-0.35714,1.3393,0.17857,0.35714,0.89286,1.4286,0.89286,1.4286l-0.17858,2.7678s-0.35714,2.3214-0.35714,2.6786c0,0.35714-0.26786,2.5893-0.26786,3.0357v2.5893c0,0.89285,0,1.5178,0.0893,2.1428s0.0893,1.6964-0.0893,2.1429c-0.17857,0.44643-0.44642,1.25-0.71428,1.9643-0.26786,0.71428-0.35714,1.25-0.44643,1.9643-0.0893,0.71429-1.0714,1.6964-1.0714,1.6964s-0.71428,0.26786-0.98214-0.625-1.6071-0.98214-1.6071-0.98214-0.71429,0.44642-1.0714,0.98214c-0.35715,0.53571-0.89286,1.25-0.35715,1.6964,0.53572,0.44643,1.5179,1.6071,1.5179,1.6071s0.625,0.35714,0.26786,1.1607c-0.35714,0.80358-1.1607,1.0714-1.6964,1.4286-0.53571,0.35714-1.5179,0.89285-1.6964,1.25-0.17857,0.35714-0.71428,1.4286-0.71428,1.7857,0,0.35714-0.44643,2.0536-0.44643,2.0536l-1.3393,0.98214-1.875,1.3393s-2.2321,0.71429-2.6786,0.98214c-0.44643,0.26786-2.5,1.4286-2.8571,1.7857-0.35715,0.35714-0.53572,1.25-1.4286,1.6071-0.89286,0.35714-3.125,1.3393-3.125,1.3393l-0.98215,0.26785s-0.35714,0.80357-0.35714,1.1607c0,0.35714-0.26786,2.2321-0.26786,2.7678,0,0.53572-0.26785,0.98215-0.625,1.6964-0.35714,0.71429-0.98214,1.6964-1.6071,1.7857-0.625,0.0893-2.7679,0.71428-3.2143,0.89285-0.44642,0.17858-2.5,0.89286-3.0357,0.98215-0.53571,0.0893-2.8571,1.0714-2.8571,1.0714l-0.71429,0.80357-1.5179,1.1607-2.0536,0.71429-1.4286,0.80357-1.6964-1.0714-0.35714-0.98214-0.44643-1.25s-0.35714-0.35715-1.25-0.26786c-0.89286,0.0893-2.0536,0.44643-2.0536,0.44643s-1.3393-1.4286-1.6071-1.875c-0.26786-0.44643-1.875-3.125-1.875-3.125l-1.54-1.99-1.34-1.61s-1.1607-0.71429-1.6964-0.71429c-0.53571,0-2.6786-0.17857-3.0357-0.17857-0.35715,0-1.6072-0.89285-1.7857-1.1607-0.17857-0.26786-3.4821-4.2857-3.4821-4.2857l-1.875-0.89285-2.8571-1.9643-1.9643-2.2321-1.0714-1.6964-0.89286-0.625s-0.89285-0.26786-1.25,0.0893c-0.35714,0.35714-0.80357,0.53571-1.3393,0.89285-0.53572,0.35715-1.875,1.4286-1.875,1.4286l-1.3393,1.25-1.9643,1.1607-1.4286,0.89286s-0.89286,1.0714-0.98215,1.6071c-0.0893,0.53571-0.26785,1.1607-0.26785,2.0536,0,0.89286-0.35715,3.3036-0.35715,3.3036z",
                            "name": "Республика Бурятия"
                        },
                        "zb": {
                            "path": "m618.41,500.07s1.1364,1.1364,1.6415,1.5152c0.50508,0.3788,1.6415,1.6415,2.2728,1.894,0.63134,0.25254,2.6516,1.6415,2.6516,1.6415s2.9042,1.0102,3.4093,1.0102h5.5558c1.1364,0,3.283,0.75762,3.283,0.75762s0.88388,0.63134,2.0203-0.25254c1.1364-0.88389,2.3991-1.6415,2.3991-1.6415s0.75762,0.25254,1.6415,0.63135c0.88388,0.3788,1.5152,1.2627,2.1466,1.2627,0.63135,0,3.4093-1.7678,3.4093-1.7678s2.6516-2.2728,3.1567-2.7779c0.50507-0.50508,2.5254-0.88388,3.5355-1.2627,1.0102-0.37881,5.4296-0.50508,5.4296-0.50508s1.894-1.2627,2.2728-1.894c0.37881-0.63135,1.7678-3.4093,1.894-3.9143,0.12627-0.50508,2.7779-2.3991,3.4093-2.9042,0.63135-0.50508,4.9245-2.5254,5.177-3.0305,0.25253-0.50508,2.0203-1.5152,2.0203-1.5152l3.1567,1.2627,2.9042,1.2627s2.2728,0.25254,2.9042,0.25254c0.63135,0,2.2728-0.50508,2.7779-0.88388,0.50508-0.37881,3.1567-1.7678,3.1567-1.7678s3.283,0.25254,3.7881,0.50508c0.50508,0.25253,1.7678,0.88388,2.3991,1.1364,0.63135,0.25254,3.9144,1.389,3.9144,1.389s3.6618,0.3788,4.4194,0.25254c0.75762-0.12627,2.5254-1.7678,2.7779-2.3991,0.25254-0.63134,0.75762-2.3991,1.6415-2.9042,0.88388-0.50507,4.2932-1.5152,4.2932-1.5152s1.389-0.12627,1.5152-1.6415c0.12627-1.5152,0.37881-2.9042-0.25254-3.5355-0.63135-0.63134-1.389-0.88388-1.7678-1.7678-0.3788-0.88389,0.88389-8.9651,0.88389-8.9651l1.6415-3.7881,1.2627-4.2932s1.389-2.2728,1.2627-2.9042c-0.12627-0.63134-0.37881-3.9143-0.37881-3.9143l-1-2.41s-1.1364-0.88388-1.5152-1.389c-0.37881-0.50507-1.0102-0.37881-1.5152-1.0102-0.50508-0.63135-1.7678-1.1364-1.7678-1.7678,0-0.63134-0.25254-1.5152,0.37881-2.0203,0.63134-0.50508,3.0305-3.0305,3.7881-3.4093,0.75761-0.37881,4.5457-2.5254,4.9245-3.0305,0.37881-0.50507,1.389-1.6415,1.7678-2.1466,0.37881-0.50508,0.88388-0.50508,0.63135-1.6415-0.25254-1.1364-2.6516-3.5355-2.6516-3.5355s-0.63135-0.88389-1.5152-0.88389c-0.88389,0-3.1567-0.3788-3.1567-1.0102,0-0.63134-0.37881-1.2627-0.12627-2.0203,0.25254-0.75762,2.0203-2.2728,2.2728-2.9042,0.25254-0.63135,0.37881-1.894,0.37881-1.894l-2.3991-1.6415-2.6516,0.12627s-0.25254-0.25253-0.25254-0.88388c0-0.63134,0.63135-2.7779,0.88388-3.283,0.25254-0.50507,0.50508-1.5152,0.63135-2.1466,0.12627-0.63134-0.25254-1.7678-0.75761-2.3991-0.50508-0.63135-1.5152-1.389-1.5152-1.389s-1.1364-0.50508-1.6415,0.12627c-0.50508,0.63134-1.1364,1.5152-1.1364,1.5152s-1.1364,0.12627-1.6415-0.25254c-0.50508-0.37881-0.88388-4.1669-0.88388-4.1669s-0.88389-1.2627-1.6415-1.389c-0.75762-0.12627-1.6415-0.12627-2.1466,0.50508-0.50507,0.63134-1.0102,1.0102-1.7678,1.5152-0.75762,0.50508-1.2627,1.1364-1.894,0.75762-0.63134-0.37881-1.389-0.75762-1.2627-1.389,0.12627-0.63135,0.75761-1.6415,0.88388-2.1466,0.12627-0.50507-1.7678-2.1466-1.7678-2.1466l-3.283-0.12627-1.1364-1.1364c-0.12627-0.75761,0.25254-2.5254,0.25254-2.5254l-1.389-1.5152-2.7779-4.0406-1.2627-1.894-3.1567-0.3788-1.1364-2.0203-0.25254-2.9042-1.2627-0.3788h-1.2627l-1.6415,0.63134-1.6415-1.0102-3.0304-0.63135-1.894,0.75762-0.37881,1.0102-0.12627,1.894,0.37881,1.894-0.25254,1.5152-0.50507,2.0203,0.75761,2.0203,0.50508,1.389,1.7678,1.5152,0.88389,0.88388,0.25254,1.894s-0.25254,1.0102-0.75762,1.389c-0.50507,0.37881-3.0305,1.2627-3.0305,1.2627s-2.3991,0.63134-2.9042,0.75761c-0.50508,0.12627-3.4093,0.75762-3.4093,0.75762l-1.389,1.5152-0.25254,1.6415,0.75762,2.5254,1.7678,3.283,1.6415,3.7881,0.75762,2.9042,2.0203,2.2728,1.2627,1.1364,2.1466,0.25254,2.2728,0.50507,1.7678,1.389,0.50507,1.6415,0.12627,1.894v2.3991l-1.894,1.6415-3.0305,1.2627-2.5254,1.2627-2.1466,2.0203-1.0102,1.7678-0.75761,2.1466-2.6516,1.6415-1.894,1.389-2.0203,1.5152-0.88388,0.88388v0.75762l0.88388,0.88388c0.50508,0.12627,2.1466,1.2627,2.1466,1.2627l1.894,1.0102s0.75762,0.88389,0.88389,1.389c0.12627,0.50508,0,1.5152-0.12627,2.1466-0.12627,0.63134-2.0203,3.6618-2.0203,3.6618l-1.894,1.6415-3.6618,2.0203-3.1567,0.63135-2.1466,1.0102s-0.75761,0.37881-1.1364,1.0102c-0.3788,0.63135-1.6415,1.2627-1.6415,1.2627l-2.2728,0.50507-1.0102,0.88388s-1.2627,0.88389-1.6415,1.389c-0.37881,0.50508-3.5355,2.9042-3.5355,2.9042l-0.88389,1.389s-0.75761,1.1364-1.389,1.2627c-0.63134,0.12627-2.2728,0.12627-2.2728,0.12627l-2.3991-0.88388-1.6415,1.389s-1.6415,0.37881-2.1466,0.88388c-0.50508,0.50508-2.7779,1.7678-2.7779,1.7678l-2.3991,0.63134s-1.894-0.25253-2.5254,0.12627c-0.63134,0.37881-1.2627,1.5152-1.2627,1.5152l0.63135,1.5152,0.25254,0.88388-0.88389,1.894s-1.0102,0.75762-1.0102,1.2627-0.88388,2.0203-0.88388,2.0203-0.50508,0.88388,0.25253,1.389c0.75762,0.50507,2.5254,0.88388,2.5254,0.88388s1.389-0.12627,1.5152,0.50508c0.12627,0.63134-1.1364,1.6415-1.1364,1.6415l-2.6516,0.75762-2.0203,1.2627-0.88389,1.6415z",
                            "name": "Забайкальский край"
                        },
                        "am": {
                            "path": "m692.32,397.46,4.6429-0.17857,2.3214-0.17858,3.5714-1.7857,2.6786,0.35714,3.5714,1.0714,2.1429,1.0714,2.6786,0.53571,4.4643-0.53571,3.0357,0,2.3214,0.53571,2.8571,2.1429,2.1429,0.89286,2.8571,0.35714,2.3214-1.7857,2.3214-0.71429,1.9643,0,2.1429,1.4286,2.1429,0.71429,2.5-0.71429,1.7857-1.9643,1.7857-1.25,4.1072,0,2.5-1.4286,2.1428-0.89286,3.75,0,1.4286,0,1.25-0.71429,0.53571-2.5,1.6071-1.0714,4.2857-2.3214,2.3214-0.89286,3.5714-1.9643,2.8572-1.4286,5-0.89286,3.0357,0,1.6071,1.4286l-0.37,3.2s-1.25,1.6071-1.9643,2.6786c-0.71429,1.0714-1.6072,2.6786-1.9643,3.3929-0.35714,0.71429-1.25,2.1429-1.25,2.1429s-0.53571,2.8571-0.71429,3.5714c-0.17857,0.71428-1.0714,2.8571-1.0714,2.8571s-1.25,1.7857-1.0714,2.5c0.17857,0.71428,1.25,1.25,1.25,1.25l0.89285,0.71428,3.2143-0.71428s1.7857-0.17857,2.6786-0.17857c0.89286,0,2.5,0.89285,2.5,0.89285l0.53572,1.9643,0.89285,2.6786s0.17857,0.53572,1.6072,0.53572,2.6786-1.4286,2.6786-1.4286l0.17857-2.3214s1.0714-0.89286,1.9643-0.89286c0.89286,0,2.5-0.53572,2.5-0.53572l1.25-2.1428,0.35715-2.5,1.9643-1.7857,2.3214,0.17857c0.71,0.19,3.03-1.6,3.03-1.6l1.4286-1.4286s0.89285-1.0714,1.9643-0.35714c1.0714,0.71428,2.3214,2.5,2.3214,2.5v2.8571l0.53572,1.6071,1.9643,1.7857s1.6071,0.71428,1.25,1.6071c-0.35714,0.89286-2.8571,1.9643-3.5714,1.9643-0.71428,0-3.5714,0.89285-3.5714,0.89285l-1.6071,0.17857-1.96,0.89s-0.71429,0.17857-0.17858,1.0714c0.53572,0.89286,1.9643,1.7857,1.9643,1.7857l1.25,0.89286,0.35714,1.9643-3.2143,2.3214-1.6072,3.0357-0.17857,2.1429-1.6071,2.3214-2.6786,0.89285-1.6071,1.4286,1.9643,1.9643,0.35714,1.7857-2.3214,2.3214-1.25,3.5714,1.6071,2.8571s3.5714,1.4286,4.2857,1.6072c0.71429,0.17857,4.8214,0.71428,4.8214,0.71428s1.4286,0.71429,1.9643,1.25c0.53571,0.53572,0.71428,3.2143,0.71428,3.2143l0.35715,2.5s0,0.53571,0.71428,1.0714c0.71429,0.53571,0,3.5714,0,3.5714l-0.71428,2.8571-0.53572,1.7857-1.25,1.7857-3.2143,0.35714-4.1072-0.17857-2.8571-1.4286-1.77-0.53-3.04,1.07h-3.3929-2.5l-3.2143,0.89286s-2.6786-0.35714-3.5714-0.53572c-0.89286-0.17857-3.5714-2.1428-3.5714-2.1428l-3.22-2.67-1.07-2.15-1.43-2.14-1.7857-1.0714-1.0714-1.9643s0-1.0714-0.71428-1.6072c-0.71429-0.53571-2.6786-0.71428-2.6786-0.71428l-0.89286-1.25-1.7857-2.8571-1.9643-2.5s-1.25-1.4286-1.9643-1.6072c-0.72-0.18-1.79-0.36-2.15-1.43-0.35715-1.0714-2.3214-2.6786-2.3214-2.6786l-2.8572-1.4286-2.6786-1.4286-3.0357-0.17857-2.6786-0.17858s-0.71429,0.89286-1.6072,1.0714c-0.89285,0.17857-4.4643-0.35714-4.4643-0.35714l-3.5714-1.25-2.3214,0.35714-1.9643,0.89286-1.6072,1.4286-3.75,0.71429s-3.2143,0.71428-3.3928,0c-0.17858-0.71429-2.8572-4.1072-2.8572-4.1072l-1.7857-1.4286h-1.6071l-1.0714-1.0714v-2.1428l2.1428-2.1429,0.17858-1.4286-0.89286-1.4286-1.25-0.89286-2.1429-0.17857s-0.71428,1.0714-0.71428,0,0.71428-3.3929,0.71428-3.3929l0.89286-2.3214-0.35714-1.9643-1.25-1.7857-1.7857-0.71428-1.25,0.71428-1.25,0.71429-1.25-0.17857s-0.35714-0.71429-0.35714-1.4286c0-0.71429-1.25-2.6786-1.25-2.6786l-0.71429-0.71428-1.7857-0.17857-0.89286,0.89285-1.4286,0.89286-2.5,0.53572s-0.35714-0.35715-0.17857-1.0714c0.17857-0.71429,0.71428-2.5,0.71428-2.5l-1.25-1.4286-0.51-0.52-1.79-0.18h-2.1429l-0.35714-1.0714v-2.1429z",
                            "name": "Амурская область"
                        },
                        "ch": {
                            "path": "M906.72,53.094c-0.34,0-0.66,0.094-0.66,0.094l-1.78,2.124-4.47,1.969s-6.05,2.853-7.12,3.031c-1.07,0.179-1.44,1.969-1.44,1.969s0.37,2.514,0.19,3.407c-0.18,0.892-1.44,1.406-1.44,1.406s-2.32,1.428-2.5,2.5c-0.18,1.071,0.91,2.156,0.91,2.156s2.66,0.906,3.37,0.906c0.72,0,2.85-0.375,3.56-0.375,0.72,0-0.34,1.625-0.34,1.625l-0.91,1.782-2.31-0.907-3.03-0.719s-2.14,0.554-3.03,0.376c-0.89-0.179-2.31-1.438-2.31-1.438l-2.69,0.531-2.88,0.375h-1.06s-0.53,2.656-1.25,2.656c-0.71,0-2.12,1.782-2.12,1.782l-3.41,0.187-2.84,2.875s-2.86,2.496-3.75,3.032c-0.9,0.535-1.61,0.531-2.5,0.531-0.9,0-2.5,1.062-2.5,1.062l-4.85,3.219-5.15,1.062-3.07,0.907s-1.04,2.861-1.93,3.219c-0.9,0.357-2.88,1.968-2.88,1.968l-3.22,1.938-2.12,1.966-2.16,3.03-1.25,1.97-1.06,2.5v3.22s-0.91,0.72-1.63,0.72c-0.71,0-2.84,1.25-2.84,1.25s-0.9,2.51-1.44,3.41c-0.53,0.89-2.85,1.76-3.56,2.12s0.34,1.25,0.34,1.25l2.35,0.53,0.53,2.16,2.69,0.53h2.65,3.75s1.44,1.07,1.97,1.78c0.54,0.72,1.63,1.78,1.63,1.78l-1.82,2.5-2.5,1.1-2.31-0.72s-1.6,1.25-2.31,1.25c-0.72,0-2.16,1.59-2.16,1.59s-1.42-0.71-2.31-1.25c-0.89-0.53-1.96,0-3.03,0s-1.26,1.26-1.44,1.97-0.87,2.84-0.87,2.84-1.09,1.79-1.63,2.5c-0.53,0.72-2.66,2.69-3.37,3.22-0.72,0.54-1.81,0.54-4.13,0.72s-1.07,1.26-1.25,2.16c-0.18,0.89-1.06,3.03-1.06,3.03s-2.15,1.24-2.69,2.31c-0.53,1.07-0.53,2.67-0.53,3.56,0,0.9,0.53,1.82,0.53,1.82h1.06l0.19-0.72,0.19-1.97,0.72-1.06,0.72,0.53,3.9,1.59,5,3.41,0.38,0.87-0.38,5.19-1.06,2.84-4.09,4.47-2.88,3.94-0.34,2.5,1.25,0.19h1.59s-0.17,1.42-0.53,2.31,0.34,1.59,0.34,1.59l2.88,1.25,3.75,0.38,4.62-0.19,2.69,3.41,2.16,1.78h4.47c1.25,0,1.06,2.5,1.06,2.5l1.06,1.59,3.94-0.34s5.36-1.44,6.25-1.44,3.2-0.53,3.56-1.25c0.36-0.71,2.69-1.59,2.69-1.59l1.97-0.91h3.75s2.66-1.24,3.37-1.59c0.72-0.36,0.74-1.98,1.1-2.69,0.35-0.71,0.87-3.03,0.87-3.03l1.25-2.5h1.63l1.78-1.06,1.06-1.63,1.44-0.34,2.31-1.44,1.06-1.25s0.91-0.89,1.63-1.78c0.71-0.89,0.87-1.6,1.4-2.31,0.54-0.72,2.51-1.44,3.22-1.97,0.72-0.54,2.15-2.14,2.5-3.03,0.36-0.9,1.63,0,1.63,0l4.09,0.68s3.22-1.04,5.72-1.93c2.5-0.9,1.08,1.06,0.91,1.78-0.18,0.71,0,3.2,0,4.09s0.88,3.22,1.78,4.47c0.89,1.25,3.9-1.44,3.9-1.44s3.05-1.78,3.94-2.5c0.89-0.71,3.94,0,3.94,0h6.06v-2.84c0-0.72,1.43-3.23,1.97-4.13,0.54-0.89,1.25-3.56,1.25-3.56l0.72-2.5-0.19-4.81s1.79-1.97,3.22-1.97,2.69,1.59,2.69,1.59l4.28,0.91,1.44-0.53s-0.19-3.22-0.19-3.94c0-0.71-0.19-2.84-0.19-2.84l-0.53-3.22s-0.54-2.51-0.72-3.41c-0.18-0.89-0.87-2.12-0.87-2.12l-2.5-1.63,1.25-0.87,4.09-0.38s1.96-2.66,2.5-3.37c0.54-0.72,2.84-2.35,2.84-2.35v-2.5s-1.04-2.13-1.93-3.03c-0.9-0.89-2.35,0.18-3.07,0.53-0.71,0.36-3.03-0.34-3.03-0.34s-1.41-0.88-2.12-0.34c-0.72,0.53-1.63,1.06-1.63,1.06l-1.4-1.06-1.97,1.78-1.44-0.72s-2.84-1.79-4.09-1.25c-1.25,0.53-1.97-0.72-1.97-0.72h-2.5s-0.56,1.25-1.1,1.97c-0.53,0.71-3.03,0.87-3.03,0.87l-2.84,0.91-2.69,3.75-2.69,0.53,1.25-2.5,0.19-1.59-3.03-0.38s2.13-0.88,2.84-1.06c0.72-0.18,3.41-1.06,3.41-1.06l1.97-0.91,0.34-1.59s1.78-3.41,1.78-4.13c0-0.71-0.68-3.22-0.68-3.22l-0.91-2.31s-2.5-4.63-3.22-5.34c-0.71-0.72-1.05-1.78-2.12-1.78-1.08,0-3.07,0.68-3.07,0.68l-1.4,0.91-1.25-1.06s-2.17-1.98-3.6-2.159c-1.42-0.178,0.38-0.719,0.38-0.719l0.87-1.593s-0.16-1.973,0.38-2.688c0.53-0.714,1.97,1.25,1.97,1.25s2.67,1.438,3.56,1.438,1.78,0.531,1.78,0.531,3.41-0.371,4.13-0.906c0.71-0.536,0.68-2.313,0.68-2.313l0.19-2.687,0.72-1.25,1.25-1.782s0.36-1.964,1.25-2.5c0.89-0.535,1.79,0,2.69,0,0.89,0,2.31,1.626,2.31,1.626l1.59,0.718,2.5-1.437s1.28-2.139,1.82-3.031c0.53-0.893,2.84-1.782,2.84-1.782l2.84-2.156,1.44-3.219s2.14-1.973,2.5-2.687c0.36-0.715-0.34-1.782-1.59-1.782h-1.78l-1.82-1.062-1.93-0.188-3.07-1.781-3.18-0.187h-3.75c-0.9,0,0-0.875,0-0.875l2.5-1.625,0.68-2.5-1.06-1.25-2.5-0.532,1.78-1.25,0.53-1.25-2.31-0.531v-2.5s-0.35-1.785-0.53-2.5c-0.09-0.357-0.45-0.437-0.78-0.437zm-77.19,16.062c-0.22-0.01-0.48,0.081-0.78,0.282-1.61,1.071-3.94,2.312-3.94,2.312-1.07,0.357-1.79,1.42-1.97,2.312-0.17,0.893-0.53,2.88-0.53,3.594,0,0.715,0.2,2.496,1.1,3.032,0.89,0.535,3.03,1.598,3.03,2.312s-0.56,2.321,0.15,2.5c0.72,0.179,1.44-0.522,1.97-1.594,0.54-1.071,0.36-3.419,0.72-4.312s1.45-2.491,1.63-3.563c0.17-1.071-0.19-5.187-0.19-5.187s-0.24-1.644-1.19-1.688z",
                            "name": "Чукотский автономный округ"
                        },
                        "ha": {
                            "path": "m809.82,276.93c0.53572-0.71428,1.4286-1.4286,1.9643-2.3214,0.53571-0.89285,1.7857-2.5,1.7857-2.5s1.7857-0.17857,4.1072,0.17858c2.3214,0.35714,4.4643,1.4286,5.7143,2.1428,1.25,0.71429,2.6786,1.25,3.0357,2.3214,0.35714,1.0714,1.6071,2.1429,1.6071,3.3929s-1.4286,3.5714-1.4286,4.2857c0,0.71429-0.17857,2.5,0.71428,3.3929,0.89286,0.89286,0.71429,1.6071,1.7857,1.4286,1.0714-0.17857,3.9286-1.0714,5-1.25,1.0714-0.17857,3.3929,0,5,0.53572,1.6071,0.53571,2.8571,0.89285,3.2143,1.6071,0.35715,0.71428,1.0714,1.4286,0.89286,2.5-0.17857,1.0714-2.5,2.8571-2.5,2.8571l0.17857,1.4286,0.89286,1.6072s1.6071,0.71428-0.35714,0.89285c-1.9643,0.17857-3.0357-0.71428-3.0357-0.71428s0.17857-0.17857,0-1.0714c-0.17857-0.89286-0.71428-1.7857-1.7857-1.4286-1.0714,0.35714-2.3214,1.9643-3.0357,2.5-0.71428,0.53571-2.8571,3.0357-2.8571,3.0357s-1.9643,0.71429-2.8571,1.7857c-0.89286,1.0714-4.1071,4.6428-4.1071,4.6428s-0.17858,1.25-1.0714,2.5c-0.89286,1.25-2.3214,2.3214-2.5,3.5714-0.17857,1.25,0,4.1071,0,4.1071s1.4286,1.0714,1.6071,2.3214c0.17857,1.25-0.89286,1.9643-1.25,2.8572-0.35714,0.89285-1.4286,0.53571-1.4286,1.7857s0.17857,5.7143,0.17857,5.7143l-0.35714,4.8214-0.35715,4.1072s-1.0714,1.9643-1.25,3.2143c-0.17857,1.25-0.35714,2.6786-0.35714,3.3929,0,0.71429-0.17857,3.0357-0.17857,3.75,0,0.71429-0.71429,1.9643-0.89286,2.6786-0.17857,0.71429-1.0714,1.25-0.17857,1.9643,0.89286,0.71428,1.9643,1.9643,1.9643,1.9643l-1.7857,3.3929-0.17857,1.9643-1.7857,3.3928-1.25,3.75-0.35715,4.1072-0.71428,1.6071-3.2143,4.1071,0.35715,2.6786s2.1428,1.0714,2.8571,1.0714c0.71428,0,3.3929,0.53572,4.4643-0.17857s2.5-1.4286,3.2143-1.7857c0.71429-0.35715,1.6071-0.89286,2.8571,0.35714s2.5,4.4643,2.5,4.4643,0.17857,1.4286,1.4286,1.0714c1.25-0.35714,1.9643-2.1428,1.9643-2.1428l-1.0714-2.1429,0.53572-2.6786-0.53572-1.7857-1.6071-2.5s-1.7857-1.4286-2.5-1.4286c-0.71429,0-3.75,1.4286-3.75,1.4286s-1.9643,2.3214-1.6071,1.4286c0.35714-0.89285,1.9643-3.3928,1.9643-3.3928l1.6071-0.35715,1.25-1.7857s0.89286-0.71429,1.9643-0.71429,3.2143-1.25,3.2143-1.25,1.25-2.6786,1.0714-0.89285c-0.12,1.78-1.72,4.28-1.72,4.28l1.0714,2.1429,1.9643,2.1429,0.53572,1.7857-0.17857,2.6786,2.3214,1.4286v1.6072,2.8571l1.7857-0.71429c0.71429-0.71428,2.1429-4.2857,2.1429-4.2857l0.89285-3.2143v-2.1428s-1.6071-1.7857-0.89285-1.9643c0.71428-0.17857,4.6428-2.1429,4.6428-2.1429s2.1429-0.53571,3.0357-0.53571c0.89286,0,4.1071,0.17857,4.8214,0.35714,0.71428,0.17857,4.4643,1.6071,4.4643,1.6071s4.4643,1.25,5.1786,1.25c0.71429,0,1.9643,1.7857,1.9643,1.7857s-0.89286,1.9643,0.53571,2.8571c1.4286,0.89286,4.8214,3.0357,4.8214,3.0357l3.75,2.1428s1.4286,3.3929,1.4286,4.2857c0,0.89285-0.17857,4.6428-0.17857,5.7143,0,1.0714,0,5,0.53572,5.7143,0.53571,0.71428,1.0714,2.3214,2.1428,3.2143,1.0714,0.89286,3.2143,4.2857,3.2143,4.2857l2.5,1.25,3.0357,6.9643s1.4286,1.4286,1.6072,2.3214c0.17857,0.89286,1.6071,3.0357,1.7857,3.75,0.17857,0.71429,1.6071,5,1.7857,5.7143,0.17857,0.71428-0.53572,8.5714-0.53572,8.5714l0.53572,3.3928s0,1.25-0.89286,1.9643c-0.89286,0.71429-3.5714,1.6071-3.5714,1.6071l-1.4286,0.17857-1.4286-1.7857-0.53572-2.6786-3.0357-3.0357s-1.9643-1.25-2.6786-0.71428c-0.71429,0.53571-2.3214,1.9643-2.3214,1.9643s-0.89286,1.7857-1.25,2.5c-0.35714,0.71429-1.4286,1.25-0.89286,2.3214,0.53572,1.0714,1.9643,2.6786,1.9643,2.6786s0.35714-0.71428,2.1428-0.53571c1.79,0.18,2.14,2.68,2.14,2.68l-0.89286,3.2143s-1.9643,1.25-2.6786,1.6071c-0.71428,0.35714-2.8571,1.25-1.7857,2.1429,1.0714,0.89285,2.3214,1.25,2.3214,1.25s0.71428,1.25,0,1.9643c-0.71429,0.71429-2.3214,2.1429-2.3214,2.1429s-1.7857,0.35714-3.0357,1.25-3.2143,1.4286-4.2857,1.6071c-1.0714,0.17857-2.8571,1.25-4.1071,0s-2.1429-0.89285-2.5,0.17857c-0.35715,1.0714-1.6072,0.89286-1.7857,1.9643-0.17857,1.0714,0,2.8571,0.35715,3.5714,0.35714,0.71428,0,3.0357,0,3.0357s-2.3214,1.9643-2.5,1.25c-0.17858-0.71428,0.17857-2.3214-0.35715-3.2143-0.53571-0.89286-2.3214-2.5-2.3214-2.5s-2.8571-1.4286-1.7857-2.3214c1.0714-0.89286,2.8571-2.6786,3.2143-3.2143,0.35714-0.53571,0.35714-3.0357,0.35714-3.0357s-2.1429-0.89286-2.6786-1.7857c-0.53572-0.89285-1.0714-3.3928-1.0714-4.1071,0-0.71428-0.71429-3.3929,0.17857-3.75,0.89286-0.35714,2.8571-1.9643,2.8571-1.9643l0.53572-1.9643s-0.53572-0.35714-2.1429-0.35714c-1.6071,0-2.5-0.17857-3.9286,0.89285s-1.4286,1.0714-2.5,2.5-2.1429,2.6786-3.2143,3.2143c-1.0714,0.53571-2.6786,0.71429-2.6786,0.71429s-4.1071-0.71429-4.2857-1.4286c-0.17857-0.71428-1.6072-1.9643-2.5-1.9643-0.89286,0-2.1429,0.35714-3.2143,0.89286-1.06,0.55-1.95,0.73-2.84,0.73-0.89286,0-4.2857,1.0714-4.2857,1.0714s-2.1428,1.7857-3.2143,1.7857c-1.0714,0-2.1014,0.40945-2.28-0.66198-0.17857-1.0714-1.0823-3.4216-1.0823-3.4216l-1.5332-4.3507s-2.6677-0.69261-3.7392-0.87119c-1.0714-0.17857-3.8221-0.85138-3.8221-0.85138l-2.4892-1.1525s-2.1249-2.2078-1.7678-2.9221c0.35714-0.71428,1.7028-4.0044,2.4171-4.5401,0.71428-0.53572,1.2608-1.4069,1.2608-1.4069l-1.25-2.3214s-1.7965-1.2085-0.90368-1.7442c0.89286-0.53571,3.7608-2.0058,3.7608-2.0058l2.0906-4.0892,1.5025-3.2341,3.5498-2.6767-0.89285-1.9643-2.4171-1.7118-0.11357-1.6288,2.5306-1.1237,4.1071-0.71428,2.6786-0.89286,1.0714-1.25-0.53571-1.6071-1.986-1.47-1.0083-2.5108-0.0631-2.4477-1.47-2.0058-1.7226-0.67282-2.2583,1.7442s-1.6703,1.0823-2.3846,1.4394c-0.73,0.34-2.87,0.19-2.87,0.19l-2.3214,1.25-0.44008,2.5-0.80992,2.3214-2.5,1.0714-2.1429,0.53571-0.53571,2.4585-1.4809,1.4286-2.3431-0.17857-0.99746-2.4585-1.0714-2.5s-1.2608-0.51404-1.9751-0.69262c-0.71428-0.17857-4.4534,0.51405-4.4534,0.51405l-1.7857-0.17857-1.7857-1.25,1.9643-5.5357,0.89286-4.1072s1.25-2.3214,1.9643-3.0357c0.71428-0.71429,3.0357-5,3.0357-5l0.35714-2.6786s-0.53571-1.25-1.6071-1.6072c-1.0714-0.35714-5.3571,0.17858-5.3571,0.17858l-2.6786,0.53571s-3.3424,2.5325-4.0567,1.8182c-0.71428-0.71429-1.1219-3.9611-1.1219-3.9611s-3.0376-1.6288-3.0376-2.5217c0-0.89286,1.9662-1.5855,1.9662-1.5855s0.53571-1.0714,0.71428-2.1429c0.17857-1.0714-0.20024-2.8138-0.20024-2.8138l-2.6281-0.77741s-1.4069-0.89472-2.1212-1.0733c-0.71428-0.17857,1.1996-2.2998,1.1996-2.2998l0.89286-1.6072-0.35714-1.0714s-2.2493-0.54655-2.2493-1.2608c0-0.71429,1.6505-3.3604,1.6505-3.3604l-1.5873-1.6703-2.5415-0.82971-0.80806-1.618s0.69262-0.73594,1.5855-1.0931c0.89286-0.35714,1.0498-0.61866,1.0498-0.61866l-1.3852-0.89286v-2.4062c0-0.71429-0.074-2.3304-0.074-2.3304s-1.2718-1.1078-1.4502-2.345c-0.1894-1.3131,2.6371-1.7532,2.6371-1.7532l-0.93619-0.82972-0.49238-1.4917,0.2417-2.1339,2.7525-0.86037,2.9094-0.89285,2.4477,0.1371,0.70345-1.8922,3.2034,0.21106,2.9203,0.0108s0.35715-1.7749,0.35715-2.4892c0-0.71428-1.8705-1.618-1.4286-2.2691,0.40112-0.59101,1.5657-0.89285,2.4585-1.0714,0.89286-0.17858,3.9286-0.71429,4.1072-1.4286,0.17857-0.71428,2.5829-6.1562,2.5829-6.1562s0.96683-1.0083,1.6811-1.1869c0.71429-0.17857,3.9286-0.93432,3.9286-0.93432l-1.764-2.794-3.0051-2.8246-1.6378-4.8539-2.3214-2.1428-1.4286-1.7857v-5.3571l3.0357-6.7857-1.0714-3.2143-0.72512-5.8585,0.81889-2.85s3.5498,0.11543,4.264,0.29401c0.71428,0.17857,7.7634,0.22004,7.7634,0.22004s0.95599-4.0152,1.3131-4.7295c0.35714-0.71428,1.3871-0.826,2.28-1.0046,0.89286-0.17857,3.3495-0.62051,3.3495-0.62051l2.5433,1.1562,1.6071-1.0714z",
                            "name": "Хабаровский край",
                            "id": [39]
                        },
                        "eu": {
                            "path": "m811.96,462.82c0.98214,1.875,1.1607,1.875,1.875,2.5893l2.6786,2.6786s0.80357,1.1607,1.0714,1.7857c0.26786,0.625-0.0893,1.6964,0.625,1.9643,0.71429,0.26785,2.3214,0.53571,2.7679,0.625,0.44643,0.0893,1.4286,1.0714,2.3214,1.1607,0.89285,0.0893,1.6071,0.0893,2.1428-0.35714,0.53572-0.44643,1.0714-1.25,1.6964-1.7857,0.625-0.53571,2.5893-1.4286,3.125-1.6964,0.53572-0.26785,1.875-0.625,2.3214-1.0714,0.44643-0.44643,1.1607-0.98215,1.1607-2.0536s0.26785-2.7678,0.71428-3.125c0.44643-0.35714,2.9464-1.9643,3.5714-2.5,0.625-0.53571,1.6964-2.2321,2.1429-2.8571,0.44643-0.625,1.875-2.6786,2.2321-3.2143,0.35714-0.53572,2.1429-2.0536,2.1429-2.0536l2.0536-2.3214,0.98214-1.0714,2.6786-1.875,0.71429-0.80357,0.17857-1.1607,0.0893-0.35714-1.5179-0.17857-1.875-0.0893-1.6964,0.44643-1.6964,1.1607-1.3393,1.25-0.80358,1.0714-1.25,1.6072-1.4286,0.98214-1.7857,0.625s-1.25,0.17857-1.7857,0c-0.53571-0.17857-2.1428-0.71429-2.1428-0.71429l-1.4286-0.625-0.80358-0.98214-0.89285-0.625s-0.80357-0.26786-1.1607-0.17857c-0.35714,0.0893-1.7857,0.625-1.7857,0.625l-2.0536,0.71429-2.4107,0.17857s-1.0714,0.44643-1.7857,0.625c-0.71429,0.17857-2.4107,0.80357-2.4107,0.80357l-1.4286,0.89285-1.875,0.26786-0.80357,0.17857-0.35714,0.98215-0.0893,1.4286s-0.44643,1.1607-0.44643,1.5178c0,0.35715-0.53571,1.875-0.53571,1.875l-0.53571,1.1607-0.71429,1.4286z",
                            "name": "Еврейская автономная область"
                        },
                        "pr": {
                            "path": "m852.68,473.71c0,0.53571,0.53571,1.25,0.53571,1.25l1.4286,1.4286s0.35715,1.0714,0.44643,1.4286c0.0893,0.35714-0.625,2.0536-0.625,2.0536l-1.1607,2.7679s-0.0893,2.2321,0,2.5893c0.0893,0.35715,0.625,1.0714,0.89285,1.5179,0.26786,0.44643,0.80358,1.1607,0.80358,1.5179,0,0.35714-0.80358,1.9643-0.80358,1.9643v1.9643c0,0.44643-0.44642,1.9643-0.44642,1.9643s-0.17858,0.0893-0.17858,1.0714v2.7679c0,0.71429-0.26785,3.0357-0.35714,3.3929-0.0893,0.35714-1.9643,0.53571-2.3214,0.53571-0.35714,0-1.3393-0.98214-1.3393-0.98214s-0.98215-1.6071-1.1607-2.0536c-0.17857-0.44643-1.3393-1.5179-1.3393-1.875,0-0.35715-0.26786-1.6072-0.89286-1.7857-0.625-0.17857-1.5179,0.26786-1.5179,0.26786s-0.53571,0.89286-0.625,1.25c-0.0893,0.35714,0,0.98214-0.0893,1.4286-0.0893,0.44643-0.71429,2.5-0.71429,2.5s-0.625,0.625-1.1607,0.89286c-0.53572,0.26786-2.2322,1.0714-2.2322,1.6071,0,0.53572,1.0714,0.71429,2.1429,2.0536,1.0714,1.3393,3.125,4.6429,3.125,4.6429l2.5,4.2857,1.4286,4.9107s0.44643,1.6071,0.625,2.1429c0.17857,0.53571,0.89286,1.1607,0.98215,1.9643,0.0893,0.80357,0.53571,2.5-0.35715,2.8571-0.89285,0.35715-4.0178,1.0714-4.0178,1.0714l-0.71429,0.625,1.1607,0.71429s0.625,0.44643,1.0714,0.53571c0.44643,0.0893,0.53572,1.4286,0.98215,1.4286,0.44642,0,1.875-0.35714,2.4107-0.71428,0.53571-0.35714,1.3393-0.625,2.1429-0.625,0.80357,0,1.4286-0.44643,1.4286-1.0714,0-0.625-0.625-3.3929-0.625-3.8393,0-0.44642,1.5179-2.5893,1.5179-2.5893v-2.1429c0-0.35714-0.17858-1.4286,0.35714-1.5179,0.53571-0.0893,2.9464-0.71428,2.9464-0.71428s0-1.1607,1.0714-0.26786c1.0714,0.89286,1.5178,2.9464,1.5178,2.9464s1.875,0.35714,2.2322,0.17857c0.35714-0.17857,0.98214-0.625,1.5178-0.98214,0.53572-0.35714,2.5893-0.53572,3.3929-0.53572,0.80357,0,2.1429-0.44642,2.1429-0.44642l-0.26786-1.1607s2.0536-1.25,2.5-1.5179c0.44643-0.26785,2.2321-1.1607,2.8571-1.7857s1.5179-1.4286,1.9643-2.4107c0.44643-0.98215,1.3393-3.125,1.5179-3.4822,0.17857-0.35714,1.1607-2.5,1.4286-3.2143,0.26785-0.71429,0.89285-2.3214,1.3393-3.125,0.44643-0.80357,1.5179-2.8572,1.5179-2.8572s-0.0893-2.3214-0.0893-2.8571c0-0.53571-0.26785-1.875-0.625-2.8571-0.35714-0.98214-0.53571-1.1607-0.44642-2.1429,0.0893-0.98214,0.98214-1.6071,1.6071-2.0536,0.625-0.44643,1.0714-1.4286,1.0714-1.9643,0-0.53571-1.25-2.9464-1.25-2.9464s0.0893-1.1607,0.35714-1.6964c0.26786-0.53572,1.5179-1.7857,1.5179-1.7857l0.17857-2.9464s0.80357-2.2321,0.80357-2.6786c0-0.44643,0.26786-3.9286,0.26786-3.9286l0.89285-2.1429s0.26786-3.3928,0.26786-3.9286c0-0.53571-0.53571-5-0.53571-5.5357,0-0.53572-0.17857-4.1071-0.17857-4.7321s-0.71429-2.1429-0.71429-2.5893c0-0.44643,0.0893-2.1429,0.26786-2.5893,0.17857-0.44643,0.98214-1.9643,0.98214-1.9643s-0.0893-2.0536-0.0893-2.5893c0-0.53571,0.17858-1.6964-0.44642-1.7857s-2.3214,0.80357-2.3214,0.80357l-1.7857,0.71429-1.5178,0.17857-0.71429-0.44643-1.0714-1.4286s-0.26786-1.4286-0.26786-1.7857c0-0.35714-0.53571-1.1607-0.53571-1.1607l-1.25-1.3393-1.3393-1.3393-1.4286-0.71429-1.0714,0.17857s-0.98214,0.17858-1.0714,0.53572c-0.0893,0.35714-0.53572,0.44643-0.80358,0.80357-0.26785,0.35714-1.1607,1.3393-1.1607,1.3393l-0.53571,1.0714-0.44643,1.0714-0.80357,0.80357-0.17858,0.71429,0.35715,0.80357,0.89285,0.98214s0,0.71429,0.53572,0.80358c0.53571,0.0893,1.0714,0.0893,1.0714,0.0893h1.3393l1.25,0.625,0.71429,0.80357,0.0893,1.3393-0.26785,1.4286-0.44643,1.25-0.53572,0.71429-1.5178,0.89285-1.7857,0.89286-0.89285,0.89286,0.26785,0.80357,1.9643,0.80357,0.80357,0.98214-0.0893,0.71429-0.80357,1.0714-1.0714,1.0714-1.875,0.89286-1.7857,0.98214-3.64,1.44-1.6964,0.44643-1.9643,0.26786-0.89286-0.44643-1.25-0.71429s-0.53571-0.26786-0.89285,0c-0.35715,0.26786-0.625,0.98214-0.625,0.98214l-1.5179,1.0714-0.53571,1.6964,0.0893,1.3393s0.35714,0.71428,0.44643,1.1607c0.08,0.44,0.08,1.33,0.08,1.33l-0.0893,1.6071-0.98214,1.0714z",
                            "name": "Приморский край",
                            "id": [23]
                        },
                        "ma": {
                            "path": "m859.64,182.46s1.0714,0.71428,2.1429,1.25c1.0714,0.53571,3.0357,2.1429,3.2143,2.8571,0.17857,0.71429,0.17857,2.3214,1.0714,2.8571,0.89286,0.53572,3.5714,1.0714,3.5714,1.0714l1.9643,0.89286,1.0714,1.7857,3.0357,1.6072s0.71429,1.0714,0.17857,1.9643c-0.53571,0.89286,0,2.6786,0,2.6786l2.5-0.35714,2.8572,0.35714,1.6071,2.3214,1.9643,2.6786,2.1429,1.0714,1.9643,2.1429,1.0714,1.9643,0.17857,2.5s-0.35715,2.5,0,3.2143c0.35714,0.71429,1.0714,3.75,1.0714,3.75l1.0714,1.7857s0.53572,1.0714,0.53572,1.7857c0,0.71428-0.89286,2.1429-0.89286,2.1429l0.17857,1.7857-1.9643-0.53571-0.35715-1.9643s0.35715-0.71429-0.53571-0.35714c-0.89286,0.35714-1.7857,1.4286-1.7857,1.4286s-0.35715,0.89286-1.0714-0.53572c-0.71429-1.4286-1.7857-1.9643-1.7857-1.9643s-1.6071-0.71429-1.6071-1.9643-1.7857-2.3214-1.7857-2.3214l-1.6072-1.4286s-0.35714,1.7857-0.35714,2.5c0,0.71429,1.4286,1.4286-0.35714,1.4286s-4.1072,0.71429-4.1072,0.71429l-0.89285,1.0714-0.35715,2.6786-1.25,1.25-2.6786,2.8571-0.35714,2.3214-1.0714,1.9643,0.53572,2.3214,1.4286,1.4286s0.53571,0.71428,0.53571,1.4286v2.6786l0.17857,1.6071,1.6072,1.4286,0.17857,4.4643v4.4643l0.17857,3.0357,1.7857,2.6786,1.0714,3.0357,0.35714,0.89285,1.9643,0.35715,1.0714-1.25,1.9643-1.0714s1.6072-0.17857,2.3214-0.17857c0.71429,0,1.6072,0.89285,1.6072,0.89285l0.17857,0.89286-1.7857,1.4286-1.7857,0.71429v1.0714l-0.71429,0.89285-1.7857,0.89286-1.25,0.53571-0.53572,0.71429-0.17857,2.6786v2.3214l-0.89285,0.71429-1.7857-0.89286-0.71428,1.4286-0.53572,2.5-1.0714,1.25-3.2143,0.71429-1.25-0.17858-0.53572-1.6071,2.5-1.6071,1.25-1.9643s1.9643-1.7857,0.53572-1.7857-2.6786,1.0714-2.6786,1.0714l-0.89286,1.25-0.89286,0.53571s-0.89286,0.35714-1.7857-0.17857c-0.89286-0.53571-2.3214-0.71429-2.3214-0.71429s-1.25,0.89286-1.25,1.4286c0,0.53571,0.35714,1.4286-0.53572,1.4286-0.89285,0-3.2143,0.17857-3.2143,0.17857l-2.5,1.6071-2.5,0.89286-1.0714,2.1429,0.35714,1.7857,0.53572,1.9643,0.35714,0.89285,1.6071,1.0714s0.17857,0.89286-1.7857,0.89286h-4.4643l-1.0714,2.1429-1.0714,1.25-2.5,0.35714-2.1429-2.8571-2.6786-1.25s-1.9643-0.71429-2.6786-0.71429c-0.71429,0-3.3929,0.17857-3.3929,0.17857l-2.1429,0.89286-1.7857,0.17857-1.25-0.89286-1.0714-1.7857-0.17857-2.3214,1.25-1.9643,0.17857-2.5-2.5-3.9286-2.3214-1.4286-2.3214-1.25-2.6786-0.71428-2.6786-0.71429-2.1429,0.71429-1.0714,1.4286-1.0714,1.9643-0.89285,1.25h-1.25l-1.25-1.9643-0.17857-0.89286,1.25-0.71429,0.35714-1.4286v-1.25l-1.25-1.25-5.7143-6.7857s-0.35714-1.0714-0.35714-1.7857v-3.2143l-1.78-0.88-0.89286-0.35714-0.17857-3.0357-0.53572-1.4286-1.0714-0.35714-0.35714-1.25,1.6071-1.4286,2.1429-0.17857,1.0714-0.53572,1.0714-1.0714,2.1429-0.17857,1.9643,0.17857,0.53572-1.0714-1.25-1.9643-1.4286-1.25-0.35714-2.1429s1.25-0.53571,1.9643-0.53571c0.71428,0,3.5714-1.0714,3.5714-1.0714l-0.17858-2.6786s0.53572-0.35714,1.25-0.35714c0.71429,0,3.9286,0.35714,3.9286,0.35714l2.1428-1.7857,4.1072-6.4286-0.17858-3.0357-1.4286-1.4286-2.6786-2.8572s-1.25-0.89285-1.4286-1.6071c-0.17857-0.71428-0.35714-1.7857-0.35714-1.7857l2.1428-2.3214,0.17858-1.6071-1.25-1.25-2.5,0.17857-0.71429-0.53572-1.0714-1.0714v-0.71429l3.06-0.86,1.25-1.0714-0.53572-1.4286-1.25-0.89285-0.17857-1.6072,2.1429-3.0357,3.75-1.25,2.1428-1.25-1.25-2.5s0.17858-0.35714,0.89286-0.35714c0.71429,0,3.3929,0.71428,3.3929,0.71428l1.0714-0.17857-0.53572-3.5714v-1.6071l1.4286-0.53572,0.2-2.66-0.17858-0.53571h2.5l1.6072,0.53571,0.53571,1.9643,1.0714,1.0714s0.53571,0.53571,1.25,0.53571,3.75-0.71428,3.75-0.71428l3.5714-0.71429,2.3214-0.35714,2.6786-1.0714,2.3214-1.4286,2.3214-0.89286,1.9643-0.17857,2.8571-0.35714,2.5-1.6072z",
                            "name": "Магаданская область"
                        },
                        "sh": {
                            "path": "M973.16,321.59c-0.45,0.19-0.81,0.37-1.19,0.94s-0.31,1.53-0.5,1.85c-0.19,0.31-1.53,1.12-1.53,1.12-0.51,0.51-0.87,1.06-2,1.25-1.14,0.19-2.59-0.23-2.85,0.66-0.25,0.88,0.06,2.12,0.69,2.25,0.63,0.12,1.53,0.44,2.1,0.25,0.56-0.19,1.56-1.25,1.56-1.25s0.62,0.3,1,0.93c0.38,0.64,0.97,1.78,0.97,2.03,0,0.26,0.19,1.06-0.07,1.57-0.25,0.5-0.81,2.78-0.56,3.03s1.24,0.9,1.94,0.9c0.69,0,1.09,0.17,1.78-0.78,0.69-0.94,0.93-1.74,1.25-2.56s0.78-1.9,1.09-2.16c0.32-0.25,0.48-1.02-0.22-1.65-0.69-0.63-0.93-1.75-1-2.06-0.06-0.32-0.56-1.09-0.24-1.53,0.31-0.45,1.12-1.31,1-1.69-0.13-0.38-1.38-1.09-1.82-1.47s-0.96-1.82-1.4-1.63zm2.15,20.44s-0.43,0.15-0.69,0.85c-0.25,0.69-0.5,1.74-0.31,2.31s0.56,1.4,0.81,1.78c0.26,0.38,0.75,1.31,0.88,1.62,0.13,0.32,0.53,0.72,1.03,0.91,0.51,0.19,1.12,0.07,1.25-0.44,0.13-0.5,0.19-1.4,0.19-2.03s-0.19-2.15-0.19-2.53,0.07-0.87-0.31-1.31-2.66-1.16-2.66-1.16zm2.53,9.22c-0.56,0.19-1.9,0.5-2.15,0.69-0.26,0.19-0.63,0.52-0.5,1.03,0.12,0.5-0.2,1.24,0.5,1.69,0.69,0.44,2.15,0.96,2.53,1.09s0.55,0.44,1.19,0.13c0.63-0.32,1.09-0.59,1.03-1.41-0.07-0.82-0.59-1.62-0.78-1.88-0.19-0.25-1.5-1.34-1.5-1.34h-0.32zm-117,4.5l-1.87,1.25s0.5,1.12,0,1.12h-1.78s-1.26,0.78-0.5,1.29c0.76,0.5,2.4,0.87,3.03,1,0.63,0.12,1.52,0.65,2.16,1.15,0.63,0.51,1.49,0.87,1.74,1.63,0.26,0.76,0.63,2.28,0.63,2.28l0.91,1.62-0.54,2.16-1.74,0.13s-0.91-1.14-1.41-0.13c-0.51,1.01-0.5,1.77-0.5,2.41,0,0.63,0.27,1.24,0.91,1.37,0.63,0.13,1.48,0.4,2.74,1.41,1.27,1.01,2.03,2.9,2.29,3.53,0.25,0.63,0.24,2.65,0.5,3.41,0.25,0.75,1.4,2.02,2.03,2.53,0.63,0.5,2.03,2.52,2.28,3.03,0.25,0.5,1.25,2.4,1.5,2.9,0.25,0.51,1.78,1.75,1.78,1.75s1.24,1.15,2,1.66,3.8,1.37,4.56,1.37,3.03,0.66,3.28,1.16c0.26,0.51,2.78,5.66,2.78,5.66l5.57,8.34s2.52,2.15,3.15,2.66c0.64,0.5,2.4,3.9,2.91,4.65,0.51,0.76,2.12,4.44,2.5,4.94,0.38,0.51,3.69,5.06,3.69,5.06s2.77,1.88,3.4,2c0.64,0.13,3.41,1.91,3.41,1.91s2.65,2.9,2.78,3.41c0.13,0.5,0.75,3.53,0.75,3.53l2.16,3.4,3.15,2.66,2.5,5.19,0.53,2.25s0,2.15,0.5,2.53c0.51,0.38,5.29,4.06,5.29,4.06l1.65,0.88,1.78,0.25v-2.54s-0.9-1.65-1.15-2.15c-0.26-0.51-0.88-3.03-0.88-3.03s-0.5-0.74-0.5-1.63c0-0.88,0.75-2.4,0.75-2.4s1.53-0.25,2.16-0.25,1.24-0.12,2.25-0.63c1.01-0.5,2.41-0.37,2.41-0.37l2.28,2,1.37,0.78s0.5-1.4,0.5-2.03c0-0.64,0.01-1.53-0.62-2.41-0.64-0.88-1.63-1.88-1.63-1.88l-2.03-1.65s-0.99-1.38-1.75-1.25-1.15,0.24-1.41,0.75c-0.25,0.5,1.52,2.66,0,2.28-1.51-0.38-2.4-0.9-2.78-1.41-0.38-0.5-1.62-1.87-1.62-1.87s-2.4-1.28-3.03-1.53c-0.64-0.26-2.4-0.88-3.04-0.88-0.63,0-4.06-1.15-4.06-1.15l-2.12-2.38-2.41-6.31s-1.12-1.65-1.25-2.41-1.03-3.15-1.16-3.65c-0.12-0.51-0.37-2.28-0.62-2.78-0.25-0.51-1-2.29-1-2.29l-0.53-3.28,1.78-1.62s2.77-1.03,3.41-1.03c0.63,0,5.06-0.13,5.06-0.13l2.4,0.63s2,0.25,2.5,0.25c0.51,0,1.03,0.51,1.16-0.5s-1.53-2-1.53-2l-3.53-0.53-3.66-1.26-2.4-1.78-18.57-15.25-1.5-1.28-1.78-0.12s-0.87,0.13-1.25-0.63-0.4-1.27-1.15-1.9c-0.76-0.64-2.5-1.88-2.5-1.88s-1.52-0.25-2.66-0.5-3.66-1.4-3.66-1.4l-0.4-2.79-1.38-1.25-0.62-1.28,1.25-1.62-0.25-1.91-2.53-2.12-3.54-0.79s-2.4-0.99-2.65-1.5c-0.25-0.5,0.12-2.15,0.12-2.15s-0.62-1.12-1.12-1.5c-0.51-0.38-4.28-1.91-4.28-1.91l-2.91-1.9-1.03-2.63s0.01-1.91-0.63-1.91c-0.63,0-2.78-0.87-2.78-0.87zm119.16,7.94c-0.88,0.25-1.53,0.4-1.72,0.97-0.19,0.56,0.06,1.24,0.31,1.43,0.26,0.19,0.84,0.69,1.47,0.57,0.63-0.13,1.56-0.19,1.82-0.57,0.25-0.38-1.13-1.46-1.32-1.78-0.19-0.31-0.56-0.62-0.56-0.62zm1.75,4.06c-0.51,0.25-1.19,0.56-1.37,1.06-0.19,0.51,0.36,1.37,1,1.75,0.63,0.38,1.05,0.63,1.56,0.06,0.5-0.56,1.09-1.62,1.03-1.93-0.06-0.32-2.22-0.94-2.22-0.94zm0.19,6.97c-0.18,0.01-0.34,0.06-0.5,0.16-0.63,0.37-0.82,1.18-0.82,1.56s0.88,3.09,0.88,3.47-0.87,2.4-1,2.9c-0.13,0.51-0.01,1.33,0.62,2.6,0,0,1.13-0.25,1.38-0.25s1.72-0.94,1.84-1.19c0.13-0.25,0.44-2.28,0.44-2.91s-0.06-2.02-0.12-2.47c-0.07-0.44-0.63-1.4-0.63-1.78s-0.31-1.43-0.69-1.69c-0.28-0.18-0.87-0.44-1.4-0.4zm-4.41,14.53s-1.28,0.03-1.53,0.16c-0.25,0.12-0.69,0.49-0.81,0.75-0.13,0.25-0.57-0.07,0.06,0.62,0.63,0.7,1.02,1.38,1.66,1.38,0.63,0,2.06,0.65,2.31,0.65s1.03-0.21,1.22-0.47c0.19-0.25,0.75-0.49,0.31-1.18-0.44-0.7-0.97-1.06-1.22-1.19s-2-0.72-2-0.72zm1.81,6.47c-0.19,0.31-1.37,1.18-1.43,1.44-0.07,0.25-0.32,0.74-0.38,1.25-0.06,0.5-0.31,1.77-0.31,2.09s-0.53,1.59-0.78,2.16c-0.26,0.56-0.5,1.49-0.44,2.12s-0.07,1.09,0.19,1.66c0.25,0.57,0.24,1.18,0.56,1.37s-0.04,1.29,1.09,0.6c1.14-0.7,1.63-1.34,1.82-1.79,0.19-0.44,0.53-2.09,0.72-2.34,0.18-0.25,0.56-1.43,0.68-1.81,0.13-0.38,0.63-1.9,0.63-2.22s0.06-1.59-0.25-2.22c-0.32-0.63-1.19-1.31-1.19-1.31l-0.91-1zm-4.9,15.4c-0.26,0.07-0.97,0.19-1.28,0.44-0.32,0.26-0.63,0.56-0.69,0.75s-0.5,0.94-0.5,1.19,0.06,1.15,0,1.41c-0.06,0.25,0,0.56-0.56,0.81-0.57,0.25-1.22,0.43-1.6,0.56s-0.81,0.44-1.06,0.69-0.94,0.72-0.94,0.72-0.53,0.18-0.53,0.5c0,0.31,0.41,0.99,0.53,1.25,0.13,0.25,0.75,1.22,0.75,1.22l-0.18,0.75s-1.04,0.74-1.1,1.06c-0.06,0.31-0.12,1.59-0.12,1.97s0.06,1.74,0.06,2c0,0.25,0.19,1.84,0.19,2.09s0.15,1.34,0.28,1.97c0.12,0.63,0.12,1.06,0.43,1.44,0.32,0.38,0.56,1.03,0.88,1.22s0.5,0.68,0.88,0.62c0.37-0.06,1.71-1.03,1.71-1.03s0.63-0.62,0.75-1.06c0.13-0.44,0.44-2.16,0.44-2.16s0.19-1.37,0.13-1.69c-0.07-0.31-0.69-0.65-0.75-1.22-0.07-0.56-0.07-0.8,0-1.68,0.06-0.89,0.87-2.09,1.06-2.35,0.19-0.25,0.84-1.18,0.97-1.93,0.12-0.76-0.07-1.84,0.19-2.16,0.25-0.32,0.8-0.75,1.06-1.06,0.25-0.32,1.06-1.65,1.18-2.03,0.13-0.38,0.13-1.4,0.13-1.91s-0.31-1.37-0.56-1.56c-0.26-0.19-1.75-0.82-1.75-0.82zm-8.35,23.69c-0.31-0.01-0.62,0-0.75,0.03-0.25,0.07-0.56,0-0.81,0.32-0.25,0.31-0.78,0.71-1.22,0.84s-0.87,0-0.93,0.31c-0.07,0.32-0.26,0.87-0.26,1.13,0,0.25,0.06,0.74,0.32,1,0.25,0.25,0.62,0.21,0.75,0.78,0.12,0.57,0.19,1.18,0.12,1.44-0.06,0.25-0.31,1.12-0.37,1.43-0.07,0.32-0.19,0.4-0.38,1.03-0.19,0.64-0.31,1.38-0.31,1.76v1.15c0,0.38-0.06,1.19,0.13,1.44,0.18,0.25,0.62,0.56,0.87,0.81s1.47,0.47,1.72,0.47,0.5-0.28,0.75-0.66,0.56-0.99,0.56-1.56-0.12-2.96-0.06-3.28,1.12-0.84,1.19-1.41c0.06-0.56,0.03-1.74,0.09-2,0.06-0.25,0.31-1.15,0.31-1.15s0.75-0.44,0.88-0.81c0.12-0.38,0.25-1.13,0.25-1.5,0-0.38-0.19-1.54-0.19-1.54h-1.84c-0.19,0-0.5-0.02-0.82-0.03zm7.85,1.88c-0.57,1.01-0.72,0.99-0.78,1.75-0.07,0.76-0.88,1.53-0.88,1.53s-0.31,0.31-0.44,0.62c-0.12,0.32-0.69,0.81-0.06,1s1.72,0.19,1.97,0.07c0.25-0.13,0.75-0.69,1-0.82,0.25-0.12,0.44-0.49,0.44-1.37,0-0.89-0.19-1.9-0.31-2.16-0.13-0.25-0.94-0.62-0.94-0.62z",
                            "name": "Сахалинская область"
                        },
                        "ka": {
                            "path": "M918.56,146.75l-1.65,0.84c-0.26,0.13-1.25,0.88-1.25,0.88l-0.13,1,0.13,2.78,0.25,1.16-0.88,2.43-1.72,4.69-0.93,1.56-0.44,1.41-0.06,1.81s-0.22,1.03-0.47,1.22c-0.26,0.19-0.82,0.13-0.82,0.13h-1.81-2.59l-1.6-0.19-1.68-0.31s-0.53,0.25-0.85,0.25c-0.31,0-0.68,0.56-1,0.75-0.31,0.19-1.37,0.74-1.56,1-0.19,0.25-1.28,0.78-1.59,0.9-0.32,0.13-1.38,1-1.63,1.19s-0.78,0.56-1.22,0.63c-0.44,0.06-0.94-0.32-0.94-0.32s-0.62-0.99-0.74-1.25c-0.13-0.25-0.97-1.72-0.97-1.72s-0.07-1.31-0.13-1.62c-0.06-0.32-0.06-1.47-0.12-1.72-0.07-0.25-0.13-1.06-0.13-1.06s0.25-1.22,0.31-1.66c0.07-0.44,0.38-0.75,0.38-0.75s0-0.56-0.19-0.87c-0.19-0.32-0.81,0.06-0.81,0.06l-1.75,0.44-1.97,0.81-1.66,0.5-1.18,0.19-2.04-0.25s-1.62-0.38-1.87-0.57-1.03-0.12-1.03-0.12l-0.63,0.56-0.87,1.16-0.63,0.81-0.84,0.88s-1.31,0.74-1.56,0.87c-0.26,0.13-0.94,0.59-0.94,0.59l-1.22,1.32-1.44,2.28s-2.27,2.28-2.59,2.47-1.18,0.87-1.44,1.12c-0.25,0.25-1.34,0.38-1.72,0.44s-0.74,0.62-1,0.94c-0.25,0.31-1.15,1.28-1.15,1.28l-0.81,0.56s-0.75-0.31-1.13-0.31-0.44,0.31-0.44,0.31l-0.97,1.91-1,2.18s-0.5,1.59-0.5,1.91,0.63,0.44,0.88,0.63c0.25,0.18,1.65,0.8,2.03,1.06,0.38,0.25,1,0.84,1.31,1.15,0.32,0.32,1.41,1.32,1.41,1.32s-0.13,0.43-0.06,0.68c0.06,0.26,0.37,1.15,0.68,1.66,0.32,0.51,0.94,0.81,0.94,0.81s4.09,1.16,4.35,1.28c0.25,0.13,1.09,1.32,1.09,1.32l0.37,0.68s1.13,0.85,1.44,1.04c0.32,0.18,1.22,0.31,1.22,0.31l0.62,0.62,0.44,1.19s-0.31,1.59-0.37,1.97c-0.07,0.38-0.07,0.99,0,1.37,0.06,0.38,1.12-0.06,1.12-0.06s1.4-0.31,1.97-0.25,1.56,0.25,1.56,0.25,1.22,0.4,1.35,0.66c0.12,0.25,0.75,1.18,0.75,1.18l1.15,1.5,1.25,1.72,1.85,1.32,2,1.65,1,1.31s0.84-0.99,1.03-1.31c0.19-0.31,0-0.74,0-1.19,0-0.44-0.37-0.71-0.75-0.96-0.38-0.26-0.97-1.19-1.35-1.63-0.37-0.44-0.56-0.84-0.56-0.84s-0.81-1.06-1.06-1.31c-0.25-0.26-1.09-0.94-1.34-1.19-0.26-0.26-1.25-1.34-1.69-1.97s0-0.75,0-1.06c0-0.32,0.87-1.04,0.87-1.04s0.94-1.3,1.19-1.62,0.44-1.21,0.5-1.59,0.47-1.31,0.85-1.5c0.37-0.19,1.18-0.38,1.68-0.44,0.51-0.06,1.84,0.5,1.97,0.81,0.13,0.32-0.62,0.69-0.75,0.94-0.12,0.25,0,1.59-0.06,2.16-0.06,0.56,0.12,1.71,0.12,2.28,0,0.56,0.75,1.37,0.75,1.37s1.13,1.4,1.44,1.72c0.32,0.32,1.28,0.93,1.59,1.19,0.32,0.25,1.57,1.65,1.57,1.65l3.34,2.32,0.97,0.59s0.75,1.25,0.81,1.69c0.07,0.44,0.44,0.93,0.44,0.93s1.03,0.22,1.34,0.47c0.32,0.26,0.63,1.31,0.63,1.69s-0.12,1.03-0.44,1.47c-0.31,0.44-1.21,0.93-1.53,1.25s-0.69,0.75-0.69,0.75-0.06,5.68-0.06,6.25,0.75,1.78,1,2.16,1.21,2.14,1.72,2.9c0.5,0.76,0.69,1.12,0.69,1.44s0.25,1.66,0.25,1.66,0.56,10.46,0.62,11.09,0.59,1.03,0.78,1.41,0.75,0.93,1,1.18c0.26,0.26,0.75,0.84,0.88,1.16,0.12,0.32,0.97,1.62,0.97,1.62s0.74,2.78,0.87,3.54c0.13,0.75,0.13,1.72,0.13,1.72s1.31,3.96,1.31,4.4v1.47s-0.81,1.75-1.13,2.13c-0.31,0.37-0.06,1.77-0.06,2.09,0,0.31-1.34,2.46-1.84,2.84-0.51,0.38-1.31,1-1.44,1.38s0.25,1.03,0.25,1.03l1.81,0.87,2.28,0.94s1.09,2.15,1.47,2.66c0.38,0.5,0.56,1.59,0.56,1.9,0,0.32,0.32,3.47,0.44,4.16,0.13,0.69,0.38,1.65,0.56,2.09,0.19,0.45,1.79,1.5,1.79,1.5s2.21,3.94,2.34,4.25c0.13,0.32,0.81,1.69,1.06,2,0.08,0.1,0.29,0.25,0.53,0.41,0.62,0.78,3.07,1.94,3.07,1.94l0.93,0.62s4.63,4.25,4.69,4.5c0.06,0.26,2.78,2.32,2.78,2.32s2.34,0.84,2.6,1.03c0.25,0.19,1.68,0.75,1.68,0.75l14.91,10.22,2.03,1.21,3.03,0.94s1.19,1.59,1.44,1.72,3.15,1.19,3.59,1.19c0.45,0,1.47,1,1.47,1s2.59,2.78,2.97,3.03,2.56,1.91,2.56,1.91,2.09,1.18,2.47,1.18,2.85-0.5,2.85-0.5l0.68-0.62v-2.03s-0.06-1.69-0.06-1.88,0-1.21-0.25-1.53-0.81-0.88-0.81-0.88,0.18-1.52,0.44-1.96c0.25-0.45,0.43-0.69,0.43-1.07s-0.31-1.15-0.56-1.4c-0.25-0.26-0.5-1.19-0.5-1.19s-0.06-2.34-0.31-2.66c-0.25-0.31-1.09-0.99-1.28-1.62s-0.5-1.03-0.63-1.41c-0.12-0.38-1.37-1.62-1.62-2.06-0.26-0.44-1.53-1.59-1.72-1.84-0.19-0.26-0.31-1.28-0.5-2.1s-1.02-0.75-1.78-0.75-1.12-0.06-1.38-0.25c-0.25-0.19,0.5-0.43,0.75-0.56,0.26-0.13,1.09-0.9,1.28-1.22,0.19-0.31,0.5-1.37,0.5-1.37l0.69-4.22,1.91-1.6c0.38-0.31,0.25-0.93-0.19-1.31s-1.09-0.25-1.41-0.31c-0.31-0.06-0.8-0.84-1.31-1.16-0.5-0.31-0.84-0.81-1.28-1s-1.24-0.31-2.06-0.56-1.4-1.03-1.91-1.47c-0.5-0.44-0.44-1-0.5-1.25s-0.06-1.96-0.06-2.84v-1.22s-0.97-2.78-0.97-3.1c0-0.31,0.03-1.05,0.16-1.43,0.12-0.38,0.49-0.69,0.75-0.94,0.25-0.25,1.43-0.78,1.43-0.78l1.47-0.88s0.38-1.71,0.38-2.59-0.5-2.25-0.63-2.56c-0.12-0.32-1.34-0.72-1.34-0.72s-1.5-1.19-1.94-1.19-2.46-0.56-2.9-0.69c-0.45-0.12-1.6-0.78-1.85-0.9-0.25-0.13-1.71-1.25-2.09-1.56-0.38-0.32-1.25-1.1-1.5-1.41-0.26-0.32-0.75-1.44-0.88-1.75-0.12-0.32-0.84-1.66-0.84-1.66s0-0.55-0.13-1.12c-0.12-0.57-0.18-1.65-0.18-2.41s1.02-0.62,1.28-0.62c0.25,0,1.68-0.25,2-0.32,0.31-0.06,1.03-0.74,1.22-1,0.19-0.25,0.37-1.77,0.31-2.09s-0.65-0.81-1.22-1-0.94-0.78-1.12-0.84c-0.19-0.07-2.16-0.88-2.16-0.88s-2.06-0.69-2.5-0.75-0.59,0.44-0.84,0.63c-0.26,0.19-0.5,0.37-1.32,0.37s-1.22-0.44-1.22-0.44l-0.87-1.18s-1.18,0.06-1.81,0.06c-0.64,0-0.91-0.59-1.16-0.91-0.25-0.31-1.06-0.56-1.06-0.56s-0.47-0.19-0.69-0.28c0-0.06,0.19-3.44,0.13-3.69-0.07-0.25-0.66-1.21-0.91-1.47-0.25-0.25-1.37-0.44-1.94-0.44s-1.4,0.6-1.84,0.85-1.06,0.75-1.31,0.94c-0.26,0.19-0.13,1.12-0.13,1.68,0,0.57-0.34,1.03-0.72,1.35-0.38,0.31-0.68,0.25-1.31,0.25s-1.12-0.19-1.63-0.31c-0.5-0.13-0.77-0.56-1.03-0.82-0.25-0.25-1.06-0.96-1.37-1.47-0.32-0.5-0.19-1.05-0.25-1.62-0.07-0.57-0.84-1.65-1.1-2.16-0.25-0.5-1.24-2.34-1.37-2.59s-0.56-1.28-1-1.91-0.9-1.99-1.28-2.62-0.74-1.09-1.5-2.1-0.78-0.56-1.35-0.68c-0.56-0.13-0.99-0.78-1.5-1.35-0.5-0.57-0.84-0.93-1.15-1.75-0.32-0.82-0.37-0.83-0.94-2.15-0.57-1.33-0.07-1.09,0.19-1.66,0.25-0.57,1.06-0.62,1.06-0.62l0.47-0.88s-0.38-1.59-0.31-2.09c0.06-0.51,0.36-0.56,1.06-0.75,0.69-0.19,1.56,0.75,1.94,0.75s1.59-0.5,1.9-0.82c0.32-0.31,0.32-1.08,0.32-1.71,0-0.64-0.62-1-1.13-1.13s-0.94-0.56-0.94-1.06c0-0.51,0.25-1.21,0.25-1.91,0-0.69,0-0.74-0.06-1.25-0.06-0.5-0.12-0.53-0.25-0.91-0.13-0.37,0.06-1.18,0.19-1.68,0.12-0.51,0.56-0.44,0.94-0.38,0.37,0.07,1.24,0.69,1.62,0.94s0.65,0.62,0.84,1,1,1.09,1.63,1.16c0.63,0.06,1.15-0.38,1.15-0.38s-0.09-0.52-0.34-1.09-0.81-1.44-1-1.81c-0.19-0.38-0.5-1.22-0.75-1.6s-0.44-0.5-0.44-0.75,0.69-2.09,0.69-2.41v-3.78c0-0.82,0.19-1.4,0.38-1.72,0.19-0.31,0.87-1.24,1.25-2.06s0.84-1.15,1.09-1.9c0.25-0.76,0.87-1.4,1.44-2.16s0.77-1,1.15-1.12c0.38-0.13,2.91,0.06,3.29,0.06,0.37,0,1.96-0.44,2.65-0.56,0.7-0.13,2.71-0.31,3.41-0.57,0.69-0.25,0.25-0.59,0.18-0.84-0.06-0.25-1.27-0.94-1.65-1.06-0.38-0.13-1.12-0.69-1.38-0.94-0.25-0.25-0.5-1.16-0.5-1.16s-0.59-2.96-0.65-3.28c-0.07-0.31-0.75-1.56-0.75-1.56s-0.13-5.18-0.13-5.63c0-0.44-0.68-2.02-1.37-2.34-0.7-0.32-0.91-0.99-0.91-1.5s0-0.96-0.12-1.59c-0.13-0.64-0.75-1.37-1-1.88-0.26-0.5,0.12-0.78,0.12-1.22s-0.12-1.18-0.5-1.5c-0.38-0.31-0.68-0.49-0.94-0.75-0.25-0.25-0.46-0.9-0.46-1.53s0.28-1,0.34-1.31c0.06-0.32,0.06-1.09-0.06-1.53-0.13-0.44-0.35-1.06-0.41-1.31-0.06-0.26-0.37-1.22-0.37-1.22s-0.5-0.44-0.69-0.44-0.94-0.19-0.94-0.19l-1.78-0.31s-1.69-0.44-1.81-0.69c-0.13-0.25-1.04-0.69-1.04-0.69l-1.56-0.59zm7.25,70.22c-0.88,0.44-1.12,0.43-1.06,1s0.37,1.09,0.63,1.47c0.25,0.38,0.44,0.93,0,1.44-0.45,0.5-1.45,0.52-1.19,1.15,0.25,0.63,0.49,1.06,0.75,1.31,0.25,0.26,0.81,0.9,0.94,1.41,0.12,0.51-0.01,1.06,0.31,1.56,0.31,0.51,0.31,0.69,0.69,0.69,0.37,0,0.59,0.32,0.65-0.5s-0.06-0.95,0-2.84c0.06-1.9,0-2.84,0.06-3.41,0.07-0.57,0.26-1.37,0-1.75-0.25-0.38-1.28-0.9-1.4-1.22-0.13-0.31-0.38-0.31-0.38-0.31zm58.91,12.47c-1.07,0.71-1.16,0.62-1.16,1.15,0,0.54-0.18,0.9,0.53,0.72,0.72-0.18,0.91-0.18,1-0.62,0.09-0.45-0.37-1.25-0.37-1.25zm-10.97,4.53c-0.63,0.45-1.08,0.2-0.81,1.09,0.27,0.9,0.44,1.16,1.15,1.25,0.72,0.09,0.73,0.1,2.07,0.1s2.31,0.06,3.03,0.06c0.71,0,0.99,0.36,1.43,0,0.45-0.36,0.63-0.07,0.54-0.78-0.09-0.72-1.24-0.9-2.22-0.81-0.98,0.08-1.52,0.34-3.13-0.19-1.6-0.54-2.06-0.72-2.06-0.72z",
                            "name": "Камчатский Край"
                        },
                        "in": {
                            "path": "m63.393,395.68,0.08929,5.2679,17.946-8.5714-1.3393-1.25-2.9464-1.25-1.5179-1.9643-2.4107,2.4107-4.1071-2.6786-1.875,1.0714,0.08929,5.8929-1.5179,1.0714z",
                            "name": "Республика Ингушетия"
                        },
                        "cc": {
                            "path": "m63.482,401.04,1.0714,2.5,3.125,1.6964,3.4821,0.44642,2.1429-1.9643,2.1429,1.7857,2.5-1.5178-0.08929-1.6072,1.875-2.1428,2.8571,0.44642,3.8393-2.8571-0.625-1.9643-4.4643-0.53572,0.44643-2.7679z",
                            "name": "Чеченская Республика",
                            "id": [42]
                        }
                    };
*/
                    $scope.svgRegions = {
                        "da": {
                            "path": "m64.939,403.74,2.6516,1.2627,3.6618,0.50507,1.7678-2.0203,2.1466,2.0203,2.3991-1.6415,0.25254-1.7678,1.6415-2.1466,3.0305,0.50508,3.7881-2.9042-0.50508-1.894-4.7982-0.50508,0.75762-3.1567-1.0102-0.63134,0.63135-2.2728-3.1567-2.7779,1.5152-0.50508,3.9143,0.88388,0-1.389-1.0102-1.2627,8.3338-0.25254,4.9245,5.4296,1.2627,1.894-0.37881,2.2728-5.3033-0.3788,0.50508,2.5254,1.5152,3.0304-1.0102,3.5355-2.3991,2.7779-1.2627,0.25254,4.5457,0.75761-5.5558,2.1466-0.50508,2.0203-0.75762,0.50508-3.0305,0.50507-0.25254,4.7982-1.2627,0.88388-1.1364,13.132-9.0914-0.12627-3.6618-2.2728-1.389-0.88388,0-11.617-3.283-5.9346,0.37881-2.9042,1.2627-0.37881z",
                            "name": "Республика Дагестан",
                            "ShortName": "Республика Дагестан",
                            "id": [25]
                        },
                        "cr": {
                            "name": "Республика Крым",
                            "ShortName": "Республика Крым",
                            "path": "m7.63 300.28 3.08 -4.47 -2.39 -5.96 -2.32 -1.30 -0.26 -1.56 5.37 0.27 5.62 1.13 3.78 3.17 -0.68 -4.60 2.99 3.45 0.38 1.58 3.51 3.18 1.69 4.34 -1.36 3.53 -0.62 6.67 2.20 0.60 1.62 -0.23 0.49 2.00 2.15 0.47 2.86 3.79 -3.47 0.05 -1.26 2.11 -4.89 -4.06 -1.13 -2.79 -2.69 -0.25 -5.54 -2.16 -3.75 -1.18 -4.89 0.14z",
                            "id": [26]
                        },
                        "sa": {
                            "path": "M701.25,126.75l-1.44,1.06-1.25,1.63s1.44,0.87,2.16,0.87c0.71,0,2.69-1.97,2.69-1.97l-2.16-1.59zm18.47,12.09c-0.18-0.01-0.4,0.02-0.63,0.07-1.78,0.35-4.81,1.93-4.81,1.93s-1.41,1.1-2.12,1.1c-0.72,0-2.35-0.38-2.35-0.38-0.71,0-2.5,1.25-2.5,1.25l-1.4,1.78s-1.1-0.51-1.1,0.38-0.35,1.96,0.72,2.5c1.07,0.53,1.61,1.06,2.5,1.06s3.22-0.72,3.22-0.72l1.97-0.87,1.97,1.06s0.51-0.9,1.4-1.44c0.9-0.53,3.4-2.31,3.75-3.03,0.36-0.71,0.72-3.22,0.72-3.22s-0.11-1.36-1.34-1.47zm-19.81,7.1c-0.15,0.01-0.29,0.05-0.44,0.09-1.25,0.36-2.85,0.19-3.56,0.19-0.72,0-0.91,0.19-0.91,0.19s-0.88,1.58-1.59,1.93c-0.72,0.36-1.99,0.74-3.07,0.57-1.07-0.18-3.75-1.25-3.75-1.25s-1.93-0.02-1.93,1.59,3.03,3.41,3.03,3.41l1.06,1.4s-2.51,0.73-3.41,0.38c-0.89-0.36-2.65-2.16-2.65-2.16l-3.22-0.72s-2.88,0.2-2.88,1.1c0,0.89-0.68,2.67-0.68,3.56s-0.9,3.04,0.53,3.94c1.43,0.89,1.79,3.03,1.97,3.75,0.17,0.71,0.7,1.77,2.84,2.31,2.14,0.53,4.29,0.53,5,1.06,0.71,0.54,1.77,1.07,2.84,0.53,1.08-0.53,1.82-2.65,1.82-2.65l2.12-1.97s1.61-1.44,2.5-2.16c0.89-0.71,2.7-0.54,4.13-1.44,1.42-0.89,2.31-3.75,2.31-3.75v-5l-0.38-4.43s-0.68-0.58-1.68-0.47zm106.25,5.62c-0.45,0.09-0.75,4.1-0.75,4.1l-7.32,1.65-3.28,0.63-4.53-6.06-7.84-0.13-0.38,0.87-5.68,1.66-1.76,2.13-6.06,6.31v2.78l-2.15,1.91-3.29,5.03-4.93-2.38-3.41-0.37-1.75,2h-4.56l-3.41,1.78-1.75-1.53,4.28-2.91-2.28-1.62-3.03-0.13-8.84,4.03,1.9,5.44-0.87,4.78-2.66,2.91-1.65-2.13,3.03-7.47-1.75-0.37-2.66,4.03-3.03,2.03-1-0.75,1-3.16,2.28-0.74,2.91-2.66-7.1,1.75-9.22,5.31-6.68,0.25,3.65,3.66-3.65,3.4-0.5,3.03,0.37,1.16,3.91-1.78-1,4.03,4.81,2.91-0.91,2.9-2-1.37-3.68,1,1.28,3.41,2.4-0.26-1.03,2.66-3.9-0.5-4.28-1.66-3.53,0.26-2.41,3.15-0.63,4.06h-6.46l-1.76-1.53-2.4-2-0.5,4.41,0.87,0.87-0.12,1.41,1.65,0.87-0.9,2.54,1.66,6.18-3.29-1.4-1,1.15-9.87-5.31v-4.94l-2.25,0.13-1.78,2.41-2-3.41,3.65-0.63-0.5-2.9-4.43-1.66,0.75-0.87,0.12-2.53-5.28-4.04-5.31-2.53-1,3.66-7.35,0.65-2.37-1.65-4.19,2.15v2.13l4.19,4.69-10.94,5.31-10.28-1.16,0.44-4.4-12.07,0.19-3.96,3.78h-2.85l-1.09,1.09,2.66,2.87h-2.13l-2.91-2.06,1.19-2.09-0.87-1.38-1.54-1.78,0.07,2.28-1.5,1.07-3.85-1.32s-2.9,3.53-2.84,3.78c0.06,0.26,2.66,3.29,2.66,3.29l-1.41,3.34,1.59,2.09,0.19,2.78,7.38,5.82-0.32,5.47,2.53,1.9,1.63,2.53-2.53,2.72-4.41,3.03-0.69,2.63-4.81,2.78,0.25,6.12-2.25,1.1-2.97-1.28-5.65,4.75-4.44,0.09,0.06,1.97,5.38,6.59,1.78,20.1-6.35,1.97,4.19,3.4-1.78,4.19v1.25l7.16,8.84-4.57,6.69,0.97,1.6-2.4,1.87,0.09,2.25,5.63,0.34,0.71,0.72,9.1,0.19,3.31,3.31-0.53,1.6-3.31,0.34,0.19,3.94,4.03-1.06,5.06,6.59-0.53,5.53,3.84,5.19-1.97,3.4,0.53,2.13,7.69,6.53v4.37l-3.75,6.44,0.28,10.78,3.85,4.13,3.37-3.94,3.75,0.09,1.88-1.34,2.68-0.62,2.41-2.07,3.56,3.85,0.38,2.31,4-5.06,0.09-4.13,5.38-2.75-0.29-6.25,2.32-4.12,3.84-1.5,4.91,1.06,6.15,4.91,0.57,3.84,1.31,0.87,4.03-1.4,2.5-2.06,2.69,1.06,0.87,4.47,3.13,4.56,2.15,1.78v3.03l2.32,1.35,0.71,4.71,3.94,0.19,0.97,1.35,1.53,4.09,8.38-0.25,3.31-1.97,5.53,1.16,3.56,1.97,11-0.72,5.54,3.75,2.21,0.53,5.19-2.6h2.6l3.03,2.26,2.78-0.19,3.22-3.94,5.68-0.06,2.5-1.97h7.88l0.19-3.75,10.68-5.09,0.82-3.04-4.28-4.12,2.31-1.69,0.62-4.03-1.34-1.69-2.41,0.38-2.03-1.44,2.75-4.03-2.84-1.6,0.25-1.87,1.53-1.97-1.44-1.44-3.47-1.15-0.53-1.6,3.38-1.43-1.88-0.91-0.19-5.25-0.87-0.62-0.19-1.88,2.78-1.25-1.62-1.25v-2.94l5.47-1.97,3.12,0.16,0.25-1.78,6.53,0.09v-2.75l-1.25-1.53,1.16-1.25,3.47-0.62,3.31-2.22,1.34-6,5-0.44,0.1-2.06s-5.29-4.9-5.47-5.25c-0.18-0.36-0.88-3.94-0.88-3.94l-3.56-2.59v-5.97l2.94-7.16-1.69-9.19,0.78-3.12,13.5,0.72,0.25-5.28,5.19-1.16,3.47,1.87,0.81-2.31-2.41-3.69,1.69-0.62,0.19-2.75-7.16-8.5,0.1-4.37-3.13-1.5-0.09-4.04-1.78-1.15,1.09-2.13,3.81-0.47,1.35-1.78,4.28,0.38,0.09-2.44-3.37-1.5,0.15-3.31,5.47-0.53v-3.57l5.63,0.44,5.62-8.03,0.44-2.5-6.06-6.06-0.19-1.88,2.31-3.4-0.97-1.79-3.31,0.19-1.5-2.34,4.72-1.41-0.09-1.53-2.07-0.97-0.25-1.34,2.13-3.75,5.72-1.97-0.78-3.56,5.15,0.68-0.62-5.43,1.34,0.28,0.19-3.59-2.69-0.63-2.94-4.53-7.59-0.28-4.19-1.88,0.72-3.47h-3.12l-0.19-1.62,8.12-10.44,1.07-7.84s-9.81-5.72-10.25-5.63zm-135.1,8.56c-0.12,0.03-0.23,0.08-0.34,0.19-0.89,0.9-1.07,1.79-0.53,2.5,0.53,0.72,1.06,1.63,1.78,2.35,0.71,0.71,2.31,1.25,2.31,1.25s0.71-1.1,0.53-1.82c-0.18-0.71-1.97-2.84-1.97-2.84s-0.94-1.78-1.78-1.63zm28.94,7.35l-2.31,0.34s-1.07,0.91-1.25,1.63c-0.18,0.71-0.9,1.24,0,1.78,0.89,0.53,3.75,1.25,3.75,1.25s1.6-0.02,1.78,0.87c0.18,0.9,0.18,1.8,0,2.69s-0.53,1.78-0.53,1.78l0.72,0.72,1.93-0.53s0.74-0.72,1.82-0.72h2.65s1.44-0.53,1.97-1.25c0.54-0.71,1.97-1.25,1.97-1.25h2.69s1.41-0.52,0.87-1.59c-0.53-1.07-1.76-1.62-2.65-2.16-0.9-0.53-3.22-2.31-3.22-2.31h-2.5l-3.6,0.34-2.84,0.38-1.25-1.97zm-17,10.15c-0.12,0-0.22,0.01-0.31,0.04-0.72,0.17-1.44,1.4-1.44,1.4s0.37,1.78,2.16,1.78c1.78,0,2.3,0.55,2.65-0.34,0.36-0.89-0.87-2.31-0.87-2.31s-1.37-0.55-2.19-0.57z",
                            "name": "Республика Саха (Якутия)",
                            "ShortName": "Якутия"
                        },
                        "so": {
                            "path": "m75.583,387.43-2.2728,2.6516-4.1669-2.6516-2.0203,1.1364-0.37881,5.8084-1.1364,1.389-2.2728-0.12627-5.9346-2.6516-3.0305-3.283,0.12627-4.9245,4.672,0.75761,0.37881-0.88388,2.5254-0.12627,3.283,1.5152,4.0406-1.894s-0.12627-3.5355,0.75761-2.7779c0.88388,0.75762,1.389,1.2627,1.389,1.2627l0.25254,3.5355z",
                            "name": "Республика Северная Осетия",
                            "ShortName": "Северная Осетия"
                        },
                        "kb": {
                            "path": "m50.982,375.86c0.26786,0.35715,2.5893,4.7322,2.5893,4.7322l0.98214,3.9286,4.6429,1.1607,2.8571-1.0714,3.2143,1.5179,4.375-1.875,0.26786-3.125-5.9821-2.3214-1.875-5.0893-2.2321-1.1607-4.375,0.71429z",
                            "name": "Республика Кабардино-Балкария",
                            "ShortName": "Кабардино-балкария"
                        },
                        "kc": {
                            "path": "m43.482,361.39,2.2321,8.4821,5.0893,6.25,4.375-2.6786,5.3571-0.89286,0.08929-3.3928,3.75-1.0714-6.6964-7.2321-2.2321,2.4107-2.8571,0.26786-1.6071-4.5536,0.44643-2.1429z",
                            "name": "Карачаево-Черкесия",
                            "ShortName": "Карачаево-Черкесия"
                        },
                        "st": {
                            "path": "m63.929,367.73-3.4821,0.98215,0.17857,3.75,1.5179,1.25,1.7857,4.6428,6.5179,3.0357,1.3393,1.3393,0.08929,3.0357,3.8393,1.7857,1.6071,2.5893,3.2143,0.625,0.71429-1.4286-2.8571-3.125,1.5179-0.53572,3.5714,0.80357,0.17857-1.1607-0.98214-1.3393,7.7679-0.0893,1.6964-1.5179,0.26786-3.5714-5.2679-7.5-0.17857-9.4643-3.4821-6.0714-4.9107-0.98214-1.5179-2.7679-5.0893-5.7143-0.98214-0.625-1.5179,1.3393-2.7679-2.0536-1.4286,0.80357-0.80357,1.0714-0.08929,1.6071,0.35714,1.3393,0.35714,1.1607-0.71429,1.6071-0.98214,1.4286-1.9643,2.2322-1.875,1.0714-0.71428,0.98214-0.98214,2.3214z",
                            "name": "Ставропольский край",
                            "ShortName": "Ставропольский край",
                            "id": [33]
                        },
                        "ks": {
                            "path": "m51.607,356.48-0.08929,2.0536,0.98214,3.8393,0.35714,0.80357,2.2321,0.0893,3.75-4.5536,1.4286-1.9643,1.9643-1.0714,2.6786-4.0178-0.26786-3.3929,0.17857-1.6964,0.89286-1.5179,1.3393,0,1.7857,1.5179,1.3393,0,2.5893-3.0357,0.08929-1.9643-0.89286-0.98214-2.2321-1.3393,0.17857-2.9464,2.8571-3.125,0.08929-1.4286-2.7679-2.9464-3.75-0.71428-0.80357-0.89286,1.6071-1.25,0.17857-2.4107-2.1429-1.6072-2.5893-0.80357-1.6071-1.6964-1.25-0.98214-0.89286-0.0893-1.3393,2.2322-0.625,0.98214,1.0714,1.4286-0.35714,1.5179-0.80357,0.625-2.7679-0.26786-0.89286-0.89286-1.9643,0.0893-1.875,0.71429-3.0357,1.7857-1.6964,0-1.3393-1.4286-1.6071-0.625-1.1607-1.4286,0-2.6786-2.2321-0.26786-1.25,0.625-0.35714,2.9464-0.089286,13.214,0.71429,5.8929,0.98214,3.6607-0.089286,2.3214-0.625,2.7679-0.089286,2.4107,0.17857,2.0536,1.5179,0.89285,0.71429,0.625,1.6071,1.5179,0.89286,1.0714,0.89286,0.89286l7.947-4.27-0.804-1.25-0.357-1.43-5.089,2.68h-1.875l-1.25-1.875,0.35714-3.5714,6.25-1.4286,2.7679-2.3214,0.71429-2.5893-1.3393-0.80357-1.9643,0.44642-1.1607-1.5178-0.71429-2.6786-1.3393-1.7857-0.17857-1.25,0.08929-1.1607,1.3393-0.80357,1.3393,0.625,1.0714,1.3393,1.0714,1.9643,1.3393,1.7857,2.3214,1.3393,1.6964,0.89285s0.625,0.26786,0.71429,0.625c0.08929,0.35715,0.89286,2.6786,0.89286,2.6786v4.0178l-0.08929,1.3393-1.0714,1.0714-1.875,1.5178-1.6071,1.4286z",
                            "name": "Краснодарский край",
                            "ShortName": "Краснодарский край",
                            "id": [12]
                        },
                        "ro": {
                            "path": "m67.5,323.45,2.0536,0.98214,1.4286-0.17857,0.625-0.89286-0.44643-1.1607-1.25-0.89286-1.9643-1.3393-0.89286-1.1607-0.35714-0.71428,1.0714-1.4286l2.231-1.08,1.6071-0.26786,1.0714,0.35714,1.4286,1.3393,1.5179,0.35714,1.6964-0.89286,0.89286,0.44643,1.072,1.06,1.339,1.79,0.268,1.33,1.607-0.08,1.3393-0.80358,1.6964-0.0893,1.3393-0.0893,0.35714-1.5178,0.53571-1.4286,1.25-1.6071,1.3393-1.0714,1.6964,1.0714,0.71429,0.35714,0.89286-1.875,0.44643-0.71428,2.6786-0.26786,1.875-1.6964,2.3214-0.17857,2.0536,1.1607,2.1429,1.25,0.98214,0.53571,3.9286,0.0893h2.2321l1.5179-0.98215h1.3393l0.71429,0.625,0.26786,1.6964-0.08929,1.9643v1.875l-0.08929,1.0714-0.981,1.34-1.25,0.98214-1.25,0.71429-0.80357,0.35714-0.35714,1.25-0.44643,1.6072-0.08929,1.4286-0.44643,1.1607-0.625,1.4286-1.4286,1.5179-1.6964,0.53571h-3.125l-1.608-0.36-1.518,0.53-0.625,1.97-0.982,0.62-0.80357,0.53572,0.17857,0.89285,1.3393,1.4286,0.71429,1.4286-1.1607,1.4286-1.3393,0.89285-0.80357,1.7857-0.08929,0.80357,0.98214,0.53571,1.1607,1.1607,0.625,1.0714,0.80357,0.80357,0.71429,1.3393v1.0714l-0.71429,0.80357,0.53572,0.625,1.4286,0.35715,0.625-0.53572,0.71429-0.0893,0.35714,0.98214v1.4286l-1.3393,1.3393-2.1429,1.0714-2.0536,1.1607-3.3929,0.0893-0.80357,0.80357-1.3393,0.80357-1.696,0.46-1.429-0.71-1.696-0.71-0.893-0.9-0.178-2.23-0.179-1.52-1.696-2.14-1.1607-0.80357-0.17857-1.25-0.80357-0.89286-1.7857-0.0893h-2.7679l-2.8571-0.0893-1.3393-0.17857-1.6071-1.7857-0.98214-0.71429v-0.89286l1.3393-1.5178v-1.5179l-0.625-1.25-1.875-1.4286-0.71429-0.625,0.26786-2.2322,2.7679-3.2143,0.08928-1.6071-1.9643-2.2322-1.3393-0.89285-2.411-0.55-1.0714-0.35714-0.08929-0.71429,1.0714-1.0714,0.26786-1.1607z",
                            "name": "Ростовская область",
                            "ShortName": "Ростовская область",
                            "id": [28]
                        },
                        "kk": {
                            "path": "m74.554,348.71,0.98214,1.6071,1.1607,1.0714,1.1607,1.6964,0.80357,1.1607,1.1607,0.71429,2.5893,0.44643,1.3393,0.625,0.98214,1.6071s0.98214,1.7857,1.25,2.2321c0.26786,0.44643,0.98214,2.4107,0.98214,2.4107l0.17857,4.9107v3.2143l0.89286,2.2321,3.3036,4.1964,1.25,2.0536-0.17857,2.5893-1.4286,1.875,0.89286,1.3393,4.375,4.7321,0.53571,1.25,0.35714,0.98215,0.89286,0.53571,1.4286,0.0893,1.6071-0.26786,1.7857-0.53572,2.2321-0.89285,2.3214-0.26786,0.713-0.71,0.625-2.15-0.268-1.16-2.232-1.34-0.982-0.71,0.08928-1.3393,1.0714-0.625,1.7857,0.0893,1.4286-1.25-0.53572-0.71428-0.71428-2.0536-0.268-1.7-0.179-1.16h1.0714l1.6964,1.25,1.7857,0.80357,2.6786-0.17857h0.89286l0.53571-1.1607-0.17857-2.4107-0.08929-3.8393v-6.3393-0.98214l-0.08929-2.2321,2.9464-2.8572,0.17857-1.3393-1.4286-0.625v-3.2143l-1.0714-1.1607-1.1607-0.35715-2.5-0.17857-0.625-1.4286-0.17857-0.80357-1.25,0.26786-0.625,1.0714h-1.3393l-1.25-0.0893-1.071-0.98-0.804-0.71-2.321-0.27-0.98214,0.35715-0.71429,0.80357-0.71429,0.35714-0.26786,1.1607-0.35714,0.80357,0.35714,0.625,1.0714,0.35714,1.0714-0.44643,0.89286,0.35714,0.08929,0.98215-0.44643,1.5178-5,3.125-3.3929,0.26786-2.3214,1.3393-1.5179,0.53571-3.8393-1.7857-0.53571-0.35715-0.08929-3.3928-0.71429-1.4286-2.3214-2.2322-0.625-1.25-1.9643-0.80357h-3.5714z",
                            "name": "Республика Калмыкия",
                            "ShortName": "Республика Калмыкия"
                        },
                        "as": {
                            "path": "m116.873,350.94,1.6415-1.389,1.1364-0.63135,1.7678,1.2627,2.0203,0.63135,2.2728,0.50508,0.88388,1.0102,2.1466,0.88388,0.75761,1.1364,0.63134,1.1364,0,1.389,0,0.88389-1.5152,0.3788-1.1364,1.389-0.12627,1.0102,0.63134,1.389,1.0102,1.1364-0.37881,2.1466-0.75762,1.0102-1.7678,0.88389-0.25254,1.1364,0.50508,0.88388,1.7678,1.1364,2.2728,1.5152,1.389,1.6415,0.63134,1.0102,0,1.5152-1.0102,1.1364-0.25254,2.0203-1.0102,1.0102,0,2.2728,0,2.7779-0.75761,0.3788-1.7678-0.3788-1.894-0.75762-0.63134,0.37881-0.37881,2.1466,1.6415,2.1466,1.1364,1.2627,0.88388,1.0102,0.50508,0.63134,0.12627,1.2627-3.9143,0.25253-3.0305,0.63135-2.1466,0-1.894-1.2627-2.0203-1.5152-5.4296,0-1.0102-0.37881-1.1364-1.1364,0.37881-2.9042-0.88388-1.0102-2.2728-1.6415,0-1.6415,1.0102-0.3788,1.5152,0,1.389-1.0102-0.63134-1.389-0.75761-4.0406,0.63134-0.3788,1.2627,0.75761,2.9042,1.389,2.0203-0.25254,1.2627-0.12627,0.50508-1.6415-0.25254-5.4296,0.12627-5.0508-0.25254-4.2931,2.1466-2.2728,1.0102-1.1364,0.12627-1.389-1.2627-0.50508-0.25254-2.1466z",
                            "name": "Астраханская область",
                            "ShortName": "Астраханская область"
                        },
                        "ad": {
                            "path": "m51.786,356.21,2.4107-1.4286,2.5-2.6786,0.35714-2.1428-0.26786-3.9286-1.0714-2.7679-2.9464-0.98214l-2.412-1.78-2.232-3.75-1.5179-1.1607-1.3393,0.71428-0.17857,2.1429,1.6071,1.875,0.80357,2.5893,1.1607,1.6964,1.6071-0.35714,1.5179,0.44643-0.44643,2.9464-2.9464,2.3214-3.394,0.71-2.8571,0.35715-0.17857,3.8393,1.0714,1.7857h1.7857l5.3571-2.9464,0.35714,1.7857z",
                            "name": "Республика Адыгея",
                            "ShortName": "Республика Адыгея"
                        },
                        "vl": {
                            "path": "m115.893,313.18,1.5179-0.98214,1.875-0.0893,1.1607-1.0714,1.1607-1.6072,0-1.25,1.1607-0.98214,1.9643,1.25,2.5,1.9643,3.3036,2.1428,3.9286,1.5179,1.4286,1.5179,0.625,2.1428,0.44643,1.4286,2.8571,0.35714,0.44643,1.4286,2.5893,0.80357,1.7857,1.7857,1.6964,1.6964,0.17857,2.2322-1.5179,1.25-1.6071,2.2321-1.4286,1.3393-0.26786,1.25,0.89286,2.2321,2.9464,1.875,1.6964,1.875,1.7857,1.1607,1.25,3.3036,1.0714,1.875,0.0893,1.25-0.71428,0.53572-1.3393,0.44643-0.71429,0.53571-2.8571,0.26786-4.6429-0.0893-1.6964,0.26786-0.71429,1.6071,0,2.8572-0.17857,1.1607-1.6964,1.25-1.3393,0.98214-4.0178-0.0893-1.0714-0.0893-1.3393-3.0357-1.4286-1.0714-1.875-1.0714-1.0714-0.625l-2.256-0.46-2.054-1.25-1.071-0.18-1.1607,0.625-0.98214,0.71429-1.25,0.26785-2.1429-0.0893-0.89286-1.1607-0.35714-1.25-1.4286,0.26786-0.89286,1.1607h-1.25l-1.875-0.71428-1.25-0.80357-1.3393-0.35715-1.4286,0.17858-1.4286,1.25h-0.89286l-1.4286-2.5-1.25-1.4286-1.0714-0.71428,0.448-1.44,0.893-1.52,1.607-1.43,0.179-0.89-1.6964-2.1429-0.44643-1.0714,1.4286-0.80358,0.625-1.875,0.625-0.53571,1.25-0.35714,1.6071,0.0893h3.0357l1.7857-0.625,1.9643-2.5893,0.89286-4.0179,0.625-1.4286,2.8571-2.0536,1.1607-1.6964,0.35714-3.3036v-2.2322z",
                            "name": "Волгоградская область",
                            "ShortName": "Волгоградская область",
                            "id": [6]
                        },
                        "vn": {
                            "path": "m100.089,310.77,0-6.0714,0.08929-1.1607,3.75-3.2143,2.5-3.6607,1.3393-1.4286,0.35714-1.875,2.4107-0.71428,0.35714-2.5893,0.625-1.7857,1.0714-0.35714,0.625-2.0536,1.3393-1.7857,1.1607-1.0714,0.98214-0.53571,0.89286,1.1607,0.44643,0,0.71429-1.0714,0.53571-0.71428,1.1607-0.17857,0.89286,0.89285,1.25,1.1607,1.4286,1.4286,1.1607,1.5179,0.80357,0.89285-0.26786,2.1429,0,1.6071,1.875,1.0714,2.3214,1.3393,0.80357,1.3393-0.0893,1.7857-0.89285,1.5178-0.44643,0.98215,1.5179,1.25,1.875,1.7857,1.9643,2.2321,1.3393,1.6964,1.1607,1.9643-0.26786,2.3214,0,2.0536-2.1429,1.0714-0.71428,0.17857-4.2857-1.875-2.6786-1.7857-2.1429-1.4286-1.6964-1.1607-0.53571-0.17857-0.71429,0.80357-0.44643,1.25-1.4286,1.9643-1.6964,0.44643-2.8571,0.80357-3.5714,1.1607-3.2143,0.0893-2.5-0.17857-2.3214-1.25-2.3214-1.0714z",
                            "name": "Воронежская область",
                            "ShortName": "Воронежская область",
                            "id": [8]
                        },
                        "bl": {
                            "path": "m93.304,272.29-5.4464,3.3036,0.08928,2.6786,1.6964,1.875,0.08929,3.125,0.44643,1.6964,2.8571,1.6071,2.8571,0.44643l1.608,2.23-2.5,3.3036-0.35714,2.1429,1.0714,1.6071,2.3214,1.5179,0.17857,2.9464,1.1607,1.5179,0.71428,0.89285,4.7321-4.375,3.75-5.4464,2.0536-0.89285,0.80357-4.1072,1.0714-0.89285,0.53571-1.3393-2.5-2.8571-3.5714-4.1071-2.7679-0.26786-2.9464-1.1607-2.6786-1.6964-2.5893-1.6072-1.9643-1.6071z",
                            "name": "Белгородская область",
                            "ShortName": "Белгородская область",
                            "id": [3]
                        },
                        "ky": {
                            "path": "m93.482,271.84,0-4.6429l-0.357-1.61-1.786-1.97-0.714-1.07,1.3393-1.0714,3.75-1.3393,2.7679-1.3393,2.6786,0.0893,0.53571,1.0714,1.25-0.0893,1.7857-1.1607h0.80357l0.98214,0.44643,1.4286,1.6071,0.53571,0.80357,0.08929,1.6964,1.0714,0.89286,1.0714,0.71428h0.89286l1.0714,1.25,0.17857,3.2143v2.4107l-0.89286,0.98214v1.5179,1.1607l1.0714,1.25,1.1607,0.98214,0.89286,0.17857,1.5179,0.53571,1.0714,1.6072,1.6071,1.5178-0.71429,1.1607-0.80357,0.89286-0.89286-0.80358-1.9643,1.25-1.4286,1.1607-0.53571,0.80357-3.4821-4.1071-2.2321-2.3214-0.98214-0.53572-3.3036-0.625-2.8571-1.5178-3.6607-2.1429-2.4107-1.9643z",
                            "name": "Курская область",
                            "ShortName": "Курская область"
                        },
                        "or": {
                            "path": "m104.732,258.27,1.0714-1.875,2.2321-0.26786,0.89286-1.6071,0.89286-0.53572,1.9643,0.89286,1.6964-0.0893,1.6071-0.71429,1.0714-1.5179,0.89286-0.53571,0.98214,0.17857,1.3393,0.98214,1.9643,0.89286,1.1607,0.89286,0.35714,0.89285,0.71429,1.3393,0.17857,2.0536,0,3.6607,0.98214,1.7857,1.4286,1.875,0.80357,1.25,0.71429,1.7857-0.26786,1.5179-3.9286,1.875-1.9643,0.98214-1.0714,2.1429-1.875,1.0714-1.875,1.0714-2.4107-0.89286-1.9643-1.6071-0.44643-1.6964,0.44643-1.9643,0.44643-0.89285,0.08928-4.4643-0.89286-1.6964-1.7857-0.53571-1.7857-1.4286-0.08929-1.6072-1.3393-1.5178-1.6071-1.6964z",
                            "name": "Орловская область",
                            "ShortName": "Орловская область"
                        },
                        "lp": {
                            "path": "m116.875,278.45,1.5179,1.875,1.0714,0.89286,1.1607,0.71428,1.1607,1.0714,2.5,2.2321,1.25,1.5179,0.625,1.4286-0.44643,2.5893,0.53572,0.625,2.5,1.3393,1.875,1.7857,1.0714-0.17857,1.0714-0.625,0.44643-0.80357,0.0893-5.8036,0.35714-0.71428,1.4286-0.80357,2.3214-0.17857,2.0536-1.1607,1.3393-0.44643,0.17857-1.6964,0.625-1.3393,1.25-1.5179-0.80357-1.1607-2.6786-0.98215-0.53571-0.53571-0.17858-0.71429,1.0714-1.3393,0-1.6071-2.1428-0.35715-1.0714,0.44643-1.6072,0.80357-0.98214,0.89286-1.1607,0.625-1.4286,0.0893-1.3393-1.5179-1.6964-1.6964-0.80357-0.98214-2.4107,0.89285-3.125,1.6964-1.1607,1.6072-1.6071,1.4286z",
                            "name": "Липецкая область",
                            "ShortName": "Липецкая область"
                        },
                        "tl": {
                            "path": "m123.482,256.3,3.2143-2.0536,0.98214-0.17857,1.6071,0.80357,0.98215-0.80357,0.71428-1.0714,3.125,0,1.6072,0.625,2.0536,0.35714,1.4286,0.80358,2.4107,0.35714,1.4286,0.71428,0.53572,1.0714,0.98214,1.0714,1.25,1.4286,0.71429,1.6072-0.35715,1.6964-0.98214,1.1607-0.71428,1.6964-1.3393,1.9643-1.6964,2.0536-1.0714,1.875-0.71428,0.98215-0.53572,0.35714-1.7857,0-2.5,0.89286-1.5179,1.0714-1.3393,0.26785-2.0536-1.3393-2.0536-2.5893-0.26786-2.0536-0.53571-1.4286-1.6071-2.5l-1.413-2.14-0.179-2.23z",
                            "name": "Тульская область",
                            "ShortName": "Тульская область",
                            "id": [35]
                        },
                        "bn": {
                            "path": "m97.679,258.62,0.26786-1.7857,2.3214-1.5179,0.44643-1.1607,0-1.4286-1.6071-1.9643-1.7857-2.1429-1.6964-1.9643-2.3214-1.875-1.5179-0.89286-1.6964-0.26786-0.89286-1.1607,0.17857-2.3214,1.3393-1.6071,3.125-2.1429,2.6786-1.875,0.89286-1.7857,0.98214-0.71428,1.6964,0.26786,0.625,1.25,0.625,1.5178,1.0714,2.2322,1.1607,0.80357,5.8929,0.26785,2.1429-0.35714,1.4286,0.53572,3.125,0.89285,2.3214,0,0.71429,1.9643,0,2.2321-0.17857,1.1607-0.98214,1.5178-0.71429,0.53572-0.26786,1.4286,0.26786,1.5179,0,1.25-0.80357,1.4286-1.4286,1.5178-1.7857,0.71429-1.6964,0.17857-1.7857-0.71428-1.4286,0.71428-0.26786,0.89286-2.4107,0.80357-1.0714,1.4286-1.3393,1.25-1.4286,0.17857-1.4286-0.71428z",
                            "name": "Брянская область",
                            "ShortName": "Брянская область",
                            "id": [4]
                        },
                        "kj": {
                            "path": "m119.196,239.61,1.6071-1.25,1.6071-1.3393l1.161-0.27,1.429,0.63,0.80357,1.4286,1.0714,1.25,1.7857,0.80357,1.7857,0.35715,3.125,0.0893,1.875-0.0893,1.6071-1.0714,2.4107-0.0893,1.4286,0.44643,0.98214,2.0536,0.26786,1.4286,1.25,0.625,1.6071,0.98215,0.98214,0.80357,0.53572,1.25-0.53572,2.0536-1.0714,1.7857-1.4286,1.9643-1.1607,1.25-0.89286,0.44643-3.75-1.25-2.6786-1.0714-2.6786,0.0893-1.875,0.44642-1.0714,1.25-1.5179-0.44642-1.0714,0.0893-1.0714,0.80357-2.0536,1.0714-0.89286-0.89286-1.0714-0.80357-1.9643-1.25-1.5179-0.89285-0.89286-0.44643v-1.0714-2.4107l-0.08929-0.625,1.1607-1.6964,1.0714-1.875v-1.7857l-0.26786-1.6071z",
                            "name": "Калужская область",
                            "ShortName": "Калужская область"
                        },
                        "sm": {
                            "path": "M109.375,237.55,110,235.95,110.179,234.52,109.732,233l-0.08928-1.4286,1.5179-1.3393,0.71429-1.6071,0.08929-3.125,0.35714-1.875,2.4107-2.5,2.5-1.9643,1.875-1.7857s1.875-1.3393,2.2321-1.5179c0.35714-0.17857,2.5-1.5178,2.5-1.5178l2.5,0.0893,3.0357,3.4822,1.875,3.4821,2.5,3.6607,1.4286,0.89286,2.7679,0.53571h2.0536l0.80357,0.71429,1.1607,1.875,1.1607,1.3393,1.25,1.6071,1.0714,1.4286,0.17857,1.3393-0.98214,1.25-1.875,0.89285-1.875,0.53572-0.89286,1.25-0.44643,0.89285-1.875,0.44643-1.7857,0.625-1.6072,0.35715h-3.0357l-3.75-0.80358-1.7857-1.7857-1.4286-1.3393-1.1607-0.26785-1.1607,0.71428-2.2321,1.5179-1.1607,0.44643-1.7857-0.44643-4.1071-0.98214-2.4107-0.35715z",
                            "name": "Смоленская область",
                            "ShortName": "Смоленская область"
                        },
                        "mc": {
                            "path": "m146.07,234.16,3.5714,0.26785,2.3214-0.89285,1.4286-0.44643,0.53571,0.625,0.0893,1.7857,0,1.1607-0.17857,1.3393,1.5178,0.89286,2.9464,0.44643,1.7857,0.89285,2.0536,0.89286,2.7678,0.89286,1.7857,0.26786,1.25,0.53571,0.26786,1.6071-0.0893,1.5179-0.44643,1.6964-1.5179,0.625-2.1428,1.1607-1.6072,1.3393-0.0893,1.25-0.625,1.7857-1.1607,1.5179-0.35714,1.6071,0.17857,1.6072,0.0893,0.89285,1.1607,1.0714,1.0714,0.625,1.1607-1.0714,0.625,0.44643,0,1.5179-0.0893,3.2143-0.44643,1.1607-1.3393-0.44643-1.875-0.17857-1.6072,0.17857-0.80357,0.89286-2.0536,0.0893-1.6071-0.35714-1.25-0.71429-1.0714-1.1607-1.6071-0.625-1.6964,0-0.44643,0.80357-0.17857,1.1607-1.0714,0.53571-1.4286,0.0893-0.80357-0.80358-0.17858-0.625,1.1607-2.4107,0.26786-1.9643-0.53572-1.6964-1.1607-1.5179-1.1607-1.5179-1.0714-0.89286,0.625-1.25,2.5-2.9464,1.1607-2.6786-0.71429-1.7857-1.6071-1.6071-1.6071-0.98215-0.53572-0.35714-0.625-1.875-0.80357-1.25-0.80357-0.80357,0.625-1.5179,2.5893-1.3393z",
                            "name": "Москва и Московская область",
                            "ShortName": "Москва и МО",
                            "id": [15,16]
                        },
                        "rz": {
                            "path": "m144.55,265.59-1.9643,2.6786-2.1429,3.125-0.625,2.7679-0.80357,1.7857,0.17857,0.80357,1.6964,0.71429,1.9643,1.3393,0.44643,1.5179-0.26786,0.89286,1.4286,1.1607,1.9643,0,1.1607,0.71429,0.0893,1.875,0.44643,1.1607,1.25,0.44643,1.5179-0.625,1.9643,0,1.5179,0.98214,0.625,1.7857,1.0714,1.1607,2.6786-0.17857,3.125,0,2.9464-2.0536,3.0357-2.9464,1.5179-2.2321,1.0714-1.7857-0.98214-2.2321-0.53572-3.125-2.0536-2.0536-1.25-1.6964-0.44643-2.8571-0.53571-1.6072-0.35715-0.98214-2.1428-0.35714-3.4822,0.26786-0.625,0.80357-2.1428-0.17857-1.875-0.71429-1.875-1.0714-1.9643-0.89286-1.0714,0.35715-0.80357,1.4286-1.4286,0.89286-1.6071-0.44643z",
                            "name": "Рязанская область",
                            "ShortName": "Рязанская область"
                        },
                        "tb": {
                            "path": "m142.77,279.43-1.6964,2.1429-0.35714,1.7857-0.80358,0.89286-2.6786,0.98214-1.875,0.44643-1.5178,0.71429-0.71429,1.4286,0,2.1429,0.26786,2.3214-0.71429,1.875-1.5179,0.53571-0.44642,1.4286-0.44643,1.6964-0.625,1.1607,0.08928,0.625,2.3214,2.1429,2.2321,2.1429,1.6072,2.2321,1.4286,2.0536,0.98214,0,2.1429,0,1.9643-1.25,2.5-1.25,1.6964-1.0714,4.0179-0.26785,1.0714-0.98215v-3.6607c0-0.35714,0.0893-2.3214,0.0893-2.3214l1.5179-1.1607s0.71429-0.71429,0.80357-1.0714c0.0893-0.35714-0.26785-4.6429-0.26785-4.6429l1.4286-1.0714-0.80357-2.1428-1.7857-1.4286-2.3214,0.26786-0.89285,0.625-1.1607-0.80357-0.89286-1.3393v-1.3393l-1.875-0.80357h-1.3393l-0.89286-1.0714-0.26786-1.3393z",
                            "name": "Тамбовская область",
                            "ShortName": "Тамбовская область"
                        },
                        "kn": {
                            "path": "m74.107,152.55,0,2.2322,0.53571,2.5,2.0536,5.1786,1.4286,3.4821,1.9643,3.6607,2.5,1.0714,3.75-0.44642,1.9643-1.3393,0.625-1.7857-0.44643-4.2857-0.89286-2.8571-1.5179-1.6071-2.4107-0.53572-0.98214-0.71428,0-3.0357-0.80357-1.4286-1.6964-1.6071-1.6071-0.26786-0.35714,1.25-0.625,1.3393-0.625,0.89285-1.4286-0.35714z",
                            "name": "Калининградская область",
                            "ShortName": "Калининградская область"
                        },
                        "ps": {
                            "path": "m125.268,213.98,0.35714-2.1428-0.26786-2.1429-1.4286-1.875-1.3393-1.4286-0.08929-1.6964,0.98214-0.71429,0.17857-1.6964-0.89286-0.98215-1.25-1.875,0-4.1964,1.5179-0.89285,3.75-2.2322,0.80357-2.4107,0.53572-1.7857,1.875-1.25,2.4107-0.0893,1.3393-1.6071,0.98214-1.6964s1.25-0.625,1.6072-0.80357c0.35714-0.17857,2.8571-0.71429,2.8571-0.71429l1.5179-0.0893,1.0714,0.53571-0.625,1.5179-0.71428,0.89285-0.17857,0.98215,1.6071,0.26785,1.25-1.7857,0.98214-2.0536,1.1607-1.5179,1.6071-0.71428h1.6071l1.5179-1.5179,1.1607-0.625h1.4286l0.98214,0.98214,0.625,1.5179,0.98214,1.6071-0.26786,1.6964-0.89285,0.98214-0.35715,1.3393-0.80357,1.6071-0.17857,1.1607h-1.4286-0.80357l-0.71429-0.53572-0.80357,0.53572-0.625,0.80357-0.53571,1.5178-0.53572,2.1429-0.0893,2.5-0.35715,1.875-1.1607,1.25-1.3393,0.98214h-1.7857l-1.5179,1.3393-0.53571,1.7857-1.3393,0.53572-0.44643,1.0714-0.17857,1.4286-1.7857,0.89286-1.7857,0.80357-0.625,1.6964,0.625,1.5178,0.625,0.625-0.26785,1.4286s-0.0893,0.44643-0.44643,0.80358c-0.35714,0.35714-1.1607,1.3393-1.1607,1.3393l-1.4286,0.80357-2.3214,0.89286-1.0714,0.0893-1.1607-0.89286-0.89286-0.89286z",
                            "name": "Псковская область",
                            "ShortName": "Псковская область"
                        },
                        "no": {
                            "path": "m153.12,188.27,1.5179,1.25,2.1428,0.35714,2.1429,0.17857,1.25,1.1607,2.5,0.53571,2.3214-0.0893,1.0714-0.89286,0.44643,0.625,0.0893,1.7857,2.1429-0.53571,2.3214,0.0893,0.80357,0.80358,0.17857,2.5,0.17857,2.5,0.53572,1.0714,1.3393,0.17858,1.3393,0.44642,0.26785,2.1429,0.71429,1.6964,0.98214,0.80357,0.44643,2.9464,0.0893,2.2321,0.89285,1.4286-0.53571,0.98215-0.71429,0.53571,0,1.6071,0.17858,1.5179,1.4286,1.3393,0.625,0.53571,0.0893,1.9643,0,1.9643-0.17857,1.3393-1.25,0.53571-0.71428-0.26785-0.625-0.80358-0.71429-0.80357-0.17857-1.1607-0.98214-0.80357-0.80358-0.625-2.0536,0-1.5178-0.53572-0.53572-0.35714-1.5178-0.53571-0.71429-0.26786,0-0.44643s-0.26786-1.25-0.26786-1.6964c0-0.44643-0.0893-2.0536-0.0893-2.0536l-0.625-0.98214h-1.7857l-0.89285-0.44643-0.44643-0.98214-0.98215-0.625-0.53571,0.625-0.89286,1.0714-1.6964,1.4286h-2.1428c-0.35715,0-1.5179,0.0893-1.5179,0.0893l-0.71429-1.0714-1.0714-0.71428-2.3214-0.17857-2.6786-0.0893-1.5179-0.44643-1.3393-0.98214-2.3214-0.44643h-2.1428l-0.89286-1.1607-1.25-1.0714-0.53571-0.71429-1.1607-0.71428,0.98214-2.7679,0.71429-0.44643,1.1607-1.5179,1.0714-1.0714,2.0536-0.625,2.5-1.9643,0.625-1.9643,0.0893-3.5714,0.98214-2.5893,1.0714-1.25,1.1607,0.26786z",
                            "name": "Новгородская область",
                            "ShortName": "Новгородская область"
                        },
                        "tr": {
                            "path": "m128.661,216.66,3.2143-0.625,2.2321-1.6072,1.3393-1.6071,0.17857-1.4286-0.80357-1.4286-0.26786-1.3393,0.35714-0.89286,1.4286-0.89285,1.6964-0.625,1.1607,0.44643,1.5179,1.5178,1.0714,0.98215,0.98215,0.53571,1.6964,0.17857,2.4107,0.35714,1.3393,0.98215,1.3393,0.26785,3.2143,0.44643,1.5178,0,1.25,0.71429,0.80358,0.71428,1.875,0.35715,1.7857-0.17857,1.875-1.6072,1.25-1.25,0.71429,0.44643,0.625,0.80357,1.4286,0.44643,1.4286,0.17857,0.53571,1.5179,0.17857,2.4107,0.35715,0.80358,1.1607,0.71428,1.4286,0.80357,1.0714,0.26786,1.875,0.35714,0.98214,0.26786,1.25,1.0714,0.44643,1.3393,0.98214,1.0714,0.80358,0.53572,1.7857-0.35715,1.3393,0.0893,1.25,0.71429,1.6071,0.89285,0,1.5179-0.625,1.6964-1.25,1.6071-1.6071,0.44643-1.25,0.98214-1.5179,1.3393-0.89286,1.0714-0.44643,0.71428-0.26785,1.5179-0.44643,1.0714-1.25,1.4286-0.53572,1.4286-0.35714,2.0536-2.0536,1.9643-2.0536,1.3393-1.0714,0.17858-0.53571-0.71429-0.26786-1.7857-1.6964-0.71429-3.8393-0.89286-3.8393-1.6071-3.0357-0.80357-1.5178-1.0714-0.0893-3.0357-0.35714-1.6964-3.3036,0.80357-3.4822,0.26786-1.3393-0.89286-3.4821-4.4643-1.5179-2.0536-3.3036-0.625-2.7679-0.53571-1.4286-1.7857z",
                            "name": "Тверская область",
                            "ShortName": "Тверская область",
                            "id": [34]
                        },
                        "vm": {
                            "path": "m167.41,247.73,1.6072,1.7857,2.0536,1.25,1.1607,1.0714,1.3393,0.35714,0.80357,0.89286,0.0893,1.5178-0.89285,1.7857-0.35715,1.0714,1.25,0.625,1.7857,0.26785,1.0714,1.1607,0.17857,1.9643,0.98214,1.875,1.0714,1.25,1.3393,1.25,1.3393,1.3393,1.3393,1.1607,1.7857,1.875,0.89286,1.3393-0.17857,0.98214-0.89286,0.71429l-0.18,0.98,0.53571,0.71429,0.44643,0.71428,0.0893,1.6072-1.7857,0.53571-2.2321-0.0893-1.1607-1.0714-4.4643-0.0893h-5.1786l-1.7857,0.53571-0.71429-1.6964-1.6964-1.9643-1.6071-2.6786-0.80357-4.1964-0.0893-4.1071-0.17857-2.0536-0.44643-0.44643-0.71428,0.44643-1.1607,0.26785-1.4286-1.25-0.26786-2.5893,0.71429-2.0536,1.1607-2.0536,0.44643-1.7857,1.3393-1.0714z",
                            "name": "Владимирская область",
                            "ShortName": "Владимирская область",
                            "id": [5]
                        },
                        "pz": {
                            "path": "m157.05,289.96,1.6964,1.7857,2.0536,1.5179,1.25,0.98214,1.6964,0.625,1.25,1.875,0.71429,1.6071,0.26785,1.9643,0.98215,0.98214,1.0714,1.0714,2.6786,0.17857,1.6964,0.0893,0.625,2.1429,0.89286,1.7857,1.6964,0.71429,2.1429,0.26785,1.4286,1.0714,0.625,1.0714-1.5179,0.89286-0.89286,0.98214,0.0893,4.1071-0.26786,3.4822-2.7679,1.25-1.0714-0.0893-0.89286,1.6071-1.9643,0.98215-1.1607-1.7857-0.98214-0.98214-5.9822-0.0893-1.1607-1.875-0.89286-0.89285-3.125-0.71429-0.98214-1.6071-1.25-1.6964-2.1429-0.71429-2.4107-1.3393-1.6071-1.0714-2.5,0.0893-0.71429-1.875,0.26786-2.5,1.1607-0.89285,3.8393-0.80357,0.89285-2.4107,0-3.4821,1.3393-1.6964,1.3393-1.6071-0.26786-2.5893,0-1.9643,1.1607-0.89286z",
                            "name": "Пензенская область",
                            "ShortName": "Пензенская область",
                            "id": [21]
                        },
                        "sr": {
                            "path": "m137.23,308.27-0.17857,3.0357-0.26786,1.25-2.2321,1.1607,1.4286,1.6964,1.0714,3.2143,2.2321,0.71429,0.98215,0.80357,0.89285,1.0714,1.7857,0.625,2.5893,2.5,0.89286,1.0714,0,1.875-1.5179,2.0536-2.4107,2.8571-0.44643,1.25,0.44643,1.6964,0.71429,0.89286,2.1428,1.1607,4.0179,3.9286,1.7857,4.5536,1.25,1.4286,1.25,1.3393,0.26786,1.9643-0.71428,2.5-0.53572,2.4107,0.26786,1.7857,0.89286,1.0714,1.6071,0.44643,1.6964,0,1.6964-1.1607,1.25-1.0714,0.44642-2.6786,0.0893-1.875,2.2321-0.625,3.3036,1.25,1.6964,0.35714,1.6072,0,1.3393-1.5179,0.44643-0.53571,1.6071,0.35714,1.3393,1.0714,1.5178,0.89286,4.6429,0,1.1607-1.1607,1.3393,0.17857,0.89286,0.80358,1.6071-0.53572,0-1.7857-0.89286-1.9643-0.35714-1.3393-0.17857-3.9286-0.0893-2.0536-0.71428-1.25,0.0893-2.8571-0.35714-1.6071,0-2.5-0.80357-1.3393-1.1607-1.6071-2.5-1.0714-1.6072-2.0536-2.5893-0.0893-1.0714-0.35714-1.7857-1.6964-0.625-1.25-0.44642-0.89286-1.7857-2.4107-5.625-0.26786-0.53571-0.17857-1.9643-2.5893-3.125-0.89286-2.2321-2.9464-6.1607-3.3036-2.3214,0-1.0714-1.6964,0.44643-2.5-0.80357-0.35714-3.8393,2.1428-1.5179,0.35715z",
                            "name": "Саратовская область",
                            "ShortName": "Саратовская область"

                        },
                        "mr": {
                            "path": "m157.59,290.05,1.875,2.1429,2.6786,1.7857,1.7857,1.1607,1.7857,2.7679,0.44642,2.4107,2.0536,2.1429,2.5893,0.0893,1.6071,0.26786,0.89286,2.2321,0.71429,1.4286,2.0536,0.89286,1.7857,0.35714,1.25,0.625,0.53572,0.80358,5.8928,0.17857,2.6786-3.5714,0.35715-0.53572,0.71428-1.3393,0.0893-2.1429-0.0893-1.9643-1.7857-0.98215-0.35714-2.5-0.0893-0.80357-1.6964,0,0,0.17857-0.80357,0.89286-1.3393,0.80357-5.2678,0-2.5893-2.3214,0.17857-3.5714-1.1607-1.0714-0.17857-0.80358,1.0714-1.0714,0-1.6072-2.5893-0.53571-1.7857-0.0893-0.80357-1.25-0.71429-1.6964-1.25,1.1607-2.1429,2.3214-2.4107,1.5178-1.5179,0.98215-2.9464,0.26785z",
                            "name": "Республика Мордовия",
                            "ShortName": "Республика Мордовия"
                        },
                        "cu": {
                            "path": "m189.11,299.07,1.3393-0.89286,2.9464,0.44643,1.3393,0.44643,1.0714-1.3393,0.26786-1.7857,2.2321-1.1607,2.2321-2.2322,3.125,0.0893,2.6786,0,1.25,1.5179,0.35715,2.9464-0.17857,1.5179,0.35714,1.25,0.71428,1.1607-0.0893,0.71428-1.3393,0.625-4.1071-0.0893-1.3393,0.53571-0.80357,0.80357,0,0.89286,1.1607,0.71428-0.17857,0.89286-1.3393,1.1607-1.7857,1.25-2.1429,0.98214-1.3393,0.44643-1.3393-1.3393-2.5-0.44643-0.98215-0.625-0.98214-1.3393-0.80357-0.80357,0.80357-3.5714z",
                            "name": "Чувашская Республика",
                            "ShortName": "Чувашская Республика",
                            "id": [43]
                        },
                        "ul": {
                            "path": "m188.57,305.32-1.875,2.6786-0.98215,1.4286-4.8214-0.26785-0.80358,0.26785-1.7857,1.4286-0.80357,1.1607,0,2.3214,0,2.5893,0,1.6964-1.7857,1.4286-1.0714,0.26786-0.89286,0-1.25,1.25-1.25,1.0714-0.625,0.26786,0.89286,1.9643,1.6071,1.6071,2.3214,0.44643,1.5178,0.17857,1.25,1.6072,1.5179,0.80357,2.1429,0.17857,0.89286-0.625,0.0893-1.875,0.17857-1.6964,1.0714-1.6964,0.35714-1.3393,1.3393-0.26786,0.80357,0.53571,1.3393,0.625,1.875-0.17857,1.3393-0.98214,1.0714,0.17857,1.6964,1.4286,2.0536,1.875,1.5179,1.6072,0.80357,1.4286,2.3214,0.17857,1.1607-1.5179,2.8572-2.0536,2.0536-1.1607,0.26785-2.3214,0-3.5714-1.875-1.1607-3.6607-0.0893-2.0536-1.4286-0.98214-1.1607-2.5-0.26785-0.98215-1.5179-3.0357-1.5179-0.80357-1.5179-0.625-2.0536z",
                            "name": "Ульяновская область",
                            "ShortName": "Ульяновская область",
                            "id": [38]
                        },
                        "ss": {
                            "path": "m180.98,329.96,1.3393,2.1428,0.71428,2.8572,0.44643,2.8571,0,2.1429,0.625,2.3214-0.0893,2.8571,0.35714,2.4107,0.53571,2.1429,0.625,1.9643,0.71429,0.98214,5.8929,0.0893,3.0357-1.6071,1.25-1.9643,1.9643-0.35715,1.6964-0.0893,2.1429-1.4286,1.4286-0.89286,1.25-0.17857,1.6072,0.625,1.7857-0.17857,0.80357-1.875,1.0714-2.3214,4.375-2.5893,1.7857-1.4286,1.1607-2.0536-0.625-1.5179-0.80357-1.7857-0.35715-2.5-1.1607-1.25-0.71429-2.4107-3.6607-0.26785-2.3214-1.6964-1.4286-0.80357-3.5714,2.3214-1.9643,2.2322-2.4107,0.0893-0.98214-0.98214-2.2321-2.4107-2.4107-1.875-1.0714-1.0714-0.89285,0.26785-1.6072,0.71429-1.6964-0.0893-1.5178-0.80357-1.0714,0-0.625,0.98215-0.53572,1.0714-0.80357,1.5179-0.17857,1.3393,0,0.98214-0.0893,0.71429z",
                            "name": "Самарская область",
                            "ShortName": "Самарская область",
                            "id": [29]
                        },
                        "ob": {
                            "path": "m185.89,352.82,0.53571,1.4286,0.71429,1.6071-1.0714,1.6072,1.0714,1.4286,3.0357,0.17857,1.9643-0.35714,2.5,0,0.17857,2.3214-0.89286,2.6786,0.35714,1.0714,3.5714,1.6071,2.1429,1.4286,0.17857,3.5714,0,4.1071,0,1.4286-1.25,0.89286,0,1.9643,0,0.71428,0.71429,1.0714,1.0714,0.89286,1.7857-2.5,0-1.4286,0.89286-0.89286,1.4286,0,1.0714,2.3214-0.17858,1.4286-0.71428,1.25-0.35714,1.4286l0.36,1.43,1.25,0.89286,2.3214,1.25,1.7857,0.89286h1.9643,2.5l1.4286-1.0714,1.6071,0.17857,1.9643,1.0714,0.89285,1.6071,0.35715,1.7857,1.0714,1.25h1.7857l0.89286-0.89285h1.25l1.6071,0.53571,1.25,1.4286,0.53571,2.6786-0.17857,3.5714,1.7857,1.6072,1.4286,0.89285,1.0714,1.6072,1.0714,0.53571,1.6071-0.71429,1.4286-0.17857,1.6071,1.4286v1.25l1.9643,1.7857,1.25,0.71428,2.1429,0.35715h2.6786l1.4286-0.17857,1.25-0.89286,1.25-1.0714,0.89286-0.89286-0.17858-1.25-2.3214-3.2143-1.0714-1.25v-3.75l-0.71429-2.1429-0.17857-2.1429,1.0714-2.3214,1.9643-1.4286-1.4286-1.7857-3.0357-2.8571-1.9643,0.35714-1.4286-0.17857-0.89286-1.25h-2.3214l-1.4286,1.25-1.0714,1.25-0.53572,1.0714h-2.5l-1.0714-2.5-3.2143-0.17858-2.8572-0.35714-0.89285-2.5-1.08,0.33-1.79,0.89h-1.4286l-0.17857-1.0714,1.4286-1.7857,2.5-2.5-0.53-1.78-0.71-0.36v-0.89286l2.5-1.9643,0.35715-1.0714v-2.1429h-1.7857l-2.1429,0.71429-1.6071,0.17857-1.4286-1.9643-0.53571-2.3214,1.25-1.7857,1.0714-0.89286v-1.6071l-0.35714-2.3214,1.0714-0.89285,0.17857-3.0357-1.25-1.9643-1.7857-1.7857-0.17857-1.6071,1.0714-2.8571,1.6072-2.5,0.89285-1.7857-0.53571-1.25-2.1429-1.6071-1.4286-2.1429-1.25-1.4286-1.6071,1.7857-1.4286,1.4286-4.1072,2.5-1.4286,1.9643-0.35714,1.9643-0.53571,0.35714-1.9643,0.17857-2.1429-0.35714-1.9643,0.53571-1.9643,1.4286-2.8571,0.53572-1.0714,0.71428-1.4286,1.7857-2.1429,1.25h-2.5z",
                            "name": "Оренбургская область",
                            "ShortName": "Оренбургская область",
                            "id": [20]
                        },
                        "nn": {
                            "path": "m186.25,271.57,4.2857-0.53571,2.5-1.4286,3.5714-0.71428,2.6786-1.0714,1.25-0.17857,2.3214,1.25,1.7857,1.0714,2.6786-0.17857,1.4286,0,2.6786-1.0714,1.25,0.17857,1.4286,1.9643,1.0714,2.1429,2.5,0.17857,2.5,1.7857,1.0714,1.25,0.89286,2.5,1.25,1.4286-0.17858,1.6071-1.25,0.89286-1.7857,0.17857-0.71429,0.89286-1.6071,0-0.71428-0.89286-1.7857-1.0714-1.6071,0.71429,0,1.6071-1.25,1.4286-1.25,0.53572-2.1429-0.89286-2.1429-1.6071-3.0357-0.89286-1.7857,0-1.0714,0.89286-0.71429,1.7857,0,2.8571-0.17857,2.8572,0.53571,1.0714-1.0714,1.4286-2.3214,1.4286-1.4286,0.89285,0,1.4286-0.35715,0.89285-0.89285,0.71429-2.8572-0.35714-1.0714-0.17858-0.89285,0-0.71429,0.53572-0.38692,0.34215-0.69448-0.12626-0.44194-0.50508-0.50508-3.0936-1.5784-0.12627-1.5784,1.4521-2.2097,0.44194-3.9775-0.25253-2.0834-2.0203,0.1894-3.3461-1.2627-1.389-0.0631-0.75761,1.0102-1.4521-0.0631-1.0733-3.7249-0.63135-1.1996-0.75761-1.0733-2.7148,1.1364-2.336-1.1996-3.3461,2.0203-0.50507,3.283-0.12627,5.9978,0.12627,1.2627,0.88388,2.0203,0.1894,2.0203-0.75761,0.12627-1.5152-0.94702-1.4521,0.63135-1.0733z",
                            "name": "Нижегородская область",
                            "ShortName": "Нижегородская область",
                            "id": [17]
                        },
                        "ml": {
                            "path": "m211.51,286.29,2.2728,2.336,2.4622,2.0834,2.7779,1.1364,2.9673,0.0631,2.4622,2.0834,1.5784,1.6415,0.44194,1.3258,0.63134,0.94702-0.3788,1.6415-0.56821,1.1364-0.0631,1.8309-1.5152,1.389-0.88388,0.56821-1.4521-0.12627-1.1996-1.5152-1.1996-0.44194-1.389-0.82075-1.7046-0.12627-0.50508,0.88389-1.7046,0.88388-2.5885,0.12627-1.9572-0.82075-1.1364-0.69448-0.88388-3.0305-0.37881-4.7351-1.1996-1.4521-4.0406-0.0631-1.3258-0.1894-0.63134-1.0733,0-2.0834,0.0631-3.0936,0.37881-1.8309,1.0102-1.0733,0.82075-0.63134,2.5885,0.3788,2.2728,0.88389,2.9673,1.7678z",
                            "name": "Республика Марий Эл",
                            "ShortName": "Марий Эл"
                        },
                        "ta": {
                            "path": "m190.93,308.14,0.0631,1.1364,0.44194,1.0733,0.88389,1.0102,1.5152,0.63134,1.8309,1.4521,1.5152,0.75762,1.389,0.44194,1.4521,1.0733,1.389,1.0102,2.4622,0.44194,1.4521,0.0631,1.7046,0.88388,0.12627,2.2097-0.37881,2.9042,0.44195,1.4521,2.0834,1.1996,1.0733,0.75761,2.9042,0.18941,0.82075,0.69448,0.56821,1.7046,1.3258,2.1466,0.63134,2.5885,0.88389,1.7678,1.6415,1.894,1.389,2.2728,1.6415,1.1364,0.88388,0.88388,1.1996,0.0631,2.9042-1.8309,2.9042-2.7148,0.44194-0.63135,0-1.894-1.0102-1.0102-0.0631-0.88388,1.8309-0.25254,1.2627,0.31567,0.75762,0.56822,1.3258,0.3788,1.6415-0.31567,1.1996-0.69448,2.9042-0.12627,1.5152-0.37881,0-0.94701-0.37881-1.2627-1.1996-1.5784-0.63134-1.2627-1.5152-0.44194-0.88389-1.2627s1.2627-1.0102,1.5784-1.1364c0.31567-0.12627,2.2728-0.75762,2.2728-0.75762l0.0631-1.4521s-1.1364-0.18941-1.389-0.50508c-0.25254-0.31567-0.69448-0.94702-0.69448-0.94702l2.0203-1.3258,2.0203-1.389,0.12626-1.1364-0.69447-0.82075h-1.5152l-0.69448,0.0631-1.1364,1.3258-0.56821,0.69448h-1.894l-0.12627,0.88388-0.12627,1.3258-0.82075,1.1364-1.5152-0.12627-0.75761-1.4521-1.1364-0.94702-0.82075,1.0102-1.7678-0.31567-0.56821-2.2728-1.4521-0.88388-0.63135-1.2627,0.12627-1.3258-1.1364-1.3258,0.0631-2.6516,0.12627-3.0936,0.63135-0.94702-0.25254-1.0102-0.69448-1.0733-0.56821-0.56821-1.0102,0.44194-0.88388,0.37881-1.0102-0.12627-1.0733-0.88389-0.88388-0.82074-1.8309-0.69448-1.4521-0.44195-0.94702,0.94702-1.8309,0.75762-1.8309,0.1894-1.6415-0.31567-1.9572-1.0733-1.389,0.50508h-2.7148l-2.0834,0.0631-1.389,1.1364-0.0631,0.88389,0.69448,0.50507,0.12627,0.82075-0.82075,1.0733-1.5152,1.2627-2.6516,1.0733-1.5784,0.69448-1.1364-0.75762-2.0834-0.82075z",
                            "name": "Республика Татарстан",
                            "ShortName": "Республика Татарстан",
                            "id": [27]
                        },
                        "iv": {
                            "path": "m174.26,252.7,2.0203-1.1364s0.94702-0.50507,1.1996-0.50507c0.25254,0,2.5885,0.31567,2.5885,0.31567l2.7148,1.1364,2.3991,1.1364,1.2627,1.1996s1.4521,1.0102,1.7046,1.1996c0.25254,0.18941,1.4521,1.2627,1.4521,1.2627l1.7046,0.63135,1.1364-0.88388h0.88388l0.50508,0.82074,0.1894,1.1996,1.0102,0.75762,1.5152,0.82074,1.0102,0.63135,0.44194,1.0102-0.69448,1.0733-0.12626,0.88388,0.75761,0.37881,0.88388-0.56821,1.389,0.63134,0.69448,0.94702,0.25254,1.2627-0.25254,0.50508-1.894,0.69448-2.9673,0.82075-3.0936,0.50507-2.3991,1.5152-3.4724,0.50508-0.94702-0.12627-1.7678-2.3991-3.5987-3.4724-2.7148-3.3461-0.82075-2.7779-0.88388-1.0102-2.1466-0.44195-0.69448-0.56821,0.50507-1.4521,0.56821-1.3258z",
                            "name": "Ивановская область",
                            "ShortName": "Ивановская область"
                        },
                        "yr": {
                            "path": "m184.11,228.33,1.7678,1.5784,1.9572,0.50507,1.7678,0.50508,1.3258,1.6415,1.9572,1.5784,1.5784,0.0631,1.0733-0.69448,0.82075,0.31568,0.3788,1.4521,0.12627,3.4093-0.0631,2.6516,0.25254,1.5152,0.88388,1.0102,0.56821,0.94702-0.37881,1.0733-1.7046,1.1364-2.7148,1.3258-3.283,2.2097-1.6415,1.0733-3.3461,0.88388-2.4622-0.1894-2.1466-0.63135-2.6516-0.69448-2.1466,0.63135-1.8309,1.0733-1.7046-0.88388-1.4521-1.0102-1.894-1.1364-1.1364-1.1996-0.25254-1.3258,0.56821-1.4521,2.0203-0.88388,2.2097-1.1996,1.6415-2.7779,1.0102-2.9673,1.1996-1.2627,0.75762-2.4622,1.6415-1.8309,1.9572-1.8309,2.7148-1.5152z",
                            "name": "Ярославская область",
                            "ShortName": "Ярославская область",
                            "id": [44]
                        },
                        "kt": {
                            "path": "m198.7,245,1.389,0.12627,1.2627-0.75762,1.5152-1.389,1.894-0.75762,1.894,1.1364,1.894,1.5152,2.5254,0.12627,0.63135-0.75761,0.75761,0.50507,1.2627,2.1466,2.2728,2.2728,1.5152,1.5152,1.1364,1.894,0.3788,2.2728,1.2627,1.7678,1.5152,1.6415,2.5254,1.389,1.7678,1.5152,1.7678,1.894,2.0203,0.88388,1.894,0.12627,2.0203-2.0203,1.6415-0.3788,0.63135,1.894,1.1364,1.0102-0.12627,1.6415-1.6415,1.5152-0.12627,1.894-0.3788,2.5254s-1.7678,0.75761-2.3991,0.75761c-0.63134,0-6.3134-0.12626-6.3134-0.12626l-3.1567,0.12626-1.1364,1.1364-1.2627,0.50507-2.0203-0.75761-1.5152-0.75762-2.0203-0.3788-1.0102-1.5152-0.88388-1.6415-0.75762-0.63135-1.1364-0.12627-0.88388,0.50508-2.1466,0.75762-3.283-0.25254-1.7678-0.50508-2.0203-1.2627-0.50508-0.50508,0.25254-0.63134v-1.1364l-1.389-1.2627-0.88389-0.50508-0.63134,0.37881-0.38556,0.10695-0.53571-0.35714,0.0893-0.89286,0.71429-0.625,0.0893-0.98214-0.89285-0.71429-1.7857-1.0714-0.98214-0.98215-0.26786-0.98214-0.71428-0.89286h-0.98215l-0.89285,0.625-0.625,0.0893-1.25-0.71429-1.4286-0.80357-1.3393-1.25-1.7857-1.3393-0.69-0.57,1.07-0.71,2.05-0.54,2.3214-0.71428,2.8571-2.0536,3.3036-1.6964z",
                            "name": "Костромская область",
                            "ShortName": "Костромская область"
                        },
                        "le": {
                            "path": "m153.49,177.57,1.7678-1.6415,1.5152,0,2.2728-1.894,2.5254-0.50507,2.2728,0.63134,2.9042,2.1466,2.7779,1.5152,0.75761,2.5254,0.12627,1.389,1.0102,1.1364,1.1364-0.37881,0.75761-2.0203-0.12627-2.3991-0.88388-1.6415-0.88388-1.894,0.12626-2.0203,1.1364-1.2627-0.25254-1.894-0.75762-1.0102,0-0.37881,1.2627-0.25254,3.283,0.25254,3.5355,1.2627,2.2728,0.12627,1.894,0.12627,1.2627,1.1364,0.63135,1.2627,0,1.7678-0.37881,1.6415-0.25254,2.1466-0.63134,1.7678-2.1466,1.2627-0.75761,1.0102-1.0102,1.894-1.0102,1.1364-1.7678,1.1364-0.63135,1.2627,0.25254,1.1364,1.389,0.75762,2.1466,0.25253,1.0102,0.88389,0.25254,1.6415,1.0102,0.75762,2.1466,0.12627,1.1364-0.50508,3.4093-0.25254,1.7678-0.63134,2.0203-0.25254,1.5152,0.75761,1.0102,1.6415,1.1364-1.2627,1.389-1.7678,0.75762,0.88388,0.50507,2.0203,0.63135,2.2728,2.1466,0.50507,1.2627,0.75762,1.1364,1.0102,0.12626,1.2627,0.12627,1.6415-0.12627,1.7678-1.2627,0.75761-2.2728-0.25254-1.389-0.88388-1.389-0.25254-0.75761,0.88388-1.5152,1.0102-3.0305,0-1.5152,0.3788-2.7779,3.0305-1.0102,1.389-0.37881,2.1466-1.6415,1.0102-1.1364,0.12627-0.3788,1.2627-1.2627,0.63134-0.63135-1.0102-1.1364-1.1364-2.2728-0.12627-0.75761,0-1.1364-3.0305,0-2.9042-1.0102-1.5152-0.88389-1.894-0.12627-1.6415-2.2728-0.88388-0.88388-0.63135s-0.37881-1.0102-0.37881-1.5152c0-0.50507-0.25254-3.4093-0.25254-3.4093l-0.75761-1.1364-2.3991-0.25254-1.389,0.75761-0.75762-0.50507-0.12627-1.2627-0.63134-0.88389-1.0102,0.63135-2.1466,0.3788-2.7779-0.88388-1.5152-0.88388-3.283-0.37881-1.2627-0.88388-1.0102-0.75762,0.63135-1.2627,0.88388-2.1466,0.88388-1.389,0.12627-1.2627z",
                            "name": "Санкт-Петербург и Ленинградская область",
                            "ShortName": "С-Пб и Лен. область",
                            "id": [30,14]
                        },
                        "ki": {
                            "path": "m237.59,265.33,1.2627-0.88388,0.12627-2.0203,0-2.0203-1.0102-1.389-0.12627-1.6415,1.5152-0.37881,3.9143,0.25254,2.5254-0.88388,2.6516-1.1364,0.63134-1.389,1.1364-0.63134,2.7779,0.25254,1.389,1.7678,0.12627,2.7779-0.63134,3.0305-1.0102,1.389-0.75761,2.7779-1.894,0.75762-2.0203,0.12626-1.6415,1.7678-0.63134,1.6415-1.0102,0.63134-0.75761,0.88389,0.75761,1.389,1.6415,0.88388,1.0102,1.389-1.6415,1.894,0.12626,1.894,1.1364,0.88389,1.2627,0.50507,0.88388-1.389,0.88388-1.894,2.7779,0,3.1567,0.3788,4.2932,1.2627,1.7678,2.2728,2.1466-0.12627,2.1466-1.6415,1.6415,0.37881,1.2627,1.0102,0.75762,1.894s1.0102,1.5152,1.389,1.7678c0.3788,0.25254,2.5254,1.894,2.5254,1.894l0.25254,1.5152-0.88389,2.0203-2.0203,1.1364-3.5355,0.25253-1.2627,0.63135-1.2627,1.5152-0.25254,1.389,1.0102,1.389,0.12627,1.1364-1.5152,1.1364-0.75762,1.389-0.12627,2.1466-1.2627,1.0102-2.7779,0.12627-1.1364-1.2627-1.0102-2.5254-2.0203-0.12627-1.389-0.3788v-1.894l-2.0203-1.1364-3.1567,0.75761-1.7678,1.389s-1.2627,1.0102-1.2627,1.5152c0,0.50508-0.3788,2.2728-0.50507,2.7779-0.12627,0.50508-1.6415,1.5152-1.6415,1.5152l-2.5254,1.1364-1.894-0.50507-1.2627-1.389-1.5152,0.25253s-0.75761,0.50508-1.0102,1.389c-0.25254,0.88389-0.12627,2.7779-0.12627,2.7779l0.12627,1.894-2.0203,0.63135-3.4093,0.3788-0.25254,1.1364v1.389l-0.3788,1.389-1.7678,0.88389h-0.63135l-0.63134-1.5152-0.50508-0.37881,0.12627-2.5254,0.25254-2.5254,0.50508-1.5152-0.88389-1.6415-0.25254-1.2627,0.75762-2.9042,0.63134-2.5254-1.0102-1.5152-1.6415-2.5254-2.1466-1.5152-0.88388-0.63134-3.9144-0.12627-1.7678-1.2627-1.6415-1.5152-1.6415-1.5152-0.50507-0.50508,0.50507-1.0102,1.2627-1.6415,0.25254-1.0102,1.1364-0.75761,1.5152,0.50507,1.894,1.389,1.389-0.75761,2.1466-0.63135,1.389-1.2627v-1.5152l-1.2627-1.894-0.63135-1.5152s-0.78918-1.1049-0.85231-1.2627c-0.0631-0.15784,0.56821-0.69448,0.56821-0.69448l0.97858-0.63135,0.75762-0.75761s2.2728-0.0316,2.8095-0.0316c0.53664,0,3.1567,0.0631,3.8828,0.0631,0.72605,0,3.7881-0.44194,3.7881-0.44194l1.4521-0.59978s0.12626-1.5784,0.15783-1.7993c0.0316-0.22097,0.47351-2.4938,0.47351-2.4938l2.0203-2.3991z",
                            "name": "Кировская область",
                            "ShortName": "Кировская область",
                            "id": [11]
                        },
                        "bs": {
                            "path": "m241.5,329.86,2.3991-1.6415,2.5254-1.6415,1.5152-0.25254,1.894,2.6516,2.2728,2.2728,2.9042,0,2.6516,2.5254,1.7678,2.5254,1.1364,1.7678,1.7678,0,1.2627,2.1466,2.6517,2.3991,2.2728,1.6415,2.0203,1.7678,1.2627,1.1364,0.88389,1.389-0.37881,1.1364-1.6415,0.63134-0.88388,1.2627,0.25254,1.389,1.389,0.63135-0.63135,1.2627-1.5152,0.50508-1.2627-0.75762-2.3991,0.37881,0,1.0102-1.5152-0.25254-0.50508-0.88388-1.5152-1.0102-4.5457,0-1.1364-0.37881,0-1.2627,1.7678-1.2627,0.12627-1.389-1.0102-0.88389-1.6415-1.1364-2.5254,0.25254-1.0102,2.1466-1.7678,2.6516-0.88388,2.0203,0.50508,3.0305,1.894,1.0102,2.0203-0.75761,1.6415,0.75761,1.0102,2.0203,2.5254,0.12627,2.0203,0.75761,2.7779,0,1.7678-0.50508,1.5152,1.1364-0.63135,1.389-1.894,1.5152-1.2627,1.1364-1.0102,1.389-1.2627,0-1.2627-0.63134-2.1466-0.75762-1.6415-0.3788-1.6415,1.2627-0.3788,1.5152-0.63135,1.389-2.3991,2.6516-1.6415,2.3991-3.9143,3.6618-1.894,1.5152-0.25254,2.0203-0.63134,1.5152-2.9042-0.25254-1.6415,1.7678-1.2627,1.389-0.50507,0.63135-2.0203,0-1.1364-2.0203-0.50508-0.63134-5.4296-0.63135-1.389-2.1466-2.7779,0.88388-1.2627-0.12627,0-0.50507,3.4093-4.4194,0-1.6415-0.88389-0.63134,0-1.1364,1.7678-1.1364,1.0102-1.389,0-2.0203-0.25253-0.50508-1.894-0.12627-2.2728,1.2627-1.7678-1.1364-1.1364-2.3991,1.2627-2.3991,1.0102-1.894-0.25254-2.5254,0-0.75761,0.88389-1.5152,0-3.1567-2.5254-2.9042-0.12627-2.0203,1.0102-2.6516,2.0203-4.1669,2.9042-2.1466,3.9143-3.1567,1.0102-2.1466-0.88389-1.389-0.12627-0.12627,0-0.75761,1.389-0.25254,2.3991,0.75762,1.389,0.12626,1.7678-0.63134,2.6516-0.25254,1.7678-0.12627,0.88388-0.63134,0-1.7678z",
                            "name": "Республика Башкортостан",
                            "ShortName": "Респулика Башкортостан",
                            "id": [24]
                        },
                        "cl": {
                            "path": "m272.18,347.66,1.7678-0.88388,2.7779,0.50507,2.3991,2.1466,2.3991,1.7678,3.0305,1.894,2.9042,0,1.5152,1.6415,1.6415,2.3991,0.75761,1.894-0.63135,3.1567,0,2.7779-0.88388,1.389-1.7678,0.63135-1.6415,1.1364-0.75762,1.2627-2.0203,0.63135-1.894,1.5152,0,1.1364,1.5152,1.5152,2.0203,2.0203,1.1364,2.3991-0.37881,2.7779-0.75762,1.7678-2.3991-0.63135-2.6516-0.50507-3.283-0.37881-2.0203-0.50508-1.5152-1.7678-2.0203-1.7678-1.1364-1.1364-1.1364,0.50508-1.5152,1.1364-0.88388,1.0102,0,1.894,1.6415,1.2627-0.37881,0.75761-2.2728,0.63135v1.0102c0,0.50508,0.75761,2.0203,0.75761,2.0203l2.0203,1.7678,0.12627,1.894-1.5152,0.63134-1.5152-1.5152-1.389-1.2627-2.2728-0.63134-3.283,0.12627-1.5152,0.25253-0.63134,1.2627,1.0102,1.389-0.37881,1.894-1.0102,1.6415-4.5457,0.25254-1.6415-0.88389-1.6415-0.63134,0.50507-2.0203,1.6415-0.88388-0.75761-1.7678-2.0203-2.3991-1.6415-1.0102-1.894,0.12627-1.389-0.63135,0.63134-2.7779,1.7678-2.6516,4.4194-4.1669,3.7881-4.672,1.2627-2.9042,1.389-0.88389,2.5254,0.25254,2.0203,1.0102h2.0203l1.894-2.2728,2.2728-1.894,0.50508-1.389-1.5152-1.2627-2.1466,0.50507h-3.0304l-2.7779-0.88388h-1.5152l-0.88388-1.894-1.389-0.50507-1.7678,0.63134-1.0102-0.37881-0.88389-0.63134-0.63134-1.894-0.12627-1.6415,3.6618-5.6821,0.75762-0.63135,1.7678,0.37881,1.7678,0.88388,0.63134,1.1364-0.3788,0.75762-1.2627,1.1364v1.1364l-0.12627,0.12627,0.75761,0.63135,2.6516,0.12627h2.2728l1.5152,1.0102,1.2627,1.1364,1.1364-0.63135,0.50507-0.75761,2.0203,0.12627,1.7678,0.37881,1.1364-1.2627-0.37881-1.0102-0.75761-0.88388,0.25253-1.5152,1.5152-1.0102,0.63135-1.1364z",
                            "name": "Челябинская область",
                            "ShortName": "Челябинская область",
                            "id": [41]
                        },
                        "ud": {
                            "path": "m261.7,302.33-0.12627,1.389-2.0203,2.7779-1.5152,1.389,0.12626,1.389-1.6415,1.0102-1.1364,1.5152-1.5152,2.3991-0.50508,1.894-0.50508,3.1567-2.0203,1.0102-2.2728,0.12627-0.63135,1.1364-0.37881,3.0304-0.12627,1.389-3.0304,2.0203-2.2728,1.389-1.0102,0-1.2627-1.5152-1.7678-0.75762-0.63134-1.2627,1.389-1.1364,2.0203-0.75761,0.50508-1.1364-0.37881-0.50508-1.5152-0.88388,0.25254-0.88389,2.7779-1.7678,1.0102-1.1364-0.50507-1.0102-0.75762-0.63134-2.0203,0.63134-1.1364,1.389-1.5152,0.63135-1.0102,0.25253-0.3788,1.5152-0.63135,0.75762-0.88388,0.25254-0.75762-1.0102-1.389-1.2627-0.75761,0.37881-1.2627,0.37881-0.88388-0.88389-0.63135-1.1364-1.0102-1.0102-0.63135-1.0102,0-1.1364,1.6415-0.88389,1.1364-1.1364,0.25254-2.0203,0.25254-1.0102,3.1567-0.50507,1.6415-0.50508,0.37881-4.4194s0-1.2627,0.63135-1.5152c0.63134-0.25253,1.2627-0.3788,1.2627-0.3788l1.2627,0.63134s1.6415,1.894,2.3991,1.389c0.75761-0.50507,1.894-0.88388,1.894-0.88388s2.3991-1.0102,2.2728-1.6415c-0.12627-0.63134,0.25254-1.6415,0.25254-1.6415l0.3788-1.389,2.1466-2.2728,1.2627-0.75761,2.2728-0.50508,1.6415,0.37881,0.88388,1.1364v0.75761l0.25254,0.63135,1.0102,0.12627,1.6415,0.3788,0.63135,0.50508,0.63134,1.6415,0.75762,0.75761z",
                            "name": "Удмуртская Республика",
                            "ShortName": "Удмуртская Республика",
                            "id": [37]
                        },
                        "pe": {
                            "path": "M272.06,274.03l-2.28,1.16,0.5,1.5-0.5,3.53,0.5,1.28,1.41,2.41,2.25,1.62,0.65,1.66-1.4,2.12-2.41,1.03-2.87,0.63-1.66,0.87-1.13,1.54,0.5,1.24,0.63,1.38-0.13,1.03-1.9,1.63-0.38,2.4-0.87,1.6-0.13-0.19-1,0.12-1.28,2.5-2,2.29-0.15,1.53-0.88,0.87-2,2.03-1.91,3.41-0.62,3.9-1.28,0.88-2.25,0.38-1.28,0.78-0.63,4.9,2.53,2.66,2.13,2.28,2.53,0.25,2.28,1.5,3.41,4.94,1,0.37,1.28-0.12,1.12-1.25,0.88-1.28,1.03-1.75,1.25-1.66,1.28,0.88,1.5,1.28h2.41l2.03-0.91,0.5-1.75,0.25-1.91,0.87-0.75,0.88-1,0.78-0.5,2.5,2.75h3.69l0.87-1,0.5-1.5,0.25-1.65,0.88-1.25,4.69-0.38,2.15-0.78,0.63-1.5-0.63-0.62-0.12-1.41,1.12-1.38,0.75-1.03v-1.37l-0.5-0.88-0.62-1.03,0.25-1.75,1-1.53,2.03-1.5,3.15-0.5,1.88-1.91,2.28-1.62,2.28-1.66,2.28-1.65,0.88-0.75,0.5-1.25,1-1.78s0.9-1.12,1.53-1.75c0.63-0.64,1.62-1.91,1.62-1.91l1.16-1.37,0.25-1.66-2.41-0.38-2.65-0.75-2.66-1.65-2.75-1.38-2.66-1.28-2.53,0.66-3.15,0.12-3.66-0.9-2.9-1.63-1.63,0.85-0.41-0.22-1.9-1.25-1.38-2.03-1.12-1.13-2.28-0.78-0.13-1.63-1.12-1.28-1.41-1.5-1.91-0.5-2.62-0.25-2.41-0.78z",
                            "name": "Пермский край",
                            "ShortName": "Пермский край",
                            "id": [22]
                        },
                        "sv": {
                            "path": "m316.13,291.72,1.7678-1.1364,1.1364,1.389,0.88388,2.3991,2.6516,1.5152,2.9042,2.1466,1.2627,2.3991,2.2728,2.7779,0.12627,1.7678,0.63135,2.0203,0.75761,1.5152-0.63134,1.7678-1.894,1.894-0.63135,1.7678-0.25253,4.7982,0.3788,2.7779,0.63135,1.0102-1.0102,2.9042-1.5152,1.7678-0.37881,2.3991,2.0203,1.2627,2.3991,2.0203,0.75761,2.0203,0.12627,2.6516-0.63134,1.6415,0,2.9042,0.75761,2.3991-0.25254,1.894s-0.88388,0.88388-0.88388,1.389c0,0.50508-0.50508,2.7779-0.50508,2.7779l-1.2627,1.2627-2.0203,0.12627-1.1364,0.88388h-3.0304l-1.5152-0.88388-2.1466,0.25254-1.389,1.1364-0.88388,1.389-0.25254,2.9042-0.75761,1.1364-1.1364,1.0102-1.7678,0.50508-3.0305,0.25254-2.0203,0.25254-1.0102,0.88388-1.894-0.37881-1.389-1.1364-1.894-1.894-2.5254-1.6415-1.5152-0.63135-2.2728,0.37881-1.894,0.3788-1.389-0.12626-1.6415-1.389-1.894-2.2728h-2.2728c-0.50508,0-1.6415-0.75761-1.6415-0.75761l-4.672-3.1567-1.6415-1.7678-2.9042-0.3788-1.389,0.12627-0.88389,0.12627-1.2627-1.2627-3.9143-3.283-3.1567-3.0305-0.50507-1.389,2.0203-2.9042,1.389-2.7779,0.75762-0.25253,1.6415,1.1364,1.1364,0.75761h2.7779l1.5152-1.389,0.50507-1.7678,0.12627-1.7678,2.5254-1.7678,1.7678,2.0203,1.2627,0.63134h2.3991l1.6415-1.1364,0.75761-2.0203,0.50508-1.894,3.7881-0.75762,2.5254-0.3788,1.389-1.2627v-1.0102l-0.88388-1.389,1.7678-2.1466,0.25254-1.1364v-1.389l-1.0102-1.6415,1.0102-2.5254,2.1466-1.6415,3.283-0.88388,1.1364-0.75762,8.0812-6.1872,0.88388-1.6415,1.6415-2.7779,2.1466-2.5254z",
                            "name": "Свердловская область",
                            "ShortName": "Свердловская область",
                            "id": [32]
                        },
                        "ku": {
                            "path": "m285.69,383.01,2.3991,1.894,3.283,0.88388,4.2932,1.2627,3.1567,0.75762,4.1669-0.50508,2.5254,0.25254,2.9042,1.0102,3.5355,1.1364,3.5355,0.88388,3.283,1.0102,3.4093-0.12627,2.3991-1.2627,3.6618,0,1.0102-1.5152,0-1.894-1.5152-2.1466-1.389-2.7779s-1.5152-0.12627-2.1466-0.37881c-0.63135-0.25254-2.2728-1.6415-2.2728-1.6415l-0.75761-3.1567-1.389-1.7678-2.6516-1.2627-1.5152-1.6415-1.2627-2.2728-1.6415-1.5152-1.389-1.2627-1.0102-1.389,0.50508-2.3991,1.389-1.2627,1.1364-1.894-2.5254,0.37881-3.0305,0.12627-1.389,0.50507-0.75762,0.50508-1.2627-0.37881-2.0203-1.0102-1.7678-1.7678-2.0203-1.389-1.7678-0.75761h-1.2627l-3.0305,0.63134-1.7678-0.12627v1.1364l0.63135,0.88388-0.50508,2.2728v2.2728l-0.25253,2.1466-0.88389,1.1364-2.5254,1.1364-1.389,1.1364-1.5152,1.2627-1.7678,0.88388-0.50507,1.2627,0.63134,1.1364,1.894,1.894,1.389,1.389,0.63134,1.7678v1.894l-0.50507,1.7678z",
                            "name": "Курганская область",
                            "ShortName": "Курганская область"
                        },
                        "ko": {
                            "path": "m254.63,259.27,2.1466-0.63134,0.63134-0.88388,1.894,0.12627,1.6415,1.894,2.1466,0.25254,2.1466-0.50508,1.5152-1.894,0.50508-1.5152-0.63135-0.88389,0.63135-1.5152,2.1466-1.2627,4.5457-1.894,2.6516-1.1364,0.25254-1.5152-0.50508-2.5254-2.1466-0.88389-3.283,0.12627-2.3991,1.6415-2.3991-0.75761s-0.50508-1.0102-1.2627-1.0102-1.5152-0.25253-1.5152-0.25253l0.50507-3.0305,1.7678-0.37881,1.389-1.5152,0.50508-1.894,2.1466-0.50508,2.2728,0.12627,0.63135-1.7678-0.63135-0.63134-0.63134-2.1466,0.63134-1.389,4.5457-2.0203v-1.2627l-1.0102-2.5254-0.63135-1.6415-1.6415-1.7678-0.63134-1.1364,0.25254-1.6415,1.2627-0.63134,1.7678,0.75761,1.5152,2.1466,1.6415,1.5152,2.2728,1.894,2.6516,1.2627,1.7678,1.1364,0.50508,1.7678,1.5152,1.5152,3.1567,0.3788,1.894,1.2627,2.9042,0.50507,0.88388,1.2627h2.0203l1.0102-0.63134-0.25254-1.5152-0.75761-1.5152,0.50507-1.0102,0.88389-1.5152s0.25253-1.1364-0.12627-1.6415c-0.37881-0.50508-1.1364-1.1364-1.1364-1.1364v-0.88388l2.7779-3.283,3.1567-2.1466,1.894-2.0203,1.0102-0.88388,2.3991,0.63134,3.4093,0.12627,2.5254,0.75762,4.2932,0.50507,2.1466,0.63135,3.283,0.12627,2.3991-0.50508,1.5152,0.12627,0.12627,1.894,1.2627,1.0102,2.1466,2.1466,5.3033,4.672,7.4499,4.672,6.4397,3.7881,5.177,3.0305,5.5558,3.283,2.7779,1.894,2.2728,0.25254h3.283l2.1466-1.0102,2.5254-2.3991,1.6415-1.2627,2.7779,0.25253,2.3991-0.12626,2.0203-0.63135,1.5152-0.88388,1.6415-0.37881,3.1567,0.12627,1.6415,0.25254-0.50508,1.5152-0.88388,1.1364-1.1364,0.63134-0.50508,1.894,1.2627,1.7678,1.2627,1.389,0.12627,1.894-1.1364,1.389-0.88388,0.25254-0.75762,1.389-2.0203,0.25254-2.3991-0.12627-2.1466,0.88388-2.5254,1.389-1.389,1.1364-3.0305-0.12627-2.1466-0.50507h-3.1567-2.0203l-1.0102,0.3788-1.389,1.5152-0.75762,0.88389-2.1466,1.6415-1.5152,0.50508h-2.3991l-2.3991-0.25254-1.5152,0.50508-2.9042,2.0203-2.2728,1.2627-1.5152,1.0102-1.5152,0.3788-1.2627-0.12626-1.2627-1.0102-0.12626-1.894-0.63135-1.389-1.6415,0.88388-1.5152,1.389-1.0102,1.2627-0.88388,0.50508-1.2627,0.50507-0.75762,0.37881-0.12627,1.7678-0.3788,1.7678-0.63135,1.389-0.88388,1.1364-1.0102,1.6415-1.894,1.6415-1.6415,1.389-1.2627,0.75762-2.7779,3.283-1.894,2.6516-1.1364,3.0305-0.50507,1.6415-1.5152,1.6415-2.0203,0.88388-1.5152,0.63134-1.7678,1.0102h-2.2728l-3.1567-1.0102-3.1567-1.6415-4.4194-2.1466-0.75761-0.3788-2.5254,0.50507h-3.283l-3.0305-0.88388-2.9042-1.389-1.0102,0.25254-1.6415-0.12627-1.5152-1.2627-2.2728-2.3991-1.894-0.88388-0.63135-1.5152-2.2728-3.0305-5.8084-1.1364-1.389-0.63134-1.7678,0.63134-0.75761,0.75762v0.75761l0.37881,0.88389v1.6415,1.0102l-0.50508,0.3788-1.389-0.63134-0.88388-0.37881-1.1364,0.25254-1.5152,0.88388-1.5152,0.50508-1.1364-0.25254-0.88389-1.389-0.88388-0.63135-2.2728-0.88388-6.0609-1.1364-1.2627,0.25254-1.1364,1.1364-0.63135,1.5152-1.1364,0.37881-1.6415-1.389v-1.1364l1.0102-1.389,0.50507-0.75761-0.50507-1.0102-1.1364-1.0102-1.1364-1.0102-0.3788-0.75761,1.5152-1.2627,1.1364-2.5254,1.6415-1.0102,1.6415-0.3788,1.894-1.2627,0.88388-2.3991,1.2627-1.2627z",
                            "name": "Республика Коми",
                            "ShortName": "Республика Коми"
                        },
                        "mu": {
                            "path": "m247.31,136.92,1.1364-1.5152,1.5152-0.75761,2.9042,0,4.2932,0.12626,2.1466-0.50507,2.5254-1.6415,0.88388-2.0203,0.12627-3.5355,1.5152-3.4093,1.0102-1.0102,4.7982,0,2.3991-0.63134,1.0102-1.2627,1.7678-0.12627,2.3991,1.0102,3.0305,1.894,2.2728,1.894,2.6516,0,2.2728-0.25253,0.25254,2.3991,1.894,0.3788,1.7678,1.0102,0,2.2728,0,1.7678-1.0102,0.63134-1.5152-0.3788-0.75761-1.1364-0.25254-0.63134-0.88388,1.0102-0.25254,0.63135,0.50508,1.1364,1.1364,0.88388,0.50507,0.75762-0.3788,1.0102-1.0102,0.63134,0,0.75762,1.1364,1.2627,0.88388,1.5152,0.88388,1.7678,2.0203,2.1466,0.75761,1.7678,0,1.7678,0,1.1364-0.50507,1.1364-0.25254,2.0203-0.12627,5.5558,0,5.5558-0.75762,1.389-0.25253,1.894,0.63134,0.88389,0.63135,1.0102-0.12627,4.0406,0,3.5355-0.63135,1.389-1.7678,1.1364-0.88389,0.88388,0,1.0102-0.25254,0.88389-1.1364,0.88388-2.7779,0.75761-3.6618,0.12627-3.1567,0.50508-1.6415,0.37881-2.5254-0.50508-2.0203-0.75761-1.894-1.389-1.894-2.2728-1.7678-2.2728-1.1364-1.894-0.63135-2.2728-0.3788-2.3991-1.2627-2.6516-1.1364-2.0203-0.3788-1.6415-0.37881-3.9143,0-1.7678,0-1.389-0.88388-0.88389-0.12627-2.9042,0-2.1466,0.75761-1.5152,0.12627-1.1364,0-1.5152-0.88388,0-0.63135,0.88388-0.88388,1.389-0.75762,1.894-0.25253,0.63135-3.5355,0-2.6516-0.25254-0.75761-1.5152,1.389-2.0203,1.1364-0.75761,0.25254-1.0102-1.7678-2.2728-1.5152-1.7678-1.2627-2.7779-1.2627-1.2627z",
                            "name": "Мурманская область",
                            "ShortName": "Мурманская область"
                        },
                        "kl": {
                            "path": "M246.94,136.91l-2.28,1.53,0.12,1.62-1,2.28-1.9,2.04-1.88,0.87-4.31-0.13-0.88,1-2.28,2.16h-2.91l-2.4,0.38-0.13,4.03-0.62,1.9-2.91,0.38-1.87,0.25,0.12,1.4,0.88,1.5-1.78,1.29-1.25,0.5-3.41-0.91-1.66,1.16-0.37,2.9-0.13,4.16-1.25,2.28-2.65,1.62-3.41,1.16-8.72-0.12-3.53-0.91-5.19-0.75-4.28-0.75,0.88,1.87-0.13,1.54,0.07,0.53-0.94,5.65-2.53,1.5-2.03,3.32-2.91,1.87-0.13,1.66,2.66,1.25,1.91,0.75,1,2.4,2.9,0.25,5.07-0.75,1.65-0.9,2.25,0.53,1.78,1.37,1.38-1.62,1.12-0.78,1.78,4.69,1.5,0.62,2.91,1.53,0.06,0.69-0.12,2.69,0.06,1.78-1.63,1.53,1,1.12,2.29,0.5,1.75-0.62,2.53-1,0.62-0.5,1.91,1.5,1,1.9,1.03,1.88,3.16,0.25,3.28-3.03,0.75-1.5,1.25-1.38,2.4-1.28,2.03-1.75,0.5-1.15-0.37-1.25-1.91-0.63-1-1.03,0.13-1.63,1.37-2.4,1.78-1.91,1.66-1.87,1.25-2.16,1.38,0.25,1.78,1.53h1.9l0.88-0.53,0.12-2,1.5-2.03,0.25-1.75-0.25-3.16-0.5-1.53,0.63-1.78,1.4-0.87,1.38-0.63,3.03-2.53,0.5-1.13,0.53-1.28h1.38l3.4-0.62,2.16-1,1.5-1.28v-1.88-3.4l0.25-2.54,1.03-0.87v-1.16l-0.12-2-0.78-1.15-2-0.38-1.41-0.37-0.63-0.88v-0.75l0.63-1.15,1.28-1,0.75-0.63-0.38-1.03-1.65-2.37-1.88-2.29-1.4-2.15-1.75-2.53z",
                            "name": "Республика Карелия",
                            "ShortName": "Республика Карелия"
                        },
                        "vo": {
                            "path": "m215.36,208.76c0.12627,2.5254-1.389,5.0508-1.389,5.0508l-1.5152,1.894s-0.3788,1.0102-0.3788,1.7678c0,0.75762,0.12626,1.389,0.12626,1.389s0.63135,1.389,1.894,2.1466c1.2627,0.75761,2.0203,2.7779,2.0203,2.7779l1.0102,1.894,1.5152,1.2627,1.2627,1.0102,1.1364,1.894,1.2627,0.37881,3.1567,0.50508,1.5152,2.2728,1.0102,1.894,1.7678,0.63135,0.25254,0.63135,1.0102,2.2728,1.2627,0.75761,2.6516,0.25254,1.5152,0.12627,0.50507,2.7779,1.2627,2.0203,2.7779,1.389,1.389,0.12627,1.0102-0.63134,1.389,0.12627,1.0102,0.50507,0.75761,1.0102-0.63134,1.5152-0.75762,1.389,0.25254,0.75762,1.2627,1.1364,0.75761,0.50508,1.0102,0.50507,0.3788,0.63135v1.0102l-1.5152,1.5152-2.0203,0.63135-2.0203,0.75761-4.2931-0.25254-1.2627,0.88389,0.25253,1.1364,0.88389,1.2627v2.6516,1.1364l-1.0102,1.1364-0.75761-0.63134-1.1364-1.0102-0.37881-1.5152-1.0102-0.12626-1.6415,1.0102-1.0102,1.0102h-1.7678l-3.0305-1.5152-2.1466-2.1466-2.0203-1.1364-1.894-1.6415-2.0203-2.7779v-1.894l-1.894-2.7779-2.5254-2.2728-1.5152-2.0203-1.2627-1.7678-0.63135,0.75761-1.6415,0.12627-1.6415-0.25254-2.2728-1.894-0.88388-0.50508-1.2627,0.63135-2.7779,1.7678-0.63135,0.37881-1.2627,0.12627-0.88388-0.50508-0.50508-1.2627-0.63134-1.894,0.25254-4.0406-0.50508-2.5254-0.50508-1.2627-1.2627,0.12627-1.2627,0.37881-0.88388-0.25254-1.389-1.2627-1.6415-1.7678-4.0406-1.0102-1.2627-1.1364-0.50508-1.0102,0.63135-2.0203-0.50508-0.88388-1.0102-0.75761-1.1364-0.63135-1.894-0.37881-0.25254-0.12627,0.50508-2.7779-0.50508-1.6415-0.63134-1.2627-0.88388-0.88389-0.37881-0.50507-0.12627-1.0102-0.25254-1.5152,0.63135-0.88388,0.75761-0.88388,1.389-0.25254h1.6415l0.88388,1.2627,1.0102,0.88388,1.1364-0.50507,0.25253-1.1364,1.2627-0.25254,1.1364-0.63135,0.75761-1.1364,0.12627-1.5152,3.283-3.6618,1.2627-0.88388h1.7678l2.0203-0.37881,1.389-0.75762,0.88388-0.63134h1.1364l1.5152,0.88388h1.2627l0.88389,0.75762,0.50507,0.88388,1.389,0.63134h1.1364l1.389-0.3788,1.5152-0.50508,1.1364-0.37881,0.63135-0.25253,0.88388,0.12627,1.0102,0.88388,1.2627,1.6415,0.50507,1.2627z",
                            "name": "Вологодская область",
                            "ShortName": "Волгоградская область",
                            "id": [7]
                        },
                        "ar": {
                            "path": "M421.06,151.03l-3.56,1.06-2.16,0.91-3.56,0.19-1.59,0.87s-1.26-1.07-1.97-1.25c-0.72-0.18-0.91,1.1-0.91,1.1l-1.78,2.65-2.69,1.63-3.03,0.87-2.31,1.78s-2.15,0.37-3.22,0.72c-1.07,0.36-2.5,0.19-2.5,0.19l-1.59,0.72,1.06,1.78-2.16,1.25,0.38,0.72,1.25,1.44,1.78,1.59,1.78,1.78,0.91,1.63,1.4-0.72,0.91-1.97,2.16-0.72,1.25-0.53,1.93-0.19,0.91-1.59h1.97l1.25,0.87,1.59-1.25,1.1-1.25,2.65-0.15,0.72-0.57,3.41,0.72,1.78-1.06,0.34-1.44,2.69-0.34s1.07-0.01,2.5-1.44l0.72,1.06,2.84-0.68s1.98-0.19,2.69-0.19,3.03-0.38,3.03-0.38h2.31l2.35,1.25,1.78,0.91,1.25-0.72,0.72-0.87,4.28,1.06,1.97-1.44,3.22,0.19,4.09-0.72,1.25-1.59,1.97-2.88s-1.26-0.89-1.97-1.25-2.69-1.44-2.69-1.44l-3.22,0.57-4.43,1.59-4.32-0.91-2.5-0.15-3.18-0.72-1.63-0.91-1.59-1.78-1.44,0.72-1.97,1.06-2.5-0.15-3.22-0.91-2.5-0.72zm-35.53,14.47l-2.5,0.53-1.78,1.63-2.5-0.38s-1.44-1.06-1.44-0.34v1.78l0.72,1.59-2.12,1.25-2.88,1.1-1.06,1.25h-2.16l-0.72-1.1-1.59-0.87-2.69,2.12-0.15,3.03,1.93,2.69,1.44,2.16s1.26,2.14,0.91,3.03c-0.36,0.89-4.28,2.5-4.28,2.5l1.06,2.5,1.25,1.59v1.97l2.31,0.53,2.88,1.97,2.12,2.31,1.97,0.38s1.06-1.07,1.06-1.78c0-0.72-0.15-4.48-0.15-5.38,0-0.89,1.59-8.37,1.59-8.37l0.34-1.44,4.13-2.69s0.88-1.07,2.31-1.97c1.43-0.89,4.66-3.03,4.66-3.03l1.78-1.4s0.71-1.64,0-1.82c-0.72-0.17-1.62-0.53-2.16-1.25-0.53-0.71-3.03-2.65-3.03-2.65l-1.25-1.44zm-132.28,14.34l-0.63,0.63-2.28,0.25-0.87-0.13-1.78,0.91v1.38l-0.63,1.65-1.15,0.75-0.13,1.38,0.91,0.78,0.87,0.87-0.12,1.25-1.25,1.28-1.66,1.5-1.65,0.13-1.38-1-0.62-1.53-1.41-2-1.25-1.03-2.03,0.53h-1l-2.41-1.66-1,0.38-1.66,2.15-1.37,2-1.66,1.78-1.25,2.66,0.38,1,1,1.28,1.78,0.25,0.12,1-0.12,1-2.78,2.41-2.16,0.87-1.87,3.03-2.53,2.53-2.91,0.5-1.13,0.13-0.5,0.91-0.28,1.87-0.87,2.16-1.75,2.03-0.13,1.87,1.25,2.79,1.5,1.28,2.04,3.53,3.78,4.15,1.28,0.75,3.15,0.38,0.38,0.65,1.37,1.38,1.66,2.53,1.38,0.5,0.5,1.66,0.9,1.5,3.28,0.5,1.63,0.25,0.78,1.4,0.37,2.13,0.75,1.15,2.41,0.88,1.5,0.75,1.28-0.5,1.13-0.25,1.37,0.75,0.91,1.66-1.03,1.25-0.13,1.53,0.66,1,1.25,0.75,1,1.03,1.03,0.62,0.75-0.37,1.25-0.25,1.41,0.5,1,1.37,0.5,0.91,0.24,2,0.26,1.03h0.65l0.88-0.16,0.87-0.5,0.63-0.37h1.03l0.75,0.75,0.62,0.91,0.88,0.25,1.4,0.25,1.88-0.5,1.41-0.5,1.37-1.79v-0.87l-0.37-0.66-0.26-0.5,0.26-1,0.5-0.5,2.78-1.28,2.4-1,1.66-1.12,1.87-0.78,0.5-0.75,0.13-1.38-0.75-1.53-1.13-0.87-2.15-0.13h-1.5l-1.53,0.5-1,0.75h-1.28l-0.63-0.12-1-1.13-1.53-0.37-0.75-0.38,0.25-1.53v-1.13l1.66-0.5,0.74-0.78,0.76-0.87,0.62-1.63,0.53-0.37,1.5-0.53,1.78,0.25,1-0.5-0.12-1.38-0.5-0.87-0.5-1.66,0.25-0.88,0.87-0.62,1-0.53,1.41-0.63,1.37-0.75,0.38-0.75v-0.5l-0.88-1.9-0.75-1.41-0.9-1.62-1-0.75-0.63-1.28,0.38-1.88,0.62-0.5h1.28l0.88,0.38,1,0.87,1.41,2.16,2.65,2.37,1,0.91s1.65,0.49,2.28,0.75c0.63,0.25,1.38,1,1.38,1l0.5,0.62,0.37,1.03,0.53,1,1,0.63,1.38,0.37h1.41l1.12,0.53,0.88,0.88,2.03,0.5h1.37l0.28,0.88,1,0.53,1,0.25,0.88-0.54,0.78-0.74-0.13-1.26-1.03-1.03,0.38-0.87,0.78-1,0.37-1.53-0.25-1-1.15-0.75-0.13-1.28,0.91-0.88,3.15-3.28,1.88-1.12,1.91-1.79,0.25-1.25-0.63-0.5-1.65-0.9-1.63-1-2.16-0.25-1.25,0.62h-1.4l-1.5-1.12-1.03-1.78-0.75-1.75-1.5-3.16-1.41-2.28-0.75-1.41-0.88-2.25-0.12-1.15-2.41,0.25-0.75-0.63-1.53-1.12s0.25-0.5,0.88-0.5,1.02-0.41,1.53-0.66c0.5-0.25,0.25-0.87,0.25-0.87s-0.37-1-0.88-1.76c-0.5-0.75-0.77-0.77-1.28-1.15-0.5-0.38-0.75-1.75-0.75-1.75l-1.25-0.41-2.03-0.5-1.66,0.13-1.5,0.53-1.9,0.12-0.88-0.65-1.62-1-2.03-0.13h-2.78-2.53l-1.63,0.75-0.91,0.75-0.37,1.66-1.13,1.37-1.12,2.04-1.28,0.87h-2.41c-0.63,0-1.75-1-1.75-1l-1.03-1c-0.51-0.51,0-2.03,0-2.03s0.13-1.53,0-2.16-1.5-1-1.5-1l-2.03-0.87s1.65-0.78,2.16-1.16c0.5-0.38,0.37-1,0.37-1v-2.28c0-0.63-0.25-2-0.25-2l-0.75-1.91zm110.16,1l-0.19,1.1,0.53,1.78,1.44,0.72,0.53-0.72v-1.63l-0.38-1.25h-1.93zm-28.22,6.19l-2.35,0.78-1.4,2.07-2.88,1.43-0.25,1.07,1.78,1.43,2.13,0.97,3.22-0.44,3.5-0.9,0.25-1.6-0.78-1.96-1.1-1.88-2.12-0.97z",
                            "name": "Архангельская область",
                            "ShortName": "Архангельская область",
                            "id": [2]
                        },
                        "tu": {
                            "path": "m329.02,389.7,2.0536,0.80357,2.1428,1.1607,1.6072,1.3393,1.6071,1.5179,1.7857,0.71428,2.3214,0.17858,0.89286-1.0714,1.6071-1.875,0.53572-2.3214,0.625-2.1429,2.2321-1.7857,1.875-0.44643,1.25-2.5,1.6964-1.0714,2.9464,0.26786,1.6071-1.6072s0.625-2.3214,0.53571-2.6786c-0.0893-0.35714-0.80357-2.5893-0.80357-2.5893l-0.89285-1.875-0.625-3.3036-0.71429-2.2322v-1.7857l1.5179-1.9643,2.2321-2.5,1.4286-1.4286,3.125-0.26786,0.35714,1.4286-0.89285,1.6071-1.6964,1.6964-0.17857,1.25,2.5,0.35714,4.0178,0.35714,1.9643,1.6072,3.0357,1.7857,1.5179-1.25,2.9464-0.17857,2.1429,1.4286,3.3928,1.0714s2.5-0.98214,2.9464-1.1607c0.44643-0.17857,3.5714-0.44642,3.5714-0.44642l0.89286-0.98215-0.53572-1.0714-1.6964-1.25-2.9464-2.2321-1.0714-1.4286s-1.6964-0.44643-2.3214-0.44643-2.6786-0.80357-2.6786-0.80357l-0.17857-2.6786-0.26786-2.4107-1.3393-1.3393-0.44642-2.2321-0.53572-3.5714-0.35714-0.89286-2.4107-2.7679-1.1607-0.71428s-2.6786-0.26786-2.9464-0.26786h-5.0893l-0.98215-0.26786s-0.625-1.5178-0.625-1.875c0-0.35714-0.98214-1.5178-0.98214-1.5178l-1.875-0.35715-1.25,1.25-2.4107,1.875-2.1429,0.89286h-3.0357l-4.6428,0.0893-2.9464,0.26785s-1.4286,0.53572-1.7857,0.625c-0.35714,0.0893-4.375,0.0893-4.375,0.0893l-3.0357-0.0893-1.4286,0.35715-0.89286,1.5178-0.53571,2.3214-0.89286,1.3393-2.3214,0.71428-1.6071,0.53572-1.5179,0.35714-1.7857-0.17857-1.3393-0.625-1.4286,0.17857c-0.35714,0.17857-1.6964,1.0714-1.6964,1.0714l-1.1607,2.1429-0.35715,2.4107-1.6071,2.3214-2.1429,2.5893-0.98214,1.5179,0.26786,1.25,0.71428,1.3393,1.5179,1.25,1.25,1.6071,1.6964,1.875,1.0714,1.6964s3.0357,0.98214,3.0357,1.5179c0,0.53571,1.6964,2.9464,1.6964,2.9464l0.625,1.875,1.6071,1.4286,1.875,0.71428,1.0714,0.80357,1.4286,2.3214,1.0714,1.4286v1.6072z",
                            "name": "Тюменская область",
                            "ShortName": "Тюменская область",
                            "id": [36]
                        },
                        "ne": {
                            "path": "m290.27,198.54,1.6071-0.89286,1.4286-1.1607,2.0536-1.0714,1.1607-1.25,0.625-3.3929,1.1607-1.6071s1.4286-0.80358,2.4107-1.0714c0.98215-0.26786,2.3214-0.26786,2.6786-0.26786,0.35714,0,1.5178-0.98214,2.0536-1.5179,0.53571-0.53571,3.0357-2.5,3.0357-2.5l0.71429-1.0714v-2.2321l1.25-1.9643s0.89285,0.17857,0.98214,0.625c0.0893,0.44642,0.26786,1.5178,0.625,1.6964,0.35714,0.17858,1.875,1.4286,1.875,1.4286l1.6964,1.1607,0.98214,0.89286-0.0893,1.3393-0.625,1.4286-0.44643,1.7857v1.6964l-0.26786,1.0714-0.44643,0.80357-0.26786,1.25-1.25,0.71428-1.3393-0.625-1.25-0.98214-0.625-0.80357-2.3214-0.53572h-3.0357c-0.44643,0-2.1429,1.1607-2.1429,1.1607l-0.80357,1.4286,0.17857,1.0714s0.53571,0.89286,0.625,1.25c0.0893,0.35714-0.71429,1.1607-0.71429,1.1607l-0.89285,1.6072s-0.26786,1.1607-0.0893,1.4286c0.17857,0.26785,0.625,0.80357,1.1607,1.25,0.53572,0.44643,1.875,1.5178,2.1429,1.6964,0.26786,0.17857,1.875,0.89285,1.875,0.89285s2.3214,0.17857,2.8571,0.17857c0.53572,0,1.9643-0.26785,1.9643-0.26785s1.5179-0.98215,1.875-1.1607c0.35714-0.17857,1.9643-1.1607,1.9643-1.1607s1.0714-0.44643,1.4286-0.35714c0.35714,0.0893,1.3393,0.98214,1.3393,0.98214l2.3214,0.17857s0.35714-0.44643,0.71429-0.80357c0.35714-0.35714,0.53571-0.71429,0.98214-0.35714,0.44643,0.35714,1.875,1.3393,1.875,1.3393l1.7857,0.44643h5.0893l2.5893,0.0893s0.80357,0.80357,1.25,0.89285c0.44642,0.0893,3.3928,0.53572,3.3928,0.53572l1.5179,1.4286,0.71429,1.9643,1.1607,0.17858,0.71429-1.5179,0.89285-1.0714,1.875-0.17857,0.89286,0.53571,2.1429,0.17857,2.5893,0.44643-0.44643,0.80357-0.98214,0.80358-1.6964,0.625-0.80357,0.98214-0.71428,0.98214-1.6964,0.71429-0.26786,1.0714,1.3393,0.98214,1.25,0.53571,0.625,2.0536,0.71428,0.35715,1.6964-0.80357s1.3393-0.89286,1.6071-0.89286c0.26786,0,3.3036,0.53571,3.3036,0.53571l2.6786,1.3393,1.5178,1.3393,1.4286,0.89286,4.4643,0.17857,0.71429,0.71429,1.5178-0.26786,2.5893-0.35714,1.7857-1.3393,0.625-1.7857s0.53572,0.625,0.53572,1.1607c0,0.53572-1.6964,2.7679-1.6964,2.7679l-0.71429,1.7857v1.0714l-1.1607,1.1607-0.89286,0.625-0.44643,0.98214,0.44643,0.80357h1.4286l0.80357-1.6071,0.17858-0.53572,1.5178-0.0893,1.5179,1.25,2.3214,0.35714,1.1607-0.89286,1.3393-1.1607,0.53571-0.89286-0.71428-1.0714-0.35715-1.4286,1.5179-1.1607,0.71429-1.875-0.53572-1.6964-1.25-0.80357-0.71428-3.3929-0.26786-3.125s-0.26786-0.89286,0.0893-1.25c0.35714-0.35714,2.2321-1.6964,2.2321-1.6964l1.3393,0.17857,1.1607,1.4286,1.0714,1.9643,0.35714,2.1429-0.89286,3.3036,0.89286,1.0714,2.8571,2.4107,2.7679,2.8572,3.3929,2.5893,2.1428,3.3036,1.6964,3.3929,0.80357,1.875,0.17858,1.6071-1.0714,1.1607-0.98215,2.0536-0.98214,1.5179h-2.5c-0.44643,0-3.6607-0.17858-3.6607-0.17858l-2.1429,0.98215-2.7679,0.71428h-3.0357l-1.7857-0.17857-2.4107,1.875-3.0357,2.4107-1.6072,0.53571-2.7678-0.0893-2.0536-0.53571-4.2857-2.4107-23.036-13.929-7.6786-6.875-1.25-1.1607v-1.3393l-0.98214-0.625-2.4107,0.625-5.0893-0.44642-5.625-0.98215-5.1786-0.80357-3.125-0.26786-4.1071-2.3214-2.0536-0.44643-1.7857,0.625-1.7857-0.26786-1.5179-1.7857-4.2857-8.4822-0.98215-2.4107z",
                            "name": "Ненецкий автономный округ",
                            "ShortName": "Ненецкий АО"
                        },
                        "om": {
                            "path": "m388.39,368.89,0.71428,2.5-1.25,1.6071-1.25,1.9643,0.53572,1.6071,0.71428,1.9643-1.25,1.9643s-1.0714,1.25-1.0714,2.1429c0,0.89286,0.17857,3.0357,0.17857,3.0357l1.7857,1.6072,0.35714,2.3214-0.53571,3.3929-1.9643,0.89286-1.25,1.6071,0.71429,2.3214-0.35715,1.9643-3.9286,0.17857s-1.4286-0.89286-2.3214-1.0714c-0.89285-0.17857-3.3928,2.8571-3.3928,2.8571l-2.5,2.1429-0.89286,4.2857,0.53571,0.89286,1.9643,2.1429,0.35714,2.6786-1.6071,2.6786-1.0714,1.7857-0.17857,3.0357-2.5,2.1429s-2.3214,1.0714-3.0357,1.0714h-4.8214l-1.6072-0.71428c-2.1428,1.4286-3.75,0-3.75,0l-1.6071-0.71429-1.9643-0.35714h-1.0714l0.35714-1.7857,1.7857-1.0714,0.71429-1.4286-2.3214-1.25-2.1429-2.3214-1.9643,0.89285-0.89286-0.71428v-3.75l-1.4286-0.89286-2.8571,0.35714-2.8572-0.89285-0.89285-0.53572-0.17857-2.1428,2.1428-2.6786,0.71429-2.3214,0.35714-2.6786v-4.1071l0.71429-2.1429,1.4286-3.9286,1.6071-2.5,2.3214-0.53571,1.0714-1.25,1.0714-1.7857,1.6071-0.89285h2.6786l1.6071-1.4286,0.89286-3.9286-1.4286-3.2143-0.71429-3.0357-1.25-3.3928,0.35715-1.6072,4.4643-4.6428,1.0714-0.89286h2.6786l0.17857,1.6071-1.25,1.6072-1.7857,1.25-0.17857,1.4286,1.4286,0.35714,3.2143,0.35714,2.3214,0.17857,2.1429,1.4286,1.9643,1.4286,1.0714,0.35714,1.0714-0.71429,1.9643-0.35714,2.3214,0.35714,3.5714,1.6072h2.5l2.1428-1.0714h2.1429z",
                            "name": "Омская область",
                            "ShortName": "Омская область",
                            "id": [19]
                        },
                        "ht": {
                            "path": "m359.64,260.32,0,3.75-0.53572,3.2143-1.6071,2.3214-2.3214,2.3214-0.89286,1.25,1.9643,1.9643,1.7857,2.3214,5,1.9643,4.8214,0.17857,3.5714,1.4286,2.3214,2.6786,0,1.4286-2.1429,1.7857,1.4286,1.4286,2.3214,2.8572,1.9643,1.0714,2.1428-1.0714,1.7857-0.89286s1.6071,0.71429,1.9643,0c0.35715-0.71429,0.89286-2.1429,0.89286-2.1429l1.6071,2.1429,1.4286,2.8571,1.9643,1.6072s0.35714,2.1428,0.35714,2.8571v4.6429l1.9643,3.3928s0.35714,0.17857,0.71429,0.89286c0.35714,0.71429,0,2.1429,0,2.1429l1.0714,1.25,2.5,0.53571,3.75,0.71429,1.4286,0.89285s2.8571,2.1429,3.5714,2.6786c0.71429,0.53571,1.25,1.6071,2.1429,1.9643,0.89286,0.35714,3.5714,0.53572,3.5714,0.53572l2.8571,0.35714,0.89286,1.0714s0.35714,1.6071,0.71428,2.6786c0.35715,1.0714,1.4286,1.7857,1.4286,1.7857l3.0357,0.17857,1.7857,0.53572,0.35715,1.9643,0.35714,1.4286,1.0714,2.5c1.9643,0.17857,2.5,0.17857,3.5714,0.17857s3.3928,1.0714,3.3928,1.0714l1.9643,0.71428,2.8571,0.35714,2.8572-1.0714,3.2143-1.9643,3.0357,0.53571,1.9643,2.6786s0.35714,1.7857,1.0714,2.1428c0.71429,0.35715,2.8571,0.53572,2.8571,0.53572l2.3214,1.6071,0.71429,2.3214,1.9643,0.71428,2.6786-0.89285,1.9643,1.6071,1.0714,3.0357v2.3214l-0.35714,1.6072-0.53572,1.9643,3.0357,1.9643,2.5,1.7857,0.35714,2.3214v1.0714l-3.75,1.7857-2.6786,0.53572-3.2143,0.17857-3,0.15-1.61-1.07-1.7857-0.71428-2.3214,0.35714-2.3214,1.6071-2.6786,1.0714-2.1429-1.9643s-2.8571-0.35714-3.5714-0.35714c-0.71429,0-2.3214-1.7857-2.3214-1.7857l-0.89286-1.25-3.9286,0.17857h-3.5714l-1.6071-2.5s-1.25-0.89286-2.1429-0.89286c-0.89286,0-4.4643-1.25-4.4643-1.25l-2.5-2.3214h-1.25c-0.71428,0-2.3214,1.25-2.3214,1.25l-2.5,2.1429-1.7857,2.6786-2.8571,2.5-1.6071,3.3929-4.4643,1.6071-3.5714,0.89286-0.35714,2.1429-0.71429,2.1428-2.6786,1.25h-2.8571l-5.8929-5.5357-3.9286-0.89286-1.0714-1.4286-0.53571-4.1071-1.0714-1.25-1.0714-5.3572-0.53571-1.7857-3.5714-3.2143h-5.5357l-3.0357-0.35714-1.9643-2.8571-1.6071-0.53572-4.4643,3.0357-3.3929,0.71428h-5.1786l-5,0.71429-4.2857,0.53571h-3.5714l-1.4286-0.17857-0.53571-2.8571-0.35714-3.2143,0.89285-3.2143-0.89285-3.2143-2.3214-2.1428-1.0714-0.89286-1.0714-1.0714,1.25-2.6786,1.4286-2.3214-0.17857-2.1429-0.71429-3.2143,0.71429-5.5357,1.4286-1.7857,1.4286-2.1429-0.71428-2.3214-1.0714-3.5714-1.9643-2.6786-2.3214-3.3928-3.3928-2.1429-1.7857-1.9643-1.0714-2.6786,3.3929-2.1429,1.6071-2.6786,2.3214-4.8214,2.1429-2.6786,2.5-1.9643,3.5714-3.3929,1.6071-1.7857,1.7857-3.3929-0.17858-1.7857,0.89286-1.0714,2.1429-1.0714,1.4286-1.9643,1.6071-1.0714,1.25,0.17857,0.89286,2.3214,0.35714,1.0714,1.4286,0.35714,2.5-0.71428,3.0357-1.6071,1.4286-1.25,1.25-1.0714,2.5-0.53572z",
                            "name": "Ханты-Мансийский автономный округ",
                            "ShortName": "Ханты-Мансийский АО",
                            "id": [40]
                        },
                        "ya": {
                            "path": "m396.25,234.25,1.4286,2.6786,1.6071,1.7857,1.6072,2.6786,1.0714,3.0357,0.89286,2.8572,3.0357,0.17857,1.7857-1.6072,1.4286-1.25-0.53571-3.2143s-0.89286-1.4286-0.53572-2.3214c0.35715-0.89286,1.7857-2.5,1.7857-2.5v-2.3214l-2.1429-1.6071-1.25-2.5s0.71429-1.6071,1.4286-1.9643c0.71429-0.35714,3.75-2.3214,3.75-2.3214s1.6071-3.75,1.9643-4.4643c0.35714-0.71429,0.35714-4.8214,0.35714-4.8214l0.89286-1.4286,7.5-2.1429,4.8214-3.5714,5.7143-6.0714,3.2143-2.1429,2.1428-0.71429,1.7857,2.3214,3.3928,0.35714,1.7857,1.25,1.0714,2.6786,0.17857,1.7857-0.89286,3.75-2.1429,2.6786-2.3214,2.8571-3.0357,1.6072-1.25,1.0714-0.35714,1.9643,1.0714,2.1429,0.17857,2.8571-0.89286,2.8571-2.1429,2.6786-1.7857,3.2143-2.6786,4.4643-1.25,3.5714-0.89286,2.1429-0.17857,2.5,0.35714,2.6786,0.71429,2.3214-0.71429,1.4286-3.0357,2.1429-1.0714,3.2143-0.89286,3.2143h-3.2143l-2.3214,1.25-2.1429,3.3929-3.5714,0.53571-2.3214,1.25-1.4286,1.4286h-3.5714l-1.4286-1.0714-1.0714-2.6786-0.71429,0.53572v1.6071l-1.9643-1.4286-0.71428-1.9643-1.0714,0.71429-0.17857,1.9643,1.7857,2.1428,2.5,2.1429,2.5,1.25,3.2143,1.0714,2.1429,1.25,2.1428-0.89286,3.5714-1.7857,3.0357-0.71429,3.75-1.0714,2.3214-3.0357,3.2143-2.6786,3.3929-1.6072,2.1428-1.7857-0.17857-2.1429-0.89286-2.3214-0.17857-1.7857,2.1429-2.1429,4.2857-0.89285h3.3929l1.4286,1.4286,1.25,3.0357v2.8571,3.0357l-1.6071,1.4286-1.25,2.5,0.17857,3.5714,1.7857,1.25,3.2143,0.71428,2.1429,2.8572,1.9643,3.2143,0.53572-0.71428-0.53572-4.1072-2.5-3.2143-3.75-1.0714v-2.8571l2.3214-3.0357s1.7857-0.35714,1.9643-1.0714c0.17857-0.71428,0.17857-3.5714,0.17857-3.5714l-0.89286-3.9286-2.6786-2.6786-2.6786-3.2143-0.89286-1.4286h-2.1428s-0.53572,1.25-1.4286,1.25c-0.89285,0-2.6786-1.25-2.6786-1.25l-1.6071-1.0714-0.53571-2.5,1.4286-3.75,2.3214-3.2143,2.1428-2.6786,3.0357-1.25,0.17857-4.4643-0.17857-3.0357v-3.0357l0.17857-2.3214,1.7857-2.3214,1.4286-1.4286,2.1429-0.35715,3.2143-0.53571,2.3214-2.5,1.7857-1.0714,1.25,2.1429-1.9643,2.3214-0.89285,1.4286-1.0714,4.4643-1.25,2.5,1.25,1.7857,2.6786,2.1429h2.8571l1.4286,2.1428,2.3214,2.5,1.7857,0.35715-1.4286-2.1429v-2.5s-1.25-1.25-1.9643-1.6071c-0.71429-0.35715-3.5714-2.8572-3.5714-2.8572l-1.25-3.5714-0.17857-1.4286s1.9643-0.71428,2.6786-0.71428c0.71429,0,3.2143,0.89285,3.2143,0.89285l0.89285,1.7857,1.6072,0.17857,1.25-0.71429-0.35715-1.9643,0.17858-1.9643,1.4286-0.35714,1.6071,0.71429,1.7857,1.4286,1.25,1.0714,0.89286,1.7857-0.35714,1.7857-2.3214,2.5-3.0357,1.25,1.0714,1.4286,2.6786,2.1428,0.35714,2.8572,0.17857,3.3928-0.71429,2.6786-2.5,1.4286-2.6786,1.4286-3.5714,1.7857-2.1428,2.1429,0.35714,2.6786,1.4286,2.5,1.25,2.5,1.6071,1.0714h3.3929,2.5l1.7857,1.6071,0.53571,3.0357,0.17857,3.3928v2.8572l-1.9643,3.2143-1.7857,2.5h-2.6786l-0.71429,0.53572,0.53572,1.9643,0.71428,1.7857-0.53571,2.5-0.89286,1.25,2.3214,3.3928,0.53572,1.7857,0.35714,1.7857-1.25,1.7857-1.0714,1.25,0.89286,2.1428-0.17857,2.5-1.6072,1.6072,1.6072,1.7857,2.1428,1.9643,1.6072,1.4286-0.17858,3.3928-1.4286,2.3214-0.17857,2.6786,2.3214,2.1429,4.6429,0.89286,0.89285,1.4286-1.4286,2.1429-0.53571,3.3928-0.89286,2.3214-2.6786,1.4286s-0.89286,0.53572-1.6071,1.0714c-0.71429,0.53572-1.7857,2.8572-1.7857,2.8572l1.9643,1.7857,0.17857,2.3214-1.4286,2.1429-1.25,2.5-2.6786,2.3214-2.8572,2.8572-0.89285-1.7857-1.6072-2.1428-1.7857-1.0714-1.9643,0.71428-1.9643-0.71428-0.71429-1.6072-1.25-1.25-2.5-0.89285-2.1428-0.89286-0.71429-1.6071-0.89286-1.7857-1.4286-1.4286-2.8571-0.17857-2.5,1.4286-2.5,1.0714-2.6786,0.17857-4.1072-1.6071-3.5714-0.35714-2.1429-0.17858-0.89286-1.9643-1.0714-2.3214v-1.4286l-3.3928-0.71429-2.3214-0.53571-0.89286-2.5-0.71429-2.3214s1.4286-0.17857-1.0714-0.35714-5.5357-1.0714-5.5357-1.0714l-1.4286-0.53572-3.2143-2.5-2.5-1.6071-2.8572-1.0714-3.2143-1.25-1.25-0.89285-0.17857-2.1429-2.8572-3.9286,0.17857-6.7857-1.25-1.7857-2.3214-2.8571-1.0714-2.1429-0.53572-0.53572-1.0714,1.25-0.53571,0.71429h-1.4286l-2.6786,0.89286-1.25,0.35714-1.6072-0.35714-2.1428-2.3214-1.7857-1.6071,0.53572-0.89286,1.4286-1.6071-0.35714-1.7857-2.5-2.3214-3.0357-1.4286-4.2857,0.35714-3.0357-1.25-2.6786-0.89285-3.3929-4.2857,2.3214-2.5,2.5-3.75,0.17857-5.3571,0.35715-1.4286,3.75-1.0714,2.6786-2.5,1.4286-1.4286h3.75,3.3929l3.9286,0.53571,1.7857-1.25,3.5714-1.6071,3.3929-0.53571,2.5-1.25,2.3214-1.25,0.35714-2.8572-2.1429-2.3214-0.71428-1.25,0.53571-1.6071,2.3214-1.4286,0.35714-1.25,1.92-2.87z",
                            "name": "Ямало-Ненецкий автономный округ",
                            "ShortName": "Ямало-Ненецкий АО"
                        },
                        "kr": {
                            "path": "M531.66,122.41c-0.45,0.04-1,0.37-1,0.37-0.9,0.72-1.25,0.77-0.94,1.13,0.31,0.35,0.19,0.55,0.9,0.78,0.72,0.22,0.91,0.49,1.44,0,0.54-0.49,0.77-1.24,0.41-1.69s-0.37-0.64-0.81-0.59zm11.56,0.65c-0.22,0.02-0.44,0.11-0.6,0.38-0.31,0.53-0.49,1.57-0.62,1.84s-0.2,0.74-0.78,0.88c-0.58,0.13-1.39,0.54-1.75,0.09s-1.03-1.51-1.25-1.69-1.04-0.74-1.13-0.03c-0.09,0.72,0.19,1.51,0.19,1.91s-0.18,0.99-0.4,1.12c-0.23,0.14-1.06,0.25-1.29,0.56-0.22,0.32-0.62,0.49-0.62,1.16s-0.27,1.67-0.31,1.94c-0.05,0.27-0.32,0.26-0.63,0.75s-1.09,1.87-1.09,1.87,0.89,0.62,1.15,0.85c0.27,0.22,0.42,0.77,0.38,1-0.05,0.22-0.13,1.05-0.53,1.19-0.4,0.13-1.43,0-1.78-0.13-0.36-0.13-1.01-0.48-1.5-0.44-0.49,0.05-1.01,0.23-1.19,0.63s-0.71,0.38-0.13,1.18c0.58,0.81,0.87,1.53,1,1.76,0.14,0.22,0.29,1.51,0.07,1.87-0.23,0.36-1,1.13-1.22,1.53-0.23,0.4-0.44,0.71-0.22,1.16,0.22,0.44,0.66,0.8,1.15,0.94,0.5,0.13,3.66,0.71,3.66,0.71s0.28-0.36,0.81-0.71c0.54-0.36,1.36-0.77,1.85-0.41s0.52,0.8,0.65,1.25c0.14,0.45,0.41,2.02,0.5,2.37,0.09,0.36,0.49,0.58,0.94,1.16s1.59,1.37,2.22,1.59c0.63,0.23,1.05,0.55,1.72,0.6,0.67,0.04,2.85,0.82,2.94,1.09s0.31,1,0.31,1,0.54,0.52,0.81,0.56c0.27,0.05,2.22,0.19,2.22,0.19,1.38-0.76,2.23-0.8,2.5-0.94,0.27-0.13,0.84-0.03,1.37-1.06,0.54-1.03,0.76-1.35,0.63-2.06-0.13-0.72-0.34-0.93-0.87-1.6-0.54-0.66-1.5-1.24-1.1-1.56,0.4-0.31,1.56-0.8,1.88-1.15,0.31-0.36,0.54-1.32,0.4-2.35-0.13-1.02-0.15-2.5-0.47-2.9-0.31-0.41-0.73-0.92-1.4-1.19s-1.23-0.67-1.81-0.53c-0.59,0.13-1.92,0.25-2.19,0.03s-0.62-0.83-0.85-1.5c-0.22-0.67-0.5-1.13-0.5-1.53s1.16-3.63,1.16-3.63,0.71-0.29,0.84-0.56c0.14-0.27,0.36-0.76,0.22-1.66-0.13-0.89-0.39-1.55-1.28-2.09s-2.09-1.72-2.09-1.72v-0.97c0-0.35-0.15-1.73-0.28-2-0.14-0.27-0.48-0.72-0.97-0.72-0.25,0-0.5-0.05-0.72-0.03zm17.72,22.91c-0.13,0.02-0.25,0.07-0.35,0.19-0.4,0.44-0.72,1.12-0.9,1.34s-0.51,0.09-0.91,0-0.89-0.43-1.16-0.03c-0.26,0.4-0.67,0.74-0.71,1.19-0.05,0.44,0.09,1.75,0.09,2.46,0,0.72,0.09,1.8,0,2.6s-0.2,1.3-0.78,1.66c-0.58,0.35-0.91,0.4-1.31,0.93-0.41,0.54-1.13,1.25-1.13,1.88,0,0.62,0.06,1.45-0.66,2.03-0.71,0.58-1.14,0.56-0.96,1.4,0.17,0.85,0.22,0.93,0.84,1.38s2.79,0.63,3.28,0.5,1.26-0.77,1.66-1.22,1.61-0.99,2.28-1.12c0.67-0.14,1.17-0.08,2.16-0.13,0.98-0.04,1.54-0.39,2.03-0.65,0.49-0.27,0.54-0.54,1.43-0.54,0.9,0,1.74,0,2.1-0.31,0.35-0.31,1.35-1.19,1.62-1.5s0.88-1.05,0.97-1.5,0.18-1.3,0-1.75,0.15-1.15-1.19-1.28-1.57,0.07-1.84-0.38c-0.27-0.44-1.03-0.88-1.03-1.37s0.08-1.02-0.19-1.37c-0.27-0.36-0.79-0.81-1.28-0.72s-1.31,0.58-1.53,0.62c-0.22,0.05-0.71-0.09-0.85-0.4-0.13-0.32-0.21-1.11-0.21-1.91s-0.25-1.63-0.25-1.63c-0.34-0.13-0.83-0.43-1.22-0.37zm5.22,20.03c-0.62,0.05-1.16,0.75-1.16,0.75s-1.62,1.95-2.16,2.84c-0.53,0.9-0.86,1.08-1.93,1.25-1.08,0.18-1.82,1.63-1.82,1.63s-0.51,1.23-0.68,2.12c-0.18,0.9-1.25,3.07-1.25,3.07v1.93l0.87,1.63s1.6,1.05,1.78,2.12c0.18,1.08-2.12-0.68-2.12-0.68s-2.14-0.73-3.03-0.91c-0.9-0.18-1.64,0.01-3.07,0.19-1.42,0.18-1.25,0.34-1.25,0.34l0.72,1.63s1.61,1.4,1.25,2.65c-0.35,1.25-1.4-0.53-1.4-0.53l-1.97-0.87s-1.98,0.16-2.88,0.87c-0.89,0.72-1.25,0.91-1.97,0.91-0.71,0-1.59-0.71-2.12-1.78-0.54-1.08-0.91-0.91-1.63-1.44-0.71-0.54-3.2,0-4.09,0s-2.32,1.79-3.75,1.97-1.78,0.53-1.78,0.53l0.34,2.12-1.97,1.1-2.12,0.53-2.16,0.53c-0.71,0.18-2.12-0.19-2.12-0.19l-1.97-0.34-1.44,0.87-0.53,0.57-2.84,0.15-2.16,0.91s-2.49,2.13-4.09,2.31c-1.61,0.18-0.19,0.53-0.19,0.53s1.06,0.91,1.06,1.63c0,0.71-0.7,0.87-0.87,1.4-0.18,0.54-1.45-0.33-2.35-0.68-0.89-0.36-1.25,0-1.25,0s0.2,1.04,0.38,1.93c0.18,0.9,1.06,1.28,1.06,2.35s-0.19,2.12-0.19,2.12,0.53,2.69,0.53,3.41v2.69c0,0.89-0.87,1.59-0.87,1.59s-1.25,0.72-3.03,0.72c-1.79,0-0.91-0.72-0.91-0.72l0.72-0.91-0.53-1.4-1.97-0.38-2.31,1.25-1.78-0.53h-3.22-3.94c-1.43,0-1.95-1.07-2.84-1.25-0.9-0.18-2.88-0.34-2.88-0.34s-2.14-0.02-3.03,0.34-1.97,1.06-1.97,1.06v3.07,3.03s-1.6,0.69-1.78,1.4c-0.18,0.72,0.01,2.68,0.19,3.75,0.18,1.08,1.05,0.72,2.12,1.25,1.07,0.54,2.16,1.25,2.16,1.25l0.53,0.57,0.34,1.78s0.57,1.94,0.57,2.65c0,0.72,1.25,1.97,1.25,1.97s0.68,1.63,0.68,2.35c0,0.71-0.51,1.22-0.87,1.93-0.36,0.72-0.73,1.61-0.91,2.5-0.18,0.9,0,2.16,0,2.16l0.38,2.84s-0.2,2.88-0.38,3.6c-0.18,0.71-0.89,1.42-1.78,1.78s-1.25,2.12-1.25,2.12,0.01,2.7,0.19,3.6c0.18,0.89,0.88,1.42,1.59,1.78,0.72,0.36,1.25,1.78,1.25,1.78l-0.87,1.78-1.78-0.34-1.44-1.78-0.91-1.82v-2.5s-0.54-1.76-1.97-2.65c-1.42-0.9,0.19-1.63,0.19-1.63s1.08-1.25,1.44-1.97c0.36-0.71,1.06-1.78,1.06-1.78s1.8-1.6,2.16-2.5c0.35-0.89-0.38-1.4-0.38-1.4l-1.06,0.68-1.78,1.82-1.78-0.91s0.69-1.25,0.87-1.78c0.18-0.54,0.54-1.79,0.72-2.5,0.18-0.72,0.35-1.6,1.06-2.31,0.72-0.72,2.35-0.19,2.35-0.19l1.25-1.25v-1.63l-1.1-1.59s-1.4-0.17-3.9-0.34c-2.5-0.18-0.72-1.25-0.72-1.25l-0.72-1.82s-0.72-1.76-1.44-2.12c-0.71-0.36-1.94-3.04-2.65-3.75-0.72-0.72-1.1-1.44-1.82-2.16-0.71-0.71-2.11-1.78-3.18-2.5-1.08-0.71-1.97-1.4-1.97-1.4l-1.63,0.34s-1.05,1.07-0.15,2.5c0.89,1.43,1.06,1.44,1.06,1.44l1.25-0.28,0.97,0.18,1.22,0.5,1.15,1.07,1.06,0.71,0.91,1.07,0.53,0.9,0.1,0.94-0.6,1.63-1.68,1.84-1.29,0.81-1.93,0.88,0.81,1.15s2.04,1.71,2.22,1.85c0.18,0.13,0.69,0.9,0.69,0.9l0.31,2.85,0.09,2.59s-0.33,2.1-0.37,2.28c-0.05,0.18-0.63,0.88-0.63,0.88l-7.09,3.97-1.44,0.9-1.25,0.94-0.66,0.81s0.3,2.37,0.35,2.6c0.04,0.22,0.64,1.18,0.69,1.4,0.04,0.23,1.28,2.69,1.28,2.69s1.15,1.2,1.46,1.69c0.32,0.49,2.16,0.31,2.16,0.31h3.44c0.4,0,1.34,0.5,1.34,0.5s1.3,0.98,1.35,1.16c0.04,0.17,0.37,1.31,0.37,1.31l0.38,3.34s0.09,3.42,0.09,3.69-0.5,1.56-0.5,1.56l-0.34,1.22c-0.04-0.01-0.07-0.03-0.1-0.06l-1.15,2.06-1.82,1.69-1.68,0.28-1.6,0.28,0.16,1.41s1,1.98,1,2.34-0.01,1.68-0.19,2.13c-0.18,0.44-0.81,1.68-0.81,1.68l0.47,1.19,1.15,1.69,0.88,2.41,0.47,1.68-1.16,1.97-1,1.63,0.72,1.93s0.08,1.53-0.09,1.97c-0.18,0.45-1.07,1.16-1.07,1.16l-0.43,1.19s4.1,3.63,5,4.53c0.89,0.89,0.15,1.52,0.15,2.06s-0.72,2.5-0.72,2.5l-1.25,2.22,0.1,1.87s1.54,1.46,1.72,1.82c0.17,0.35,1.68,0.78,2.22,0.87,0.53,0.09,2.78,0.38,2.78,0.38l1.25,1.31-0.19,0.81-1.16,1.63-0.72,3.28s-0.8,2.07-1.15,2.34c-0.36,0.27-1.44,1.16-1.44,1.16l-2.22,1.15-1.72,2.41,0.38,0.97,1.34,1,0.25,1.78-0.81,1.78-1.25,2.78-1.5,1.41-2.31,2.34-1.72,1.6-1.5,2.25s-0.9,2.92-0.81,4c0.08,1.07,0.96,0.72,0.96,0.72s1.62,1.07,2.16,1.34,1.51,0.99,1.78,1.34c0.27,0.36,1,1.24,1,1.69v1.53l-0.81,0.88-1.25,0.81-3.41,1.25-1.69,0.34-2.4-0.25s-1,0.43-0.91,0.78c0.09,0.36,0.72,1.63,0.72,1.63s0.45,1.24,0.63,1.69c0.17,0.44,0.27,0.88,0.72,1.06,0.44,0.18,0.09,2.97,0.09,2.97s-0.89,2.3-1.16,2.75c-0.27,0.44-0.46,1.25-0.37,1.87,0.09,0.63,0.72,1,0.72,1s1.7,0.69,2.06,0.78,2.94,1.1,2.94,1.1,3.13,0.72,3.84,0.72,2.58,0.06,3.56,0.15,2.5,1,2.5,1,1,0.87,1.53,1.41c0.54,0.53,0.25,4.64,0.25,5s2.88,0.19,3.5,0.28c0.63,0.09,2.32,0.81,2.32,0.81s0.43,1.33,0.43,1.69-0.43,1.88-0.43,1.88l-1.78,0.9-3.47,1.5-0.57,1.06s-1.13,4.74-1.4,5.19,0.53,1.88,0.53,1.88l1.5,0.62,2.25,1.06s3.47,2.25,4.09,2.79c0.63,0.53-0.09,0.96-0.09,0.96l-0.97,1.82-5.44,4.72-0.72,1.96-0.18,1.5s-0.44,3.58-0.44,3.94,0.34,1.53,0.34,1.53,1.81,1.15,2.25,1.5c0.45,0.36,1.88,1,1.88,1l0.72,1.41s0.79,1.54,1.06,2.34c0.27,0.81-0.72,0.97-0.72,0.97l-3.56,2.94-1.97,0.91s-1.35,1.33-1.44,1.87,0.81,0.97,0.81,0.97l0.97,1.44,1,1.34s1.95,0.73,2.75,0.91c0.81,0.17,1.63-0.57,1.63-0.57s1.42-1.95,2.4-2.22c0.99-0.26,0.53,0.46,1.07,0.72,0.53,0.27,1.96,0.61,2.59,0.88s2.22,1.34,2.22,1.34l0.81,2.06,1.78,7.41,0.82,2.5-1.26,4.13s0.1,2.05,0.19,2.4c0.09,0.36,0.8,1.24,1.07,1.6,0.26,0.35,0.43,2.15,0.43,2.15l-0.97,1.35-2.4,1.5-1.1,1.78s-2.3,3.32-2.65,3.59c-0.36,0.27-2.06,1.14-2.6,1.41-0.53,0.27-2.06,1.44-2.06,1.44s0.27,1.06,0.63,1.15c0.35,0.09,0.53,2.16,0.53,2.16l0.81,1.06,1.88-0.44,3.21,0.78,2.5,0.91s1.25,0.88,1.79,1.06c0.53,0.18,3.4-0.44,3.4-0.44s5.87-2.32,6.31-2.59c0.45-0.27,1.72-1.06,1.72-1.06s2.5-1.89,3.03-2.25c0.54-0.36,3.74-2.14,4.1-2.41,0.35-0.27,1.44-1.78,1.44-1.78l0.9-2.12s0.16-1.99,0.25-2.44,0.53-1.5,0.53-1.5l0.72-1.25,2.16-0.19,3.12,0.44,2.32,0.19s3.57,0.1,4.37-0.35c0.8-0.44,0.45-0.72,0.63-1.34,0.17-0.63-0.27-0.9-0.63-1.35-0.36-0.44-1-1.33-1.53-1.78-0.54-0.44-1.25-1.15-1.25-1.15s-2.31-4.22-2.31-4.75c0-0.54,0.81-1.15,2.15-1.69s3.91-0.97,3.91-0.97l2.06-1.19-0.09-2.65,0.47-1.78s1.16-2.8,1.25-3.07c0.09-0.26,1.51-2.93,1.68-3.56,0.18-0.62,0.62-1.79,1.07-2.59,0.44-0.81,1.62-1.68,2.15-2.03,0.54-0.36,1.68-1.91,2.13-2.44,0.44-0.54,1.09-2.22,1.09-2.22l-0.19-4.09s-2.13-2.42-2.4-3.22c-0.27-0.81,0.07-1.43,0.34-1.78,0.27-0.36,1.61-1.88,1.97-2.5,0.36-0.63,0.81-2.53,0.81-2.97,0-0.45,0.98-1.5,1.88-2.13,0.89-0.62,2.83-0.18,3.28,0s1.09,0.81,1.72,1.35c0.62,0.53,3.28,0.68,3.28,0.68s1.07-1.42,1.25-1.87,0.98-1.77,1.25-2.22,1.53-1.07,2.25-1.16c0.71-0.09,1.69,0.63,1.69,0.63s0.97,1.78,1.15,2.31c0.18,0.54,1.18,1.61,1.53,1.97,0.36,0.36,1.26,1.8,1.35,2.16,0.09,0.35,1.06,0.33,2.22,0.15s0.09-1.4,0.09-1.4v-2.16s-0.62-2.16-0.62-2.78c0-0.63,0.71-1.78,0.71-1.78s2.5-0.8,3.03-1.06c0.54-0.27-0.08-1.17,0.1-1.97,0.18-0.81,1.33-1.7,1.69-1.88,0.35-0.18,2.96-0.61,3.4-0.87,0.45-0.27,1.41-1.25,1.41-1.25l0.62-2.69,0.28-2.88s-0.02-0.11-0.03-0.12c0.09-0.06,0.32-0.22,0.32-0.22l1.31,0.19s0.6-0.58,1.31-0.94c0.72-0.36,0.79,0.03,0.97,0.03s0.68,1.11,0.81,1.47c0.14,0.36,0.36,1.26,0.41,1.53,0.04,0.27,1.38,0.68,1.56,0.72s1.55,0.47,1.81,0.56c0.27,0.09,1.66,1.08,1.97,1.44,0.32,0.36,1.04,0.45,2.38,0.94s1.53-0.28,1.53-0.28l0.65-0.63s0.23-1.4,0.32-1.94c0.09-0.53,0.72-0.87,0.72-0.87s1.51-1.22,1.87-1.63c0.36-0.4,0.5-0.87,0.5-0.87s0.34-2.99,0.16-3.13c-0.18-0.13-1.38-0.71-1.78-0.84-0.41-0.13-1.6-1.46-2-2.13-0.41-0.66,0.3-1.16,0.43-1.43,0.14-0.27,1.41-1.06,1.63-1.28,0.22-0.23,1.06-0.78,1.59-1,0.54-0.23,0.27-2.9,0.22-3.35-0.04-0.44-0.7-0.44-1.81-0.62-1.12-0.18-1.97-0.85-1.97-0.85s-1.52-1.52-2.19-2.28-0.22-2.76-0.22-3.03,0.17-4.1,0.13-4.9c-0.05-0.81,0.54-1.63,0.72-1.85s2.37-0.49,2.59-0.53,1.9-0.99,2.35-1.34c0.44-0.36,0.59-1.19,0.59-1.19s-0.37-1.3-0.5-1.75c-0.14-0.45,0.72-1.65,1.03-1.88,0.31-0.22,1.91-1.37,1.91-1.37s1.07-6.86,1.25-7.13c0.17-0.26-0.32-1.59-0.32-1.59s-1.19-3.62-1.28-3.84c-0.09-0.23-0.68-1.65-0.5-2.32s1.27-1.02,1.41-1.25c0.13-0.22,0.07-0.97-0.16-1.15-0.22-0.18-1.03-1.16-1.03-1.16s0.58-3.41,0.63-3.81c0.04-0.4,0.28-1.69,0.28-1.69l1.22-0.84s3.79-0.07,4.06-0.07,2.03-0.79,2.44-1.06c0.4-0.27,0.13-1.66,0-1.84-0.14-0.18-1.19-1.94-1.19-1.94h-2.28l-2.5,0.06-2.1-0.43-1.03-0.41s-2.49-0.25-2.72-0.25c-0.22,0-1.5-0.16-1.5-0.16l-0.65-0.25s-0.13-1.6-0.13-1.87,0.48-0.55,1.07-0.91c0.58-0.35,0.93-0.94,0.93-0.94s-0.17-0.98-0.43-1.34c-0.27-0.36-0.1-0.97-0.1-0.97s2.29-2.76,2.38-2.93c0.09-0.18,0.62-1.04,0.62-1.04s0.89-1.56,1.06-2.18c0.18-0.63-0.59-1.16-0.59-1.16s-3.42-4.04-3.78-4.44-1.14-1.64-1.31-1.9c-0.18-0.27-0.91-1.24-1-1.69s0.31-1.41,0.31-1.41l1.09-3.47-0.56-1.06s-1.07-0.96-1.16-1.09c-0.09-0.14-1-0.75-1-0.75s-0.63-0.55-0.5-0.91c0.14-0.36,1.36-0.56,1.63-0.56s2.31-0.69,2.31-0.69,1.39-0.56,1.56-0.78c0.18-0.22-0.03-1.16-0.03-1.16s-1.56-17.7-1.56-18.06-0.65-1.56-0.78-1.78c-0.14-0.22-2.19-2.34-2.19-2.34l-0.72-5.16h0.06s1.85,0.06,2.47,0.06c0.63,0,0.97-0.84,0.97-0.84l2.5-2.06,1.53-1.38s0.57-0.52,0.88-0.56c0.31-0.05,1.26,0.58,1.44,0.62,0.17,0.05,1.47,0.6,1.47,0.6s0.99-0.52,1.43-0.66c0.45-0.13,0.75-0.62,0.75-0.62l-0.31-5.94,4.16-2.16s0.93-1.1,0.93-1.28,0.57-1.87,0.57-1.87l4.47-3.1s1.78-2.23,2.18-2.5-0.03-0.62-0.03-0.62l-1.25-1.85s-1.07-1.29-1.78-1.47c-0.71-0.17-0.91-1.09-0.91-1.09l0.29-5-0.6-0.47-2.84-2.31-3.41-2.69-0.72-1.97-0.34-1.4-1.06-1.78,0.15-0.91,1.25-2.69-1.4-1.4-1.63-1.97-0.72,1.59s-1.43-0.53-2.5-0.53-1.06,1.44-1.06,1.44-1.95,0.71-2.84,1.25c-0.9,0.53-1.25,1.78-1.25,1.78s-1.45,1.25-2.16,1.25-2.14,0.01-3.03,0.19c-0.89,0.17-1.43,1.41-1.97,2.12-0.54,0.72-1.44,2.33-2.16,2.69-0.71,0.36-0.71,0.34-1.78,0.34s-0.16-0.7,0.38-2.31c0.53-1.61,1.95-1.79,2.31-2.5s0.72-1.78,0.72-1.78l2.5-0.91s0.54-3.02,1.44-3.37c0.89-0.36,3.75-0.53,3.75-0.53s1.22-1.63,1.4-2.35c0.18-0.71,1.44-1.58,1.97-2.65,0.54-1.08,0.72-1.79,0.72-2.5,0-0.72,0.91-1.82,0.91-1.82l2.5-2.12s1.58-1.6,1.93-2.31c0.36-0.72,2.16-1.97,2.16-1.97l2.16-1.97,2.31-2.5s0.19-1.44,0.19-2.16c0-0.71-0.72-1.78-0.72-1.78s-1.26-0.9-1.97-1.44c-0.72-0.53-1.78-0.7-1.78-1.59s0.16-0.72,0.34-1.44c0.18-0.71,0.72,0,0.72,0l1.44,1.1,0.15-1.25-0.15-2.35-0.53-1.97-2.69-0.68-1.78-1.1h-2.16c-0.71,0-0.52-0.69-0.87-1.4-0.36-0.72-0.37-1.62-0.91-2.69s-2.31-0.19-2.31-0.19l-1.78,0.91c-0.72,0.35-0.73,0.52-1.44,1.06-0.72,0.54-1.61-0.37-3.22-0.91-1.61-0.53-1.77,0.02-2.84,0.38-1.08,0.36,0.17,0.88,0.53,1.59,0.35,0.72,0,1.44,0,1.44l-2.35-0.19s-1.06-0.35-1.78-1.25c-0.71-0.89,0.19-1.06,0.19-1.06s1.25-1.43,1.25-2.5-0.72-1.25-0.72-1.25h-2.69c-1.25,0-1.96-0.17-3.03-0.34-1.07-0.18-1.25-0.37-1.97-1.44-0.71-1.07,0.57-0.53,0.57-0.53l1.4-1.25,1.25-0.72,2.69,0.34s0.9,0.56,1.97,0.38,0.19-0.72,0.19-0.72l-1.63-1.06s-1.77,0.34-2.84,0.34-2.16-0.72-2.16-0.72l-1.97-0.87s-1.41-1.45-2.12-1.63c-0.09-0.02-0.2-0.04-0.28-0.03zm-45.94,3.34c-0.85,0.32-1.23-0.03-1.5,0.82-0.27,0.84-0.34,0.96,0.16,1.18,0.49,0.23,0.87,0.53,1.4,0.44,0.54-0.09,1.24-0.47,1.06-1.09-0.17-0.63-1.12-1.35-1.12-1.35zm20.84,3.82c-0.33,0-0.47,0.12-0.94,0.56-0.62,0.58-1.62,1.37-1.71,1.9-0.09,0.54,0.12,0.96-0.19,1.54s-1.55,1.81-2,2.12-2.51,0.16-2.6,0.47c-0.08,0.31-0.37,0.52,0.04,0.87,0.4,0.36,2.91,0.63,3.72,0.54,0.8-0.09,3.3-0.3,3.74-0.35,0.45-0.04,0.71,0.28,0.66-0.43-0.04-0.72-0.72-1.36-0.4-1.85,0.31-0.49,0.6-0.65,0.78-0.97,0.17-0.31,0.49-1.06,0.31-1.47-0.18-0.4-0.72-0.95-0.72-1.53s-0.28-1.37-0.28-1.37c-0.18-0.01-0.3-0.04-0.41-0.03zm-45.53,6.62c-0.49,0-2.1,0.86-2.19,1.13-0.09,0.26-0.56,0.38,0.07,0.97,0.62,0.58,0.39,0.88,1.15,0.84,0.76-0.05,1.55-0.67,2.22-0.63,0.67,0.05,1,0.79,1.31,0.79,0.32,0,0.62-0.23,0.66-0.72s-0.42-0.89-0.59-1.07c-0.18-0.17-0.54-0.18-0.54-0.18-0.31-0.45-1.6-1.13-2.09-1.13zm-2.06,6.25c-0.54,0.18-1.01,0.45-1.5,0.63-0.49,0.17-0.81,0.17-1.13,0.43-0.31,0.27-0.72,0.46-0.72,0.82,0,0.35,0.15,0.5,0.6,0.81s0.52,0.62,1.19,0.62,1.89-0.5,2.03-0.81c0.13-0.31,0.48-0.94,0.53-1.25,0.04-0.31-1-1.25-1-1.25zm-51.31,9.13l-2.35,2.12-0.34,1.78,1.97,0.38,1.25,0.87h2.5l1.25-0.87v-1.78l-1.63-2.16-2.65-0.34zm59.09,4.4c-0.49,0.14-1.47,0.59-1.25,1.03,0.22,0.45,0.5,0.8,0.91,0.75,0.4-0.04,0.74-0.01,0.87-0.5,0.14-0.49-0.22-1.25-0.22-1.25l-0.31-0.03zm97.34,1.78c-0.09,0.01-0.18,0.07-0.28,0.22-0.38,0.6-0.53,1.69-0.4,2.1,0.12,0.41-0.42,0.87,0.12,1.31s0.62,1.22,1.53,1.25c0.92,0.03,1.9,0.47,2.63-0.06,0.72-0.54,1.43-1.69,1.65-2.19,0.22-0.51,0.32-1.22,0.07-1.53-0.26-0.32-0.62-0.81-1.13-0.88-0.5-0.06-1.19,0.16-1.19,0.16-1.07,0.31-0.99,0.66-1.78,0.31-0.59-0.26-0.92-0.72-1.22-0.69zm-135.37,0.22l-1.97,0.19-1.44,1.44,0.53,1.06,1.63-0.91,1.44,0.57,0.34,1.59,1.25,0.34,0.72-0.87-0.53-1.06-1.97-2.35zm27.09,1.13c-0.49,0.01-1.04,0.1-0.9,0.5,0.17,0.53,1.09,0.75,2.03,0.75s2.97,0.08,3.06,0.44c0.09,0.35,0.68,1.56,0.91,1.65,0.22,0.09,0.92,0.13,0.97-0.41,0.04-0.53-0.44-1.13-0.76-1.4-0.31-0.27-2.09-1.25-2.09-1.25-0.45-0.09-2.24-0.28-2.78-0.28-0.13,0-0.27-0.01-0.44,0zm10.31,1.12c-0.71,0.23-0.93,0.25-0.93,0.88,0,0.62-0.1,1.06,0.43,1.15,0.54,0.09,0.85,0.33,1.26,0.07,0.4-0.27,0.59-0.91,0.37-1.22s-1.13-0.88-1.13-0.88zm-44.71,1.16l-1.44,1.25,0.72,0.87,1.78-1.06-1.06-1.06zm6.4,2.31v1.78l2.35-0.53v-1.25h-2.35zm133.35,1.5c-1.05,0.29-1.25,0.28-2.07,0.6-0.82,0.31-1.49,0.24-1.87,0.74-0.38,0.51-0.44,0.28-0.66,1.29s-0.69,0.99,0.1,1.31c0.79,0.31,1.39,0.29,2.31-0.41,0.91-0.69,1.71-1.09,2.19-1.65,0.47-0.57,0.84-1.19,0.84-1.35s-0.84-0.53-0.84-0.53zm-122.41,0.5c-0.4,0.63-0.65,1.16-0.87,1.56-0.23,0.41-0.68,0.77-1.13,1.66s-0.81,1.32-0.81,2.03c0,0.72,0.24,1.18,0.68,1.41,0.45,0.22,0.34,0.5,0.57,0.5,0.22,0,0.82,0.09,1.31,0s1.03-0.19,1.03-0.5v-1.88c0-0.53-0.31-3.37-0.31-3.59s-0.47-1.19-0.47-1.19zm-16.47,0.69l-1.06,0.87v1.25l1.44,0.57,0.87-1.25-1.25-1.44z",
                            "name": "Красноярский край",
                            "ShortName": "Красноярский край",
                            "id": [13]
                        },
                        "tm": {
                            "path": "m454.64,359.43,1.25,3.2143,1.25,2.3214s-0.53571,2.3214-0.71428,3.0357c-0.17857,0.71429-1.6071,3.0357-1.6071,3.0357s0.53571,1.25,1.6071,1.9643c1.0714,0.71429,5.8929,1.7857,5.8929,1.7857l5.3571,0.17857s3.75,0.89285,4.1071,1.6071c0.35714,0.71429,0.89286,1.0714,0.89286,2.1429,0,1.0714,0.35714,4.2857,0.35714,4.2857s1.25,0.35714,2.6786,0.35714,3.0357,0.35715,3.0357,0.35715,0.35714,2.1428,0.35714,2.6786c0,0.53571-0.89286,1.7857-1.9643,1.7857s-3.75,1.6072-3.75,1.6072-1.25,2.6786-1.25,3.75-0.89285,3.5714-0.53571,4.2857c0.35714,0.71429,4.4643,1.7857,5.1786,2.1429,0.71429,0.35714,3.2143,2.6786,3.2143,2.6786s-0.71429,1.6071-1.6072,2.6786c-0.89285,1.0714-4.1071,3.0357-5.3571,4.6429-1.25,1.6071-0.35714,2.8571-0.35714,2.8571l-0.71429,1.6071-3.2143,0.53572-3.2143,0.35714-1.4286-1.6071-1.9643-0.17857-4.66-0.57h-2.3214l-1.25,1.0714s-2.1429,1.0714-3.2143,1.25c-1.0714,0.17857-5.3571,1.25-6.0714,1.25-0.71428,0-6.4286,0.71429-6.4286,0.71429l-3.3928,1.4286h-2.3214l-0.35715-1.9643,0.71429-2.1429-0.35714-2.3214,1.7857-2.3214-0.53571-1.4286s-1.0714-0.17858-1.9643,0.53571c-0.89286,0.71429-4.4643,1.0714-4.4643,1.0714l-4.2857-0.17857-1.9643-2.3214-0.89286-3.0357s-1.25-1.0714-2.6786-0.71428c-1.4286,0.35714-1.6072,1.25-2.6786,1.25s-2.5,0-3.0357-0.89286c-0.53571-0.89286-0.89285-3.0357-0.89285-3.0357l-0.9-2.33s-1.6071-0.89286-2.5-1.6071c-0.89286-0.71429-3.2143-2.3214-3.2143-2.3214l-5.1786-2.3214-4.2857-1.9643-4.6429-1.7857-2.6786-1.0714-1.7857-2.5v-3.0357l1.6072-2.8572,0.35714-1.7857-0.53571-2.3214,1.25-3.0357,0.71428-3.3929,1.9643-1.0714,3.3928-2.8571s0-2.1429,0.71429-2.3214c0.71429-0.17857,5.7143-1.6071,5.7143-1.6071l1.9643-1.7857,1.25-2.6786,2.5-1.6071,1.6071-3.2143s1.0714-1.0714,1.7857-1.7857c0.71428-0.71429,2.1428-1.4286,2.1428-1.4286l1.9643-0.35715,2.1429,1.7857,2.1428,1.0714,2.5,0.35714,2.8572,1.4286,1.0714,1.6071,3.0357,0.89286h3.3929l2.1428,0.35714,1.25,1.6072,2.6786,0.71428,2.3214,0.71429,2.1429,1.7857,1.25-0.89286,1.7857-0.53571,2.1428-1.4286,2.1429-0.17857,1.6071,0.71428,1.7857,0.89286z",
                            "name": "Томская область",
                            "ShortName": "Томская область"
                        },
                        "nv": {
                            "path": "m371.43,421.57,4.1071,0.71429l4.4643-0.17858c1.25-0.17857,2.1429-0.71428,2.1429-0.71428l-2.14,3.4h-3.0357l-0.89285,2.1428s1.0714,1.9643,1.7857,2.5c0.71429,0.53572,2.6786,3.0357,2.6786,3.0357l0.53572,2.1428,2.3214,0.35715h1.4286s2.6786,0.35714,3.3928,0.35714c0.71429,0,0.89286,0,1.9643-0.35714,1.0714-0.35715,3.2143-0.71429,4.6429-0.71429h3.5714s2.6786,0.17857,3.5714-0.35714c0.89286-0.53572,0.89286-1.0714,2.3214-1.25,1.4286-0.17857,3.0357-0.17857,3.9286-0.17857,0.89286,0,1.9643-0.17857,1.9643-0.17857s0,1.6071,0.89286,2.1428c0.89285,0.53572,4.1071,2.6786,4.1071,2.6786l0.71428,0.71429c0.17858,0.71429-0.17857,2.5-0.17857,3.2143,0,0.71428-1.0714,0.71428-0.17857,1.6071,0.89286,0.89286,1.9643,1.4286,1.9643,1.4286l2.3214-1.9643,2.3214-2.3214s2.1429-0.53572,2.8572-0.53572c0.71428,0,3.0357,0,3.75-0.17857,0.71428-0.17857,1.4286-0.71429,2.6786-0.17857,1.25,0.53571,2.3214,0.71428,3.3929,0.71428,1.0714,0,3.5714-1.25,3.5714-1.25s1.7857-2.1428,1.9643-2.8571c0.21-0.7-0.33-4.45-0.33-4.45v-3.75c0-0.71429,0.71428-2.3214,1.25-2.6786,0.53571-0.35714,1.7857-0.89285,1.7857-1.7857,0-0.89286-0.89286-1.6071-0.89286-1.6071s-0.89285-0.53572-0.89285-1.4286c0-0.89286,0.35714-3.2143-0.53572-3.0357-0.89285,0.17857-4.1071,1.7857-4.1071,1.7857s0,0.17857-1.4286,0.17857-2.5,0-2.6786-0.71429c-0.17857-0.71428,0.35714-5,0.35714-5l0.53571-2.6786,0.17858-2.1429-2.8572,1.4286s-1.6071,0.53572-2.5,0.71429c-0.9,0.18-4.47-0.71-4.47-0.71l-2.1429-0.71428-1.4286-2.1429-1.4286-2.8571s-2.5,0.53571-3.2143,0.71428c-0.71428,0.17858-1.9643,0.53572-1.9643,0.53572l-2.3214-1.25-1.0714-3.3929v-1.25l-3.0357-1.7857s-1.9643-1.6072-2.6786-2.1429c-0.71428-0.53571-3.3928-1.7857-3.3928-1.7857s-3.3929-1.25-4.1072-1.6072c-0.71428-0.35714-1.9643-1.25-2.6786-1.6071-0.71428-0.35714-3.9286-1.4286-3.9286-1.4286l-1.9643,0.17857s-0.35715,1.0714-0.53572,1.9643c-0.17857,0.89285-1.0714,2.3214-1.0714,2.3214l-1.4286,1.0714-0.89286,1.6072,0.17858,2.1428-0.71429,1.4286h-3.2143l-2.5-0.35714-2.1428,0.89286-2.1429,2.3214-1.4286,1.9643-0.71429,2.6786,0.71429,1.9643,1.7857,2.6786v1.7857l-2.1428,3.5714z",
                            "name": "Новосибирская область",
                            "ShortName": "Новосибирская область",
                            "id": [18]
                        },
                        "al": {
                            "path": "m381.25,435.14,1.7857,5,1.7857,5.1786,1.6071,6.7857,0.89286,8.5714,0.35714,8.2143,0.35714,2.8571,2.3214-0.53571,1.7857-0.53572,0.89285-0.53571,0.17857-1.9643,1.25-1.6071,1.25-0.35714,1.7857,0.53571,0.89286,1.9643,0.89285,2.8571,2.3214,2.8571,1.9643,1.6071,4.6428,0,3.3929-0.35714,2.5-0.89286,2.3214,0,3.3929,1.4286,1.0714,1.9643,2.3214,0.53572,2.3214-0.53572-0.17857-1.4286-1.6071-1.0714-1.0714-0.89286,0.35714-1.6071,0.71429-0.35714,2.5-0.35714,4.4643-0.71429,3.75-0.17857,2.6786-0.71429,2.3214-1.9643,1.0714-1.9643s0.53572-0.71428,1.25-0.71428c0.71429,0,3.3929-0.17858,3.3929-0.17858l1.9643-0.17857,1.0714-1.7857s0.53572-2.1429,1.25-2.5c0.71429-0.35714,0.89286-2.3214,0.89286-2.3214l0.71429-2.1429-0.35715-1.0714-0.71428-1.0714,0.71428-0.89286,1.25-0.53571-0.17857-1.0714-1.4286-1.6072-1.0714-1.0714c-0.17857-0.71429-0.89286-2.8572-0.89286-2.8572l-1.7857-1.7857-0.17857-0.89286-0.53572-2.1429-1.6071-1.4286-2.5-1.9643-1.74-1.79s-1.6072,1.0714-2.3214,1.4286c-0.71429,0.35715-1.7857,0.71429-1.7857,0.71429l-2.5,0.17857-2.5-0.35714-3.0357-0.17857-4.8214,0.71428-2.5,1.6072-1.6071,1.7857-1.0714,0.71429-0.89286,0.35714-1.4286-1.25-0.35714-0.89286,0.35714-0.89286,0.17857-1.7857-0.17857-1.4286-2.3214-1.6071-1.9643-1.25-1.0714-1.25-0.17857-0.89286-1.9643-0.17857-4.2857,0.17857-1.25,1.25-2.1429,0.53571-3.75-0.53571-4.2857,0.17857-2.6786,1.25h-2.5l-3.3929-0.17857z",
                            "name": "Алтайский край",
                            "ShortName": "Алтайский край",
                            "id": [1]
                        },
                        "km": {
                            "path": "m472.14,414.79-0.71428,2.3214,0.89286,1.6072,2.5,1.4286,1.7857,1.6071,1.25,2.5,0.17857,0.89286s-0.89286,1.4286-1.6071,2.1429c-0.71429,0.71428-4.2857,2.3214-4.2857,2.3214l-1.7857,1.7857-1.7857,1.7857v1.6072l1.0714,1.7857,0.17858,1.7857-1.9643,2.5s-1.25,1.0714-1.0714,1.7857c0.17857,0.71428,1.0714,1.4286,1.7857,1.6071,0.71428,0.17857,2.8571,0.89286,2.8571,0.89286l-0.71429,1.4286-1.25,1.7857-0.53571,1.6072-1.7857,0.71428-1.4286,1.6072,0.71429,1.25,1.25,1.25-0.89286,2.5-1.25,1.6071,0.53572,1.25,1.7857,1.7857-0.35714,1.6072-1.6072,1.9643-2.5,2.1429h-1.9643l-0.71429-1.7857-1.9643-1.25-2.6786-0.35714-1.4286,1.0714-2.1428-1.4286-0.71429-2.3214-1.0714-0.71429,0.17857-2.5-0.53571-2.5,0.89286-1.9643,0.71428-1.6071-2.1428-2.6786-1.6072-2.6786-1.25-1.4286-0.71428-2.3214-0.89286-1.7857-2.3214-2.1429-1.7857-1.6071-0.71429-1.25v-1.7857l-0.35714-4.6428,0.17857-2.5,0.71429-2.3214,1.25-1.4286,0.71428-1.25-1.4286-1.9643v-0.89286l-0.35714-2.5,1.6071-0.35714,4.4643-0.53571,2.5-0.89286,3.0357-0.89286,1.0714-0.35714,0.71428-0.89286h1.6072,1.9643,2.5l1.7857,0.35715,1.4286,0.35714,0.89286,0.89286,1.9643,0.53571,1.6071-0.17857,2.5-0.71429z",
                            "name": "Кемеровская область",
                            "ShortName": "Кемеровская область",
                            "id": [10]
                        },
                        "lt": {
                            "path": "m422.32,478.89-0.44643,2.1428s-0.17857,1.875,0,2.5893c0.17857,0.71429,1.1607,2.3214,1.1607,2.3214l3.3036,0.89286s0.98215,1.1607,1.0714,1.6071c0.0893,0.44643,0.0893,3.3036,0.0893,3.3036s0.17857,0.89286,0.53571,1.6071c0.35715,0.71429,1.25,1.875,1.7857,2.2322,0.53571,0.35714,1.6071,1.25,2.4107,1.3393,0.80357,0.0893,3.125,0.0893,3.5714,0.0893,0.44643,0,4.0179,0.0893,4.0179,0.0893s1.0714,0.53572,1.6071,0.89286c0.53571,0.35714,1.4286,1.25,1.7857,1.875,0.35715,0.625,1.5179,1.6964,2.0536,1.9643,0.53571,0.26785,1.1607,0.80357,1.7857,1.1607,0.625,0.35714,1.6964,0.71429,2.4107,0.80357,0.71429,0.0893,2.9464-0.44643,3.3929-0.71428,0.44643-0.26786,2.3214-0.89286,3.4821-0.89286s4.7322-0.35714,5-0.44643c0.26786-0.0893,3.5714-1.3393,4.1964-1.3393s1.4286-0.89285,1.6071-1.25c0.17858-0.35714,0.625-1.9643,0.17858-2.7678-0.44643-0.80357-0.80358-1.0714-1.4286-1.4286-0.625-0.35715-1.4286-1.25-1.25-1.7857,0.17858-0.53571,1.9643-1.1607,2.4107-1.1607,0.44643,0,2.5,1.0714,2.5,0.26785,0-0.80357-1.6964-2.2321-1.6964-2.2321s-0.98214-1.3393-1.25-1.7857c-0.26786-0.44643-1.875-1.9643-1.875-1.9643s-2.2321-2.7679-2.0536-4.1071c0.17857-1.3393-0.0893-3.3929-0.0893-3.3929s-0.625-1.3393-0.71428-1.6964c-0.0893-0.35714-1.3393-0.17857-1.3393-0.17857l-1.5179,1.5179s-1.4286-0.26786-1.5178-0.80357c-0.0893-0.53572-0.71429-2.5893-0.71429-2.5893s-0.35714-1.7857-0.44643-2.1429c-0.0893-0.35714-0.17857-1.9643-0.17857-1.9643l1.6964-1.3393,2.8571-1.3393,0.35715-1.1607-1.3393-1.6071-0.80357-0.625-2.1429-0.53571-1.9643,0.98214s-1.0714-0.625-1.4286-0.80357c-0.35714-0.17857-1.0714-0.89286-1.0714-0.89286l-0.89286-1.7857s0-1.0714-0.71429-0.89286c-0.71428,0.17857-0.89285,0.71428-0.89285,0.71428s-1.1607,1.1607-1.1607,1.5179c0,0.35714-0.625,1.4286-0.625,1.4286l-0.98214,1.0714s-1.6071,0.44643-1.9643,0.44643h-3.0357c-0.35714,0-1.1607,0.71429-1.5179,1.0714-0.35714,0.35714-1.1607,1.9643-1.1607,1.9643l-1.5179,1.0714-0.98214,0.625-2.3214,0.71429h-2.3214l-4.1071,0.71428-4.1071,0.625-1.0714,0.625-0.0893,0.98215s0.0893,0.89285,0.53572,0.98214c0.44642,0.0893,1.6071,0.80357,1.6071,0.80357l0.44643,0.89286-0.0893,0.89286-1.875,0.625z",
                            "name": "Республика Алтай",
                            "ShortName": "Республика Алтай"
                        },
                        "tv": {
                            "path": "m461.96,477.02,0.26786-1.6964s0.89286-0.625,1.6071-0.625c0.71429,0,1.6964,0.71428,2.4107,0.89286,0.71428,0.17857,2.7678,0.71428,3.0357,0.71428,0.26786,0,1.0714-0.80357,1.3393-1.25,0.26785-0.44643,1.9643-2.6786,1.9643-2.6786s0-1.25,0.625-1.6071c0.625-0.35715,1.875-0.35715,2.3214-0.35715,0.44643,0,1.6071-0.17857,2.3214,0.26786,0.71429,0.44643,1.1607,3.0357,1.1607,3.0357s0.89286,0.89285,1.1607,0.89285c0.26786,0,2.1429-0.80357,2.1429-0.80357s1.4286,0.17857,1.7857,0.44643c0.35714,0.26786,3.0357,0.89286,3.0357,0.89286s1.6964,1.6071,2.2322,1.6071c0.53571,0,1.6964,0.26786,2.6786-0.0893,0.98214-0.35714,2.8571-0.80357,3.3929-1.25,0.53571-0.44642,5.5357-1.9643,5.9821-2.5,0.44643-0.53571,7.0536-5.9821,7.0536-5.9821l2.1429-2.8571s-0.17857-1.875-0.17857-2.9464,1.0714-2.3214,1.4286-2.5893c0.35714-0.26785,2.8571,0.0893,3.3036,0.17858,0.44643,0.0893,4.375,0.89285,4.7321,0.80357,0.35714-0.0893,4.2857-0.44643,4.2857-0.44643l2.4107-2.2321s1.5179-0.35715,2.4107,0.0893c0.89286,0.44643,3.6607,2.5,4.1964,2.7679,0.53572,0.26786,3.75,2.3214,3.75,2.3214l1.6072,1.5178s1.25,0.71429,1.7857,0.44643c0.53571-0.26785,2.3214-0.89285,2.3214-0.89285l1.6071,0.53571,0.35714,1.25s0.53572,0.89286,0.53572,1.25-0.89286,1.6071-0.89286,1.6071-0.71428,0.53572-0.80357,1.1607c-0.0893,0.625-0.26786,4.1071-0.26786,4.1071s-0.0893,2.3214-0.0893,2.7679c0,0.44643-0.71429,2.1428-0.71429,2.1428l-1.4286,2.4107s-1.5179,1.3393-1.875,1.875c-0.35714,0.53571-2.2321,1.3393-2.4107,1.6964-0.17858,0.35714-0.71429,1.875-0.71429,1.875s-0.71429,1.875-0.71429,2.4107c0,0.53572-0.0893,3.3929-0.0893,3.9286,0,0.53572,0.53571,2.5,1.0714,3.2143,0.53571,0.71428,1.25,1.6071,1.25,2.0536,0,0.44643-0.80357,2.3214-1.1607,2.7679-0.35714,0.44643-4.8214,4.1964-4.8214,4.1964l-2.0536,1.25-2.1428,0.17857s-1.7857-0.98215-2.1429-0.89286c-0.35714,0.0893-2.3214,0.17857-2.6786,0.17857-0.35715,0-1.7857-0.89286-1.7857-0.89286s-1.6964-0.35714-2.1428-0.625c-0.44643-0.26785-1.7857-1.1607-1.7857-1.1607s-2.7679-0.26786-3.2143-0.26786c-0.44643,0-2.8572-0.17857-3.2143-0.53571l-2.0536-2.0536s-0.71429-1.4286-0.80357-1.9643c-0.0893-0.53571-0.17857-2.5-0.17857-2.5s-0.80358-0.80357-1.3393-1.25c-0.53571-0.44643-2.1429-0.89286-2.9464-0.89286-0.80357,0-3.9286,0.17858-3.9286,0.17858s-1.9643,0.53571-2.2321,0.625c-0.26786,0.0893-1.25,0.71428-1.875,0.80357-0.625,0.0893-2.0536,0.0893-1.9643-0.80357,0.0893-0.89286,1.25-1.6964,1.3393-2.0536,0.0893-0.35714-0.0893-1.0714-0.71429-1.3393-0.625-0.26786-2.1429-0.17857-3.0357,0.0893-0.89286,0.26786-2.3214,0.80358-2.8572,0.89286-0.53571,0.0893-3.3928,0.71429-3.3928,0.71429s-2.1429,0.89285-2.6786,1.0714c-0.53572,0.17857-3.8393,1.1607-3.8393,1.1607l-3.0357,1.5179-2.4107,1.1607-2.5893-0.26786-2.1429-0.98214-1.5179-0.71428-1.25-1.25c0-0.44643,0.35714-0.98215,0.35714-0.98215l2.4107-0.44643,1.7857,0.53572s1.25-0.35714,0.17857-1.0714c-1.0714-0.71429-4.4643-5.0893-4.4643-5.0893l-1.48-2.44s-1.0714-1.4286-1.0714-1.7857v-2.5893z",
                            "name": "Республика Тыва",
                            "ShortName": "Республика Тыва",
                        },
                        "hk": {
                            "path": "m470.27,432.11c0.53572,0.35715,1.9643,1.875,1.9643,1.875l1.3393,1.6072s0.26785,0.625,1.1607,0.80357c0.89286,0.17857,2.0536,0.17857,2.0536,0.17857s0.35714-0.35714,0.80357-0.80357,0.625-0.98214,0.98215-1.25c0.35714-0.26786,0.89285-0.89286,1.3393-0.80357,0.44643,0.0893,0.71429,0.26785,1.3393,0.71428,0.625,0.44643,1.3393,1.25,2.2321,1.25,0.89286,0,2.5,0.80357,2.5,0.80357s0.44643,1.875,0.625,2.3214c0.17857,0.44643,0.53571,2.9464,0.53571,2.9464s0.35715,1.5179,0.71429,2.4107c0.35714,0.89285,0.98214,2.0536,1.0714,2.4107,0.0893,0.35714-0.0893,3.125-0.17857,3.3929-0.0893,0.26785-0.80357,1.875-0.89286,2.2321-0.0893,0.35714,0,2.5893,0,2.5893l1.5179,1.5179,0.625,1.875s-1.25,1.4286-1.4286,1.6964c-0.17858,0.26786-2.2322,1.3393-2.5893,1.875-0.35714,0.53571-1.4286,3.0357-1.4286,3.0357s-1.6071,1.9643-2.1429,2.2322c-0.53571,0.26785-2.8571,1.0714-3.125,1.5178-0.26786,0.44643-1.6964,1.6964-1.6964,1.6964l-2.7678,0.0893s-1.3393,0.17857-1.6072,0.625c-0.26785,0.44643-0.53571,1.4286-1.0714,1.875-0.53571,0.44643-1.0714,1.25-1.1607,1.6071-0.0893,0.35714-0.89286,1.0714-0.89286,1.0714s0.0893,0.71429-1.0714,0.625c-1.1607-0.0893-2.9464-0.35714-2.9464-0.35714l-1.7857-1.1607-1.6071,0.44643-0.625,0.80357-0.26786,0.89286-2.5,1.0714s-0.625,0.89286-1.1607,0.35714c-0.53572-0.53571-1.25-2.3214-1.25-2.3214l-0.625-2.5893v-1.5179s0.17857-1.0714,0.53571-1.25c0.35714-0.17857,2.5-1.6071,2.5-1.6071s1.3393-0.98215,1.6964-1.0714c0.35714-0.0893,2.1429-0.44643,2.1429-0.44643l1.9643-1.0714,1.5179-2.0536,1.3393-1.0714-0.44643-1.6071s-1.25-1.25-1.4286-1.6071c-0.17858-0.35715-0.44643-1.25-0.44643-1.25l1.6071-2.2322,0.0893-1.875s-1.0714-1.1607-1.1607-1.5178c-0.0893-0.35715-0.0893-1.25-0.0893-1.25l2.5893-1.5179,1.0714-1.875,1.1607-1.9643,0.53572-1.6964-3.5714-1.1607s-0.89286-1.25-0.71429-1.7857c0.17858-0.53572,1.7857-2.4107,1.7857-2.4107s0.89286-1.875,0.89286-2.3214c0-0.44642-1.0714-2.8571-1.0714-2.8571s0-0.71428,0.26785-1.1607c0.26786-0.44643,1.25-0.98215,1.25-0.98215z",
                            "name": "Республика Хакасия",
                            "ShortName": "Республика Хакасия"
                        },
                        "ir": {
                            "path": "M599.41,325.78c-0.12,0.03-0.22,0.12-0.22,0.34,0,0.45,0.53,1.54,0.53,1.54l0.37,1.06s-0.26,0.88-0.62,1.06-1.78,0.63-1.78,0.63l-2.69,0.09s-1.61,0.26-1.88,0.44c-0.26,0.18-0.9,0.73-0.9,1.09s-0.44,1.96-0.53,2.31c-0.09,0.36-0.16,1.97-0.16,1.97s0.18,0.78,0.63,1.41c0.44,0.62,0.43,1.81,0.43,1.81l-1.25,1.16s0.26,1.67,0.35,2.03,1,3.4,1,3.4l0.43,2.5s-0.28,1.42-0.28,1.69-0.96,4.57-0.96,4.57-0.09,0.98-0.54,1.24c-0.44,0.27-2.06,1.88-2.06,1.88s-0.19,0.99-0.19,1.34c0,0.36,0.37,1.06,0.19,1.5-0.18,0.45-1.97,1.72-1.97,1.72l-2.59,0.72-1.31,0.88-0.29,3.84-0.09,2.22v1.81c0,0.36,0.27,1.34,0.72,1.78,0.45,0.45,2.16,1.97,2.16,1.97l2.21,0.53,1.16,0.78,0.1,2.25s-0.37,1.33-0.82,1.5c-0.44,0.18-2.75,1.82-2.75,1.82l-0.53,1.15,0.97,1.16,1.97,1.59s0.78,0.1,0.87,0.72c0.09,0.63-0.15,2.6-0.15,2.6l-0.47,1.43-1.25,1.07-1.41,1.43-0.19,1.6-1.24,0.81-2.79-0.28-1.59-1.35-1.78-0.68-2.25-0.63s-0.45-0.74-0.63-1.19c-0.17-0.44-0.34-1.68-0.34-1.68l-1.25-0.72-1.87,1-1.26,0.09-0.18,1.69-0.35,2.41-0.53,1.53-0.9,0.97-1.6,0.53s-1.89,0.28-2.25,0.37c-0.35,0.09-1.34,1.41-1.34,1.41s-0.53,0.8-0.44,1.15c0.09,0.36,0.19,1.25,0.19,1.25l-1.16,0.91-2.06,0.81s-0.44,0.9-0.44,1.25c0,0.36,0.16,1.97,0.16,1.97l0.37,1.5,0.1,1.63s0.7,0.7,0.43,1.06c-0.26,0.36-2.78,0.62-2.78,0.62l-1.93-2.78-1-1.5-1.07-2.34-1.06-0.69h-1.72l-1.59,1.69s-0.89,0.81-1.16,1.44c-0.27,0.62,0.01,1.78-1.15,1.78s-3.22-0.38-3.22-0.38l-1.25-1.15-1.97-0.44-1.34-0.19s-0.62,0.64-0.97,0.91c-0.36,0.27-1.35,1.25-1.35,1.25v0.62l-0.72,1.88-1.15,2.22-0.81,0.9-0.29,1.35,0.63,1.68s0.45,0.9,0.81,1.25c0.36,0.36,0.63,0.35,0.72,0.97,0.09,0.63,0.19,2.6,0.19,2.6l-0.38,2.4-0.97,1.88s-1.88,1.79-2.15,2.06-2.13,1.61-2.13,1.97-1.62,4.19-1.62,4.19l-1.25,2.25s-0.69,2.11-0.78,2.56-0.63,3.59-0.63,3.59-0.09,1.33-0.62,1.6c-0.54,0.26-3.69,0.81-3.69,0.81s-2.12,1.07-2.56,1.34c-0.45,0.27-0.72,0.63-0.72,0.63s-0.19,0.52-0.1,0.87c0.09,0.36,1.16,2.25,1.16,2.25l1.44,2.66,1.06,0.56,0.97,1.06,1.09,1.69v0.81l1.25-0.43s0.9-0.91,1.25-1c0.36-0.09,1.78,0.28,1.78,0.28l1.44,0.87s1.43,0.91,1.78,1c0.36,0.09,2.03,1.41,2.03,1.41l4.32,2.87s0.34,0.82,1.06,0.82c0.71,0,2.41-0.38,2.41-0.38l1.78-0.34,1.06,1.15,0.28,1.16,0.28,1.53,2.56-0.81,2.44-2.41s2.14-2.16,3.13-2.34c0.98-0.18,2.12,1.19,2.12,1.19s0.72,1.58,1.25,2.03c0.54,0.44,2.43,2.32,2.78,2.59,0.36,0.27,3.03,1.53,3.03,1.53l2.22,2.66c0.45,0.53,2.52,3.22,2.97,3.22s2.84,0.18,3.38,0.09c0.53-0.09,1.96,0.63,2.5,1.25,0.53,0.63,1.78,2.69,1.78,2.69s1.27,1.69,1.62,1.78c0.36,0.09,1.16,1.88,1.16,1.88s0.89,1.62,1.25,1.53,2.31-0.63,2.31-0.63,0.73,0.15,0.91,0.69c0.18,0.53,0.87,2.59,0.87,2.59s1.18,0.62,1.53,0.53c0.36-0.09,1.88-1.25,1.88-1.25s1.77-0.26,2.12-0.43c0.36-0.18,1.44-0.82,0.82-1.44-0.05-0.04-0.11-0.06-0.16-0.09,0.05-0.01,0.34-0.07,0.34-0.07l1.69-0.62,8.75-2.88s1-1.76,1-2.03,0.63-2.06,0.63-2.06l0.06-2.06,0.81-0.82,1.78-0.96,2.25-0.82,1.16-1.68,1.06-0.82,5.44-2.59,1.62-1.31,0.82-1.1,0.62-2.5,1.94-1.15s1.27-0.9,1.62-1.35c0.36-0.44,0.35-0.97,0.35-0.97l-0.63-0.81-1.25-1.25-0.34-0.81s0.18-0.96,0.62-1.41c0.45-0.44,0.71-0.63,1.07-0.72,0.35-0.09,1.25,0.35,1.25,0.35l1,1.09,0.87-0.47,0.63-1.78s0.81-2.14,0.9-2.5,0.25-1.69,0.25-1.69-0.25-3.05-0.25-3.5v-2.5s0.44-4.01,0.53-4.37,0.35-2.13,0.35-2.13l-0.1-1.87s-0.44-1.17-0.62-1.44-0.16-0.81-0.16-0.81,0.63-1.05,0.72-1.41c0.09-0.35-0.37-0.81-0.37-0.81s-0.54-0.71-0.72-1.06c-0.18-0.36-0.88,0.15-0.88,0.15l-1.44,0.91s-0.79,1.26-1.15,1.53-0.44,1.31-0.44,1.31l-0.28,4.38-0.81,1.34-1.53-0.09c-0.34-0.63-0.73-1.32-0.79-1.6-0.08-0.44-0.43-2.67-0.34-3.65s0.97-4.38,0.97-4.38l1.25-1.25s0.09-1.52-0.53-2.06c-0.63-0.53-1.87-1.07-2.41-1.34-0.53-0.27-1.72-1.35-1.72-1.97,0-0.63,0.92-1.77,1.19-2.13,0.27-0.35,3.93-1.51,4.28-1.78,0.36-0.27,3.57-2.15,3.57-2.15l3.65-1.07,2.78,0.25,2.13-0.34,1.34-2.5,2.88-0.81s1.87,1.25,2.4,1.25c0.54,0,2.22-0.72,2.22-0.72s1.07,0.64,1.25,1,1.63,1.34,1.63,1.34l1.93-0.37s1.35-0.44,2.07-0.35c0.71,0.09,1.7,0.98,2.06,1.07s2.75-0.72,2.75-0.72l1.09-1.5,2.5-1.16s1.35-1.08,1.35-1.53,0.15-3.22,0.15-3.22,1.25-0.61,1.88-0.97c0.62-0.35,2.15-0.18,2.15-0.18s0.17-1.34,0.35-1.79c0.18-0.44,1.33-1.34,1.78-1.43s2.44,0.37,2.44,0.37l1.15,0.97-1.34,1.44-0.72,1.15,0.72,0.72s2.31-0.45,2.94-0.72c0.62-0.26,2.24-0.44,2.78-0.53,0.53-0.09,2.84-1.15,2.84-1.15s0.91-1.08,0.91-1.44-0.2-1.71-0.38-2.16c-0.18-0.44-2.21-1.14-2.65-1.59-0.45-0.45-0.54-2.58-0.72-2.94s-0.9-1.9-0.63-2.44c0.27-0.53,1.06-1.78,1.06-1.78l-0.62-2.5s-0.01-2.48,0.34-2.84c0.36-0.36,2.07-1,2.07-1l2.93,0.81s0.9,1.15,1.35,1.06c0.44-0.09,2.15-0.53,2.15-0.53l0.25-3.56-0.87-1.16s-1.27-1.42-1.63-1.68c-0.35-0.27-1.25-1.25-1.25-1.25l-1.68-2.97-0.25-2.6-0.72-1.68-2.25-0.54-1.78,0.97-3.13,1.53-1.97,0.44-0.72-0.72-0.78-2.84-1-1.59-2.75-2.35-2.34-1.68-2.66-0.91-2.78-0.06s-2.49,0.8-2.84,1.15c-0.36,0.36-1.45,1.52-1.72,1.88-0.27,0.35-0.88,2.5-0.88,2.5l-0.28,2.12v2.5s-0.17,1.36-0.43,1.72c-0.27,0.36-3.94,2.03-3.94,2.03l-1.16,1.72-0.19,2.66-0.97,2.25-2.15,2.22s-0.6,0.63-0.69,0.09-0.62-2.22-0.62-2.22l-2.16-2.34s-0.44-1.23-1.06-0.78c-0.63,0.44-1.63,1.31-1.63,1.31l-3.28,1s-0.89,0.43-1.25,0.87c-0.36,0.45-2.97,0.72-2.97,0.72l-2.03,0.28-2.16,2.5s-0.62,1.26-1.24,0.82c-0.63-0.45-2.22-2.35-2.22-2.35l-0.82-1.59-0.53-2.94,0.16-5.56-0.06-2.56,1.5-2.6,1.87-3.03s0.44-1.61,0.44-2.06-0.53-3.03-0.53-3.03l-2.03-2.25-4.94-3.66s-0.63-0.71-0.63-1.25c0-0.53,0.1-2.31,0.1-2.31l1.15-1.97s0.63-0.35,0-1.06c-0.62-0.72-3.18-4.57-3.18-4.57l0.15-5.34s0.02-0.65-0.34-1.09c-0.36-0.45-2.59-3.28-2.59-3.28l-1.54-1.88s-0.24-0.62-0.68-0.62c-0.45,0-2.16,0.68-2.16,0.68s-1.17,0.82-1.44,0.29c-0.27-0.54-0.25-2.6-0.25-2.6s-0.29-1.16,0.16-1.25,1.62-0.44,1.62-0.44h1.5l0.29-1.43-1.79-1.97-1.53-1.35-1.4-0.06s-0.14-0.03-0.25,0z",
                            "name": "Иркутская область",
                            "ShortName": "Иркутская область",
                            "id": [9]
                        },
                        "br": {
                            "path": "m543.39,476.39s1.6072,0.98214,2.3214,1.1607c0.71429,0.17857,2.8572,1.25,3.3929,1.3393,0.53571,0.0893,1.7857,0.71428,2.5,0.98214,0.71429,0.26786,1.875,0.98214,2.5893,1.3393,0.71428,0.35714,2.2321,0.53571,3.2143,0.625,0.98214,0.0893,2.8571,0.89285,3.4821,1.0714,0.625,0.17858,2.1429,1.0714,2.9464,1.1607,0.80357,0.0893,1.5179,0,2.7679,0.625s2.7679,1.3393,3.125,1.5179c0.35714,0.17857,0.71429,0.26785,0.80357,0.98214,0.0893,0.71428,0,2.6786,0.0893,3.0357,0.0893,0.35715,0.26785,1.6964,0.625,2.0536,0.35714,0.35715,1.6071,1.9643,2.5893,2.5893,0.98215,0.625,1.4286,1.6964,1.9643,2.1429,0.53571,0.44643,2.3214,1.875,2.8571,1.9643,0.53572,0.0893,2.3214,0.625,2.7679,0.625,0.44643,0,5.0893,0.44643,5.0893,0.44643s1.7857-0.80357,2.7679-1.25c0.98214-0.44643,4.0179-1.25,4.4643-1.5179,0.44643-0.26785,1.5178-0.98214,2.6786-1.0714,1.1607-0.0893,4.1964-0.0893,5.0893-0.0893,0.89286,0,4.1072,0.0893,4.1072,0.0893s2.3214-0.0893,3.125,0.44642c0.80357,0.53572,1.6071,1.6072,1.9643,2.1429,0.35715,0.53572,0.625,1.4286,1.0714,1.6071,0.44643,0.17858,1.4286,0.35715,1.875,0.35715,0.44643,0,2.1429-0.26786,2.5-0.35715,0.35714-0.0893,2.2321-0.44642,2.2321-0.44642l0.0893-2.6786s-0.0893-1.7857,0.53571-2.0536c0.625-0.26785,4.4643-1.5178,4.8214-1.6964,0.35715-0.17857,1.25-1.6071,1.25-1.6071s-2.5-0.625-3.3036-0.625c-0.80357,0-1.25-1.4286-1.25-1.4286l1.0714-1.5179,0.17857-1.9643,0.98214-1.0714,0.80358-1.3393s-0.625-0.98214-0.80358-1.3393c-0.17857-0.35715-0.0893-1.4286-0.0893-1.4286l2.2321-1.1607,3.125-0.35714,2.4107-1.1607,3.4821-2.4107,1.7857-0.625s1.4286,0.0893,1.875,0.26786c0.44643,0.17857,2.4107,0.53571,2.5893,0.17857,0.17857-0.35714,1.6071-1.9643,2.0536-2.3214,0.44643-0.35714,2.6786-2.1429,2.6786-2.1429l1.4286-1.1607s0.98215-1.25,1.4286-1.5179c0.44643-0.26786,1.875-1.0714,2.4107-1.0714,0.53571,0,0.98214,0,1.3393-0.26785,0.35715-0.26786,1.1607-1.25,1.3393-1.6072,0.17857-0.35714,1.0714-0.80357,1.6071-0.89285,0.53572-0.0893,5-1.3393,5-1.3393l2.6786-1.5179s1.875-1.5178,2.0536-1.875c0.17857-0.35714,1.6071-2.8571,1.6071-2.8571l0.98214-1.875s-0.26786-1.4286-0.71428-1.7857c-0.44643-0.35715-2.1429-1.6072-2.1429-1.6072l-2.5-1.25s-1.25-0.80357-1.1607-1.6071c0.0893-0.80357,7.5-5.625,7.5-5.625s0.98215-1.6964,1.0714-2.0536c0.0893-0.35714,0.89286-1.9643,1.25-2.3214,0.35715-0.35714,2.5-2.0536,2.5-2.0536s1.4286-0.625,1.875-0.71429c0.44643-0.0893,3.5714-1.5178,3.5714-1.5178l1.25-0.98215s0.44643-2.0536,0.44643-2.5893c0-0.53572-0.80357-3.8393-0.80357-3.8393s-1.0714-0.53571-1.4286-0.89285c-0.35715-0.35715-1.25-0.80358-2.1429-0.80358-0.89286,0-2.6786,0-3.125-0.625-0.44643-0.625-1.3393-1.25-1.6964-1.875-0.35714-0.625-1.1607-1.7857-1.25-2.2321-0.0893-0.44643-0.80357-2.4107-0.98214-2.7679-0.17857-0.35714-1.0714-2.3214-1.0714-2.3214l-2.0536-3.5714-1.0714-2.7679,0.26786-2.0536,1.0714-0.625,0.80357-1.25,1.4286-1.875,0.625-0.98214-2.3214-1.25s-1.875,0.44642-2.2321,0.71428c-0.35715,0.26786-0.98215,1.3393-0.98215,1.3393s0.35715,0.625,0,0.80357c-0.35714,0.17857-2.3214,0.44643-2.3214,0.44643l-1.25,0.89285-0.71429,1.9643v1.6071l-0.98214,0.98215-2.0536,1.0714-1.3393,0.98215-1.1607,1.3393s-1.6964,0.0893-2.0536,0.0893c-0.35714,0-2.0536-0.625-2.0536-0.625l-2.6786,0.17857-2.3214-0.0893-1.9643-1.4286-1.4286,0.26786-2.0536-0.35714s-0.80357-0.71429-1.1607-0.71429c-0.35714,0-2.1429,0.625-2.1429,0.625l-1.5178,1.3393-0.98215,1.0714-2.6786,0.26785-1.9643-0.0893-2.3214,0.44643-2.2322,1.1607-3.3928,1.7857-2.3214,0.98215-1.3393,0.89285-0.89285,1.1607s-0.0893,0.35714,0.0893,0.71428c0.17857,0.35715,0.98214,1.4286,0.98214,1.4286l1.6072,0.80357,0.98214,0.89285,0.83,0.91,0.0893,1.1607-1.6071,2.1428-0.35714,2.2322-0.35715,1.875v2.6786l0.80358,1.6071,1.1607,1.4286s0.26786-0.44643,0.71429-0.80357c0.44642-0.35714,1.1607-2.3214,1.1607-2.3214v-2.0536l0.0893-2.0536,0.98214-1.875,1.6964-1.25,1.1607-0.17857,0.89286,1.1607s-0.0893,1.25-0.26786,1.6964c-0.17857,0.44643-0.53571,0.98214-0.35714,1.3393,0.17857,0.35714,0.89286,1.4286,0.89286,1.4286l-0.17858,2.7678s-0.35714,2.3214-0.35714,2.6786c0,0.35714-0.26786,2.5893-0.26786,3.0357v2.5893c0,0.89285,0,1.5178,0.0893,2.1428s0.0893,1.6964-0.0893,2.1429c-0.17857,0.44643-0.44642,1.25-0.71428,1.9643-0.26786,0.71428-0.35714,1.25-0.44643,1.9643-0.0893,0.71429-1.0714,1.6964-1.0714,1.6964s-0.71428,0.26786-0.98214-0.625-1.6071-0.98214-1.6071-0.98214-0.71429,0.44642-1.0714,0.98214c-0.35715,0.53571-0.89286,1.25-0.35715,1.6964,0.53572,0.44643,1.5179,1.6071,1.5179,1.6071s0.625,0.35714,0.26786,1.1607c-0.35714,0.80358-1.1607,1.0714-1.6964,1.4286-0.53571,0.35714-1.5179,0.89285-1.6964,1.25-0.17857,0.35714-0.71428,1.4286-0.71428,1.7857,0,0.35714-0.44643,2.0536-0.44643,2.0536l-1.3393,0.98214-1.875,1.3393s-2.2321,0.71429-2.6786,0.98214c-0.44643,0.26786-2.5,1.4286-2.8571,1.7857-0.35715,0.35714-0.53572,1.25-1.4286,1.6071-0.89286,0.35714-3.125,1.3393-3.125,1.3393l-0.98215,0.26785s-0.35714,0.80357-0.35714,1.1607c0,0.35714-0.26786,2.2321-0.26786,2.7678,0,0.53572-0.26785,0.98215-0.625,1.6964-0.35714,0.71429-0.98214,1.6964-1.6071,1.7857-0.625,0.0893-2.7679,0.71428-3.2143,0.89285-0.44642,0.17858-2.5,0.89286-3.0357,0.98215-0.53571,0.0893-2.8571,1.0714-2.8571,1.0714l-0.71429,0.80357-1.5179,1.1607-2.0536,0.71429-1.4286,0.80357-1.6964-1.0714-0.35714-0.98214-0.44643-1.25s-0.35714-0.35715-1.25-0.26786c-0.89286,0.0893-2.0536,0.44643-2.0536,0.44643s-1.3393-1.4286-1.6071-1.875c-0.26786-0.44643-1.875-3.125-1.875-3.125l-1.54-1.99-1.34-1.61s-1.1607-0.71429-1.6964-0.71429c-0.53571,0-2.6786-0.17857-3.0357-0.17857-0.35715,0-1.6072-0.89285-1.7857-1.1607-0.17857-0.26786-3.4821-4.2857-3.4821-4.2857l-1.875-0.89285-2.8571-1.9643-1.9643-2.2321-1.0714-1.6964-0.89286-0.625s-0.89285-0.26786-1.25,0.0893c-0.35714,0.35714-0.80357,0.53571-1.3393,0.89285-0.53572,0.35715-1.875,1.4286-1.875,1.4286l-1.3393,1.25-1.9643,1.1607-1.4286,0.89286s-0.89286,1.0714-0.98215,1.6071c-0.0893,0.53571-0.26785,1.1607-0.26785,2.0536,0,0.89286-0.35715,3.3036-0.35715,3.3036z",
                            "name": "Республика Бурятия",
                            "ShortName": "Республика Бурятия"
                        },
                        "zb": {
                            "path": "m618.41,500.07s1.1364,1.1364,1.6415,1.5152c0.50508,0.3788,1.6415,1.6415,2.2728,1.894,0.63134,0.25254,2.6516,1.6415,2.6516,1.6415s2.9042,1.0102,3.4093,1.0102h5.5558c1.1364,0,3.283,0.75762,3.283,0.75762s0.88388,0.63134,2.0203-0.25254c1.1364-0.88389,2.3991-1.6415,2.3991-1.6415s0.75762,0.25254,1.6415,0.63135c0.88388,0.3788,1.5152,1.2627,2.1466,1.2627,0.63135,0,3.4093-1.7678,3.4093-1.7678s2.6516-2.2728,3.1567-2.7779c0.50507-0.50508,2.5254-0.88388,3.5355-1.2627,1.0102-0.37881,5.4296-0.50508,5.4296-0.50508s1.894-1.2627,2.2728-1.894c0.37881-0.63135,1.7678-3.4093,1.894-3.9143,0.12627-0.50508,2.7779-2.3991,3.4093-2.9042,0.63135-0.50508,4.9245-2.5254,5.177-3.0305,0.25253-0.50508,2.0203-1.5152,2.0203-1.5152l3.1567,1.2627,2.9042,1.2627s2.2728,0.25254,2.9042,0.25254c0.63135,0,2.2728-0.50508,2.7779-0.88388,0.50508-0.37881,3.1567-1.7678,3.1567-1.7678s3.283,0.25254,3.7881,0.50508c0.50508,0.25253,1.7678,0.88388,2.3991,1.1364,0.63135,0.25254,3.9144,1.389,3.9144,1.389s3.6618,0.3788,4.4194,0.25254c0.75762-0.12627,2.5254-1.7678,2.7779-2.3991,0.25254-0.63134,0.75762-2.3991,1.6415-2.9042,0.88388-0.50507,4.2932-1.5152,4.2932-1.5152s1.389-0.12627,1.5152-1.6415c0.12627-1.5152,0.37881-2.9042-0.25254-3.5355-0.63135-0.63134-1.389-0.88388-1.7678-1.7678-0.3788-0.88389,0.88389-8.9651,0.88389-8.9651l1.6415-3.7881,1.2627-4.2932s1.389-2.2728,1.2627-2.9042c-0.12627-0.63134-0.37881-3.9143-0.37881-3.9143l-1-2.41s-1.1364-0.88388-1.5152-1.389c-0.37881-0.50507-1.0102-0.37881-1.5152-1.0102-0.50508-0.63135-1.7678-1.1364-1.7678-1.7678,0-0.63134-0.25254-1.5152,0.37881-2.0203,0.63134-0.50508,3.0305-3.0305,3.7881-3.4093,0.75761-0.37881,4.5457-2.5254,4.9245-3.0305,0.37881-0.50507,1.389-1.6415,1.7678-2.1466,0.37881-0.50508,0.88388-0.50508,0.63135-1.6415-0.25254-1.1364-2.6516-3.5355-2.6516-3.5355s-0.63135-0.88389-1.5152-0.88389c-0.88389,0-3.1567-0.3788-3.1567-1.0102,0-0.63134-0.37881-1.2627-0.12627-2.0203,0.25254-0.75762,2.0203-2.2728,2.2728-2.9042,0.25254-0.63135,0.37881-1.894,0.37881-1.894l-2.3991-1.6415-2.6516,0.12627s-0.25254-0.25253-0.25254-0.88388c0-0.63134,0.63135-2.7779,0.88388-3.283,0.25254-0.50507,0.50508-1.5152,0.63135-2.1466,0.12627-0.63134-0.25254-1.7678-0.75761-2.3991-0.50508-0.63135-1.5152-1.389-1.5152-1.389s-1.1364-0.50508-1.6415,0.12627c-0.50508,0.63134-1.1364,1.5152-1.1364,1.5152s-1.1364,0.12627-1.6415-0.25254c-0.50508-0.37881-0.88388-4.1669-0.88388-4.1669s-0.88389-1.2627-1.6415-1.389c-0.75762-0.12627-1.6415-0.12627-2.1466,0.50508-0.50507,0.63134-1.0102,1.0102-1.7678,1.5152-0.75762,0.50508-1.2627,1.1364-1.894,0.75762-0.63134-0.37881-1.389-0.75762-1.2627-1.389,0.12627-0.63135,0.75761-1.6415,0.88388-2.1466,0.12627-0.50507-1.7678-2.1466-1.7678-2.1466l-3.283-0.12627-1.1364-1.1364c-0.12627-0.75761,0.25254-2.5254,0.25254-2.5254l-1.389-1.5152-2.7779-4.0406-1.2627-1.894-3.1567-0.3788-1.1364-2.0203-0.25254-2.9042-1.2627-0.3788h-1.2627l-1.6415,0.63134-1.6415-1.0102-3.0304-0.63135-1.894,0.75762-0.37881,1.0102-0.12627,1.894,0.37881,1.894-0.25254,1.5152-0.50507,2.0203,0.75761,2.0203,0.50508,1.389,1.7678,1.5152,0.88389,0.88388,0.25254,1.894s-0.25254,1.0102-0.75762,1.389c-0.50507,0.37881-3.0305,1.2627-3.0305,1.2627s-2.3991,0.63134-2.9042,0.75761c-0.50508,0.12627-3.4093,0.75762-3.4093,0.75762l-1.389,1.5152-0.25254,1.6415,0.75762,2.5254,1.7678,3.283,1.6415,3.7881,0.75762,2.9042,2.0203,2.2728,1.2627,1.1364,2.1466,0.25254,2.2728,0.50507,1.7678,1.389,0.50507,1.6415,0.12627,1.894v2.3991l-1.894,1.6415-3.0305,1.2627-2.5254,1.2627-2.1466,2.0203-1.0102,1.7678-0.75761,2.1466-2.6516,1.6415-1.894,1.389-2.0203,1.5152-0.88388,0.88388v0.75762l0.88388,0.88388c0.50508,0.12627,2.1466,1.2627,2.1466,1.2627l1.894,1.0102s0.75762,0.88389,0.88389,1.389c0.12627,0.50508,0,1.5152-0.12627,2.1466-0.12627,0.63134-2.0203,3.6618-2.0203,3.6618l-1.894,1.6415-3.6618,2.0203-3.1567,0.63135-2.1466,1.0102s-0.75761,0.37881-1.1364,1.0102c-0.3788,0.63135-1.6415,1.2627-1.6415,1.2627l-2.2728,0.50507-1.0102,0.88388s-1.2627,0.88389-1.6415,1.389c-0.37881,0.50508-3.5355,2.9042-3.5355,2.9042l-0.88389,1.389s-0.75761,1.1364-1.389,1.2627c-0.63134,0.12627-2.2728,0.12627-2.2728,0.12627l-2.3991-0.88388-1.6415,1.389s-1.6415,0.37881-2.1466,0.88388c-0.50508,0.50508-2.7779,1.7678-2.7779,1.7678l-2.3991,0.63134s-1.894-0.25253-2.5254,0.12627c-0.63134,0.37881-1.2627,1.5152-1.2627,1.5152l0.63135,1.5152,0.25254,0.88388-0.88389,1.894s-1.0102,0.75762-1.0102,1.2627-0.88388,2.0203-0.88388,2.0203-0.50508,0.88388,0.25253,1.389c0.75762,0.50507,2.5254,0.88388,2.5254,0.88388s1.389-0.12627,1.5152,0.50508c0.12627,0.63134-1.1364,1.6415-1.1364,1.6415l-2.6516,0.75762-2.0203,1.2627-0.88389,1.6415z",
                            "name": "Забайкальский край",
                            "ShortName": "Забайкальский край"
                        },
                        "am": {
                            "path": "m692.32,397.46,4.6429-0.17857,2.3214-0.17858,3.5714-1.7857,2.6786,0.35714,3.5714,1.0714,2.1429,1.0714,2.6786,0.53571,4.4643-0.53571,3.0357,0,2.3214,0.53571,2.8571,2.1429,2.1429,0.89286,2.8571,0.35714,2.3214-1.7857,2.3214-0.71429,1.9643,0,2.1429,1.4286,2.1429,0.71429,2.5-0.71429,1.7857-1.9643,1.7857-1.25,4.1072,0,2.5-1.4286,2.1428-0.89286,3.75,0,1.4286,0,1.25-0.71429,0.53571-2.5,1.6071-1.0714,4.2857-2.3214,2.3214-0.89286,3.5714-1.9643,2.8572-1.4286,5-0.89286,3.0357,0,1.6071,1.4286l-0.37,3.2s-1.25,1.6071-1.9643,2.6786c-0.71429,1.0714-1.6072,2.6786-1.9643,3.3929-0.35714,0.71429-1.25,2.1429-1.25,2.1429s-0.53571,2.8571-0.71429,3.5714c-0.17857,0.71428-1.0714,2.8571-1.0714,2.8571s-1.25,1.7857-1.0714,2.5c0.17857,0.71428,1.25,1.25,1.25,1.25l0.89285,0.71428,3.2143-0.71428s1.7857-0.17857,2.6786-0.17857c0.89286,0,2.5,0.89285,2.5,0.89285l0.53572,1.9643,0.89285,2.6786s0.17857,0.53572,1.6072,0.53572,2.6786-1.4286,2.6786-1.4286l0.17857-2.3214s1.0714-0.89286,1.9643-0.89286c0.89286,0,2.5-0.53572,2.5-0.53572l1.25-2.1428,0.35715-2.5,1.9643-1.7857,2.3214,0.17857c0.71,0.19,3.03-1.6,3.03-1.6l1.4286-1.4286s0.89285-1.0714,1.9643-0.35714c1.0714,0.71428,2.3214,2.5,2.3214,2.5v2.8571l0.53572,1.6071,1.9643,1.7857s1.6071,0.71428,1.25,1.6071c-0.35714,0.89286-2.8571,1.9643-3.5714,1.9643-0.71428,0-3.5714,0.89285-3.5714,0.89285l-1.6071,0.17857-1.96,0.89s-0.71429,0.17857-0.17858,1.0714c0.53572,0.89286,1.9643,1.7857,1.9643,1.7857l1.25,0.89286,0.35714,1.9643-3.2143,2.3214-1.6072,3.0357-0.17857,2.1429-1.6071,2.3214-2.6786,0.89285-1.6071,1.4286,1.9643,1.9643,0.35714,1.7857-2.3214,2.3214-1.25,3.5714,1.6071,2.8571s3.5714,1.4286,4.2857,1.6072c0.71429,0.17857,4.8214,0.71428,4.8214,0.71428s1.4286,0.71429,1.9643,1.25c0.53571,0.53572,0.71428,3.2143,0.71428,3.2143l0.35715,2.5s0,0.53571,0.71428,1.0714c0.71429,0.53571,0,3.5714,0,3.5714l-0.71428,2.8571-0.53572,1.7857-1.25,1.7857-3.2143,0.35714-4.1072-0.17857-2.8571-1.4286-1.77-0.53-3.04,1.07h-3.3929-2.5l-3.2143,0.89286s-2.6786-0.35714-3.5714-0.53572c-0.89286-0.17857-3.5714-2.1428-3.5714-2.1428l-3.22-2.67-1.07-2.15-1.43-2.14-1.7857-1.0714-1.0714-1.9643s0-1.0714-0.71428-1.6072c-0.71429-0.53571-2.6786-0.71428-2.6786-0.71428l-0.89286-1.25-1.7857-2.8571-1.9643-2.5s-1.25-1.4286-1.9643-1.6072c-0.72-0.18-1.79-0.36-2.15-1.43-0.35715-1.0714-2.3214-2.6786-2.3214-2.6786l-2.8572-1.4286-2.6786-1.4286-3.0357-0.17857-2.6786-0.17858s-0.71429,0.89286-1.6072,1.0714c-0.89285,0.17857-4.4643-0.35714-4.4643-0.35714l-3.5714-1.25-2.3214,0.35714-1.9643,0.89286-1.6072,1.4286-3.75,0.71429s-3.2143,0.71428-3.3928,0c-0.17858-0.71429-2.8572-4.1072-2.8572-4.1072l-1.7857-1.4286h-1.6071l-1.0714-1.0714v-2.1428l2.1428-2.1429,0.17858-1.4286-0.89286-1.4286-1.25-0.89286-2.1429-0.17857s-0.71428,1.0714-0.71428,0,0.71428-3.3929,0.71428-3.3929l0.89286-2.3214-0.35714-1.9643-1.25-1.7857-1.7857-0.71428-1.25,0.71428-1.25,0.71429-1.25-0.17857s-0.35714-0.71429-0.35714-1.4286c0-0.71429-1.25-2.6786-1.25-2.6786l-0.71429-0.71428-1.7857-0.17857-0.89286,0.89285-1.4286,0.89286-2.5,0.53572s-0.35714-0.35715-0.17857-1.0714c0.17857-0.71429,0.71428-2.5,0.71428-2.5l-1.25-1.4286-0.51-0.52-1.79-0.18h-2.1429l-0.35714-1.0714v-2.1429z",
                            "name": "Амурская область",
                            "ShortName": "Амурская область"
                        },
                        "ch": {
                            "path": "M906.72,53.094c-0.34,0-0.66,0.094-0.66,0.094l-1.78,2.124-4.47,1.969s-6.05,2.853-7.12,3.031c-1.07,0.179-1.44,1.969-1.44,1.969s0.37,2.514,0.19,3.407c-0.18,0.892-1.44,1.406-1.44,1.406s-2.32,1.428-2.5,2.5c-0.18,1.071,0.91,2.156,0.91,2.156s2.66,0.906,3.37,0.906c0.72,0,2.85-0.375,3.56-0.375,0.72,0-0.34,1.625-0.34,1.625l-0.91,1.782-2.31-0.907-3.03-0.719s-2.14,0.554-3.03,0.376c-0.89-0.179-2.31-1.438-2.31-1.438l-2.69,0.531-2.88,0.375h-1.06s-0.53,2.656-1.25,2.656c-0.71,0-2.12,1.782-2.12,1.782l-3.41,0.187-2.84,2.875s-2.86,2.496-3.75,3.032c-0.9,0.535-1.61,0.531-2.5,0.531-0.9,0-2.5,1.062-2.5,1.062l-4.85,3.219-5.15,1.062-3.07,0.907s-1.04,2.861-1.93,3.219c-0.9,0.357-2.88,1.968-2.88,1.968l-3.22,1.938-2.12,1.966-2.16,3.03-1.25,1.97-1.06,2.5v3.22s-0.91,0.72-1.63,0.72c-0.71,0-2.84,1.25-2.84,1.25s-0.9,2.51-1.44,3.41c-0.53,0.89-2.85,1.76-3.56,2.12s0.34,1.25,0.34,1.25l2.35,0.53,0.53,2.16,2.69,0.53h2.65,3.75s1.44,1.07,1.97,1.78c0.54,0.72,1.63,1.78,1.63,1.78l-1.82,2.5-2.5,1.1-2.31-0.72s-1.6,1.25-2.31,1.25c-0.72,0-2.16,1.59-2.16,1.59s-1.42-0.71-2.31-1.25c-0.89-0.53-1.96,0-3.03,0s-1.26,1.26-1.44,1.97-0.87,2.84-0.87,2.84-1.09,1.79-1.63,2.5c-0.53,0.72-2.66,2.69-3.37,3.22-0.72,0.54-1.81,0.54-4.13,0.72s-1.07,1.26-1.25,2.16c-0.18,0.89-1.06,3.03-1.06,3.03s-2.15,1.24-2.69,2.31c-0.53,1.07-0.53,2.67-0.53,3.56,0,0.9,0.53,1.82,0.53,1.82h1.06l0.19-0.72,0.19-1.97,0.72-1.06,0.72,0.53,3.9,1.59,5,3.41,0.38,0.87-0.38,5.19-1.06,2.84-4.09,4.47-2.88,3.94-0.34,2.5,1.25,0.19h1.59s-0.17,1.42-0.53,2.31,0.34,1.59,0.34,1.59l2.88,1.25,3.75,0.38,4.62-0.19,2.69,3.41,2.16,1.78h4.47c1.25,0,1.06,2.5,1.06,2.5l1.06,1.59,3.94-0.34s5.36-1.44,6.25-1.44,3.2-0.53,3.56-1.25c0.36-0.71,2.69-1.59,2.69-1.59l1.97-0.91h3.75s2.66-1.24,3.37-1.59c0.72-0.36,0.74-1.98,1.1-2.69,0.35-0.71,0.87-3.03,0.87-3.03l1.25-2.5h1.63l1.78-1.06,1.06-1.63,1.44-0.34,2.31-1.44,1.06-1.25s0.91-0.89,1.63-1.78c0.71-0.89,0.87-1.6,1.4-2.31,0.54-0.72,2.51-1.44,3.22-1.97,0.72-0.54,2.15-2.14,2.5-3.03,0.36-0.9,1.63,0,1.63,0l4.09,0.68s3.22-1.04,5.72-1.93c2.5-0.9,1.08,1.06,0.91,1.78-0.18,0.71,0,3.2,0,4.09s0.88,3.22,1.78,4.47c0.89,1.25,3.9-1.44,3.9-1.44s3.05-1.78,3.94-2.5c0.89-0.71,3.94,0,3.94,0h6.06v-2.84c0-0.72,1.43-3.23,1.97-4.13,0.54-0.89,1.25-3.56,1.25-3.56l0.72-2.5-0.19-4.81s1.79-1.97,3.22-1.97,2.69,1.59,2.69,1.59l4.28,0.91,1.44-0.53s-0.19-3.22-0.19-3.94c0-0.71-0.19-2.84-0.19-2.84l-0.53-3.22s-0.54-2.51-0.72-3.41c-0.18-0.89-0.87-2.12-0.87-2.12l-2.5-1.63,1.25-0.87,4.09-0.38s1.96-2.66,2.5-3.37c0.54-0.72,2.84-2.35,2.84-2.35v-2.5s-1.04-2.13-1.93-3.03c-0.9-0.89-2.35,0.18-3.07,0.53-0.71,0.36-3.03-0.34-3.03-0.34s-1.41-0.88-2.12-0.34c-0.72,0.53-1.63,1.06-1.63,1.06l-1.4-1.06-1.97,1.78-1.44-0.72s-2.84-1.79-4.09-1.25c-1.25,0.53-1.97-0.72-1.97-0.72h-2.5s-0.56,1.25-1.1,1.97c-0.53,0.71-3.03,0.87-3.03,0.87l-2.84,0.91-2.69,3.75-2.69,0.53,1.25-2.5,0.19-1.59-3.03-0.38s2.13-0.88,2.84-1.06c0.72-0.18,3.41-1.06,3.41-1.06l1.97-0.91,0.34-1.59s1.78-3.41,1.78-4.13c0-0.71-0.68-3.22-0.68-3.22l-0.91-2.31s-2.5-4.63-3.22-5.34c-0.71-0.72-1.05-1.78-2.12-1.78-1.08,0-3.07,0.68-3.07,0.68l-1.4,0.91-1.25-1.06s-2.17-1.98-3.6-2.159c-1.42-0.178,0.38-0.719,0.38-0.719l0.87-1.593s-0.16-1.973,0.38-2.688c0.53-0.714,1.97,1.25,1.97,1.25s2.67,1.438,3.56,1.438,1.78,0.531,1.78,0.531,3.41-0.371,4.13-0.906c0.71-0.536,0.68-2.313,0.68-2.313l0.19-2.687,0.72-1.25,1.25-1.782s0.36-1.964,1.25-2.5c0.89-0.535,1.79,0,2.69,0,0.89,0,2.31,1.626,2.31,1.626l1.59,0.718,2.5-1.437s1.28-2.139,1.82-3.031c0.53-0.893,2.84-1.782,2.84-1.782l2.84-2.156,1.44-3.219s2.14-1.973,2.5-2.687c0.36-0.715-0.34-1.782-1.59-1.782h-1.78l-1.82-1.062-1.93-0.188-3.07-1.781-3.18-0.187h-3.75c-0.9,0,0-0.875,0-0.875l2.5-1.625,0.68-2.5-1.06-1.25-2.5-0.532,1.78-1.25,0.53-1.25-2.31-0.531v-2.5s-0.35-1.785-0.53-2.5c-0.09-0.357-0.45-0.437-0.78-0.437zm-77.19,16.062c-0.22-0.01-0.48,0.081-0.78,0.282-1.61,1.071-3.94,2.312-3.94,2.312-1.07,0.357-1.79,1.42-1.97,2.312-0.17,0.893-0.53,2.88-0.53,3.594,0,0.715,0.2,2.496,1.1,3.032,0.89,0.535,3.03,1.598,3.03,2.312s-0.56,2.321,0.15,2.5c0.72,0.179,1.44-0.522,1.97-1.594,0.54-1.071,0.36-3.419,0.72-4.312s1.45-2.491,1.63-3.563c0.17-1.071-0.19-5.187-0.19-5.187s-0.24-1.644-1.19-1.688z",
                            "name": "Чукотский автономный округ",
                            "ShortName": "Чукотский АО"
                        },
                        "ha": {
                            "path": "m809.82,276.93c0.53572-0.71428,1.4286-1.4286,1.9643-2.3214,0.53571-0.89285,1.7857-2.5,1.7857-2.5s1.7857-0.17857,4.1072,0.17858c2.3214,0.35714,4.4643,1.4286,5.7143,2.1428,1.25,0.71429,2.6786,1.25,3.0357,2.3214,0.35714,1.0714,1.6071,2.1429,1.6071,3.3929s-1.4286,3.5714-1.4286,4.2857c0,0.71429-0.17857,2.5,0.71428,3.3929,0.89286,0.89286,0.71429,1.6071,1.7857,1.4286,1.0714-0.17857,3.9286-1.0714,5-1.25,1.0714-0.17857,3.3929,0,5,0.53572,1.6071,0.53571,2.8571,0.89285,3.2143,1.6071,0.35715,0.71428,1.0714,1.4286,0.89286,2.5-0.17857,1.0714-2.5,2.8571-2.5,2.8571l0.17857,1.4286,0.89286,1.6072s1.6071,0.71428-0.35714,0.89285c-1.9643,0.17857-3.0357-0.71428-3.0357-0.71428s0.17857-0.17857,0-1.0714c-0.17857-0.89286-0.71428-1.7857-1.7857-1.4286-1.0714,0.35714-2.3214,1.9643-3.0357,2.5-0.71428,0.53571-2.8571,3.0357-2.8571,3.0357s-1.9643,0.71429-2.8571,1.7857c-0.89286,1.0714-4.1071,4.6428-4.1071,4.6428s-0.17858,1.25-1.0714,2.5c-0.89286,1.25-2.3214,2.3214-2.5,3.5714-0.17857,1.25,0,4.1071,0,4.1071s1.4286,1.0714,1.6071,2.3214c0.17857,1.25-0.89286,1.9643-1.25,2.8572-0.35714,0.89285-1.4286,0.53571-1.4286,1.7857s0.17857,5.7143,0.17857,5.7143l-0.35714,4.8214-0.35715,4.1072s-1.0714,1.9643-1.25,3.2143c-0.17857,1.25-0.35714,2.6786-0.35714,3.3929,0,0.71429-0.17857,3.0357-0.17857,3.75,0,0.71429-0.71429,1.9643-0.89286,2.6786-0.17857,0.71429-1.0714,1.25-0.17857,1.9643,0.89286,0.71428,1.9643,1.9643,1.9643,1.9643l-1.7857,3.3929-0.17857,1.9643-1.7857,3.3928-1.25,3.75-0.35715,4.1072-0.71428,1.6071-3.2143,4.1071,0.35715,2.6786s2.1428,1.0714,2.8571,1.0714c0.71428,0,3.3929,0.53572,4.4643-0.17857s2.5-1.4286,3.2143-1.7857c0.71429-0.35715,1.6071-0.89286,2.8571,0.35714s2.5,4.4643,2.5,4.4643,0.17857,1.4286,1.4286,1.0714c1.25-0.35714,1.9643-2.1428,1.9643-2.1428l-1.0714-2.1429,0.53572-2.6786-0.53572-1.7857-1.6071-2.5s-1.7857-1.4286-2.5-1.4286c-0.71429,0-3.75,1.4286-3.75,1.4286s-1.9643,2.3214-1.6071,1.4286c0.35714-0.89285,1.9643-3.3928,1.9643-3.3928l1.6071-0.35715,1.25-1.7857s0.89286-0.71429,1.9643-0.71429,3.2143-1.25,3.2143-1.25,1.25-2.6786,1.0714-0.89285c-0.12,1.78-1.72,4.28-1.72,4.28l1.0714,2.1429,1.9643,2.1429,0.53572,1.7857-0.17857,2.6786,2.3214,1.4286v1.6072,2.8571l1.7857-0.71429c0.71429-0.71428,2.1429-4.2857,2.1429-4.2857l0.89285-3.2143v-2.1428s-1.6071-1.7857-0.89285-1.9643c0.71428-0.17857,4.6428-2.1429,4.6428-2.1429s2.1429-0.53571,3.0357-0.53571c0.89286,0,4.1071,0.17857,4.8214,0.35714,0.71428,0.17857,4.4643,1.6071,4.4643,1.6071s4.4643,1.25,5.1786,1.25c0.71429,0,1.9643,1.7857,1.9643,1.7857s-0.89286,1.9643,0.53571,2.8571c1.4286,0.89286,4.8214,3.0357,4.8214,3.0357l3.75,2.1428s1.4286,3.3929,1.4286,4.2857c0,0.89285-0.17857,4.6428-0.17857,5.7143,0,1.0714,0,5,0.53572,5.7143,0.53571,0.71428,1.0714,2.3214,2.1428,3.2143,1.0714,0.89286,3.2143,4.2857,3.2143,4.2857l2.5,1.25,3.0357,6.9643s1.4286,1.4286,1.6072,2.3214c0.17857,0.89286,1.6071,3.0357,1.7857,3.75,0.17857,0.71429,1.6071,5,1.7857,5.7143,0.17857,0.71428-0.53572,8.5714-0.53572,8.5714l0.53572,3.3928s0,1.25-0.89286,1.9643c-0.89286,0.71429-3.5714,1.6071-3.5714,1.6071l-1.4286,0.17857-1.4286-1.7857-0.53572-2.6786-3.0357-3.0357s-1.9643-1.25-2.6786-0.71428c-0.71429,0.53571-2.3214,1.9643-2.3214,1.9643s-0.89286,1.7857-1.25,2.5c-0.35714,0.71429-1.4286,1.25-0.89286,2.3214,0.53572,1.0714,1.9643,2.6786,1.9643,2.6786s0.35714-0.71428,2.1428-0.53571c1.79,0.18,2.14,2.68,2.14,2.68l-0.89286,3.2143s-1.9643,1.25-2.6786,1.6071c-0.71428,0.35714-2.8571,1.25-1.7857,2.1429,1.0714,0.89285,2.3214,1.25,2.3214,1.25s0.71428,1.25,0,1.9643c-0.71429,0.71429-2.3214,2.1429-2.3214,2.1429s-1.7857,0.35714-3.0357,1.25-3.2143,1.4286-4.2857,1.6071c-1.0714,0.17857-2.8571,1.25-4.1071,0s-2.1429-0.89285-2.5,0.17857c-0.35715,1.0714-1.6072,0.89286-1.7857,1.9643-0.17857,1.0714,0,2.8571,0.35715,3.5714,0.35714,0.71428,0,3.0357,0,3.0357s-2.3214,1.9643-2.5,1.25c-0.17858-0.71428,0.17857-2.3214-0.35715-3.2143-0.53571-0.89286-2.3214-2.5-2.3214-2.5s-2.8571-1.4286-1.7857-2.3214c1.0714-0.89286,2.8571-2.6786,3.2143-3.2143,0.35714-0.53571,0.35714-3.0357,0.35714-3.0357s-2.1429-0.89286-2.6786-1.7857c-0.53572-0.89285-1.0714-3.3928-1.0714-4.1071,0-0.71428-0.71429-3.3929,0.17857-3.75,0.89286-0.35714,2.8571-1.9643,2.8571-1.9643l0.53572-1.9643s-0.53572-0.35714-2.1429-0.35714c-1.6071,0-2.5-0.17857-3.9286,0.89285s-1.4286,1.0714-2.5,2.5-2.1429,2.6786-3.2143,3.2143c-1.0714,0.53571-2.6786,0.71429-2.6786,0.71429s-4.1071-0.71429-4.2857-1.4286c-0.17857-0.71428-1.6072-1.9643-2.5-1.9643-0.89286,0-2.1429,0.35714-3.2143,0.89286-1.06,0.55-1.95,0.73-2.84,0.73-0.89286,0-4.2857,1.0714-4.2857,1.0714s-2.1428,1.7857-3.2143,1.7857c-1.0714,0-2.1014,0.40945-2.28-0.66198-0.17857-1.0714-1.0823-3.4216-1.0823-3.4216l-1.5332-4.3507s-2.6677-0.69261-3.7392-0.87119c-1.0714-0.17857-3.8221-0.85138-3.8221-0.85138l-2.4892-1.1525s-2.1249-2.2078-1.7678-2.9221c0.35714-0.71428,1.7028-4.0044,2.4171-4.5401,0.71428-0.53572,1.2608-1.4069,1.2608-1.4069l-1.25-2.3214s-1.7965-1.2085-0.90368-1.7442c0.89286-0.53571,3.7608-2.0058,3.7608-2.0058l2.0906-4.0892,1.5025-3.2341,3.5498-2.6767-0.89285-1.9643-2.4171-1.7118-0.11357-1.6288,2.5306-1.1237,4.1071-0.71428,2.6786-0.89286,1.0714-1.25-0.53571-1.6071-1.986-1.47-1.0083-2.5108-0.0631-2.4477-1.47-2.0058-1.7226-0.67282-2.2583,1.7442s-1.6703,1.0823-2.3846,1.4394c-0.73,0.34-2.87,0.19-2.87,0.19l-2.3214,1.25-0.44008,2.5-0.80992,2.3214-2.5,1.0714-2.1429,0.53571-0.53571,2.4585-1.4809,1.4286-2.3431-0.17857-0.99746-2.4585-1.0714-2.5s-1.2608-0.51404-1.9751-0.69262c-0.71428-0.17857-4.4534,0.51405-4.4534,0.51405l-1.7857-0.17857-1.7857-1.25,1.9643-5.5357,0.89286-4.1072s1.25-2.3214,1.9643-3.0357c0.71428-0.71429,3.0357-5,3.0357-5l0.35714-2.6786s-0.53571-1.25-1.6071-1.6072c-1.0714-0.35714-5.3571,0.17858-5.3571,0.17858l-2.6786,0.53571s-3.3424,2.5325-4.0567,1.8182c-0.71428-0.71429-1.1219-3.9611-1.1219-3.9611s-3.0376-1.6288-3.0376-2.5217c0-0.89286,1.9662-1.5855,1.9662-1.5855s0.53571-1.0714,0.71428-2.1429c0.17857-1.0714-0.20024-2.8138-0.20024-2.8138l-2.6281-0.77741s-1.4069-0.89472-2.1212-1.0733c-0.71428-0.17857,1.1996-2.2998,1.1996-2.2998l0.89286-1.6072-0.35714-1.0714s-2.2493-0.54655-2.2493-1.2608c0-0.71429,1.6505-3.3604,1.6505-3.3604l-1.5873-1.6703-2.5415-0.82971-0.80806-1.618s0.69262-0.73594,1.5855-1.0931c0.89286-0.35714,1.0498-0.61866,1.0498-0.61866l-1.3852-0.89286v-2.4062c0-0.71429-0.074-2.3304-0.074-2.3304s-1.2718-1.1078-1.4502-2.345c-0.1894-1.3131,2.6371-1.7532,2.6371-1.7532l-0.93619-0.82972-0.49238-1.4917,0.2417-2.1339,2.7525-0.86037,2.9094-0.89285,2.4477,0.1371,0.70345-1.8922,3.2034,0.21106,2.9203,0.0108s0.35715-1.7749,0.35715-2.4892c0-0.71428-1.8705-1.618-1.4286-2.2691,0.40112-0.59101,1.5657-0.89285,2.4585-1.0714,0.89286-0.17858,3.9286-0.71429,4.1072-1.4286,0.17857-0.71428,2.5829-6.1562,2.5829-6.1562s0.96683-1.0083,1.6811-1.1869c0.71429-0.17857,3.9286-0.93432,3.9286-0.93432l-1.764-2.794-3.0051-2.8246-1.6378-4.8539-2.3214-2.1428-1.4286-1.7857v-5.3571l3.0357-6.7857-1.0714-3.2143-0.72512-5.8585,0.81889-2.85s3.5498,0.11543,4.264,0.29401c0.71428,0.17857,7.7634,0.22004,7.7634,0.22004s0.95599-4.0152,1.3131-4.7295c0.35714-0.71428,1.3871-0.826,2.28-1.0046,0.89286-0.17857,3.3495-0.62051,3.3495-0.62051l2.5433,1.1562,1.6071-1.0714z",
                            "name": "Хабаровский край",
                            "ShortName": "Хабаровский край",
                            "id": [39]
                        },
                        "eu": {
                            "path": "m811.96,462.82c0.98214,1.875,1.1607,1.875,1.875,2.5893l2.6786,2.6786s0.80357,1.1607,1.0714,1.7857c0.26786,0.625-0.0893,1.6964,0.625,1.9643,0.71429,0.26785,2.3214,0.53571,2.7679,0.625,0.44643,0.0893,1.4286,1.0714,2.3214,1.1607,0.89285,0.0893,1.6071,0.0893,2.1428-0.35714,0.53572-0.44643,1.0714-1.25,1.6964-1.7857,0.625-0.53571,2.5893-1.4286,3.125-1.6964,0.53572-0.26785,1.875-0.625,2.3214-1.0714,0.44643-0.44643,1.1607-0.98215,1.1607-2.0536s0.26785-2.7678,0.71428-3.125c0.44643-0.35714,2.9464-1.9643,3.5714-2.5,0.625-0.53571,1.6964-2.2321,2.1429-2.8571,0.44643-0.625,1.875-2.6786,2.2321-3.2143,0.35714-0.53572,2.1429-2.0536,2.1429-2.0536l2.0536-2.3214,0.98214-1.0714,2.6786-1.875,0.71429-0.80357,0.17857-1.1607,0.0893-0.35714-1.5179-0.17857-1.875-0.0893-1.6964,0.44643-1.6964,1.1607-1.3393,1.25-0.80358,1.0714-1.25,1.6072-1.4286,0.98214-1.7857,0.625s-1.25,0.17857-1.7857,0c-0.53571-0.17857-2.1428-0.71429-2.1428-0.71429l-1.4286-0.625-0.80358-0.98214-0.89285-0.625s-0.80357-0.26786-1.1607-0.17857c-0.35714,0.0893-1.7857,0.625-1.7857,0.625l-2.0536,0.71429-2.4107,0.17857s-1.0714,0.44643-1.7857,0.625c-0.71429,0.17857-2.4107,0.80357-2.4107,0.80357l-1.4286,0.89285-1.875,0.26786-0.80357,0.17857-0.35714,0.98215-0.0893,1.4286s-0.44643,1.1607-0.44643,1.5178c0,0.35715-0.53571,1.875-0.53571,1.875l-0.53571,1.1607-0.71429,1.4286z",
                            "name": "Еврейская автономная область",
                            "ShortName": "Еврейская АО"
                        },
                        "pr": {
                            "path": "m852.68,473.71c0,0.53571,0.53571,1.25,0.53571,1.25l1.4286,1.4286s0.35715,1.0714,0.44643,1.4286c0.0893,0.35714-0.625,2.0536-0.625,2.0536l-1.1607,2.7679s-0.0893,2.2321,0,2.5893c0.0893,0.35715,0.625,1.0714,0.89285,1.5179,0.26786,0.44643,0.80358,1.1607,0.80358,1.5179,0,0.35714-0.80358,1.9643-0.80358,1.9643v1.9643c0,0.44643-0.44642,1.9643-0.44642,1.9643s-0.17858,0.0893-0.17858,1.0714v2.7679c0,0.71429-0.26785,3.0357-0.35714,3.3929-0.0893,0.35714-1.9643,0.53571-2.3214,0.53571-0.35714,0-1.3393-0.98214-1.3393-0.98214s-0.98215-1.6071-1.1607-2.0536c-0.17857-0.44643-1.3393-1.5179-1.3393-1.875,0-0.35715-0.26786-1.6072-0.89286-1.7857-0.625-0.17857-1.5179,0.26786-1.5179,0.26786s-0.53571,0.89286-0.625,1.25c-0.0893,0.35714,0,0.98214-0.0893,1.4286-0.0893,0.44643-0.71429,2.5-0.71429,2.5s-0.625,0.625-1.1607,0.89286c-0.53572,0.26786-2.2322,1.0714-2.2322,1.6071,0,0.53572,1.0714,0.71429,2.1429,2.0536,1.0714,1.3393,3.125,4.6429,3.125,4.6429l2.5,4.2857,1.4286,4.9107s0.44643,1.6071,0.625,2.1429c0.17857,0.53571,0.89286,1.1607,0.98215,1.9643,0.0893,0.80357,0.53571,2.5-0.35715,2.8571-0.89285,0.35715-4.0178,1.0714-4.0178,1.0714l-0.71429,0.625,1.1607,0.71429s0.625,0.44643,1.0714,0.53571c0.44643,0.0893,0.53572,1.4286,0.98215,1.4286,0.44642,0,1.875-0.35714,2.4107-0.71428,0.53571-0.35714,1.3393-0.625,2.1429-0.625,0.80357,0,1.4286-0.44643,1.4286-1.0714,0-0.625-0.625-3.3929-0.625-3.8393,0-0.44642,1.5179-2.5893,1.5179-2.5893v-2.1429c0-0.35714-0.17858-1.4286,0.35714-1.5179,0.53571-0.0893,2.9464-0.71428,2.9464-0.71428s0-1.1607,1.0714-0.26786c1.0714,0.89286,1.5178,2.9464,1.5178,2.9464s1.875,0.35714,2.2322,0.17857c0.35714-0.17857,0.98214-0.625,1.5178-0.98214,0.53572-0.35714,2.5893-0.53572,3.3929-0.53572,0.80357,0,2.1429-0.44642,2.1429-0.44642l-0.26786-1.1607s2.0536-1.25,2.5-1.5179c0.44643-0.26785,2.2321-1.1607,2.8571-1.7857s1.5179-1.4286,1.9643-2.4107c0.44643-0.98215,1.3393-3.125,1.5179-3.4822,0.17857-0.35714,1.1607-2.5,1.4286-3.2143,0.26785-0.71429,0.89285-2.3214,1.3393-3.125,0.44643-0.80357,1.5179-2.8572,1.5179-2.8572s-0.0893-2.3214-0.0893-2.8571c0-0.53571-0.26785-1.875-0.625-2.8571-0.35714-0.98214-0.53571-1.1607-0.44642-2.1429,0.0893-0.98214,0.98214-1.6071,1.6071-2.0536,0.625-0.44643,1.0714-1.4286,1.0714-1.9643,0-0.53571-1.25-2.9464-1.25-2.9464s0.0893-1.1607,0.35714-1.6964c0.26786-0.53572,1.5179-1.7857,1.5179-1.7857l0.17857-2.9464s0.80357-2.2321,0.80357-2.6786c0-0.44643,0.26786-3.9286,0.26786-3.9286l0.89285-2.1429s0.26786-3.3928,0.26786-3.9286c0-0.53571-0.53571-5-0.53571-5.5357,0-0.53572-0.17857-4.1071-0.17857-4.7321s-0.71429-2.1429-0.71429-2.5893c0-0.44643,0.0893-2.1429,0.26786-2.5893,0.17857-0.44643,0.98214-1.9643,0.98214-1.9643s-0.0893-2.0536-0.0893-2.5893c0-0.53571,0.17858-1.6964-0.44642-1.7857s-2.3214,0.80357-2.3214,0.80357l-1.7857,0.71429-1.5178,0.17857-0.71429-0.44643-1.0714-1.4286s-0.26786-1.4286-0.26786-1.7857c0-0.35714-0.53571-1.1607-0.53571-1.1607l-1.25-1.3393-1.3393-1.3393-1.4286-0.71429-1.0714,0.17857s-0.98214,0.17858-1.0714,0.53572c-0.0893,0.35714-0.53572,0.44643-0.80358,0.80357-0.26785,0.35714-1.1607,1.3393-1.1607,1.3393l-0.53571,1.0714-0.44643,1.0714-0.80357,0.80357-0.17858,0.71429,0.35715,0.80357,0.89285,0.98214s0,0.71429,0.53572,0.80358c0.53571,0.0893,1.0714,0.0893,1.0714,0.0893h1.3393l1.25,0.625,0.71429,0.80357,0.0893,1.3393-0.26785,1.4286-0.44643,1.25-0.53572,0.71429-1.5178,0.89285-1.7857,0.89286-0.89285,0.89286,0.26785,0.80357,1.9643,0.80357,0.80357,0.98214-0.0893,0.71429-0.80357,1.0714-1.0714,1.0714-1.875,0.89286-1.7857,0.98214-3.64,1.44-1.6964,0.44643-1.9643,0.26786-0.89286-0.44643-1.25-0.71429s-0.53571-0.26786-0.89285,0c-0.35715,0.26786-0.625,0.98214-0.625,0.98214l-1.5179,1.0714-0.53571,1.6964,0.0893,1.3393s0.35714,0.71428,0.44643,1.1607c0.08,0.44,0.08,1.33,0.08,1.33l-0.0893,1.6071-0.98214,1.0714z",
                            "name": "Приморский край",
                            "ShortName": "Приморский край",
                            "id": [23]
                        },
                        "ma": {
                            "path": "m859.64,182.46s1.0714,0.71428,2.1429,1.25c1.0714,0.53571,3.0357,2.1429,3.2143,2.8571,0.17857,0.71429,0.17857,2.3214,1.0714,2.8571,0.89286,0.53572,3.5714,1.0714,3.5714,1.0714l1.9643,0.89286,1.0714,1.7857,3.0357,1.6072s0.71429,1.0714,0.17857,1.9643c-0.53571,0.89286,0,2.6786,0,2.6786l2.5-0.35714,2.8572,0.35714,1.6071,2.3214,1.9643,2.6786,2.1429,1.0714,1.9643,2.1429,1.0714,1.9643,0.17857,2.5s-0.35715,2.5,0,3.2143c0.35714,0.71429,1.0714,3.75,1.0714,3.75l1.0714,1.7857s0.53572,1.0714,0.53572,1.7857c0,0.71428-0.89286,2.1429-0.89286,2.1429l0.17857,1.7857-1.9643-0.53571-0.35715-1.9643s0.35715-0.71429-0.53571-0.35714c-0.89286,0.35714-1.7857,1.4286-1.7857,1.4286s-0.35715,0.89286-1.0714-0.53572c-0.71429-1.4286-1.7857-1.9643-1.7857-1.9643s-1.6071-0.71429-1.6071-1.9643-1.7857-2.3214-1.7857-2.3214l-1.6072-1.4286s-0.35714,1.7857-0.35714,2.5c0,0.71429,1.4286,1.4286-0.35714,1.4286s-4.1072,0.71429-4.1072,0.71429l-0.89285,1.0714-0.35715,2.6786-1.25,1.25-2.6786,2.8571-0.35714,2.3214-1.0714,1.9643,0.53572,2.3214,1.4286,1.4286s0.53571,0.71428,0.53571,1.4286v2.6786l0.17857,1.6071,1.6072,1.4286,0.17857,4.4643v4.4643l0.17857,3.0357,1.7857,2.6786,1.0714,3.0357,0.35714,0.89285,1.9643,0.35715,1.0714-1.25,1.9643-1.0714s1.6072-0.17857,2.3214-0.17857c0.71429,0,1.6072,0.89285,1.6072,0.89285l0.17857,0.89286-1.7857,1.4286-1.7857,0.71429v1.0714l-0.71429,0.89285-1.7857,0.89286-1.25,0.53571-0.53572,0.71429-0.17857,2.6786v2.3214l-0.89285,0.71429-1.7857-0.89286-0.71428,1.4286-0.53572,2.5-1.0714,1.25-3.2143,0.71429-1.25-0.17858-0.53572-1.6071,2.5-1.6071,1.25-1.9643s1.9643-1.7857,0.53572-1.7857-2.6786,1.0714-2.6786,1.0714l-0.89286,1.25-0.89286,0.53571s-0.89286,0.35714-1.7857-0.17857c-0.89286-0.53571-2.3214-0.71429-2.3214-0.71429s-1.25,0.89286-1.25,1.4286c0,0.53571,0.35714,1.4286-0.53572,1.4286-0.89285,0-3.2143,0.17857-3.2143,0.17857l-2.5,1.6071-2.5,0.89286-1.0714,2.1429,0.35714,1.7857,0.53572,1.9643,0.35714,0.89285,1.6071,1.0714s0.17857,0.89286-1.7857,0.89286h-4.4643l-1.0714,2.1429-1.0714,1.25-2.5,0.35714-2.1429-2.8571-2.6786-1.25s-1.9643-0.71429-2.6786-0.71429c-0.71429,0-3.3929,0.17857-3.3929,0.17857l-2.1429,0.89286-1.7857,0.17857-1.25-0.89286-1.0714-1.7857-0.17857-2.3214,1.25-1.9643,0.17857-2.5-2.5-3.9286-2.3214-1.4286-2.3214-1.25-2.6786-0.71428-2.6786-0.71429-2.1429,0.71429-1.0714,1.4286-1.0714,1.9643-0.89285,1.25h-1.25l-1.25-1.9643-0.17857-0.89286,1.25-0.71429,0.35714-1.4286v-1.25l-1.25-1.25-5.7143-6.7857s-0.35714-1.0714-0.35714-1.7857v-3.2143l-1.78-0.88-0.89286-0.35714-0.17857-3.0357-0.53572-1.4286-1.0714-0.35714-0.35714-1.25,1.6071-1.4286,2.1429-0.17857,1.0714-0.53572,1.0714-1.0714,2.1429-0.17857,1.9643,0.17857,0.53572-1.0714-1.25-1.9643-1.4286-1.25-0.35714-2.1429s1.25-0.53571,1.9643-0.53571c0.71428,0,3.5714-1.0714,3.5714-1.0714l-0.17858-2.6786s0.53572-0.35714,1.25-0.35714c0.71429,0,3.9286,0.35714,3.9286,0.35714l2.1428-1.7857,4.1072-6.4286-0.17858-3.0357-1.4286-1.4286-2.6786-2.8572s-1.25-0.89285-1.4286-1.6071c-0.17857-0.71428-0.35714-1.7857-0.35714-1.7857l2.1428-2.3214,0.17858-1.6071-1.25-1.25-2.5,0.17857-0.71429-0.53572-1.0714-1.0714v-0.71429l3.06-0.86,1.25-1.0714-0.53572-1.4286-1.25-0.89285-0.17857-1.6072,2.1429-3.0357,3.75-1.25,2.1428-1.25-1.25-2.5s0.17858-0.35714,0.89286-0.35714c0.71429,0,3.3929,0.71428,3.3929,0.71428l1.0714-0.17857-0.53572-3.5714v-1.6071l1.4286-0.53572,0.2-2.66-0.17858-0.53571h2.5l1.6072,0.53571,0.53571,1.9643,1.0714,1.0714s0.53571,0.53571,1.25,0.53571,3.75-0.71428,3.75-0.71428l3.5714-0.71429,2.3214-0.35714,2.6786-1.0714,2.3214-1.4286,2.3214-0.89286,1.9643-0.17857,2.8571-0.35714,2.5-1.6072z",
                            "name": "Магаданская область",
                            "ShortName": "Магаданская область"
                        },
                        "sh": {
                            "path": "M973.16,321.59c-0.45,0.19-0.81,0.37-1.19,0.94s-0.31,1.53-0.5,1.85c-0.19,0.31-1.53,1.12-1.53,1.12-0.51,0.51-0.87,1.06-2,1.25-1.14,0.19-2.59-0.23-2.85,0.66-0.25,0.88,0.06,2.12,0.69,2.25,0.63,0.12,1.53,0.44,2.1,0.25,0.56-0.19,1.56-1.25,1.56-1.25s0.62,0.3,1,0.93c0.38,0.64,0.97,1.78,0.97,2.03,0,0.26,0.19,1.06-0.07,1.57-0.25,0.5-0.81,2.78-0.56,3.03s1.24,0.9,1.94,0.9c0.69,0,1.09,0.17,1.78-0.78,0.69-0.94,0.93-1.74,1.25-2.56s0.78-1.9,1.09-2.16c0.32-0.25,0.48-1.02-0.22-1.65-0.69-0.63-0.93-1.75-1-2.06-0.06-0.32-0.56-1.09-0.24-1.53,0.31-0.45,1.12-1.31,1-1.69-0.13-0.38-1.38-1.09-1.82-1.47s-0.96-1.82-1.4-1.63zm2.15,20.44s-0.43,0.15-0.69,0.85c-0.25,0.69-0.5,1.74-0.31,2.31s0.56,1.4,0.81,1.78c0.26,0.38,0.75,1.31,0.88,1.62,0.13,0.32,0.53,0.72,1.03,0.91,0.51,0.19,1.12,0.07,1.25-0.44,0.13-0.5,0.19-1.4,0.19-2.03s-0.19-2.15-0.19-2.53,0.07-0.87-0.31-1.31-2.66-1.16-2.66-1.16zm2.53,9.22c-0.56,0.19-1.9,0.5-2.15,0.69-0.26,0.19-0.63,0.52-0.5,1.03,0.12,0.5-0.2,1.24,0.5,1.69,0.69,0.44,2.15,0.96,2.53,1.09s0.55,0.44,1.19,0.13c0.63-0.32,1.09-0.59,1.03-1.41-0.07-0.82-0.59-1.62-0.78-1.88-0.19-0.25-1.5-1.34-1.5-1.34h-0.32zm-117,4.5l-1.87,1.25s0.5,1.12,0,1.12h-1.78s-1.26,0.78-0.5,1.29c0.76,0.5,2.4,0.87,3.03,1,0.63,0.12,1.52,0.65,2.16,1.15,0.63,0.51,1.49,0.87,1.74,1.63,0.26,0.76,0.63,2.28,0.63,2.28l0.91,1.62-0.54,2.16-1.74,0.13s-0.91-1.14-1.41-0.13c-0.51,1.01-0.5,1.77-0.5,2.41,0,0.63,0.27,1.24,0.91,1.37,0.63,0.13,1.48,0.4,2.74,1.41,1.27,1.01,2.03,2.9,2.29,3.53,0.25,0.63,0.24,2.65,0.5,3.41,0.25,0.75,1.4,2.02,2.03,2.53,0.63,0.5,2.03,2.52,2.28,3.03,0.25,0.5,1.25,2.4,1.5,2.9,0.25,0.51,1.78,1.75,1.78,1.75s1.24,1.15,2,1.66,3.8,1.37,4.56,1.37,3.03,0.66,3.28,1.16c0.26,0.51,2.78,5.66,2.78,5.66l5.57,8.34s2.52,2.15,3.15,2.66c0.64,0.5,2.4,3.9,2.91,4.65,0.51,0.76,2.12,4.44,2.5,4.94,0.38,0.51,3.69,5.06,3.69,5.06s2.77,1.88,3.4,2c0.64,0.13,3.41,1.91,3.41,1.91s2.65,2.9,2.78,3.41c0.13,0.5,0.75,3.53,0.75,3.53l2.16,3.4,3.15,2.66,2.5,5.19,0.53,2.25s0,2.15,0.5,2.53c0.51,0.38,5.29,4.06,5.29,4.06l1.65,0.88,1.78,0.25v-2.54s-0.9-1.65-1.15-2.15c-0.26-0.51-0.88-3.03-0.88-3.03s-0.5-0.74-0.5-1.63c0-0.88,0.75-2.4,0.75-2.4s1.53-0.25,2.16-0.25,1.24-0.12,2.25-0.63c1.01-0.5,2.41-0.37,2.41-0.37l2.28,2,1.37,0.78s0.5-1.4,0.5-2.03c0-0.64,0.01-1.53-0.62-2.41-0.64-0.88-1.63-1.88-1.63-1.88l-2.03-1.65s-0.99-1.38-1.75-1.25-1.15,0.24-1.41,0.75c-0.25,0.5,1.52,2.66,0,2.28-1.51-0.38-2.4-0.9-2.78-1.41-0.38-0.5-1.62-1.87-1.62-1.87s-2.4-1.28-3.03-1.53c-0.64-0.26-2.4-0.88-3.04-0.88-0.63,0-4.06-1.15-4.06-1.15l-2.12-2.38-2.41-6.31s-1.12-1.65-1.25-2.41-1.03-3.15-1.16-3.65c-0.12-0.51-0.37-2.28-0.62-2.78-0.25-0.51-1-2.29-1-2.29l-0.53-3.28,1.78-1.62s2.77-1.03,3.41-1.03c0.63,0,5.06-0.13,5.06-0.13l2.4,0.63s2,0.25,2.5,0.25c0.51,0,1.03,0.51,1.16-0.5s-1.53-2-1.53-2l-3.53-0.53-3.66-1.26-2.4-1.78-18.57-15.25-1.5-1.28-1.78-0.12s-0.87,0.13-1.25-0.63-0.4-1.27-1.15-1.9c-0.76-0.64-2.5-1.88-2.5-1.88s-1.52-0.25-2.66-0.5-3.66-1.4-3.66-1.4l-0.4-2.79-1.38-1.25-0.62-1.28,1.25-1.62-0.25-1.91-2.53-2.12-3.54-0.79s-2.4-0.99-2.65-1.5c-0.25-0.5,0.12-2.15,0.12-2.15s-0.62-1.12-1.12-1.5c-0.51-0.38-4.28-1.91-4.28-1.91l-2.91-1.9-1.03-2.63s0.01-1.91-0.63-1.91c-0.63,0-2.78-0.87-2.78-0.87zm119.16,7.94c-0.88,0.25-1.53,0.4-1.72,0.97-0.19,0.56,0.06,1.24,0.31,1.43,0.26,0.19,0.84,0.69,1.47,0.57,0.63-0.13,1.56-0.19,1.82-0.57,0.25-0.38-1.13-1.46-1.32-1.78-0.19-0.31-0.56-0.62-0.56-0.62zm1.75,4.06c-0.51,0.25-1.19,0.56-1.37,1.06-0.19,0.51,0.36,1.37,1,1.75,0.63,0.38,1.05,0.63,1.56,0.06,0.5-0.56,1.09-1.62,1.03-1.93-0.06-0.32-2.22-0.94-2.22-0.94zm0.19,6.97c-0.18,0.01-0.34,0.06-0.5,0.16-0.63,0.37-0.82,1.18-0.82,1.56s0.88,3.09,0.88,3.47-0.87,2.4-1,2.9c-0.13,0.51-0.01,1.33,0.62,2.6,0,0,1.13-0.25,1.38-0.25s1.72-0.94,1.84-1.19c0.13-0.25,0.44-2.28,0.44-2.91s-0.06-2.02-0.12-2.47c-0.07-0.44-0.63-1.4-0.63-1.78s-0.31-1.43-0.69-1.69c-0.28-0.18-0.87-0.44-1.4-0.4zm-4.41,14.53s-1.28,0.03-1.53,0.16c-0.25,0.12-0.69,0.49-0.81,0.75-0.13,0.25-0.57-0.07,0.06,0.62,0.63,0.7,1.02,1.38,1.66,1.38,0.63,0,2.06,0.65,2.31,0.65s1.03-0.21,1.22-0.47c0.19-0.25,0.75-0.49,0.31-1.18-0.44-0.7-0.97-1.06-1.22-1.19s-2-0.72-2-0.72zm1.81,6.47c-0.19,0.31-1.37,1.18-1.43,1.44-0.07,0.25-0.32,0.74-0.38,1.25-0.06,0.5-0.31,1.77-0.31,2.09s-0.53,1.59-0.78,2.16c-0.26,0.56-0.5,1.49-0.44,2.12s-0.07,1.09,0.19,1.66c0.25,0.57,0.24,1.18,0.56,1.37s-0.04,1.29,1.09,0.6c1.14-0.7,1.63-1.34,1.82-1.79,0.19-0.44,0.53-2.09,0.72-2.34,0.18-0.25,0.56-1.43,0.68-1.81,0.13-0.38,0.63-1.9,0.63-2.22s0.06-1.59-0.25-2.22c-0.32-0.63-1.19-1.31-1.19-1.31l-0.91-1zm-4.9,15.4c-0.26,0.07-0.97,0.19-1.28,0.44-0.32,0.26-0.63,0.56-0.69,0.75s-0.5,0.94-0.5,1.19,0.06,1.15,0,1.41c-0.06,0.25,0,0.56-0.56,0.81-0.57,0.25-1.22,0.43-1.6,0.56s-0.81,0.44-1.06,0.69-0.94,0.72-0.94,0.72-0.53,0.18-0.53,0.5c0,0.31,0.41,0.99,0.53,1.25,0.13,0.25,0.75,1.22,0.75,1.22l-0.18,0.75s-1.04,0.74-1.1,1.06c-0.06,0.31-0.12,1.59-0.12,1.97s0.06,1.74,0.06,2c0,0.25,0.19,1.84,0.19,2.09s0.15,1.34,0.28,1.97c0.12,0.63,0.12,1.06,0.43,1.44,0.32,0.38,0.56,1.03,0.88,1.22s0.5,0.68,0.88,0.62c0.37-0.06,1.71-1.03,1.71-1.03s0.63-0.62,0.75-1.06c0.13-0.44,0.44-2.16,0.44-2.16s0.19-1.37,0.13-1.69c-0.07-0.31-0.69-0.65-0.75-1.22-0.07-0.56-0.07-0.8,0-1.68,0.06-0.89,0.87-2.09,1.06-2.35,0.19-0.25,0.84-1.18,0.97-1.93,0.12-0.76-0.07-1.84,0.19-2.16,0.25-0.32,0.8-0.75,1.06-1.06,0.25-0.32,1.06-1.65,1.18-2.03,0.13-0.38,0.13-1.4,0.13-1.91s-0.31-1.37-0.56-1.56c-0.26-0.19-1.75-0.82-1.75-0.82zm-8.35,23.69c-0.31-0.01-0.62,0-0.75,0.03-0.25,0.07-0.56,0-0.81,0.32-0.25,0.31-0.78,0.71-1.22,0.84s-0.87,0-0.93,0.31c-0.07,0.32-0.26,0.87-0.26,1.13,0,0.25,0.06,0.74,0.32,1,0.25,0.25,0.62,0.21,0.75,0.78,0.12,0.57,0.19,1.18,0.12,1.44-0.06,0.25-0.31,1.12-0.37,1.43-0.07,0.32-0.19,0.4-0.38,1.03-0.19,0.64-0.31,1.38-0.31,1.76v1.15c0,0.38-0.06,1.19,0.13,1.44,0.18,0.25,0.62,0.56,0.87,0.81s1.47,0.47,1.72,0.47,0.5-0.28,0.75-0.66,0.56-0.99,0.56-1.56-0.12-2.96-0.06-3.28,1.12-0.84,1.19-1.41c0.06-0.56,0.03-1.74,0.09-2,0.06-0.25,0.31-1.15,0.31-1.15s0.75-0.44,0.88-0.81c0.12-0.38,0.25-1.13,0.25-1.5,0-0.38-0.19-1.54-0.19-1.54h-1.84c-0.19,0-0.5-0.02-0.82-0.03zm7.85,1.88c-0.57,1.01-0.72,0.99-0.78,1.75-0.07,0.76-0.88,1.53-0.88,1.53s-0.31,0.31-0.44,0.62c-0.12,0.32-0.69,0.81-0.06,1s1.72,0.19,1.97,0.07c0.25-0.13,0.75-0.69,1-0.82,0.25-0.12,0.44-0.49,0.44-1.37,0-0.89-0.19-1.9-0.31-2.16-0.13-0.25-0.94-0.62-0.94-0.62z",
                            "name": "Сахалинская область",
                            "ShortName": "Сахалинская область"
                        },
                        "ka": {
                            "path": "M918.56,146.75l-1.65,0.84c-0.26,0.13-1.25,0.88-1.25,0.88l-0.13,1,0.13,2.78,0.25,1.16-0.88,2.43-1.72,4.69-0.93,1.56-0.44,1.41-0.06,1.81s-0.22,1.03-0.47,1.22c-0.26,0.19-0.82,0.13-0.82,0.13h-1.81-2.59l-1.6-0.19-1.68-0.31s-0.53,0.25-0.85,0.25c-0.31,0-0.68,0.56-1,0.75-0.31,0.19-1.37,0.74-1.56,1-0.19,0.25-1.28,0.78-1.59,0.9-0.32,0.13-1.38,1-1.63,1.19s-0.78,0.56-1.22,0.63c-0.44,0.06-0.94-0.32-0.94-0.32s-0.62-0.99-0.74-1.25c-0.13-0.25-0.97-1.72-0.97-1.72s-0.07-1.31-0.13-1.62c-0.06-0.32-0.06-1.47-0.12-1.72-0.07-0.25-0.13-1.06-0.13-1.06s0.25-1.22,0.31-1.66c0.07-0.44,0.38-0.75,0.38-0.75s0-0.56-0.19-0.87c-0.19-0.32-0.81,0.06-0.81,0.06l-1.75,0.44-1.97,0.81-1.66,0.5-1.18,0.19-2.04-0.25s-1.62-0.38-1.87-0.57-1.03-0.12-1.03-0.12l-0.63,0.56-0.87,1.16-0.63,0.81-0.84,0.88s-1.31,0.74-1.56,0.87c-0.26,0.13-0.94,0.59-0.94,0.59l-1.22,1.32-1.44,2.28s-2.27,2.28-2.59,2.47-1.18,0.87-1.44,1.12c-0.25,0.25-1.34,0.38-1.72,0.44s-0.74,0.62-1,0.94c-0.25,0.31-1.15,1.28-1.15,1.28l-0.81,0.56s-0.75-0.31-1.13-0.31-0.44,0.31-0.44,0.31l-0.97,1.91-1,2.18s-0.5,1.59-0.5,1.91,0.63,0.44,0.88,0.63c0.25,0.18,1.65,0.8,2.03,1.06,0.38,0.25,1,0.84,1.31,1.15,0.32,0.32,1.41,1.32,1.41,1.32s-0.13,0.43-0.06,0.68c0.06,0.26,0.37,1.15,0.68,1.66,0.32,0.51,0.94,0.81,0.94,0.81s4.09,1.16,4.35,1.28c0.25,0.13,1.09,1.32,1.09,1.32l0.37,0.68s1.13,0.85,1.44,1.04c0.32,0.18,1.22,0.31,1.22,0.31l0.62,0.62,0.44,1.19s-0.31,1.59-0.37,1.97c-0.07,0.38-0.07,0.99,0,1.37,0.06,0.38,1.12-0.06,1.12-0.06s1.4-0.31,1.97-0.25,1.56,0.25,1.56,0.25,1.22,0.4,1.35,0.66c0.12,0.25,0.75,1.18,0.75,1.18l1.15,1.5,1.25,1.72,1.85,1.32,2,1.65,1,1.31s0.84-0.99,1.03-1.31c0.19-0.31,0-0.74,0-1.19,0-0.44-0.37-0.71-0.75-0.96-0.38-0.26-0.97-1.19-1.35-1.63-0.37-0.44-0.56-0.84-0.56-0.84s-0.81-1.06-1.06-1.31c-0.25-0.26-1.09-0.94-1.34-1.19-0.26-0.26-1.25-1.34-1.69-1.97s0-0.75,0-1.06c0-0.32,0.87-1.04,0.87-1.04s0.94-1.3,1.19-1.62,0.44-1.21,0.5-1.59,0.47-1.31,0.85-1.5c0.37-0.19,1.18-0.38,1.68-0.44,0.51-0.06,1.84,0.5,1.97,0.81,0.13,0.32-0.62,0.69-0.75,0.94-0.12,0.25,0,1.59-0.06,2.16-0.06,0.56,0.12,1.71,0.12,2.28,0,0.56,0.75,1.37,0.75,1.37s1.13,1.4,1.44,1.72c0.32,0.32,1.28,0.93,1.59,1.19,0.32,0.25,1.57,1.65,1.57,1.65l3.34,2.32,0.97,0.59s0.75,1.25,0.81,1.69c0.07,0.44,0.44,0.93,0.44,0.93s1.03,0.22,1.34,0.47c0.32,0.26,0.63,1.31,0.63,1.69s-0.12,1.03-0.44,1.47c-0.31,0.44-1.21,0.93-1.53,1.25s-0.69,0.75-0.69,0.75-0.06,5.68-0.06,6.25,0.75,1.78,1,2.16,1.21,2.14,1.72,2.9c0.5,0.76,0.69,1.12,0.69,1.44s0.25,1.66,0.25,1.66,0.56,10.46,0.62,11.09,0.59,1.03,0.78,1.41,0.75,0.93,1,1.18c0.26,0.26,0.75,0.84,0.88,1.16,0.12,0.32,0.97,1.62,0.97,1.62s0.74,2.78,0.87,3.54c0.13,0.75,0.13,1.72,0.13,1.72s1.31,3.96,1.31,4.4v1.47s-0.81,1.75-1.13,2.13c-0.31,0.37-0.06,1.77-0.06,2.09,0,0.31-1.34,2.46-1.84,2.84-0.51,0.38-1.31,1-1.44,1.38s0.25,1.03,0.25,1.03l1.81,0.87,2.28,0.94s1.09,2.15,1.47,2.66c0.38,0.5,0.56,1.59,0.56,1.9,0,0.32,0.32,3.47,0.44,4.16,0.13,0.69,0.38,1.65,0.56,2.09,0.19,0.45,1.79,1.5,1.79,1.5s2.21,3.94,2.34,4.25c0.13,0.32,0.81,1.69,1.06,2,0.08,0.1,0.29,0.25,0.53,0.41,0.62,0.78,3.07,1.94,3.07,1.94l0.93,0.62s4.63,4.25,4.69,4.5c0.06,0.26,2.78,2.32,2.78,2.32s2.34,0.84,2.6,1.03c0.25,0.19,1.68,0.75,1.68,0.75l14.91,10.22,2.03,1.21,3.03,0.94s1.19,1.59,1.44,1.72,3.15,1.19,3.59,1.19c0.45,0,1.47,1,1.47,1s2.59,2.78,2.97,3.03,2.56,1.91,2.56,1.91,2.09,1.18,2.47,1.18,2.85-0.5,2.85-0.5l0.68-0.62v-2.03s-0.06-1.69-0.06-1.88,0-1.21-0.25-1.53-0.81-0.88-0.81-0.88,0.18-1.52,0.44-1.96c0.25-0.45,0.43-0.69,0.43-1.07s-0.31-1.15-0.56-1.4c-0.25-0.26-0.5-1.19-0.5-1.19s-0.06-2.34-0.31-2.66c-0.25-0.31-1.09-0.99-1.28-1.62s-0.5-1.03-0.63-1.41c-0.12-0.38-1.37-1.62-1.62-2.06-0.26-0.44-1.53-1.59-1.72-1.84-0.19-0.26-0.31-1.28-0.5-2.1s-1.02-0.75-1.78-0.75-1.12-0.06-1.38-0.25c-0.25-0.19,0.5-0.43,0.75-0.56,0.26-0.13,1.09-0.9,1.28-1.22,0.19-0.31,0.5-1.37,0.5-1.37l0.69-4.22,1.91-1.6c0.38-0.31,0.25-0.93-0.19-1.31s-1.09-0.25-1.41-0.31c-0.31-0.06-0.8-0.84-1.31-1.16-0.5-0.31-0.84-0.81-1.28-1s-1.24-0.31-2.06-0.56-1.4-1.03-1.91-1.47c-0.5-0.44-0.44-1-0.5-1.25s-0.06-1.96-0.06-2.84v-1.22s-0.97-2.78-0.97-3.1c0-0.31,0.03-1.05,0.16-1.43,0.12-0.38,0.49-0.69,0.75-0.94,0.25-0.25,1.43-0.78,1.43-0.78l1.47-0.88s0.38-1.71,0.38-2.59-0.5-2.25-0.63-2.56c-0.12-0.32-1.34-0.72-1.34-0.72s-1.5-1.19-1.94-1.19-2.46-0.56-2.9-0.69c-0.45-0.12-1.6-0.78-1.85-0.9-0.25-0.13-1.71-1.25-2.09-1.56-0.38-0.32-1.25-1.1-1.5-1.41-0.26-0.32-0.75-1.44-0.88-1.75-0.12-0.32-0.84-1.66-0.84-1.66s0-0.55-0.13-1.12c-0.12-0.57-0.18-1.65-0.18-2.41s1.02-0.62,1.28-0.62c0.25,0,1.68-0.25,2-0.32,0.31-0.06,1.03-0.74,1.22-1,0.19-0.25,0.37-1.77,0.31-2.09s-0.65-0.81-1.22-1-0.94-0.78-1.12-0.84c-0.19-0.07-2.16-0.88-2.16-0.88s-2.06-0.69-2.5-0.75-0.59,0.44-0.84,0.63c-0.26,0.19-0.5,0.37-1.32,0.37s-1.22-0.44-1.22-0.44l-0.87-1.18s-1.18,0.06-1.81,0.06c-0.64,0-0.91-0.59-1.16-0.91-0.25-0.31-1.06-0.56-1.06-0.56s-0.47-0.19-0.69-0.28c0-0.06,0.19-3.44,0.13-3.69-0.07-0.25-0.66-1.21-0.91-1.47-0.25-0.25-1.37-0.44-1.94-0.44s-1.4,0.6-1.84,0.85-1.06,0.75-1.31,0.94c-0.26,0.19-0.13,1.12-0.13,1.68,0,0.57-0.34,1.03-0.72,1.35-0.38,0.31-0.68,0.25-1.31,0.25s-1.12-0.19-1.63-0.31c-0.5-0.13-0.77-0.56-1.03-0.82-0.25-0.25-1.06-0.96-1.37-1.47-0.32-0.5-0.19-1.05-0.25-1.62-0.07-0.57-0.84-1.65-1.1-2.16-0.25-0.5-1.24-2.34-1.37-2.59s-0.56-1.28-1-1.91-0.9-1.99-1.28-2.62-0.74-1.09-1.5-2.1-0.78-0.56-1.35-0.68c-0.56-0.13-0.99-0.78-1.5-1.35-0.5-0.57-0.84-0.93-1.15-1.75-0.32-0.82-0.37-0.83-0.94-2.15-0.57-1.33-0.07-1.09,0.19-1.66,0.25-0.57,1.06-0.62,1.06-0.62l0.47-0.88s-0.38-1.59-0.31-2.09c0.06-0.51,0.36-0.56,1.06-0.75,0.69-0.19,1.56,0.75,1.94,0.75s1.59-0.5,1.9-0.82c0.32-0.31,0.32-1.08,0.32-1.71,0-0.64-0.62-1-1.13-1.13s-0.94-0.56-0.94-1.06c0-0.51,0.25-1.21,0.25-1.91,0-0.69,0-0.74-0.06-1.25-0.06-0.5-0.12-0.53-0.25-0.91-0.13-0.37,0.06-1.18,0.19-1.68,0.12-0.51,0.56-0.44,0.94-0.38,0.37,0.07,1.24,0.69,1.62,0.94s0.65,0.62,0.84,1,1,1.09,1.63,1.16c0.63,0.06,1.15-0.38,1.15-0.38s-0.09-0.52-0.34-1.09-0.81-1.44-1-1.81c-0.19-0.38-0.5-1.22-0.75-1.6s-0.44-0.5-0.44-0.75,0.69-2.09,0.69-2.41v-3.78c0-0.82,0.19-1.4,0.38-1.72,0.19-0.31,0.87-1.24,1.25-2.06s0.84-1.15,1.09-1.9c0.25-0.76,0.87-1.4,1.44-2.16s0.77-1,1.15-1.12c0.38-0.13,2.91,0.06,3.29,0.06,0.37,0,1.96-0.44,2.65-0.56,0.7-0.13,2.71-0.31,3.41-0.57,0.69-0.25,0.25-0.59,0.18-0.84-0.06-0.25-1.27-0.94-1.65-1.06-0.38-0.13-1.12-0.69-1.38-0.94-0.25-0.25-0.5-1.16-0.5-1.16s-0.59-2.96-0.65-3.28c-0.07-0.31-0.75-1.56-0.75-1.56s-0.13-5.18-0.13-5.63c0-0.44-0.68-2.02-1.37-2.34-0.7-0.32-0.91-0.99-0.91-1.5s0-0.96-0.12-1.59c-0.13-0.64-0.75-1.37-1-1.88-0.26-0.5,0.12-0.78,0.12-1.22s-0.12-1.18-0.5-1.5c-0.38-0.31-0.68-0.49-0.94-0.75-0.25-0.25-0.46-0.9-0.46-1.53s0.28-1,0.34-1.31c0.06-0.32,0.06-1.09-0.06-1.53-0.13-0.44-0.35-1.06-0.41-1.31-0.06-0.26-0.37-1.22-0.37-1.22s-0.5-0.44-0.69-0.44-0.94-0.19-0.94-0.19l-1.78-0.31s-1.69-0.44-1.81-0.69c-0.13-0.25-1.04-0.69-1.04-0.69l-1.56-0.59zm7.25,70.22c-0.88,0.44-1.12,0.43-1.06,1s0.37,1.09,0.63,1.47c0.25,0.38,0.44,0.93,0,1.44-0.45,0.5-1.45,0.52-1.19,1.15,0.25,0.63,0.49,1.06,0.75,1.31,0.25,0.26,0.81,0.9,0.94,1.41,0.12,0.51-0.01,1.06,0.31,1.56,0.31,0.51,0.31,0.69,0.69,0.69,0.37,0,0.59,0.32,0.65-0.5s-0.06-0.95,0-2.84c0.06-1.9,0-2.84,0.06-3.41,0.07-0.57,0.26-1.37,0-1.75-0.25-0.38-1.28-0.9-1.4-1.22-0.13-0.31-0.38-0.31-0.38-0.31zm58.91,12.47c-1.07,0.71-1.16,0.62-1.16,1.15,0,0.54-0.18,0.9,0.53,0.72,0.72-0.18,0.91-0.18,1-0.62,0.09-0.45-0.37-1.25-0.37-1.25zm-10.97,4.53c-0.63,0.45-1.08,0.2-0.81,1.09,0.27,0.9,0.44,1.16,1.15,1.25,0.72,0.09,0.73,0.1,2.07,0.1s2.31,0.06,3.03,0.06c0.71,0,0.99,0.36,1.43,0,0.45-0.36,0.63-0.07,0.54-0.78-0.09-0.72-1.24-0.9-2.22-0.81-0.98,0.08-1.52,0.34-3.13-0.19-1.6-0.54-2.06-0.72-2.06-0.72z",
                            "name": "Камчатский край",
                            "ShortName": "Камчатский край"
                        },
                        "in": {
                            "path": "m63.393,395.68,0.08929,5.2679,17.946-8.5714-1.3393-1.25-2.9464-1.25-1.5179-1.9643-2.4107,2.4107-4.1071-2.6786-1.875,1.0714,0.08929,5.8929-1.5179,1.0714z",
                            "name": "Республика Ингушетия",
                            "ShortName": "Республика Ингушетия"
                        },
                        "cc": {
                            "path": "m63.482,401.04,1.0714,2.5,3.125,1.6964,3.4821,0.44642,2.1429-1.9643,2.1429,1.7857,2.5-1.5178-0.08929-1.6072,1.875-2.1428,2.8571,0.44642,3.8393-2.8571-0.625-1.9643-4.4643-0.53572,0.44643-2.7679z",
                            "name": "Чеченская Республика",
                            "ShortName": "Чеченская Республика",
                            "id": [42]
                        }
                    };



                    $scope.regionsO = {};
                    //$scope.regions = $scope.parameters.regions.lists;

                    

                    $scope.updateRegions = function(){
                        if (!$scope.regions) return;
                        $scope.regionsO = {};
                        var maxValue = 0;
                        var maxRegion = null;
                        $scope.regions.forEach(function(region){
                            $scope.regionsO[region.id] = region;
                            if (region.data && region.data.count > maxValue){
                                maxValue = region.data.count;
                                maxRegion = region;
                            }
                        });
                        // показываем маркер для региона с максимальным значением
                        if (maxRegion){
                            var items = Object.keys($scope.svgRegions)
                                .map(function(itemId){return $scope.svgRegions[itemId];})
                                .filter(function(item){return item.id && item.id.length && item.id.indexOf(maxRegion.id) >= 0;
                            });
                            if (items[0])
                                $scope.regionClick(items[0]);
                        }
                    };
                    
                    $scope.isRegionActive = function(item){
                        if (!item || !item.id || !item.id.length) return false;
                        return item.id.some(function(id){
                            return $scope.regionsO[id] && $scope.regionsO[id].selected;
                        });
                    };
                   
                    
                    $scope.getRegionClasses = function(item){
                        if (!item || !item.id || !item.id.length) return [];
                        var res = {
                            state:{},
                            styles:{}
                        };
                        item.id.forEach(function(id){
                            if ($scope.regionsO[id] && $scope.regionsO[id].selected)
                                res.state.selected = true;
                            if ($scope.regionsO[id] && $scope.regionsO[id].highlighted)
                                res.state.highlighted = true;
                        });
                        if (res.state.selected)
                            res.styles = {'fill': $scope.selectedColor || '#770000'};
                        else if (res.state.highlighted)
                            res.styles = {'fill': $scope.highlightedColor || '#007700'};
                        
                        return res;
                    };


                    
                    $scope.regionClick = function(item, event){
                        
                        if (!item || !item.id || !item.id.length) {
                            $scope.hideMarker();
                            return;
                        }

                        var newValue = !$scope.getRegionClasses(item).state.selected;
                        var regions = [];
                        item.id.forEach(function(id){
                            if ($scope.regionsO[id])
                                regions.push($scope.regionsO[id]);
                        });

                        if ($scope.markerItem == item)
                            $scope.hideMarker();
                        else {
                            $scope.markerData = {
                                //name: item.name,
                                name: item.ShortName,
                                count: 0,
                                percent: 0,
                                header: ''
                            };
                            regions.forEach(function(region){
                                $scope.markerData.count += region.data && region.data.count || 0;
                                $scope.markerData.percent += region.data && region.data.percent || 0;
                                $scope.markerData.header += (region.data && region.data.header ? ' '+region.data.header : '');
                                if ($scope.selectable !== false)
                                    region.selected = newValue;
                            });
                            if ($scope.markerData.count)
                                $scope.showMarker(item);
                            else
                                $scope.hideMarker();
                        }
                    };

                    $scope.getItemCenter = function(item){
                        var path = $scope.el[0].querySelectorAll('path[region-id="'+JSON.stringify(item.id)+'"]');
                        if (!path.length) return null;

                        function getElementCoords(element, coords) {
                            var ctm = element.getCTM(),
                                x = ctm.e + coords.x*ctm.a + coords.y*ctm.c,
                                y = ctm.f + coords.x*ctm.b + coords.y*ctm.d;
                            return {x: x, y: y};
                        }

                        var bbox = path[0].getBBox();
                        var x = bbox.x + bbox.width/2;
                        var y = bbox.y + bbox.height/2;

                        var xy = getElementCoords(path[0], {x:x, y:y});
                        //console.log(path);
                        return xy;
                    };

                    $scope.markerItem = null;
                    $scope.showMarker = function(item){
                        
                        var center = $scope.getItemCenter(item);
                        if (!center){
                            $scope.hideMarker();
                            return;
                        }
                        var markerWidth = 144;
                        var markerHeight = 204;

                        $scope.markerLeft = center.x - markerWidth/2;
                        $scope.markerTop = center.y - markerHeight;
                        $scope.markerVisible = true;
                        $scope.markerItem = item;
                    };
                    
                    $scope.hideMarker = function(){
                        $scope.markerVisible = false;
                        $scope.markerItem = null;
                    };

                    var tempMarkerItem;
                    $scope.$on('printStart', function(){
                        tempMarkerItem = $scope.markerItem;
                        $scope.hideMarker();
                    });
                    $scope.$on('printEnd', function(){
                       if (tempMarkerItem)
                           $scope.showMarker(tempMarkerItem);
                        tempMarkerItem = null;
                    });



                    $scope.highlightRegion = function(item){
                        if (!item || !item.id || !item.id.length) return;
                        //var newValue = !$scope.isRegionActive(item);
                        item.id.forEach(function(id){
                            if ($scope.regionsO[id])
                                $scope.regionsO[id].highlighted = true;
                        });
                    };
                    $scope.unhighlightRegion = function(item){
                        if (!item || !item.id || !item.id.length) return;
                        //var newValue = !$scope.isRegionActive(item);
                        item.id.forEach(function(id){
                            if ($scope.regionsO[id])
                                $scope.regionsO[id].highlighted = false;
                        });
                    };
                    
                   /* $scope.redrawChart = function(){
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
*/
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
                // .text(Format(d.value))
                .text(d.tooltip)
                //.transition().duration(200)
                //.style('opacity', 1);
                 .style('display', 'initial');

            var bbox = tooltip.node().getBBox();
            var chartW = (cfg.w + cfg.margin.left + cfg.margin.right)/2;

            if (bbox.x + bbox.width > chartW){
                newX = chartW - bbox.width - 10;
                tooltip.attr('x', newX);
                bbox = tooltip.node().getBBox();
            }

            var padding = 3;
            tooltipRect
                .attr("x", bbox.x - padding - 15 - 8)
                .attr("y", bbox.y - padding)
                .attr("width", bbox.width + (padding*2) + 15 + 8)
                .attr("height", bbox.height + (padding*2))
                .style('display', 'initial');
            tooltipColor
                .attr("x", bbox.x - 15 - 8)
                .attr("y", bbox.y + (bbox.height - 15)/2)
                .style('fill', d.tooltipColor)
                .style('display', 'initial');
        })
        .on("mouseout", function(){
            tooltip
                //.transition().duration(200)
                 // .style("opacity", 0);
                .style('display', 'none');
            tooltipColor
                .style('display', 'none');
            tooltipRect
                //.transition().duration(200)
                //.style('fill', 'rgba(0, 0, 0, 0.7)')
                .style('display', 'none');
        });

    //Set up the small tooltip for when you hover over a circle
    var tooltipRect = g.append('rect')
        .style('fill', 'rgba(0, 0, 0, 0.7)')
        .attr('rx', '2')
        .attr('ry', '2')
       // .attr('class', 'chartjs-tooltip')
        .style('display', 'none');

    var tooltipColor = g.append('rect')
        //.style('fill', 'rgba(0, 0, 0, 0.7)')
        .attr('rx', '2')
        .attr('ry', '2')
        .attr("width", 15)
        .attr("height", 15)
        .attr('stroke', 'gray')
        // .attr('class', 'chartjs-tooltip')
        .style('display', 'none');

    var tooltip = g.append("text")
        //.attr("class", "tooltip")
        //.style("opacity", 0);
        .style("fill", 'white')
        .style('font-size', '13px')
        .style('display', 'none');





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
(function(){
	"use strict";

	var root = this,
		Chart = root.Chart,
		helpers = Chart.helpers;


	var defaultConfig = {
		//Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
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
		
		// Засечки на оси Y
		showHorisontalSerifs: true,
		
		// Засечки на оси Х
		showVerticalSerifs: true,

		// не сдвигать бары в соседних датасетах
		barsInOneLine: false,

		//Boolean - If there is a stroke on each bar
		barShowStroke : true,

		//Number - Pixel width of the bar stroke
		barStrokeWidth : 2,

		//Number - Spacing between each of the X value sets
		barValueSpacing : 5,

		//Number - Spacing between data sets within X values
		barDatasetSpacing : 1,

		// ширина столбца
		barWidth: 30,

		// максимальная высота столбца
		barHeight: 100,

		//String - A legend template
		legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].fillColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"

		
	};

  Chart.HorizontalRectangle = Chart.Element.extend({
		draw : function(){

			if (!this.value) return;

			var ctx = this.ctx,
				halfHeight = this.height/2,
				top = this.y - halfHeight,
				bottom = this.y + halfHeight,
				right = this.left - (this.left - this.x),
				halfStroke = this.strokeWidth / 2;

			// Canvas doesn't allow us to stroke inside the width so we can
			// adjust the sizes to fit if we're setting a stroke on the line
			if (this.showStroke){
				top += halfStroke;
				bottom -= halfStroke;
				right += halfStroke;
			}

			ctx.beginPath();

			ctx.fillStyle = this.fillColor;
			//ctx.strokeStyle = this.strokeColor;
			ctx.lineWidth = this.strokeWidth;

			// It'd be nice to keep this class totally generic to any rectangle
			// and simply specify which border to miss out.
			ctx.moveTo(this.left, top);
  			ctx.lineTo(right, top);
  			ctx.lineTo(right, bottom);
			ctx.lineTo(this.left, bottom);
			ctx.fill();
			if (this.showStroke){
				ctx.stroke();
			}

			if (this.showLabels !== false) {
				ctx.fillStyle = "#000000";
				ctx.textAlign = (this.value < 0) ? "right" : "left";
				var dx = (this.value < 0) ? -5 : 5;
				ctx.textBaseline = "middle";// : "top";
				if (this.showLabels instanceof Function)
					ctx.fillText(this.showLabels(this.value), right + dx, this.y);
				else
					ctx.fillText(this.value, right + dx, this.y);
			}
			// if (this.label) {
			// 	ctx.fillStyle = "#000000";
			// 	ctx.textAlign = (this.value < 0) ? "right" : "left";
			// 	var dx = (this.value < 0) ? -5 : 5;
			// 	ctx.textBaseline = "middle";// : "top";
			// 	ctx.fillText(this.label, right + dx, this.y);
			// }
		},
		inRange : function(chartX,chartY){
  			return (
			((chartX >= this.left && chartX <= this.x) || (chartX <= this.left && chartX >= this.x)) 
			&& chartY >= (this.y - this.height/2) && chartY <= (this.y + this.height/2));
		}
	});

	Chart.Type.extend({
		name: "HorizontalBar",
		defaults : defaultConfig,
		initialize:  function(data){

			//Expose options as a scope variable here so we can access it in the ScaleClass
			var options = this.options;

			this.ScaleClass = Chart.Scale.extend({
				offsetGridLines : true,
				calculateBarX : function(datasetCount, datasetIndex, barIndex){
					//Reusable method for calculating the xPosition of a given bar based on datasetIndex & width of the bar
					var xWidth = this.calculateBaseWidth(),
						xAbsolute = this.calculateX(barIndex) - (xWidth/2),
						barWidth = this.calculateBarWidth(datasetCount);

					return xAbsolute + (barWidth * datasetIndex) + (datasetIndex * options.barDatasetSpacing) + barWidth/2;
				},
				calculateBaseWidth : function(){
					return (this.calculateX(1) - this.calculateX(0)) - (2*options.barValueSpacing);
				},
				// calculateBaseWidth : function(){
				// 	if (options.barWidth)
				// 		return options.barWidth;
				// 	else
				// 		return (this.calculateX(1) - this.calculateX(0)) - (2*options.barValueSpacing);
				// },
				calculateBarWidth : function(datasetCount){
					if (options.barsInOneLine) datasetCount = 1;
					//The padding between datasets is to the right of each bar, providing that there are more than 1 dataset
					var baseWidth = this.calculateBaseWidth() - ((datasetCount - 1) * options.barDatasetSpacing);

					return (baseWidth / datasetCount);
				},

				calculateBaseHeight : function(){
					if (options.barWidth)
					 		return options.barWidth;
					else
					return ((this.endPoint - this.startPoint) / this.yLabels.length) - (2*options.barValueSpacing);
				},
				calculateBarHeight : function(datasetCount){
					if (options.barWidth)
						return options.barWidth;
					if (options.barsInOneLine) datasetCount = 1;
					//The padding between datasets is to the right of each bar, providing that there are more than 1 dataset
					var baseHeight = this.calculateBaseHeight() - ((datasetCount) * options.barDatasetSpacing);

					return (baseHeight / datasetCount);
				},

				calculateXInvertXY : function(value) {
					var scalingFactor = (this.width - Math.round(this.xScalePaddingLeft) - this.xScalePaddingRight) / (this.max - this.min);
					return Math.round(this.xScalePaddingLeft) + (scalingFactor * (value - this.min));
				},

				calculateYInvertXY : function(index){
					return index * ((this.startPoint - this.endPoint) / (this.yLabels.length));
				},

				calculateBarY : function(datasetCount, datasetIndex, barIndex){
					if (options.barsInOneLine) datasetCount = 1;
					//Reusable method for calculating the yPosition of a given bar based on datasetIndex & height of the bar
					var yHeight = this.calculateBaseHeight(),
						// yAbsolute = (this.endPoint + this.calculateYInvertXY(barIndex) - (yHeight / 2)) - 5,
						yAbsolute = (this.endPoint + this.calculateYInvertXY(barIndex) - (yHeight / 2)) - options.barValueSpacing/2,
						barHeight = this.calculateBarHeight(datasetCount);
					// if (datasetCount > 1) yAbsolute = yAbsolute + (barHeight * (datasetIndex - 1)) - (datasetIndex * options.barDatasetSpacing) + barHeight/2;
					var dy = datasetIndex * barHeight + datasetIndex * options.barDatasetSpacing;
					if (datasetCount > 1 && datasetIndex > 0){
						yAbsolute -= dy
					}
					return yAbsolute;
				},

        buildCalculatedLabels : function() {
    			this.calculatedLabels = [];

    			var stepDecimalPlaces = helpers.getDecimalPlaces(this.stepValue);

    			for (var i=0; i<=this.steps; i++){
    				this.calculatedLabels.push(helpers.template(this.templateString,{value:(this.min + (i * this.stepValue)).toFixed(stepDecimalPlaces)}));
    			}
    		},

    		buildYLabels : function(){
				this.buildYLabelCounter = (typeof this.buildYLabelCounter === 'undefined') ? 0 : this.buildYLabelCounter + 1;
				this.buildCalculatedLabels();
				if(this.buildYLabelCounter === 0) this.yLabels = this.xLabels;
			  	this.xLabels = this.calculatedLabels;
				this.yLabelWidth = (this.display && this.showLabels) ? helpers.longestText(this.ctx,this.font,this.yLabels) + 10 : 0;
    		},

        calculateX : function(index){
    			var isRotated = (this.xLabelRotation > 0),
    				innerWidth = this.width - (this.xScalePaddingLeft + this.xScalePaddingRight),
    				valueWidth = innerWidth/(this.steps - ((this.offsetGridLines) ? 0 : 1)),
    				valueOffset = (valueWidth * index) + this.xScalePaddingLeft;

    			if (this.offsetGridLines){
    				valueOffset += (valueWidth/2);
    			}

    			return Math.round(valueOffset);
    		},

        draw : function(){
    			var ctx = this.ctx,
    				yLabelGap = (this.endPoint - this.startPoint) / this.yLabels.length,
    				xStart = Math.round(this.xScalePaddingLeft),
					xStop = this.width - Math.round(this.xScalePaddingRight),
					//xStart += 100;
					zeroPos = this.calculateXInvertXY(0);
				// TODO xStart - не левая граница х, а позиция нуля! Влияет на надписи по Y и черточки
    			if (this.display){

    				ctx.fillStyle = this.textColor;
    				ctx.font = this.font;
    				helpers.each(this.yLabels,function(labelString,index){
    					var yLabelCenter = this.endPoint - (yLabelGap * index),
							linePositionY = Math.round(yLabelCenter),
							drawHorizontalLine = this.showHorizontalLines;

    					yLabelCenter -= yLabelGap / 2;

    					ctx.textAlign = "right";
    					ctx.textBaseline = "middle";
    					// if (this.showLabels){
    						ctx.fillText(labelString,zeroPos - 10,yLabelCenter);
    					// }

						// if (this.showLabels !== false)
						// 	if (this.showLabels instanceof Function)
						// 		ctx.fillText(this.showLabels(labelString), zeroPos - 10,yLabelCenter);
						// 	else
						// 		ctx.fillText(labelString,zeroPos - 10,yLabelCenter);

                        if (index === 0 && !drawHorizontalLine) {
                            drawHorizontalLine = true;
                        }
                        if (drawHorizontalLine){
                            ctx.beginPath();
                        }
    					if (index > 0){
    						// This is a grid line in the centre, so drop that
    						ctx.lineWidth = this.gridLineWidth;
    						ctx.strokeStyle = this.gridLineColor;
    					} else {
    						// This is the first line on the scale
    						ctx.lineWidth = this.lineWidth;
    						ctx.strokeStyle = this.lineColor;
    					}

    					linePositionY += helpers.aliasPixel(ctx.lineWidth);

                        if(drawHorizontalLine){
                            ctx.moveTo(xStart, linePositionY);
                            ctx.lineTo(xStop, linePositionY);
                            ctx.stroke();
                            ctx.closePath();
                        }

						if (options.showHorisontalSerifs) {
							ctx.lineWidth = this.lineWidth;
							ctx.strokeStyle = this.lineColor;
							ctx.beginPath();
							ctx.moveTo(zeroPos - 2, linePositionY);
							ctx.lineTo(zeroPos + 2 + this.lineWidth, linePositionY);
							ctx.stroke();
							ctx.closePath();
						}

    				},this);

    				helpers.each(this.xLabels,function(label,index){
    					var width = this.calculateX(1) - this.calculateX(0);
    					var xPos = this.calculateX(index) + helpers.aliasPixel(this.lineWidth) - (width / 2),
    						// Check to see if line/bar here and decide where to place the line
    						linePos = this.calculateX(index - (this.offsetGridLines ? 0.5 : 0)) + helpers.aliasPixel(this.lineWidth),
    						isRotated = (this.xLabelRotation > 0);

    					ctx.beginPath();

    					//if (index > 0){ // TODO нулевой тоже рисуем так
						if (label != '0'){
    						// This is a grid line in the centre, so drop that
    						ctx.lineWidth = this.gridLineWidth;
    						ctx.strokeStyle = this.gridLineColor;
    					} else {
    						// This is the first line on the scale
    						ctx.lineWidth = this.lineWidth;
    						ctx.strokeStyle = this.lineColor;
    					}
    					ctx.moveTo(linePos,this.endPoint);
    					ctx.lineTo(linePos,this.startPoint - 3);
    					ctx.stroke();
    					ctx.closePath();


    					ctx.lineWidth = this.lineWidth;
    					ctx.strokeStyle = this.lineColor;


    					// Small lines at the bottom of the base grid line
    					ctx.beginPath();
    					ctx.moveTo(linePos,this.endPoint);
    					ctx.lineTo(linePos,this.endPoint + 5);
    					ctx.stroke();
    					ctx.closePath();

    					ctx.save();
    					ctx.translate(xPos,(isRotated) ? this.endPoint + 12 : this.endPoint + 8);
    					ctx.rotate(helpers.radians(this.xLabelRotation)*-1);
    					ctx.font = this.font;
    					ctx.textAlign = (isRotated) ? "right" : "center";
    					ctx.textBaseline = (isRotated) ? "middle" : "top";
    					ctx.fillText(label, 0, 0);
    					ctx.restore();
    				},this);

    			}
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
			this.BarClass = Chart.HorizontalRectangle.extend({
				strokeWidth : this.options.barStrokeWidth,
				showStroke : this.options.barShowStroke,
				showLabels : this.options.showLabels,
				ctx : this.chart.ctx
			});

			//Iterate through each of the datasets, and build this into a property of the chart
			helpers.each(data.datasets,function(dataset,datasetIndex){

				var datasetObject = {
					label : dataset.label || null,
					fillColor : dataset.fillColor,
					strokeColor : dataset.strokeColor,
					bars : []
				};

				this.datasets.push(datasetObject);

				helpers.each(dataset.data,function(dataPoint,index){
					//Add a new point for each piece of data, passing any required data to draw.
					datasetObject.bars.push(new this.BarClass({
						value : dataPoint,
						//label : data.labels[index],
						label: dataset.label && dataset.label[index],
						datasetLabel: dataset.label,
						//strokeColor : dataset.strokeColor,
						//strokeColor : dataset.strokeColor[index],
						//fillColor : dataset.fillColor,
						fillColor : dataset.fillColor[index],
						//highlightFill : dataset.highlightFill || dataset.fillColor,
						highlightFill : dataset.fillColor[index]
						//highlightStroke : dataset.highlightStroke || dataset.strokeColor
					}));
				},this);

			},this);

			this.buildScale(data.labels);

			
			var paddingsX = this.scale.xScalePaddingLeft + this.scale.xScalePaddingRight;
			var paddingsY = this.chart.height - (this.scale.endPoint - this.scale.startPoint);

			//var datas = data.labels.length * this.options.barWidth + data.labels.length * this.options.barValueSpacing;
			if (this.options.barsInOneLine)
				var oneData = this.options.barWidth;
			else
				var oneData = this.options.barWidth * this.datasets.length + this.options.barDatasetSpacing * (this.datasets.length-1);
			oneData += this.options.barValueSpacing;
			var datas = oneData * data.labels.length;

			//var datas = data.labels.length * (this.options.barWidth * this.datasets.length + this.options.barDatasetSpacing * (this.datasets.length-1)) + data.labels.length * this.options.barValueSpacing;

			// var width = paddings + datas;
			var height = paddingsY + datas;

			var width = this.options.barHeight + paddingsX;


			// var height = this.options.barHeight - (this.scale.endPoint - this.scale.startPoint) + this.chart.height;
			//var height = (this.scale.endPoint - this.scale.startPoint) + this.chart.height;

			this.chart.width = width;
			this.chart.canvas.width = width;

			this.chart.height = height;
			this.chart.canvas.height = height;

			helpers.retinaScale(this.chart);
			this.buildScale(data.labels);

      		this.BarClass.prototype.left = Math.round(this.scale.xScalePaddingLeft);

			function getPrevValues(_index, _datasetIndex){
				var value = 0;
				this.eachBars(function(bar, index, datasetIndex){
					if (datasetIndex < _datasetIndex && index == _index)
						value += bar.value;
				});
				return value;
			}


			this.eachBars(function(bar, index, datasetIndex){
				helpers.extend(bar, {
          			//x: Math.round(this.scale.xScalePaddingLeft),
					left: this.scale.calculateXInvertXY(0),
					x: this.scale.calculateXInvertXY(0),
					//x: this.scale.calculateXInvertXY(this.options.stacked ? getPrevValues.call(this, index, datasetIndex) : 0),
					y : this.scale.calculateBarY(this.datasets.length, datasetIndex, index),
					height : this.scale.calculateBarHeight(this.datasets.length)


				});
				bar.save();
			}, this);

			this.render();
		},
		showTooltip: function(activeBars){
			if(this.options.customTooltips){
				this.options.customTooltips(false);
			}
			if (!activeBars || !activeBars.length) return;
			// get dataset
			/*var dataArray, dataIndex;
			for (var i = this.datasets.length - 1; i >= 0; i--) {
				dataArray = this.datasets[i].points || this.datasets[i].bars || this.datasets[i].segments;
				dataIndex = dataArray.indexOf(activeBars[0]);
				if (dataIndex !== -1){
					break;
				}
			}*/
			var tooltipLabels = [];

			var pos = {x: 0, y:0};
			//var x=0;
			//var y=0;
			activeBars.forEach(function (bar){
				var right = bar.left - (bar.left - bar.x);
				pos.x = Math.max(pos.x, right);
				pos.y = bar.y;
				
				// var obj = {bar:bar};
				// var dataArray, dataIndex;
				// for (var i = this.datasets.length - 1; i >= 0; i--) {
				// 	dataArray = this.datasets[i].points || this.datasets[i].bars || this.datasets[i].segments;
				// 	dataIndex = dataArray.indexOf(activeBars[0]);
				// 	if (dataIndex !== -1){
				// 		//break;
				// 		obj.dataset = this.datasets[i];
				// 		obj.yLabel = this.scale.yLabels[i];
				// 	}
				// }
				tooltipLabels.push(helpers.template(this.options.multiTooltipTemplate, bar));
				//tooltipLabels.push(bar.label + ': ' + bar.value);
			}, this);
			//tooltipLabels.push(helpers.template(this.options.multiTooltipTemplate, element));

			//var tooltipPosition = Element.tooltipPosition();
			new Chart.Tooltip({
				x: pos.x,
				y: pos.y,
				labels: tooltipLabels,
				xPadding: this.options.tooltipXPadding,
				yPadding: this.options.tooltipYPadding,
				fillColor: this.options.tooltipFillColor,
				textColor: this.options.tooltipFontColor,
				fontFamily: this.options.tooltipFontFamily,
				fontStyle: this.options.tooltipFontStyle,
				fontSize: this.options.tooltipFontSize,
				caretHeight: this.options.tooltipCaretSize,
				cornerRadius: this.options.tooltipCornerRadius,
				text: '',//template(this.options.tooltipTemplate, Element),
				chart: this.chart,
				custom: this.options.customTooltips
			}).draw();

			/*new Chart.MultiTooltip({
				//x: medianPosition.x,
				//y: medianPosition.y,
				//x: Math.round(tooltipPosition.x),
				//y: Math.round(tooltipPosition.y),
				x: pos.x,
				y: pos.y,
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
				legendColors: [],//tooltipColors,
				legendColorBackground : this.options.multiTooltipKeyBackground,
				title: '',//template(this.options.tooltipTitleTemplate,activeBars[0]),
				chart: this.chart,
				ctx: this.chart.ctx,
				custom: this.options.customTooltips
			}).draw();*/

		},
		update : function(){
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
				self.eachBars(function(bar){
					values.push(bar.value);
				});
				return values;
			};
			var dataTotalStacked = function(){
				var values = [];
				helpers.each(self.datasets, function(dataset) {
					helpers.each(dataset.bars, function(bar, barIndex) {
						if(!values[barIndex]) values[barIndex] = 0;
						values[barIndex] = +values[barIndex] + +bar.value;
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
				stacked: this.options.stacked,
				calculateYRange: function(currentHeight){
					var updatedRanges = helpers.calculateScaleRange(
						this.stacked ? dataTotalStacked() : dataTotal(),
						currentHeight,
						this.fontSize,
						this.beginAtZero,
						this.integersOnly
					);
					helpers.extend(this, updatedRanges);
				},
				xLabels : labels,
				font : helpers.fontString(this.options.scaleFontSize, this.options.scaleFontStyle, this.options.scaleFontFamily),
				lineWidth : this.options.scaleLineWidth,
				lineColor : this.options.scaleLineColor,
				showHorizontalLines : this.options.scaleShowHorizontalLines,
				showVerticalLines : this.options.scaleShowVerticalLines,
				gridLineWidth : (this.options.scaleShowGridLines) ? this.options.scaleGridLineWidth : 0,
				gridLineColor : (this.options.scaleShowGridLines) ? this.options.scaleGridLineColor : "rgba(0,0,0,0)",
				padding : (this.options.showScale) ? 0 : (this.options.barShowStroke) ? this.options.barStrokeWidth : 0 + (this.options.padding  ? this.options.padding : 0),
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


			// if (this.options.scaleStartValue !== undefined)
			// 	scaleOptions.min = this.options.scaleStartValue;
			// if (this.options.scaleStopValue !== undefined)
			// 	scaleOptions.max = this.options.scaleStopValue;
			//
			this.scale = new this.ScaleClass(scaleOptions);

			var labelsTotal = function(){
				var labels = [];
				self.eachBars(function(bar){
					//if (bar.label)
					//	labels.push(bar.label);
					if (bar.value)
						labels.push(bar.value);
				});
				return labels;
			};

			var padding = helpers.longestText(this.scale.ctx,this.scale.font,labelsTotal());

			this.scale.xScalePaddingRight += padding || 0;

			if (dataTotal().some(function(value){return value < 0;}))
				this.scale.xScalePaddingLeft += padding || 0;


		},
		addData : function(valuesArray,label){
			//Map the values array for each of the datasets
			helpers.each(valuesArray,function(value,datasetIndex){
				//Add a new point for each piece of data, passing any required data to draw.
				this.datasets[datasetIndex].bars.push(new this.BarClass({
					value : value,
					label : label,
					//x: 0,
					//x: this.scale.calculateXInvertXY(0),
					x: this.scale.calculateBarX(this.datasets.length, datasetIndex, this.scale.valuesCount+1),
					y: this.scale.endPoint,
					width : this.scale.calculateBarWidth(this.datasets.length),
					base : this.scale.endPoint,
					strokeColor : this.datasets[datasetIndex].strokeColor,
					fillColor : this.datasets[datasetIndex].fillColor
				}));
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

			var ctx = this.chart.ctx;

			this.scale.draw(easingDecimal);

			function getPrevValues(_index, _datasetIndex){
				var value = 0;
				this.eachBars(function(bar, index, datasetIndex){
					if (datasetIndex < _datasetIndex && index == _index)
						value += bar.value;
				});
				return value;
			}

			//Draw all the bars for each dataset
			helpers.each(this.datasets,function(dataset,datasetIndex){
				helpers.each(dataset.bars,function(bar,index){
					if (bar.hasValue()){
						//bar.left = Math.round(this.scale.xScalePaddingLeft);
						//bar.left = this.scale.calculateXInvertXY(0);
						//bar.left = this.scale.calculateXInvertXY(this.options.stacked ? getPrevValues.call(this, index, datasetIndex) : 0);
						//bar.x = bar.left;
						//Transition then draw
						bar.transition({
							// x : this.scale.calculateXInvertXY(bar.value),
							// y : this.scale.calculateBarY(this.datasets.length, datasetIndex, index),
							// height : this.scale.calculateBarHeight(this.datasets.length)
							// x : this.scale.calculateXInvertXY(bar.value),
							left: this.scale.calculateXInvertXY(this.options.stacked ? getPrevValues.call(this, index, datasetIndex) : 0),
							x : this.scale.calculateXInvertXY(bar.value + (this.options.stacked ? getPrevValues.call(this, index, datasetIndex) : 0)),
							y : this.scale.calculateBarY(this.datasets.length, datasetIndex, index),
							height : this.scale.calculateBarHeight(this.datasets.length)
						}, easingDecimal).draw();
					}
				},this);

			},this);
		}
	});


}).call(this);

(function () {
    "use strict";
    /**
     * @desc
     * @example
     */
    angular.module('SportsensusApp')
        .directive('horisontalBarDir', horisontalBarDir);

    horisontalBarDir.$inject = [
        '$rootScope'
    ];

    function horisontalBarDir(
        $rootScope
    )    {
        return {
            restrict: 'E',
            scope: {
                chart: '='
            },
            templateUrl: '/views/widgets/charts/horisontalBar/horisontalBar.html',
            link: function ($scope, $el, attrs) {
                $scope.el = $el;
                $scope.tooltipEl = $el.find('div');
                // $scope.draw1();
                // $scope.draw2();
                // $scope.draw3();
                // $scope.draw4();
                $scope.$watch('chart', $scope.redrawChart);
            },
            replace: true,
            controller: [
                '$scope',
                function(
                    $scope
                ){








                    var randomScalingFactor = function(invert, max){
                        return Math.round(Math.random()*(max || 1000000)) * (invert ? -1 : 1);
                    };

                    var colorGenerator = d3.scale.category10();
                    var colors = [0,1,2,3,4,5,6].map(function(item){
                        return colorGenerator(item);
                    });

                    var data1 = [randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor()];
                    var data3 = [randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor()];
                    // var data2 = [randomScalingFactor(true, 4000),randomScalingFactor(true, 4000),randomScalingFactor(true, 4000),randomScalingFactor(true),randomScalingFactor(true),randomScalingFactor(true),randomScalingFactor(true)];
                    var data2 = [randomScalingFactor(true),randomScalingFactor(true),randomScalingFactor(true),randomScalingFactor(true),randomScalingFactor(true),randomScalingFactor(true),randomScalingFactor(true)];

                    var label1 = data1.map(function(item){return '!'+item + '%'});
                    var label2 = data2.map(function(item){return '!'+item + '%'});

                    $scope.draw1 = function(){

                        var barChartData = {
                            labels : ["January","February","March","April","May","June","July"],
                            datasets : [
                                {
                                    //fillColor : "rgba(220,220,220,0.5)",
                                    fillColor : colors,
                                    //strokeColor : "rgba(220,220,220,0.8)",
                                    //highlightFill: "rgba(220,220,220,0.75)",
                                    //highlightStroke: "rgba(220,220,220,1)",
                                    data : data1
                                },
                                {
                                    //fillColor : "rgba(151,187,205,0.5)",
                                    fillColor : colors,
                                    //strokeColor : "rgba(151,187,205,0.8)",
                                    //highlightFill : "rgba(151,187,205,0.75)",
                                    //highlightStroke : "rgba(151,187,205,1)",
                                    data : data3
                                    // data : [
                                    //     randomScalingFactor(true),
                                    //     randomScalingFactor(true),
                                    //     randomScalingFactor(true),
                                    //     randomScalingFactor(true),
                                    //     randomScalingFactor(true),
                                    //     randomScalingFactor(true),
                                    //     randomScalingFactor(true)
                                    //     ]
                                }
                            ]
                        };

                        var ctx = $scope.el.find('canvas')[0].getContext("2d");
                        var chart = new Chart(ctx).HorizontalBar(barChartData, {
                            responsive: false,
                            barShowStroke: true,
                            scaleBeginAtZero: true,
                            //scaleShowGridLines : false,
                            //scaleShowHorizontalLines: false,
                            barWidth: 30,
                            barHeight: 300,
                            barValueSpacing: 20,
                            barDatasetSpacing: 10,
                            //padding: 10
                            //Boolean - Whether to show vertical lines (except Y axis)
                            //scaleShowVerticalLines: false,
                            //barValueSpacing : -10,
                            //barDatasetSpacing : -10
                        });

                    };

                    $scope.draw2 = function(){
                        var barChartData = {
                            //labels : ["January","February","March","April","May","June","July"],
                            labels : ["","","","","","",""],
                            datasets : [
                                {
                                    //fillColor : "rgba(220,220,220,0.5)",
                                    fillColor : colors,
                                    label: label1,
                                    //strokeColor : "rgba(220,220,220,0.8)",
                                    //highlightFill: "rgba(220,220,220,0.75)",
                                    //highlightStroke: "rgba(220,220,220,1)",
                                    data : data1
                                }
                            ]
                        };

                        var ctx = $scope.el.find('canvas')[2].getContext("2d");
                        var chart = new Chart(ctx).HorizontalBar(barChartData, {
                            responsive: false,
                            barShowStroke: true,
                            scaleBeginAtZero: true,
                            scaleShowGridLines : false,
                            scaleShowHorizontalLines: false,
                            barWidth: 30,
                            barHeight: 300,
                            barValueSpacing: 20,
                            //Boolean - Whether to show vertical lines (except Y axis)
                            scaleShowVerticalLines: false,
                            //barValueSpacing : -10,
                            //barDatasetSpacing : -10
                        });

                    };

                    $scope.draw3 = function(){
                        var barChartData = {
                            labels : ["January","February","March","April","May","June","July"],
                            datasets : [
                                {
                                    //fillColor : "rgba(220,220,220,0.5)",
                                    fillColor : colors,
                                    //strokeColor : "rgba(220,220,220,0.8)",
                                    //highlightFill: "rgba(220,220,220,0.75)",
                                    //highlightStroke: "rgba(220,220,220,1)",
                                    data : data1
                                }
                            ]
                        };

                        var ctx = $scope.el.find('canvas')[3].getContext("2d");
                        var chart = new Chart(ctx).HorizontalBar(barChartData, {
                            responsive: false,
                            barShowStroke: true,
                            scaleBeginAtZero: true,
                            scaleShowGridLines : false,
                            scaleShowHorizontalLines: false,
                            barWidth: 30,
                            barHeight: 300,
                            barValueSpacing: 20,
                            //Boolean - Whether to show vertical lines (except Y axis)
                            scaleShowVerticalLines: false,
                            //barValueSpacing : -10,
                            //barDatasetSpacing : -10
                        });

                    };

                    $scope.draw4 = function(){
                        var barChartData = {
                            //labels : ["Januaryyyyyyyyyy","February","March","April","May","June","July"],
                            labels : ["","","","","","",""],
                            datasets : [
                                {
                                    //fillColor : "rgba(220,220,220,0.5)",
                                    fillColor : colors,
                                    label: label1,
                                    //strokeColor : "rgba(220,220,220,0.8)",
                                    //highlightFill: "rgba(220,220,220,0.75)",
                                    //highlightStroke: "rgba(220,220,220,1)",
                                    data : data1
                                },
                                {
                                    //fillColor : "rgba(220,220,220,0.5)",
                                    fillColor : colors,
                                    label: label2,
                                    //strokeColor : "rgba(220,220,220,0.8)",
                                    //highlightFill: "rgba(220,220,220,0.75)",
                                    //highlightStroke: "rgba(220,220,220,1)",
                                    data : data2
                                }
                            ]
                        };

                        var ctx = $scope.el.find('canvas')[4].getContext("2d");
                        var chart = new Chart(ctx).HorizontalBar(barChartData, {
                            responsive: false,
                            barShowStroke: true,
                            scaleBeginAtZero: false,
                            //scaleShowGridLines : false,
                            //scaleShowHorizontalLines: false,
                            barWidth: 30,
                            barHeight: 500,
                            barValueSpacing: 20,
                            showHorisontalSerifs: false,
                            barsInOneLine: true,
                            scaleLabel: function(obj){
                                var value = Math.abs(obj.value);
                                return value > 1000*1000 ? value/1000/1000+'M' : value > 1000 ? value/1000+'K' : value;
                            },
                            showLabels: $scope.formatValue,
                            //padding: 40,
                            //Boolean - Whether to show vertical lines (except Y axis)
                            scaleShowVerticalLines: false,
                            //barValueSpacing : -10,
                            //barDatasetSpacing : -10
                        });

                    };


                    $scope.redrawChart = function(){

                        if ($scope.chartObj){
                            $scope.chartObj.clear();
                            $scope.chartObj.destroy();

                        }
                        if (!$scope.chart || !$scope.chart.data || !$scope.chart.options) {
                            return;
                        }

                        var chartData = $scope.chart.data;
                        var chartOptions = $scope.chart.options || {};



                        var ctx = $scope.el.find('canvas')[0].getContext("2d");
                        $scope.chartObj = new Chart(ctx).HorizontalBar(chartData, angular.extend({
                            showLabels: false,
                            showTooltips: true,
                            stacked: true,
                            barWidth: 30,
                            barHeight: 400,
                            padding: 20,
                            barValueSpacing: 20,
                            //scaleLabel: "<%=value%>M",

                            customTooltips:customTooltips,
                            multiTooltipTemplate: function(bar){
                                //return '<div class="line"><div class="color" style="background-color:'+ bar.fillColor+';"></div><b>'+bar.label + ': </b>' + bar.value.toLocaleString('en-US')+'</div>';
                                return '<div class="line"><div class="color" style="background-color:'+ bar.fillColor+';"></div><span>' + bar.label + '</span></div>';
                            },
                            tooltipHideZero: true,
                            maintainAspectRatio: false,


                            responsive: false,
                            barShowStroke: true,
                            scaleBeginAtZero: true,
                            //scaleShowGridLines : false,
                            //scaleShowHorizontalLines: false,
                            showHorisontalSerifs: false,
                            barsInOneLine: true,
                            //stacked:true,
                            scaleLabel: function(obj){
                                var value = Math.abs(obj.value);
                                return value > 1000*1000 ? value/1000/1000+'M' : value > 1000 ? value/1000+'K' : value;
                            },
                            //showLabels: $scope.formatValue,
                            //padding: 40,
                            //Boolean - Whether to show vertical lines (except Y axis)
                            scaleShowVerticalLines: false
                        }, chartOptions));

                        function customTooltips(tooltip) {
                            $scope.$apply(function(){
                                var tooltipEl = $scope.tooltipEl;
                                
                                if (!tooltip) {
                                    $scope.tooltipVisible = false;
                                    return;
                                }
                                $scope.tooltipVisible = true;

                                var innerHtml = tooltip.labels.join('');
                                tooltipEl.html(innerHtml);

                                tooltipEl.css({
                                    //opacity: 1,
                                    left: tooltip.chart.canvas.offsetLeft + tooltip.x + 'px',
                                    top: tooltip.chart.canvas.offsetTop + tooltip.y + 'px',
                                    fontFamily: tooltip.fontFamily,
                                    fontSize: tooltip.fontSize,
                                    fontStyle: tooltip.fontStyle
                                });
                            })
                        }

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
                columnsCount: '@',
                selectable: '=?',
                highlightable: '=?',
                selectedColor: '=?',
                highlightedColor: '=?',
                disabled: '=?'
            },
            templateUrl: '/views/widgets/charts/legend/legend.html',
            link: function ($scope, $el, attrs) {
                //if (angular.isUndefined($scope.selectable))
                //   $scope.selectable = true;
            },

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

                    $scope.getPointStyles = function(item){
                        var selectedColor = item.selected || !$scope.selectable ? ($scope.selectedColor || item.color || item.chartColor) : null;
                        var highlightedColor = item.highlighted && $scope.highlightable ? ($scope.highlightedColor || item.color || item.chartColor) : null;
                        
                        // if (highlightedColor)
                        //     return  {'background-color': highlightedColor};
                        // else if (selectedColor)
                        //     return  {'background-color': selectedColor};
                        if (selectedColor)
                            return  {'background-color': selectedColor};
                        else if (highlightedColor)
                            return  {'background-color': highlightedColor};
                        else 
                            return {'background-color': 'none'};
                        
                        //        return {'background-color': item.selected || !selectable ? (item.color || item.chartColor) : 'none'}
                    };

                    $scope.getParam = function(param){
                      return $scope[param];
                    };


                    
                    $scope.itemClick = function(item){
                        item.selected = !item.selected;
                    };

                    $scope.highlightItem = function(item){
                        item.highlighted = true;
                    };
                    $scope.unhighlightItem = function(item){
                        item.highlighted = false;
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
        .directive('articlesCarouselDir', articlesCarousel);

    articlesCarousel.$inject = [
        '$rootScope'
    ];

    function articlesCarousel(
        $rootScope
    )    {
        return {
            restrict: 'E',
            scope: {
            },
            templateUrl: '/views/widgets/home/articlesCarousel/articlesCarousel.html',
            link: function ($scope, $el, attrs) {},

            controller: [
                '$scope',
                '$routeParams',
                '$location',
                '$anchorScroll',
                '$window',
                '$timeout',
                'ArticlesSrv',
                function(
                    $scope,
                    $routeParams,
                    $location,
                    $anchorScroll,
                    $window,
                    $timeout,
                    ArticlesSrv
                ){
                    
                    $scope.carousel = null;
                    ArticlesSrv.getArticles().then(function(articles){
                        $scope.articles = articles;
                        $timeout(function(){
                            $scope.carousel = new Flickity('.articles-carousel-flickity');  
                        }, 1);
                       
                    })
                   
                   
                }
            ]
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
		tooltipHideZero: false/*,

		// ширина столбца
		barWidth: 30,
		
		// максимальная высота столбца
		barHeight: 100*/
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
					
					if (options.barsInOneLine) {
						offset = 0;
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
						//label : data.labels[index],
						label : dataset.label instanceof Array ? dataset.label[datasetObject.bars.length] : dataset.label,
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
		showTooltip: function(activeBars){
			if(this.options.customTooltips){
				this.options.customTooltips(false);
			}
			if (!activeBars || !activeBars.length) return;
			// get dataset
			/*var dataArray, dataIndex;
			 for (var i = this.datasets.length - 1; i >= 0; i--) {
			 dataArray = this.datasets[i].points || this.datasets[i].bars || this.datasets[i].segments;
			 dataIndex = dataArray.indexOf(activeBars[0]);
			 if (dataIndex !== -1){
			 break;
			 }
			 }*/
			var tooltipLabels = [];

			var pos = {x: 0, y:Number.MAX_VALUE};
			//var x=0;
			//var y=0;
			activeBars.forEach(function (bar){
				if (!bar.value) return;
				//var right = bar.left - (bar.left - bar.x);
				pos.x = Math.max(pos.x, bar.x);
				pos.y = Math.min(pos.y, bar.y);

				// var obj = {bar:bar};
				// var dataArray, dataIndex;
				// for (var i = this.datasets.length - 1; i >= 0; i--) {
				// 	dataArray = this.datasets[i].points || this.datasets[i].bars || this.datasets[i].segments;
				// 	dataIndex = dataArray.indexOf(activeBars[0]);
				// 	if (dataIndex !== -1){
				// 		//break;
				// 		obj.dataset = this.datasets[i];
				// 		obj.yLabel = this.scale.yLabels[i];
				// 	}
				// }
				tooltipLabels.push(helpers.template(this.options.multiTooltipTemplate, bar));
				//tooltipLabels.push(bar.label + ': ' + bar.value);
			}, this);
			//tooltipLabels.push(helpers.template(this.options.multiTooltipTemplate, element));
			if (!tooltipLabels.length) return;
			//var tooltipPosition = Element.tooltipPosition();
			new Chart.Tooltip({
				x: pos.x,
				y: pos.y,
				//x: Math.round(tooltipPosition.x),
				//y: Math.round(tooltipPosition.y),
				labels: tooltipLabels,
				xPadding: this.options.tooltipXPadding,
				yPadding: this.options.tooltipYPadding,
				fillColor: this.options.tooltipFillColor,
				textColor: this.options.tooltipFontColor,
				fontFamily: this.options.tooltipFontFamily,
				fontStyle: this.options.tooltipFontStyle,
				fontSize: this.options.tooltipFontSize,
				caretHeight: this.options.tooltipCaretSize,
				cornerRadius: this.options.tooltipCornerRadius,
				text: '',//template(this.options.tooltipTemplate, Element),
				chart: this.chart,
				custom: this.options.customTooltips
			}).draw();


		},
		showTooltip_old : function(ChartElements, forceRedraw){
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
                $scope.tooltipEl = $el.find('div');
                $scope.$watch('chart', $scope.redrawChart);
            },
            replace: true,
            controller: [
                '$scope',
                function(
                    $scope
                ){


                    $scope.redrawChart = function(){
                        if ($scope.chartObj){
                            $scope.chartObj.clear();
                            $scope.chartObj.destroy();
                        }
                        if (!$scope.chart || !$scope.chart.data || !$scope.chart.options) {
                            return;
                        }

                        var chartData = $scope.chart.data;
                        var chartOptions = $scope.chart.options || {};
                        
                        
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
                            customTooltips:customTooltips,
                            multiTooltipTemplate: function(bar){
                                //return '<div class="line"><div class="color" style="background-color:'+ bar.fillColor+';"></div><b>'+bar.label + ': </b>' + bar.value.toLocaleString('en-US')+'</div>';
                                return '<div class="line"><div class="color" style="background-color:'+ bar.fillColor+';"></div><span>' + bar.label + '</span></div>';
                            },
                            //customTooltips:customTooltips,
                            tooltipHideZero: true,
                            maintainAspectRatio: false
                            //responsive: true
                            //barStrokeWidth: 40
                            //barValueSpacing: 40
                        }, chartOptions));


                        function customTooltips(tooltip) {
                            $scope.$apply(function(){
                                var tooltipEl = $scope.tooltipEl;

                                if (!tooltip) {
                                    $scope.tooltipVisible = false;
                                    return;
                                }
                                $scope.tooltipVisible = true;

                                var innerHtml = tooltip.labels.join('');
                                tooltipEl.html(innerHtml);

                                tooltipEl.css({
                                    //opacity: 1,
                                    left: tooltip.chart.canvas.offsetLeft + tooltip.x + 'px',
                                    top: tooltip.chart.canvas.offsetTop + tooltip.y + 'px',
                                    fontFamily: tooltip.fontFamily,
                                    fontSize: tooltip.fontSize,
                                    fontStyle: tooltip.fontStyle
                                });
                            })
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
        '$rootScope',
        'graphHelpersSrv'
    ];

    function baseGraphCtrl($scope,
                          $rootScope,
                           graphHelpersSrv)
    {

        // $scope.getLegend;
		//
        // $scope.getSportLegend;
        //
        // $scope.getInterestLegend;
        //
        // $scope.getImageLegend;
		//
        // $scope.getInvolveLegend;

        $scope.formatValue = graphHelpersSrv.formatValue;

        $scope.prepareChartData = graphHelpersSrv.prepareChartData;
        
    }
}());

(function () {

	"use strict";
	angular.module('SportsensusApp')
		.factory('graphHelpersSrv', graphHelpersSrv);

	// инициализируем сервис
	// angular.module('SportsensusApp').run(['graphHelpersSrv', function(graphHelpersSrv) {
	// 	//graphHelpersSrv.init();
	// 	//graphHelpersSrv.logout();
	// }]);

	angular.module('SportsensusApp').run(['graphHelpersSrv', function(graphHelpersSrv) {}]);

	graphHelpersSrv.$inject = [
		'$rootScope',
		'ParamsSrv'
	];


	/**
	 * events:
	 * graphHelpersSrv.highlightItem
	 */
	function graphHelpersSrv(
		$rootScope,
		ParamsSrv
	) {

		var parameters;
		ParamsSrv.getParams().then(function(params) {
			parameters = params;
		});


		function getLegend(objects, options){
			options = options || {};
			var selected = false;
			// var legend = obj.lists.map(function (list) {
			var legend = objects.map(function (list) {
				selected = selected || list.selected || list.interested;
				var result =  {
					id: list.id,
					key: list.key,
					name: list.name,
					color: options.color ? options.color : list.chartColor,
					selected: list.selected || list.interested
				};
				if (options.depth && options.depth > 0){
					if (list.lists) {
						result.lists = getLegend(list.lists, angular.extend({}, options, {depth: options.depth - 1}));
					}
					if (list.clubs){
						result.clubs = getLegend(list.clubs, angular.extend({}, options, {depth: options.depth - 1}));
					}
				}
				return result;
			});//.reverse();
			if (!selected && options.selectAll) legend.forEach(function(item){item.selected = true;});
			return legend;
		}

		function getSportLegend (options) {
			options = options || {};
			var selected = false;
			var legend = parameters.sport.lists.map(function (list) {
				selected = selected || list.interested;
				var result = {
					id: list.id,
					name: list.name,
					key: list.key,
					color: options.color ? options.color : list.chartColor,
					selected: list.interested
				};
				if (options.clubs){

					//var clubsObj = list.lists.filter(function(child){return child.key == 'clubs';});
					//if (clubsObj.length){
					var clubs = list.clubs.map(function(list){
						return {
							id: list.id,
							name: list.name,
							color: options.color ? options.color : list.chartColor,
							selected: list.selected
						}
					});
					result.clubs = clubs;
					//}
				}
				return result;
			});
			if (!selected && options.selectAll !== false) legend.forEach(function(item){item.selected = true;});
			return legend;
		}

		function getInterestLegend(options){
			options = options || {};
			var selected = false;
			var legend = parameters.interest.lists.map(function (list) {
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
		}

		function getImageLegend(options){
			options = options || {};
			var selected = false;
			var legend = parameters.image.lists.map(function (list) {
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
		}

		function getInvolveLegend(options){
			options = options || {};
			var selected = false;
			var legend = parameters.involve.lists.map(function (list) {
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
		}

		function formatValue(value){
			var multiplier = value > 1000*1000 ? 1000*1000 : value > 1000 ? 1000 : 1;
			value = value / multiplier;
			value = value >= 100 ? Math.round(value) : value > 10 ? Math.round(value * 10) / 10 : Math.round(value * 100) / 100;
			return value + (multiplier == 1000*1000 ? 'M' : multiplier == 1000 ? 'K' : '');
		}

		function prepareChartData(data, legendMapping) {
			var legends = {};
			var legendsByName = {};

			var legendsA = data.legends.map(function (legend, index) {
				// legends[legend.name] = {index:index, values:{}};
				legends[index] = {index: index, name: legend.name, values: {}, sports: []};
				legendsByName[legend.name] = legends[index];
				return legend.name;
			});

			var maxValue = 0;
			data.data && data.data.forEach(function (item) {
				item.legend.forEach(function (value, index) {
					legends[index].values[value] = true;
					if (legends[index].name == 'club') {
						if (legendsByName['sport']) {
							var sportId = item.legend[legendsByName['sport'].index];
						} else if (legendMapping.sportId != undefined) {
							var sportId = legendMapping.sportId;
						}
						if (sportId)
							legends[index].sports.push({clubId: value, sportId: sportId});
						//legends[index].sports[value] = sportId;
					}
				});
				maxValue = Math.max(maxValue, item.count);
			});

			var legendsO = {};

			Object.keys(legends).forEach(function (index) {
				var legend = legends[index];
				if (legend.name == 'club') {
					legendsO[legend.name] = [];
					legendMapping[legend.name].lists.filter(function (list) { // list - sport. Отфильтровываем спорты
						var id = list.id;
						return Object.keys(legend.sports).some(function (index) {
							return legend.sports[index].sportId == id;
						});
					}).forEach(function (sport) {
						//var clubsObj = sport.lists.filter(function(child){return child.id == 'clubs';});
						//if (clubsObj.length) {
						//clubsObj[0].lists.forEach(function (club) {
						sport.clubs.forEach(function (club) {
							if (Object.keys(legend.sports).some(function (index) {
									return legend.sports[index].sportId == sport.id && legend.sports[index].clubId == club.id;
								})) {
								legendsO[legend.name].push({
									id: club.id,
									name: club.name,
									color: club.chartColor,
									sport: {
										id: sport.id,
										name: sport.name,
										key: sport.key,
										color: sport.chartColor
									}
								})
							}
						});
						//}
					})
				} else {
					if (!legendMapping[legend.name]) return;
					legendsO[legend.name] = legendMapping[legend.name].lists.filter(function (list) {
						var id = list.id;
						return legend.values[id];
					}).map(function (list) {
						return {
							id: list.id,
							name: list.name,
							key: list.key,
							color: list.chartColor
						}
					})
				}
			});
			// keys: {sport:1, image:2}
			function getCount(keys){
				var count;
				keys = keys || {};
				data.data && data.data.forEach(function(item){
					if (item.legend.every(function(value, index){
							var legend = legends[index];
							return keys[legend.name] == value || keys[legend.name] == undefined
						})){
						count = (count || 0) + item.count;
					}
				});
				return count;
			}

			return {
				legends:legendsO,
				maxValue: maxValue,
				multiplier:  maxValue > 1000*1000 ? 1000*1000 : maxValue > 1000 ? 1000 : 1,
				getCount:getCount
			}
		}
		
		

		var me = {
			getLegend: getLegend,
			getSportLegend: getSportLegend,
			getInterestLegend: getInterestLegend,
			getImageLegend: getImageLegend,
			getInvolveLegend: getInvolveLegend,
			formatValue: formatValue,
			prepareChartData: prepareChartData
			
			
			
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
		.directive('adminArticlesDir', adminArticlesDir);

	adminArticlesDir.$inject = [
		'$rootScope'
	];

	function adminArticlesDir(
		$rootScope
	)    {
		return {
			restrict: 'E',
			scope: {
				type: '@'
			},
			templateUrl: '/views/widgets/admin/panels/articles/articles.html',
			link: function ($scope, $el, attrs) {
				//$scope.init();
			},

			controller: [
				'$scope',
				'$routeParams',
				'$location',
				'$window',
				'$mdDialog',
				'ParamsSrv',
				'ApiSrv',
				function(
					$scope,
					$routeParams,
					$location,
					$window,
					$mdDialog,
					ParamsSrv,
					ApiSrv
				) {

				
					$scope.menu = [{
						id:'cases/cases',
						text:'Кейсы'
					}/*,{
						id:'home',
						text:'Статьи на главной'
					}*/];


				 	$scope.pages = {
				 	    'cases': {id:'cases/cases'}
				 	};
				// 	[
				// 		'cases',
				// 		'home'
				// 	].forEach(function(page){
				// 		$scope.pages[page] = {id:page};
				// 	});
                    				

					$scope.activePage = null;
					$scope.activeMenuItem = null;
					$scope.setActiveMenuItem = function(item){
						$scope.activeMenuItem = item;
						$scope.activePage = item;
					};


					$scope.setActiveMenuItem($scope.menu[0]);

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
        .controller('articlesCtrl', articlesCtrl);

    articlesCtrl.$inject = [
        '$scope',
        '$controller',
        'ParamsSrv',
        'ArticlesSrv'
    ];

    function articlesCtrl(
        $scope,
        $controller,
        ParamsSrv,
        ArticlesSrv
    ) {


        // Editor options.
        $scope.options = {
            language: 'ru',
            //uiColor: '#9AB8F3',
            customConfig: false,
            stylesSet: false
        };
  
        ArticlesSrv.getArticles().then(function(articles){
            $scope.articles = articles;
        }, function(){
            // показать ошибку
        })
        
        
        
        // редактируемая статья - оригинал
        $scope.selectedArticle = null;
        // редактируемая статья - с правками
        $scope.editingArticle = null;
        
  
        // $scope.article = {
        //     title: 'Заголовок',
        //     tags: ['tag1', 'tag2', 'tag3'],
        //     content: 'Текс статьи'
        // };
        
        $scope.allTags = ArticlesSrv.getTags(); 
        // [
        //     'wer',
        //     'cas',
        //     'bearg',
        //     'vawe',
        //     'geqra',
        //     'ikuy'
        // ];
        //$controller('baseGraphCtrl', {$scope: $scope});
        
        $scope.creareArticle = function(){
            $scope.selectedArticle = {
                title: 'Новая статья',
                tags: []
            };
            $scope.editingArticle = $scope.selectedArticle;
        };

        $scope.removeArticle = function(article){
            if (article == $scope.selectedArticle){
                $scope.selectedArticle = null;
            }
            ArticlesSrv.removeArticle(article);
        };
        
        $scope.editArticle = function(article){
            ArticlesSrv.getArticle(article.id).then(function(fullArticle){
                fullArticle.groupedTags.sport = fullArticle.groupedTags.sport || [];
                fullArticle.groupedTags.category = fullArticle.groupedTags.category || [];
                $scope.selectedArticle = article;
                $scope.editingArticle = fullArticle;    
            })
        };
        
        $scope.saveArticle = function(){
            angular.extend($scope.selectedArticle, $scope.editingArticle);
            
            // if ($scope.selectedArticle.id !== undefined) {
            //     ArticlesSrv.createArticle
            // }
            ArticlesSrv.setArticle($scope.selectedArticle);
            $scope.selectedArticle = null;
            $scope.editingArticle = null;
        };
        
        $scope.cancelEdit = function(){
            $scope.selectedArticle = null;
            $scope.editingArticle = null;
        };
        
        
        
        
        $scope.removeImage = function(){
            $scope.article.image = null;
        };
        
        $scope.setFile = function(file){
            var reader = new FileReader();  
            reader.onload = function(e) {
                var img = document.createElement("img");
                img.onload = function () {
                    var canvas = document.createElement("canvas");
                    var ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0);
                    
                    var MAX_WIDTH = 300;
                    var MAX_HEIGHT = 300;
                    var width = img.width;
                    var height = img.height;
                    
                    var k = Math.max(width / MAX_WIDTH, height / MAX_HEIGHT, 1);
                    
                    // if (width > height) {
                    //   if (width > MAX_WIDTH) {
                    //     height *= MAX_WIDTH / width;
                    //     width = MAX_WIDTH;
                    //   }
                    // } else {
                    //   if (height > MAX_HEIGHT) {
                    //     width *= MAX_HEIGHT / height;
                    //     height = MAX_HEIGHT;
                    //   }
                    // }
                    height /= k;
                    width /= k;
                    
                    canvas.width = width;
                    canvas.height = height;
                    var ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    var dataurl = canvas.toDataURL("image/png");
                    
                    $scope.$apply(function(){
                        $scope.editingArticle.image = dataurl;
                    })
                    
                }
                img.src = e.target.result;
            }
            reader.readAsDataURL(file);
        };
        
        
        $scope.transformSportTag = function(tag) {
          // If it is an object, it's already a known chip
          if (angular.isString(tag)) {
            //   if (tag.indexOf('sport::') == 0)
                return tag;
          }
    
          // Otherwise, create a new one
          return null;
        };
        
        $scope.onSportTagAdd = function(tag) {
            var a = tag;
        }
        
        $scope.transformCategoryTag = function(tag) {
          // If it is an object, it's already a known chip
          if (angular.isString(tag)) {
              if (tag.indexOf('category::') == 0)
                return tag;
          }
    
          // Otherwise, create a new one
          return null;
        };

        $scope.querySportTagSearch = function(query) {
            return querySportTagSearch('sport', query);
        };
        
        $scope.queryCategoryTagSearch = function(query) {
            return querySportTagSearch('category', query);
        };
        
        function querySportTagSearch(group, query) {
            var lowercaseQuery = angular.lowercase(query);
            
            if (!$scope.allTags[group]) return [];
            
            var results = query ? $scope.allTags[group].filter(function(tag){
                return tag.toLowerCase().indexOf(lowercaseQuery) === 0;
            }) : [];
            
            return results;
        }

    }

}());

(function () {
	"use strict";
	/**
	 * @desc
	 * @example
	 */
	angular.module('SportsensusApp')
		.directive('adminProfilesDir', adminProfilesDir);

	adminProfilesDir.$inject = [
		'$rootScope'
	];

	function adminProfilesDir(
		$rootScope
	)    {
		return {
			restrict: 'E',
			scope: {
				type: '@'
			},
			templateUrl: '/views/widgets/admin/panels/profiles/profiles.html',
			link: function ($scope, $el, attrs) {
				//$scope.init();
			},

			controller: [
				'$scope',
				'$routeParams',
				'$location',
				'$window',
				'$mdDialog',
				'ParamsSrv',
				'ApiSrv',
				'AdminProfilesSrv',
				function(
					$scope,
					$routeParams,
					$location,
					$window,
					$mdDialog,
					ParamsSrv,
					ApiSrv,
					AdminProfilesSrv
				) {
	
					$scope.showPreloader = true;
					AdminProfilesSrv.getProfiles().then(function(profiles){
							$scope.showPreloader = false;	
							$scope.profiles = profiles;
						}, function(){
							$scope.showPreloader = false;
                            $mdDialog.show(
                              $mdDialog.alert()
                                .clickOutsideToClose(false)
                                .title('Ошибка')
                                .textContent('Ошибка загрузки данных')
                                .ok('OK')
                            );
						}
					);

					$scope.saveProfile = function(profile){
						var acl = {
							"admin": profile.admin_role,
							"sponsor":  profile.sponsor_role,
							"rightholder":  profile.rightholder_role,
							"demo":  profile.demo_role
						};
						ApiSrv.addRole(profile.user_id, acl).then(function(acl){
							profile.admin_role = acl.admin;
							profile.sponsor_role = acl.sponsor;
							profile.rightholder_role = acl.rightholder;
							profile.demo_role = acl.demo;
							profile.dirty = false;
						}, function(){
							$mdDialog.show($mdDialog.alert()
								.title('Ошибка')
								.textContent('Невозможно применить изменения')
								.ok('OK'));
						});

					};
					
				}]
		};
	}
}());

(function () {

    "use strict";
    angular.module('SportsensusApp')
        .factory('AdminProfilesSrv', AdminProfilesSrv);

    // инициализируем сервис
    // angular.module('SportsensusApp').run(['AdminProfilesSrv', function(AdminProfilesSrv) {
    // }]);

    // angula
    // r.module('SportsensusApp').run(AdminProfilesSrv.init);

    AdminProfilesSrv.$inject = [
        '$rootScope',
        '$q',
        'ApiSrv'
    ];


    function AdminProfilesSrv(
        $rootScope,
        $q,
        ApiSrv
    ) {
        
        var profile = [];
        //var allTags = [];
        
        var tags = {
            // ungrouped: []
        };
        
        var profilesLoaded = false;
        var profilesDefer = $q.defer();

        
        function getProfiles(){
            if (!profilesLoaded){
                profilesLoaded = true;
                //var allTags = [];
                
                ApiSrv.getUserAuthPromise().then(function(){
                    ApiSrv.getProfilesList().then(function(profiles){
                        //angular.forEach(articles, loadArticleTags);
                        
                        profilesDefer.resolve(profiles);
                    }, function(){
                        profilesDefer.reject();
                    }); 
                });
                
            }
            
            return profilesDefer.promise;
        }
       
        var me = {
            getProfiles: getProfiles
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
        .directive('mapMarkerDir', mapMarkerDir);

    mapMarkerDir.$inject = [
        '$rootScope',
        '$timeout'
    ];

    function mapMarkerDir(
        $rootScope,
        $timeout
    )    {
        return {
            restrict: 'E',
            scope: {
                //legend: '=',
                //columnsCount: '@',
                //selectable: '=?'
                color: '@',
                progress: '@',
                region: '@',
                count: '@',
                
                footer: '@',
                header: '@'
            },
            templateUrl: '/views/widgets/charts/map/mapMarker/mapMarker.html',
            link: function ($scope, $el, attrs) {
                //if (angular.isUndefined($scope.selectable))
                //   $scope.selectable = true;
                $scope.el = $el;

                //$scope.redrawChart();


                $scope.$watch('header', $scope.redrawTO);

                $scope.$watch('progress', function(){
                    if (typeof $scope.progress != "number" && $scope.progress != '' && $scope.progress != '0'){
                        $scope.realProgress = Number.parseFloat($scope.progress) || 0;
                        $scope.header = Math.round($scope.progress * 10)/10 + '%';
                        $scope.progress = 0;

                        // if (!$scope.redrawWatcher)
                        //     $scope.redrawWatcher = $scope.$watch('realProgress', $scope.redrawTO);
                    }
                    //$scope.redrawChart();
                });


                
                
                //$scope.progress = 30;

                $scope.$watch('color', function(value){
                    if ($scope.color != 'green') {
                        $scope.color = 'blue';
                    }
                });

                $scope.$watch('count', function(value){
                    var count = Number.parseFloat($scope.count) || 0;
                    $scope.countText = count.toLocaleString();
                });

            },

            controller: [
                '$scope',
                '$routeParams',
                '$location',
                '$interval',
                '$timeout',
                '$window',
                'ApiSrv',
                function(
                $scope,
                $routeParams,
                $location,
                $interval,
                $timeout,
                $window,
                ApiSrv
                ){


                    $scope.redrawTO = function(){
                        $timeout($scope.redrawChart, 200);
                    };

                    $scope.redrawChart = function() {
                        //return;
                        var canvas = $scope.el.find('canvas')[0];
                        // if ($scope.chartObj) {
                        //     $scope.chartObj.clear();
                        //     $scope.chartObj.destroy();
                        //     $scope.chartObj = null;
						//
                        //     canvas.width = 105;
                        //     canvas.height = 105;
                        // }
                        if (!$scope.realProgress) return;

                        var ctx = canvas.getContext("2d");

                        var chartOptions = {
                            percentageInnerCutout: 92,
                            segmentShowStroke: false
                        };
                        var chartData = [{
                            label: '1 ',
                            //legend: 'Владеют',
                            color: "#ffffff",
                            value: $scope.realProgress
                        },{
                            label: '2 ',
                            //legend: 'Не владеют',
                            color: "#4CB7AE",
                            value: 50//100 - $scope.realProgress
                        }];

                        if (!$scope.chartObj)
                            $scope.chartObj = new Chart(ctx).Doughnut(chartData, chartOptions);
                        else {
                            $scope.chartObj.segments[0].value = $scope.realProgress;
                            $scope.chartObj.segments[1].value = 100 - $scope.realProgress;
                            $scope.chartObj.update();
                        }

                    };


                    
                    // $interval(function() {
                    //     $scope.progress = ($scope.progress < 100 ? $scope.progress+1 : 0);
                    // }, 100);
                    
                    //$scope.$watch('legend', function(){
                    //});

                    $scope.toggleColor = function(){
                        if ($scope.color == 'blue')
                            $scope.color = 'green';
                        else $scope.color = 'blue';
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
        .controller('analyticsCtrl', analyticsCtrl);

    analyticsCtrl.$inject = [
        '$scope',
        '$controller',
        'ParamsSrv',
        'ApiSrv',
        'analyticsSrv'
    ];

    function analyticsCtrl(
        $scope,
        $controller,
        ParamsSrv,
        ApiSrv,
        analyticsSrv
    ) {

        $controller('baseGraphCtrl', {$scope: $scope});

        ParamsSrv.getParams().then(function (params) {
            $scope.parameters = params;
            //$scope.prepareLegends();
            //requestData();
            //requestData($scope.sportLegend[0]);
            updateCaption();
            updatePanel();
        });

        function updateCaption(){
            $scope.caption = ParamsSrv.getSelectedDemographyCaption();
        }

        function updatePanel(){
            var selected = analyticsSrv.getSelected();

            //$scope.advertising = [];
            if (!selected.sport){ // нет спорта - нет жизни!
                return;
            } else if (selected.sport.key == 'hockey'){
                //$scope.playground = playgrounds[0];
                $scope.playgroundType = 'hockeyBox40';
            } else if (selected.sport.key == 'football'){
                //$scope.playground = playgrounds[0];
                $scope.playgroundType = 'footballField';
            }

            //
            // if (selected.club){
            //     var playgrounds = selected.club.playgrounds;
            //     if (playgrounds.length == 1){
            //         $scope.playground = playgrounds[0];
            //     } // else if (!playgrounds.length){}
            // }
        }

        // определить выбранный спорт/лигу/клуб, загрузить из них playgrounds


        
        /*$scope.advertising = [{
            "type": "hockeyBox32",
            "stadium": "Стадион",
            "city": "Город",
            "capacity": 100500,
            "matchCount": 100500,
            "occupancy": 0.1
        }];*/
        
        
    /* TODO
    что делать, если у клуба несколько площадок?
    что делать, если выбрана лига (в ней несколько клубов и несколько площадок)?
     */

    }

}());

(function () {

	"use strict";
	angular.module('SportsensusApp')
		.factory('analyticsSrv', analyticsSrv);

	// инициализируем сервис
	angular.module('SportsensusApp').run(['analyticsSrv', function(analyticsSrv) {

	}]);
	
	analyticsSrv.$inject = [
		'$rootScope',
		'ApiSrv',
		'ParamsSrv'
	];

/**
 * events:
 * analyticsSrv.selectionChanged
 */
	function analyticsSrv(
		$rootScope,
		ApiSrv,
		ParamsSrv
	) {

		var selected = {
			sport: null,
			league: null,
			club: null
		};
	
		function getSelected(){
			return selected; 
		}
	

		function setSelected(val){ 
			selected = val || {};
			$rootScope.$broadcast('analyticsSrv.selectionChanged', selected);
		}
		
	
	
		var me = {
			getSelected: getSelected,
			setSelected: setSelected
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
		.directive('adminMenuDir', adminMenuDir);

	adminMenuDir.$inject = [
		'$rootScope'
	];

	function adminMenuDir(
		$rootScope
	)    {
		return {
			restrict: 'E',
			scope: {
				type: '@'
			},
			templateUrl: '/views/widgets/admin/panels/menu/menu.html',
			link: function ($scope, $el, attrs) {
				//$scope.init();
			},

			controller: [
				'$scope',
				'$routeParams',
				'$location',
				'$window',
				'$mdDialog',
				'ParamsSrv',
				'ApiSrv',
				function(
					$scope,
					$routeParams,
					$location,
					$window,
					$mdDialog,
					ParamsSrv,
					ApiSrv
				) {

                    $scope.loggedIn = false;
                    $scope.isAdmin = false;
                    
                    
                    
                    $scope.$watch( function () { return ApiSrv.getUser().sid; }, function (sid) {
                        $scope.loggedIn = !!sid;
                        $scope.isAdmin = ApiSrv.getUser().userRights && !!ApiSrv.getUser().userRights.admin;

                    }, true);

                    $scope.selectItem = function(item){
                        $scope.activeMenuItem = item;
                        if (item.path)
                            $scope.setPath(item.path);
                    }		
                    
                    $scope.setPath = function(path){
                        $location.path(path);
                    };

					$scope.menu = [{
						id:'profiles',
						text:'Пользователи',
						path: '/admin/profiles/',
						visible: function(){return $scope.loggedIn && $scope.isAdmin;}
					},{
						id:'leagues',
						text:'Лиги',
						path: '/leagues/',
						visible: function(){return $scope.loggedIn && $scope.isAdmin;}
					},{
						id:'email',
						text:'Шаблоны писем',
						path: '/mail_templates/',
						visible: function(){return $scope.loggedIn && $scope.isAdmin;}
					},{
						id:'other',
						text:'Другое',
						path: '/other/',
						visible: function(){return $scope.loggedIn && $scope.isAdmin;}
					},{
					    id:'other',
						text:'Редактор кейсов',
						path: '/admin/cases/',
						visible: function(){return $scope.loggedIn && $scope.isAdmin;}
					}];


                    var path = $location.path();
                    angular.forEach($scope.menu, function(item){
                        if (item.path && path.indexOf(item.path) >= 0)
                            $scope.activeMenuItem = item;
                    })
                    if (!$scope.activeMenuItem)
                        $scope.selectItem($scope.menu[0]);
                        
                    
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
		.controller('consumeCtrl', consumeCtrl);

	consumeCtrl.$inject = [
		'$scope',
		'$controller',
		'ParamsSrv',
		'ApiSrv'
	];

	function consumeCtrl(
		$scope,
		$controller,
		ParamsSrv,
		ApiSrv
	) {
		//$controller('baseGraphCtrl', {$scope: $scope});
		ParamsSrv.getParams().then(function (params) {
			$scope.parameters = params;
			// $scope.parameters.tvcable.visible = {
			// 	tvhome:2
			// };
			// $scope.parameters.net.visible = {
			// 	time_week:'net'
			// };

			// $scope.parameters.gamingplatform.visible = {
			// 	gamingtime: [1,2,3]
			// };

			$scope.prepareConsume(params.consume);
			//$scope.prepareLegends();
			//requestData();
			//requestData($scope.sportLegend[0]);
			//updateCaption();
		});



		// возвращает все наборы параметров, включая вложенные в виде линейной структуры
		$scope.getAllSubchildren2 = function(item){
			if (!item) return;
			var finalItems = [];
			if (!item.lists || item.lists.every(function(subitem){ return !subitem.lists; }))
				finalItems.push(item);
			else item.lists.forEach(function(subitem){
				finalItems = finalItems.concat($scope.getAllSubchildren(subitem));
			});
			return finalItems;
		};

		$scope.getAllSubchildren = function(item){
			if (!item) return;
			var finalItems = [];
			if (item.lists){
				//finalItems.push(item);

				item.lists.forEach(function (subitem) {
					if (subitem.lists){
						finalItems.push(subitem);
						if (subitem.visible !== undefined){
							subitem.visibleFn = function(){
								if (subitem.visible === false)
									return false;
								if (subitem.visible instanceof Object){
									return Object.keys(subitem.visible).some(function(key){
										var params = $scope.parameters[key];
										return params.lists.some(function(child){
											var value = subitem.visible[key];
											if (value instanceof Array)
												return child.selected && value.indexOf(child.id) >= 0;
											else
												return child.selected && child.id == value;
										})
									});
								}
							}
						}
					}

					finalItems = finalItems.concat($scope.getAllSubchildren(subitem));
				});
			}

			return finalItems;
		};

		//function

		$scope.blocks = [];
		$scope.prepareConsume = function(consume){
			$scope.blocks = consume.lists.map(function(list){ return {name: list.name, lists: list.lists}; });
			$scope.blocks.forEach(function(block){
				if (block.lists.every(function(list){ return !list.lists })){ // terminate list (like antivirus)
					block.lists = [{
						lists: block.lists
					}]
				} else {
					block.lists = $scope.getAllSubchildren(block);
				}
			});
		}


		

	}

}());

(function () {
	"use strict";
	/**
	 * @desc
	 * @example
	 */
	angular.module('SportsensusApp')
		.directive('adminCaseDir', adminCaseDir);

	adminCaseDir.$inject = [
		'$rootScope'
	];

	function adminCaseDir(
		$rootScope
	)    {
		return {
			restrict: 'E',
			scope: {
				// type: '@'
			},
			templateUrl: '/views/widgets/admin/panels/case/case.html',
			link: function ($scope, $el, attrs) {
				//$scope.init();
				$scope.el = $el;
			},

			controller: [
				'$scope',
				'$routeParams',
				'$location',
				'$window',
				'$mdDialog',
				'ParamsSrv',
				'ArticlesSrv',
				function(
					$scope,
					$routeParams,
					$location,
					$window,
					$mdDialog,
					ParamsSrv,
					ArticlesSrv
				) {
	
                    // Editor options.
                    $scope.options = {
                        language: 'ru',
                        uiColor: '#1e88e5',
                        customConfig: false,
                        stylesSet: false
                    };
              
                    $scope.caseId = Number.parseInt($routeParams.caseId);
                    if (Number.isNaN($scope.caseId)){
                        setArticle({
                            title: 'Заголовок', 
                            content: 'Текс статьи'
                        });
                    } else {
                        $scope.showPreloader = true;
                        ArticlesSrv.getArticle($scope.caseId).then(function(article){
                            setArticle(article);
                            $scope.showPreloader = false;
                        }, function(){
                            $scope.showPreloader = false;
                            $mdDialog.show(
                              $mdDialog.alert()
                                .clickOutsideToClose(false)
                                .title('Ошибка')
                                .textContent('Ошибка загрузки данных с сервера')
                                .ok('OK')
                            ).then(function(){
                                $location.path('/admin/cases/');
                            });
                        })
                    }
                    
                    function setArticle(article){
                        article.tags = article.tags || [];
                        article.groupedTags = article.groupedTags || {};
                        article.groupedTags.sport = article.groupedTags.sport || [];
                        article.groupedTags.category = article.groupedTags.category || [];
                        
                        $scope.article = article;   
                    }
             
                    ArticlesSrv.getTags().then(function(tags){
                        $scope.allTags = tags;
                    }); 

            
                    $scope.removeArticle = function(article){
                        $scope.showPreloader = true;
                        ArticlesSrv.removeArticle(article).then(function(){
                            $location.path('/admin/cases/');
                        }, function(){
                            $scope.showPreloader = false;
                            $mdDialog.show(
                              $mdDialog.alert()
                                .clickOutsideToClose(false)
                                .title('Ошибка')
                                .textContent('Ошибка удаления')
                                .ok('OK')
                            );
                        });
                    };
                    
                    
                    $scope.saveArticle = function(){
                        $scope.showPreloader = true;
                        ArticlesSrv.setArticle($scope.article).then(function(){
                            $scope.showPreloader = false;
                        }, function(){
                            $scope.showPreloader = false;
                            $mdDialog.show(
                              $mdDialog.alert()
                                .clickOutsideToClose(false)
                                .title('Ошибка')
                                .textContent('Ошибка сохранения')
                                .ok('OK')
                            );
                        });
                    };
                    
                    $scope.cancelEdit = function(){
                        $location.path('/admin/cases/');
                    };
                    
                    
                    
                    
                    
                    
                    
                    
                    $scope.removeImage = function(){
                        $scope.article.image = null;
                    };
                    
                    $scope.setFile = function(file){
                        var reader = new FileReader();  
                        reader.onload = function(e) {
                            var img = document.createElement("img");
                            img.onload = function () {
                                var canvas = document.createElement("canvas");
                                var ctx = canvas.getContext("2d");
                                ctx.drawImage(img, 0, 0);
                                
                                var MAX_WIDTH = 300;
                                var MAX_HEIGHT = 300;
                                var width = img.width;
                                var height = img.height;
                                
                                var k = Math.max(width / MAX_WIDTH, height / MAX_HEIGHT, 1);
                                
                                // if (width > height) {
                                //   if (width > MAX_WIDTH) {
                                //     height *= MAX_WIDTH / width;
                                //     width = MAX_WIDTH;
                                //   }
                                // } else {
                                //   if (height > MAX_HEIGHT) {
                                //     width *= MAX_HEIGHT / height;
                                //     height = MAX_HEIGHT;
                                //   }
                                // }
                                height /= k;
                                width /= k;
                                
                                canvas.width = width;
                                canvas.height = height;
                                var ctx = canvas.getContext("2d");
                                ctx.drawImage(img, 0, 0, width, height);
                                
                                var dataurl = canvas.toDataURL("image/png");
                                
                                $scope.$apply(function(){
                                    $scope.article.image = dataurl;
                                })
                                
                            }
                            img.src = e.target.result;
                        }
                        reader.readAsDataURL(file);
                    };
                    
                    
                    $scope.transformSportTag = function(tag) {
                      // If it is an object, it's already a known chip
                      if (angular.isString(tag)) {
                        //   if (tag.indexOf('sport::') == 0)
                            return tag;
                      }
                
                      // Otherwise, create a new one
                      return null;
                    };
                    
                    $scope.onSportTagAdd = function(tag) {
                        var a = tag;
                    }
                    
                    $scope.transformCategoryTag = function(tag) {
                      // If it is an object, it's already a known chip
                      if (angular.isString(tag)) {
                          if (tag.indexOf('category::') == 0)
                            return tag;
                      }
                
                      // Otherwise, create a new one
                      return null;
                    };
            
                    $scope.querySportTagSearch = function(query) {
                        return querySportTagSearch('sport', query);
                    };
                    
                    $scope.queryCategoryTagSearch = function(query) {
                        return querySportTagSearch('category', query);
                    };
                    
                    function querySportTagSearch(group, query) {
                        var lowercaseQuery = angular.lowercase(query);
                        
                        if (!$scope.allTags[group]) return [];
                        
                        var results = query ? $scope.allTags[group].filter(function(tag){
                            return tag.toLowerCase().indexOf(lowercaseQuery) === 0;
                        }) : [];
                        
                        return results;
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
        .directive('chooseFile', function() {
            return {
              link: function (scope, elem, attrs) {
               // var button = elem.find('button');
                var input = angular.element(elem[0].querySelector('input#fileInput'));
        
                // button.bind('click', function() {
                //   input[0].click();
                // });
        
                scope.openFileDialog = function(){
                    input[0].click();
                }
                
                input.bind('change', function(e) {
                  scope.$apply(function() {
                    var files = e.target.files;
                    if (files[0]) {
                        scope.setFile(files[0]);
                     // scope.fileName = files[0].name;
                    } else {
                        scope.setFile();
                      //scope.fileName = null;
                    }
                  });
                });
              }
            };
          });
   
   
          
}());

(function () {
	"use strict";
	/**
	 * @desc
	 * @example
	 */
	angular.module('SportsensusApp')
		.directive('adminCasesDir', adminCasesDir);

	adminCasesDir.$inject = [
		'$rootScope'
	];

	function adminCasesDir(
		$rootScope
	)    {
		return {
			restrict: 'E',
			scope: {
				type: '@'
			},
			templateUrl: '/views/widgets/admin/panels/cases/cases.html',
			link: function ($scope, $el, attrs) {
				//$scope.init();
			},

			controller: [
				'$scope',
				'$routeParams',
				'$location',
				'$window',
				'$mdDialog',
				'$interval',
				'ParamsSrv',
				'ArticlesSrv',
				'ApiSrv',
				function(
					$scope,
					$routeParams,
					$location,
					$window,
					$mdDialog,
					$interval,
					ParamsSrv,
					ArticlesSrv,
					ApiSrv
				) {
	
					$scope.showPreloader = true;
                    ArticlesSrv.getArticles().then(function(articles){
                        $scope.articles = articles;
                        $scope.showPreloader = false;
                    }, function(){
                        // показать ошибку
                        $scope.showPreloader = false;
                    })
                    
                    ArticlesSrv.getTags().then(function(tags){
                        $scope.allTags = tags;
                    }); 
        
                    $scope.creareArticle = function(){
                        $location.path('/admin/cases/new');
                    };
            
                    $scope.removeArticle = function(article){
                        $scope.showPreloader = true;
                        ArticlesSrv.removeArticle(article).then(function(){
                            // $location.path('/admin/cases/');
                            $scope.showPreloader = false;
                        }, function(){
                        	$scope.showPreloader = false;
                            $mdDialog.show(
                              $mdDialog.alert()
                                .clickOutsideToClose(false)
                                .title('Ошибка')
                                .textContent('Ошибка удаления')
                                .ok('OK')
                            );
                        });
                    };
                    
                    $scope.editArticle = function(article){
                    	$location.path('/admin/cases/' + article.id);
                    };
			
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
        .controller('expressSportCtrl', expressSportCtrl);

    expressSportCtrl.$inject = [
        '$scope',
        '$controller',
        'ParamsSrv',
        'ApiSrv',
        'graphHelpersSrv'
    ];

    function expressSportCtrl(
        $scope,
        $controller,
        ParamsSrv,
        ApiSrv,
        graphHelpersSrv
    ) {

        $controller('baseGraphCtrl', {$scope: $scope});
        
        ParamsSrv.getParams().then(function (params) {
            $scope.parameters = params;
            $scope.prepareLegends();
            updateCaption();
            // requestData();
            //requestData($scope.sportLegend[0]);
        });

        function updateCaption(){
            $scope.caption = ParamsSrv.getSelectedSportCaption(true);
        }
        
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
            ApiSrv.getExpressSport(audience, sport.id, clubs).then(function (data) {
                $scope.prepareSportData(sport, data);
                //$scope.updateGraph();
            }, function () {
            });
        }

        $scope.prepareLegends = function () {
            $scope.sportLegend = graphHelpersSrv.getSportLegend({color:'#555555', clubs:true, selectAll:false});
            //    .filter(function(sport){return !!sport.clubs;});

            $scope.sportLegend.forEach(function(sport){
                $scope.$watch(function(){return sport;}, function(sport, oldValue){
                    if (sport.selected){
                        $scope.sportDatas[sport.id] = {
                            sport: sport,
                            //clubs: sport.clubs.filter(function(club){return club.selected;}),
                            clubNames: sport.clubs.filter(function(club){return club.selected;}).map(function(club){return club.name; }).join(', ')
                        };
                        requestData(sport);
                    } else {
                        $scope.sportDatas[sport.id] = null;
                    }
                }, true);
            });

            //$scope.$watch('sportLegend', $scope.updateGraph, true);
        };

        $scope.checkSport = function(item){
            item.selected = !item.selected;
        };

        $scope.prepareSportData = function(sport, data){
            if (!$scope.sportDatas[sport.id]) return;

            $scope.sportDatas[sport.id].data = data;

            data.avg_age_text = Math.round(data.avg_age*100)/100  + ' лет';
            data.avg_children_text = Math.round(data.avg_children*100)/100 + ' ребёнка';
            data.avg_income_text = Math.round(data.avg_income) + ' ₽';

            data.trc_text = Math.round(data.trc*100)/100  + '%';
            data.mobile_hours_text = Math.round(data.mobile_hours*10)/10;
            data.game_text = Math.round(data.game*100)/100 + '%';

            data.bank_text = Math.round(data.bank*100)/100  + '%';
            data.gas_persent_text = Math.round(data.gas_persent*100)/100 + '%';
            data.gas_persent_header = 'Заправляются на БИПИ';

            //data.car_text = Math.round(data.car*100)/100 + '%';
            var gasStation = findById($scope.parameters.gasoften, data.gas_station);
            data.gas_persent_header = 'Заправляются на ' + (gasStation ? gasStation.name : '');


            ////////////////////////////////////////////////////
            //         Занятость
            ////////////////////////////////////////////////////

            var careerData = data.career ? $scope.prepareChartData(data.career, {
                'career': $scope.parameters.career
            }) : null;

            var dataDs = { label:[], fillColor:[], data:[] };
            //var emptyDs = { label:[], fillColor:[], data:[] };
            var chartData = {labels:[],datasets:[dataDs]}; //, emptyDs]};

            careerData.legends.career.forEach(function(career){
                career.data = {
                    count: careerData.getCount({'career': career.id})
                }
            });
            careerData.legends.career.sort(function(a,b){
                return a.data.count - b.data.count;
            });

            careerData.legends.career.forEach(function(career){
                //dataDs.label.push($scope.formatValue(career.data.count));//career.name);//region.name);
                dataDs.label.push(career.name + ': ' + career.data.count.toLocaleString('en-US'));//region.name);
                dataDs.fillColor.push("#4ac0b6");//career.color);
                //var count = regionsData.getCount({'region': region.id});
                dataDs.data.push(career.data.count);

                // emptyDs.label.push(region.name);
                // emptyDs.fillColor.push(region.color);
                // emptyDs.data.push(0);

                chartData.labels.push(career.name);
            });

            data.careerLegend = careerData.legends.career;

            data.careerChart = {
                data:chartData,
                options:{
                    showLabels: false, // : $scope.formatValue,
                    //stacked: false,
                    barHeight: 600,
                    scaleLabel: function(obj){return $scope.formatValue(obj.value)}
                }
            };

            ////////////////////////////////////////////////////
            //         Регионы проживания
            ////////////////////////////////////////////////////

            var regionsData = data.region ? $scope.prepareChartData(data.region, {
                'region': $scope.parameters.region
                //'sport': $scope.parameters.sport
            }) : null;

            //regionsData.legends.region.forEach()
            var allCount = regionsData.getCount();

            regionsData.legends.region.forEach(function(region){
                region.selected = true;
                var count = regionsData.getCount({'region': region.id});
                region.data = {
                    count: count,
                    percent: count/allCount*100
                };
            });
            regionsData.legends.region.sort(function(a,b){return a.data.count - b.data.count; });


            var dataDs = { label:[], fillColor:[], data:[] };
            //var emptyDs = { label:[], fillColor:[], data:[] };
            var chartData = {labels:[],datasets:[dataDs]};//, emptyDs]};

            regionsData.legends.region.forEach(function(region){
                //dataDs.label.push($scope.formatValue(region.data.count));//region.name);
                dataDs.label.push(region.name + ': ' + region.data.count.toLocaleString('en-US'));
                dataDs.fillColor.push('#4ac0b6');
                //var count = regionsData.getCount({'region': region.id});
                dataDs.data.push(region.data.count);

                // emptyDs.label.push(region.name);
                // emptyDs.fillColor.push(region.color);
                // emptyDs.data.push(0);

                chartData.labels.push(region.name);
            });

            data.regionsLegend = regionsData.legends.region;

            data.regionsChart = {
                data:chartData,
                options:{
                    showLabels: false, // : $scope.formatValue,
                    //stacked: false,
                    barHeight: 600,
                    scaleLabel: function(obj){return $scope.formatValue(obj.value)}
                }
            };


            ////////////////////////////////////////////////////
            //         Потребительское поведение
            ////////////////////////////////////////////////////



            function findById(params, id){
                var result = null;
                params.lists.some(function(obj){
                    if (obj.id == id){
                        result = obj;
                        return true;
                    }
                });
                return result;
            }

            
            data.tvHomeChart = {
                text:"Телевидение",
                chartData: [],
                options: {
                    percentageInnerCutout: 70
                }
            };
            data.tvHomeLegend = [];
            data.tvhome.data.forEach(function(item){
                var itemIndex = item.legend[0];
                var itemObj = findById($scope.parameters.tvhome, itemIndex);
                data.tvHomeChart.chartData.push({
                    //label: itemObj && itemObj.name,
                    label: (itemObj && itemObj.name) + ': ' + item.count.toLocaleString('en-US'),
                    color: itemObj && itemObj.chartColor,
                    value: item.count || 0
                });
                data.tvHomeLegend.push({
                    //id: list.id,
                    name: itemObj.name,
                    color: itemObj.chartColor
                });
            });
           

            data.electronicsChart = {
                text:"Владение устройствами",
                chartData: [],
                options: {
                    percentageInnerCutout: 70
                }
            };
            data.electronicsLegend = [];
            data.electronics.data.forEach(function(item){
                var itemIndex = item.legend[0];
                var itemObj = findById($scope.parameters.electronics_exist, itemIndex);
                data.electronicsChart.chartData.push({
                    //label: itemObj && itemObj.name,
                    label: (itemObj && itemObj.name) + ': ' + item.count.toLocaleString('en-US') ,
                    color: itemObj && itemObj.chartColor,
                    //highlight: "#78acd9",
                    value: item.count || 0
                });
                data.electronicsLegend.push({
                    name: itemObj.name,
                    color: itemObj.chartColor
                });
            });

            var carPercent = Math.round(data.car);
            data.carChart = {
                text:"Владение автомобилем",
                chartData: [{
                    //label: 'Владеют',
                    label: 'Владеют: ' + carPercent + '%',
                    legend: 'Владеют',
                    color: "#2CA02C",
                    value: carPercent
                },{
                    //label: 'Не владеют',
                    label: 'Не владеют: ' + (100-carPercent) + '%',
                    legend: 'Не владеют',
                    color: "#D62728",
                    value: 100 - carPercent
                }],
                options: {
                    percentageInnerCutout: 70
                }
            };
            data.carLegend = data.carChart.chartData.map(function(item){
                return {
                    name: item.legend,
                    color: item.color
                }
            });

            ////////////////////////////////////////////////////
            //         Сила боления для каждого клуба
            ////////////////////////////////////////////////////


            var walkData = data.walk ? $scope.prepareChartData(data.walk, {
                'walk': $scope.parameters.walk,
                'club': $scope.parameters.sport,
                sportId: sport.id
                //'sport': $scope.parameters.sport
            }) : null;

            var watchData = data.watch ? $scope.prepareChartData(data.watch, {
                'watch':$scope.parameters.watch,
                'club':$scope.parameters.sport,
                sportId: sport.id
                //'sport': $scope.parameters.sport
            }) : null;

            if (walkData && watchData){

                var clubs = walkData.legends.club.filter(function(club){
                    return watchData.legends.club.some(function(club2){
                        return club2.id == club.id;
                    })
                });

                data.clubs = [];
                clubs.forEach(function(club){
                    var ds1 = { label:[], fillColor:[], data:[] };
                    var ds2 = { label:[], fillColor:[], data:[] };
                    var chartData = {labels:[],datasets:[ds1, ds2]};
                    //cl.walkWatchChart.data = chartData;

                    data.clubs.push({
                        club:club,
                        walkLegend: walkData.legends.walk,
                        watchLegend: watchData.legends.watch,
                        walkWatchChart: {
                            data:chartData,
                            options:{
                                showLabels: false, // : $scope.formatValue,
                                //scaleLabel: function(obj){return $scope.formatValue(obj.value)},
                                stacked:false,

                                responsive: false,
                                barShowStroke: true,
                                scaleBeginAtZero: false,
                                //scaleShowGridLines : false,
                                //scaleShowHorizontalLines: false,
                                //barWidth: 30,
                                //barHeight: 500,
                                //barValueSpacing: 20,
                                barHeight: 600,
                                showHorisontalSerifs: false,
                                barsInOneLine: true,

                                //padding: 40,
                                //Boolean - Whether to show vertical lines (except Y axis)
                                scaleShowVerticalLines: false,
                                scaleLabel: function(obj){
                                    var value = Math.abs(obj.value);
                                    //return value > 1000*1000 ? value/1000/1000+'M' : value > 1000 ? value/1000+'K' : value;
                                    return value + '%';
                                },
                                scaleStartValue: -100,
                                scaleOverride: true,
                                scaleSteps: 10,
                                scaleStepWidth: 20
                                //scaleStopValue: 100

                    //barValueSpacing : -10,
                                
                            }
                        }
                    });

                    var indexes = walkData.legends.walk.map(function(item){return item.id;})
                        .concat(watchData.legends.watch.map(function(item){return item.id;}))
                        .filter(function(id, pos, arr){return arr.indexOf(id) == pos})
                        .sort();


                    //walkData.legends.walk.
                    var walkCount = walkData.getCount({'club':club.id});
                    var watchCount = watchData.getCount({'club':club.id});

                    function getPercent(value, sum){
                        var result = Math.round(value / sum * 100 * 10) / 10;
                        return result;
                    }

                    indexes.forEach(function(index){
                        var walk = walkData.legends.walk.filter(function(item){return item.id == index;})[0];
                        var watch = watchData.legends.watch.filter(function(item){return item.id == index;})[0];

                        var count = walkData.getCount({'club':club.id, 'walk':index});
                        var percent = getPercent(count,walkCount);
                        //ds1.label.push(count);
                        ds1.label.push('Ходил, '+ walk.name + ': ' + percent + '% (' + count.toLocaleString('en-US') + ')');
                        ds1.fillColor.push(walk ? walk.color || walk.chartColor : '#777777'); //club.color);
                        //ds1.data.push(-1*walkData.getCount({'club':club.id, 'walk':index}));
                        ds1.data.push(-1*percent);

                        count = watchData.getCount({'club':club.id, 'watch':index});
                        percent = getPercent(count, watchCount);
                        //ds2.label.push(count);
                        ds2.label.push('Смотрел, '+ watch.name + ': ' + percent + '% (' + count.toLocaleString('en-US') + ')');
                        ds2.fillColor.push(watch ?  watch.color || watch.chartColor : '#777777'); //club.color);
                        //ds2.data.push(watchData.getCount({'club':club.id, 'watch':index}));
                        ds2.data.push(percent);

                        chartData.labels.push('');
                    });

                }); // clubs
            }



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
        .controller('interestGraphCrtl', interestGraphCrtl);

    interestGraphCrtl.$inject = [
        '$scope',
        '$controller',
        'ParamsSrv',
        'ApiSrv',
        'graphHelpersSrv'
    ];

    function interestGraphCrtl(
        $scope,
        $controller,
        ParamsSrv,
        ApiSrv,
        graphHelpersSrv
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
                sports[list.key] = {interested: true}
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
            $scope.sportLegend = graphHelpersSrv.getSportLegend({color:'#555555'});
            $scope.interestLegend = graphHelpersSrv.getInterestLegend();
            
            $scope.$watch('sportLegend', $scope.updateGraph, true);
            $scope.$watch('interestLegend', $scope.updateGraph, true);
        };
        

        $scope.prepareData = function (data) {

            /*var interests = {};
            $scope.parameters.interest.lists.forEach(function (list) {
                interests[list.id] = {
                    id: list.id,
                    name: list.name,
                    count: 0
                }
            });
            
            var sports = {};
            $scope.parameters.sport.lists.forEach(function (list) {
                sports[list.id] = angular.merge({
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
            */

            $scope.interestData = $scope.prepareChartData(data, {
                'sport': $scope.parameters.sport,
                'sportinterest':  $scope.parameters.interest,
                'region': $scope.parameters.region
            });


        };

        $scope.updateGraph = function () {
            if (!$scope.interestData) return;


            var sports = $scope.sportLegend.filter(function(item) {
                return item.selected;
            });

            var interests = $scope.interestLegend.filter(function(item) {
                return item.selected;
            });

            var useRegions = $scope.interestData.legends.region && $scope.interestData.legends.region.length;
            
            if (useRegions){
                $scope.interestData.legends.region.forEach(function(region){
                    region.selected = true;
                    var maxSport;
                    var maxCount = 0;

					sports.forEach(function(sport){
                        var count = ($scope.interestData.getCount({'sport':sport.id, 'region':region.id, 'sportinterest':4}) || 0) +
							($scope.interestData.getCount({'sport':sport.id, 'region':region.id, 'sportinterest':5}) || 0);
                        if (count >= maxCount){
							maxCount = count;
							maxSport = sport;
						}
                    });
                    region.data = {
                        count: maxCount,
                        //percent: 50// count/allCount*100
						header: maxSport.name
                    };
                });
				$scope.regionsChart = $scope.interestData.legends.region;
                $scope.showCharts = false;
                return;
            }
			
			$scope.regionsChart = null;
            

            //var count = $scope.interestData.getCount({'sport':sport.id, 'sportinterest':interest.id});

            // используем stack только если не выбран пункт "ни то ни сё"
            var useStack = interests.every(function(item){return item.id != 3;});

            var charts = [];
            sports.forEach(function(sport){
                var chartData = {labels:[],datasets:[]};

                if (useStack){
                    var interestA = [];
                    var notInterestA = [];
                    interests.forEach(function(interest){
                        var count = $scope.interestData.getCount({'sport':sport.id, 'sportinterest':interest.id});
                        if (count == 0) return;
                        //if ($scope.chartsData.sports[sport.id].data[interest.id].count == 0) return;
                        if (interest.id < 3) interestA.push(interest);
                        if (interest.id > 3) notInterestA.push(interest);
                    });
                    var twoCols = interestA.length && notInterestA.length;

                    var firstDs = { label:[], fillColor:[], data:[] };
                    var secondDs = { label:[], fillColor:[], data:[] };

                    [[notInterestA[0],firstDs],[interestA[0],firstDs],
                        [notInterestA[1],secondDs],[interestA[1],secondDs]].forEach(function(item){
                        if(item[0]){
                            //item[1].label.push(item[0].name);
                            var count = $scope.interestData.getCount({'sport':sport.id, 'sportinterest':item[0].id});
                            //var value = $scope.chartsData.sports[sport.id].data[item[0].id].count;
                            item[1].label.push(item[0].name + ': ' + count.toLocaleString('en-US'));
                            item[1].fillColor.push(item[0].color);
                            item[1].data.push(count);
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
                        var count = $scope.interestData.getCount({'sport':sport.id, 'sportinterest':interest.id});
                        //var value = $scope.chartsData.sports[sport.id].data[interest.id].count;
                        if (count == 0) return;

                        dataDs.label.push(interest.name + ': ' + count.toLocaleString('en-US'));
                        dataDs.fillColor.push(interest.color);
                        dataDs.data.push(count);

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
                barValueSpacing: 30,
                barsInOneLine: true
                
            }};
            combineChart.data.labels = sports.map(function(item){return item.name.replace(' ','\n');});
            interests.forEach(function(interest){
                var ds = { label:[], fillColor:[], data:[] };
                sports.forEach(function(sport) {
                    var count = $scope.interestData.getCount({'sport':sport.id, 'sportinterest':interest.id});
                    //var value = $scope.chartsData.sports[sport.id].data[interest.id].count;
                    ds.label.push(interest.name + ': ' + count.toLocaleString('en-US'));//item[0].name);
                    ds.fillColor.push(interest.color);
                    ds.data.push(count);
                });
                combineChart.data.datasets.push(ds);
            });
            $scope.combineChart = (combineChart.data.labels.length > 1 ? combineChart : null);



            /*
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
                        if ($scope.chartsData.sports[sport.id].data[interest.id].count == 0) return;
                        if (interest.id < 3) interestA.push(interest);
                        if (interest.id > 3) notInterestA.push(interest);
                    });
                    var twoCols = interestA.length && notInterestA.length;

                    var firstDs = { label:[], fillColor:[], data:[] };
                    var secondDs = { label:[], fillColor:[], data:[] };

                    [[notInterestA[0],firstDs],[interestA[0],firstDs],
                    [notInterestA[1],secondDs],[interestA[1],secondDs]].forEach(function(item){
                        if(item[0]){
                            //item[1].label.push(item[0].name);
                            var value = $scope.chartsData.sports[sport.id].data[item[0].id].count;
                            item[1].label.push(item[0].name + ': ' + value.toLocaleString('en-US'));
                            item[1].fillColor.push(item[0].color);
                            item[1].data.push(value);
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
                        var value = $scope.chartsData.sports[sport.id].data[interest.id].count;
                        if (value == 0) return;
                        
                        dataDs.label.push(interest.name + ': ' + value.toLocaleString('en-US'));
                        dataDs.fillColor.push(interest.color);
                        dataDs.data.push(value);

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
                    var value = $scope.chartsData.sports[sport.id].data[interest.id].count;
                    ds.label.push(interest.name + ': ' + value.toLocaleString('en-US'));//item[0].name);
                    ds.fillColor.push(interest.color);
                    ds.data.push(value);
                });
                combineChart.data.datasets.push(ds);
            });
            $scope.combineChart = (combineChart.data.labels.length > 1 ? combineChart : null);

            */
        };




    }

}());

(function () {
	"use strict";
	angular.module('SportsensusApp')
		.controller('analyticsFooterCtrl', analyticsFooterCtrl);

	analyticsFooterCtrl.$inject = [
		'$scope',
		'$controller',
		'ParamsSrv',
		'ApiSrv'
	];

	function analyticsFooterCtrl(
		$scope,
		$controller,
		ParamsSrv,
		ApiSrv
	) {
		$controller('baseFooterCtrl', {$scope: $scope});

		$scope.checkButtonText = 'Анализ пакета';
		//$scope.checkButtonPage = null;
		$scope.checkButtonClick = function(){
			//$scope.activePage = $scope.pages[$scope.checkButtonPage];
			$scope.setActivePageById('analytics/analytics');
		};
		
	}

}());



(function () {
	"use strict";
	angular.module('SportsensusApp')
		.controller('baseFooterCtrl', baseFooterCtrl);

	baseFooterCtrl.$inject = [
		'$scope',
		'$controller',
		'ParamsSrv',
		'ApiSrv'
	];

	function baseFooterCtrl(
		$scope,
		$controller,
		ParamsSrv,
		ApiSrv
	) {
		

		$scope.$on('ApiSrv.countError', function(){
			setAudienceCount(0);
		});
		$scope.$on('ApiSrv.countLoaded', readCount);

		function readCount(){
			var result = ApiSrv.getLastCountResult();
			if (result && result.is_valid_count)
				setAudienceCount(result.audience_count);
			else
				setAudienceCount(0);
		}
		readCount();

		function setAudienceCount(audienceCount) {
			$scope.audienceCount = audienceCount;
			if (audienceCount == null)
				$scope.audienceCountText = '' ;
			else if (audienceCount != 0)
				$scope.audienceCountText = 'Болельщики: ' + audienceCount.toLocaleString();
			else
				$scope.audienceCountText = 'Болельщики: недостаточно данных';
		}


		$scope.checkButtonText = '';
		//$scope.checkButtonPage = null;
		$scope.checkButtonClick = function(){
			//$scope.activePage = $scope.pages[$scope.checkButtonPage];
			$scope.setActivePage($scope.pages[$scope.checkButtonPage]);
		};

		$scope.$on('ParamsSrv.paramsChanged', paramsChanged);
		paramsChanged();

		function paramsChanged(){
			var selected = ParamsSrv.getSelectedParams();
			var audienceSelected = !!(selected.demography || selected.regions || selected.consume);
			$scope.sportSelected = !!selected.sport;
			var filtersSelected = !!(selected.interest || selected.rooting || selected.involve || selected.image);

			if ($scope.type == 'infobox') {
				if (audienceSelected && !$scope.sportSelected) {
					$scope.checkButtonText = 'Экспресс-результат';
					$scope.checkButtonPage = 'expressAudience/expressAudience';
				} else if ($scope.sportSelected && !audienceSelected && !filtersSelected) {
					$scope.checkButtonText = 'Экспресс-результат';
					$scope.checkButtonPage = 'expressSport/expressSport';
				} else {
					$scope.checkButtonText = 'Показать результат';
					$scope.checkButtonPage = 'allGraphs';
				}
			} /*else if ($scope.type == 'analytics'){
			 $scope.checkButtonText = 'Анализ пакета';
			 $scope.checkButtonPage = 'analytics/analytics';
			 }*/
		}



	}

}());

(function () {
	"use strict";
	angular.module('SportsensusApp')
		.controller('infoboxFooterCtrl', infoboxFooterCtrl);

	infoboxFooterCtrl.$inject = [
		'$scope',
		'$controller',
		'ParamsSrv',
		'ApiSrv'
	];

	function infoboxFooterCtrl(
		$scope,
		$controller,
		ParamsSrv,
		ApiSrv
	) {
		$controller('baseFooterCtrl', {$scope: $scope});


		
		$scope.checkButtonText = '';
		//$scope.checkButtonPage = null;
		$scope.checkButtonClick = function(){
			//$scope.activePage = $scope.pages[$scope.checkButtonPage];
			$scope.setActivePage($scope.pages[$scope.checkButtonPage]);
		};

		$scope.$on('ParamsSrv.paramsChanged', paramsChanged);
		paramsChanged();

		function paramsChanged(){
			var selected = ParamsSrv.getSelectedParams();
			var audienceSelected = !!(selected.demography || selected.regions || selected.consume);
			$scope.sportSelected = !!selected.sport;
			var filtersSelected = !!(selected.interest || selected.rooting || selected.involve || selected.image);

			if ($scope.type == 'infobox') {
				if (audienceSelected && !$scope.sportSelected) {
					$scope.checkButtonText = 'Экспресс-результат';
					$scope.checkButtonPage = 'expressAudience/expressAudience';
				} else if ($scope.sportSelected && !audienceSelected && !filtersSelected) {
					$scope.checkButtonText = 'Экспресс-результат';
					$scope.checkButtonPage = 'expressSport/expressSport';
				} else {
					$scope.checkButtonText = 'Показать результат';
					$scope.checkButtonPage = 'allGraphs';
				}
			} /*else if ($scope.type == 'analytics'){
				$scope.checkButtonText = 'Анализ пакета';
				$scope.checkButtonPage = 'analytics/analytics';
			}*/
		}



	}

}());

(function () {
	"use strict";
	angular.module('SportsensusApp')
		.controller('infoboxResultFooterCtrl', infoboxResultFooterCtrl);

	infoboxResultFooterCtrl.$inject = [
		'$scope',
		'$controller',
		'ParamsSrv',
		'ApiSrv',
		'analyticsSrv'
	];

	function infoboxResultFooterCtrl(
		$scope,
		$controller,
		ParamsSrv,
		ApiSrv,
		analyticsSrv
	) {
		$controller('baseFooterCtrl', {$scope: $scope});

		$scope.checkButtonText = 'Сбросить';
		//$scope.checkButtonPage = null;
		$scope.checkButtonClick = function(){
			//$scope.activePage = $scope.pages[$scope.checkButtonPage];
			//$scope.setActivePage($scope.pages[$scope.checkButtonPage]);
			['demography', 'consume', 'regions',
				'sport','interest','rooting','involve','image'].forEach(function(type){
				ParamsSrv.clearSelection(type);
			});
			
			analyticsSrv.setSelected({
				sport: null,
				league: null,
				club: null
			});
			
			$scope.setActiveMenuItemById('demography');

		};

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
            //$scope.prepareLegends();
            requestData();
            //requestData($scope.sportLegend[0]);
            updateCaption();
        });

        $scope.sportDatas = {};

        function updateCaption(){
            $scope.caption = ParamsSrv.getSelectedDemographyCaption();
        }

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
            ApiSrv.getExpressAudience(audience).then(function (data) {
                $scope.graphs = {};
                prepareInterestData(data.interest);
                prepareInvolveData(data.involvment);
                prepareKnownData(data.clubs_known);
                prepareKnownHelpData(data.clubs_known_help);
                prepareWatchData(data.watch);
                prepareWalkData(data.walk);


                var a = data;
                
                //$scope.updateGraph();
            }, function () {
            });
        }

        var colorGenerator = d3.scale.category10();

        


        function prepareInterestData(data){

            data = $scope.prepareChartData(data, {
                'sport': $scope.parameters.sport,
                'interest': $scope.parameters.interest
            });

            
            var datasets2 = data.legends.interest.map(function(){
                return { label:[], fillColor:[], data:[] }
            });
            var chartData2 = {labels:[],datasets:datasets2};
            data.legends.sport.forEach(function(sport) {
                data.legends.interest.forEach(function (interest, interestIndex) {
                    var count = data.getCount({'sport': sport.id, 'interest': interest.id});
                    var ds = datasets2[interestIndex];
                    //ds.label.push('');
                    ds.label.push(interest.name + ': ' + count.toLocaleString('en-US'));
                    ds.fillColor.push(interest.color);
                    ds.data.push(count);
                });
                chartData2.labels.push(sport.name);
            });

            
            $scope.graphs.interest = {
                legends:data.legends,

                chartData2:{
                    data:chartData2,
                    options:{
                        showLabels: false, // : $scope.formatValue,
                        stacked: true,
                        scaleLabel: function(obj){return $scope.formatValue(obj.value)}
                    }
                }
            };
            

            // $scope.showCharts = !!charts.length && !!interests.length;
            // $scope.charts = charts;
        }

        function prepareInvolveData(data){
            data = $scope.prepareChartData(data, {
                'sport': $scope.parameters.sport,
                'involve': $scope.parameters.involve
            });

            var charts = [];
            // var datasets = data.legends.involve.map(function(){
            //     return { label:[], fillColor:[], data:[] }
            // });
            // var chartData = {labels:[],datasets:datasets};

            data.legends.sport.forEach(function(sport) {
                var chart = {
                    //sport: sport,
                    text:sport.name,
                    chartData: [],
                    options: {
                        percentageInnerCutout: 70
                    }
                };
                charts.push(chart);

                data.legends.involve.forEach(function (involve, involveIndex) {
                    var count = data.getCount({'sport': sport.id, 'involve': involve.id});
                    chart.chartData.push({
                        //label: involve.name,
                        label: involve.name + ': ' + count.toLocaleString('en-US'),
                        color: involve.color,
                        //highlight: "#78acd9",
                        value: count
                    });

                });

            });

            $scope.graphs.involve = {
                legends:data.legends,
                charts: charts
            };


            
        }

        function prepareKnownData(data){
            data = $scope.prepareChartData(data, {
                'sport': $scope.parameters.sport,
                'club': $scope.parameters.sport
            });

            
            
            var dataDs2 = { label:[], fillColor:[], data:[] };
            var chartData2 = {labels:[],datasets:[dataDs2]};

            data.legends.club.forEach(function(club, index) {
                var count = data.getCount({'sport': club.sport.id, 'club': club.id});
                dataDs2.label.push(club.name + ' (' + club.sport.name + '): ' + count.toLocaleString('en-US'));
                dataDs2.fillColor.push(colorGenerator(index)); //club.color);
                dataDs2.data.push(count);

                chartData2.labels.push(club.name + ' (' + club.sport.name + ')');
            });


            $scope.graphs.known = {
                legends:data.legends,
                chartData2:{
                    data:chartData2,
                    options:{
                        showLabels: false, // : $scope.formatValue,
                        scaleLabel: function(obj){return $scope.formatValue(obj.value)}
                    }
                }
            };
        }

        function prepareKnownHelpData(data){
            data = $scope.prepareChartData(data, {
                'sport': $scope.parameters.sport,
                'club': $scope.parameters.sport
            });

           
            var dataDs2 = { label:[], fillColor:[], data:[] };
            var chartData2 = {labels:[],datasets:[dataDs2]};
            data.legends.club.forEach(function(club, index) {
                var count = data.getCount({'sport': club.sport.id, 'club': club.id});
                dataDs2.label.push(club.name + ' (' + club.sport.name + '): ' + count.toLocaleString('en-US'));
                dataDs2.fillColor.push(colorGenerator(index));
                dataDs2.data.push(count);

                chartData2.labels.push(club.name + ' (' + club.sport.name + ')');
            });


            $scope.graphs.knownHelp = {
                legends:data.legends,
                
                chartData2:{
                    data:chartData2,
                    options:{
                        showLabels: false, // : $scope.formatValue,
                        scaleLabel: function(obj){return $scope.formatValue(obj.value)}
                    }
                }
            };
        }

        function prepareWatchData(data){
            data = $scope.prepareChartData(data, {
                'sport': $scope.parameters.sport,
                'club': $scope.parameters.sport,
                'watch': $scope.parameters.watch
            });

           


            var datasets2 = data.legends.watch.map(function(){
                return { label:[], fillColor:[], data:[] }
            });
            var chartData2 = {labels:[],datasets:datasets2};

            data.legends.club.forEach(function(club) {
                data.legends.watch.forEach(function (watch, watchIndex) {
                    var count = data.getCount({'sport': club.sport.id, 'club': club.id, 'watch': watch.id}) || 0;
                    var ds = datasets2[watchIndex];
                    ds.label.push(watch.name + ': ' + count.toLocaleString('en-US'));
                    ds.fillColor.push(watch.color);
                    ds.data.push(count);
                });
                chartData2.labels.push(club.name + ' (' + club.sport.name + ')');
            });
            
            $scope.graphs.watch = {
                legends:data.legends,
               
                chartData2:{
                    data:chartData2,
                    options:{
                        showLabels: false, // : $scope.formatValue,
                        scaleLabel: function(obj){return $scope.formatValue(obj.value)}
                    }
                }
            };
        }

        function prepareWalkData(data){
            data = $scope.prepareChartData(data, {
                'sport': $scope.parameters.sport,
                'club': $scope.parameters.sport,
                'walk': $scope.parameters.walk
            });
            

            var datasets2 = data.legends.walk.map(function(){
                return { label:[], fillColor:[], data:[] }
            });
            var chartData2 = {labels:[],datasets:datasets2};

            data.legends.club.forEach(function(club) {
                data.legends.walk.forEach(function (walk, walkIndex) {
                    var count = data.getCount({'sport': club.sport.id, 'club': club.id, 'walk': walk.id}) || 0;
                    var ds = datasets2[walkIndex];
                    ds.label.push(walk.name + ': ' + count.toLocaleString('en-US'));
                    ds.fillColor.push(walk.color);
                    ds.data.push(count);
                });
                chartData2.labels.push(club.name + ' (' + club.sport.name + ')');
            });
            
            $scope.graphs.walk = {
                legends:data.legends,
                
                chartData2:{
                    data:chartData2,
                    options:{
                        showLabels: false, // : $scope.formatValue,
                        scaleLabel: function(obj){return $scope.formatValue(obj.value)}
                    }
                }
            };
        }



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
        'ApiSrv',
        'graphHelpersSrv'
    ];

    function imageGraphCrtl(
        $scope,
        $controller,
        ParamsSrv,
        ApiSrv,
        graphHelpersSrv
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
                sports[list.key] = {interested: true}
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
            $scope.sportLegend = graphHelpersSrv.getSportLegend();
            $scope.imageLegend = graphHelpersSrv.getImageLegend();
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
                sports[list.id] = angular.merge({
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




            
            var chartData = [];
            var localColors = [];
            var maxValue = 0;
            //$scope.sportLegend.forEach(function (item) {
                //if (!item.selected) return;
            sports.forEach(function(sport){
                //var maxValue = 0;
                var axisData = [];
                var data = $scope.chartsData.sports[sport.id].data;
                images.forEach(function(image){
                //Object.keys(images).forEach(function (imageId) { // цикл по восприятиям
                    // var value = sport.data[imageId].count / 1000 / 1000;
                    var value = $scope.chartsData.sports[sport.id].data[image.id].count;
                    //var value = sport.data[imageId].count;
                    //value = Math.round(value * 10) / 10;
                    //axisData.push({axis: images[imageId].name, value: value});
                    axisData.push({
                        axis: image.name, 
                        value: value, 
                        tooltip: sport.name + ': ' + image.name + ': ' + value.toLocaleString('en-US'),
                        tooltipColor: sport.color
                    });
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
        .controller('involveGraphCrtl', involveGraphCrtl);

    involveGraphCrtl.$inject = [
        '$scope',
        '$controller',
        'ParamsSrv',
        'ApiSrv',
        'graphHelpersSrv'
    ];

    function involveGraphCrtl(
        $scope,
        $controller,
        ParamsSrv,
        ApiSrv,
        graphHelpersSrv
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
                sports[list.key] = {interested: true}
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
            $scope.sportLegend = graphHelpersSrv.getSportLegend({color:'#555555'});
            $scope.involveLegend = graphHelpersSrv.getInvolveLegend();

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
                sports[list.id] = angular.merge({
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
                        var value = $scope.chartsData.sports[sport.id].data[involve.id].count;
                        if (value == 0) return;

                        dataDs.label.push(involve.name + ': ' + value.toLocaleString('en-US'));
                        dataDs.fillColor.push(involve.color);
                        dataDs.data.push($scope.chartsData.sports[sport.id].data[involve.id].count);

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
                    var value = $scope.chartsData.sports[sport.id].data[involve.id].count;
                    ds.label.push(involve.name + ': ' + value.toLocaleString('en-US'));//item[0].name);
                    ds.fillColor.push(involve.color);
                    ds.data.push(value);

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
		.controller('sportAnalyticsCtrl', sportAnalyticsCtrl);

	sportAnalyticsCtrl.$inject = [
		'$scope',
		'$controller',
		'$q',
		'ParamsSrv',
		'ApiSrv',
		'analyticsSrv'
	];

	function sportAnalyticsCtrl(
		$scope,
		$controller,
		$q,
		ParamsSrv,
		ApiSrv,
		analyticsSrv
	) {
		//$controller('baseGraphCtrl', {$scope: $scope});



		ParamsSrv.getParams().then(function (params) {
			$scope.parameters = params;

			// TODO фильтровать спорты/лиги/клубы по наличию данных для аналитики, не хардкодить
			$scope.sports = [];

			
			$scope.selected = analyticsSrv.getSelected();
			$scope.$on('analyticsSrv.selectionChanged', function(event, value){
				$scope.selected = value;
			});
			
			
			$scope.parameters.sport.lists.forEach(function(sport){

				var selected = analyticsSrv.getSelected || {};

				//return sport.key == 'football' || sport.key == 'hockey';
				if (sport.key == 'hockey'){

					/*var sportObj = angular.extend({}, sport);

					if (!selected.club && !selected.league && selected.sport && selected.sport.id == sportObj.id)
						sportObj.selectedInAnalytics = true;

					var leagues = [];
					sportObj.leagues.forEach(function(league){
						//if (league.id == 1){
						if (league.name == "КХЛ"){
							var leagueObj = angular.extend({}, league);
							//leagueObj.disableSelectionInAnalytics = true;
							if (!selected.club && selected.league && selected.sport &&
								selected.sport.id == sportObj.id && selected.league.id == leagueObj.id )
								leagueObj.selectedInAnalytics = true;

							leagues.push(leagueObj);
						}
					});
					sportObj.leagues = leagues;
					sportObj.disableSelectionInAnalytics = true;

					$scope.sports.push(sportObj);*/
					$scope.sports.push(sport);

				} else if (sport.key == 'football'){

					/*var sportObj = angular.extend({}, sport);

					if (!selected.club && !selected.league && selected.sport && selected.sport.id == sportObj.id)
						sportObj.selectedInAnalytics = true;

					var leagues = [];
					sportObj.leagues.forEach(function(league){
						//if (league.id == 1){
						if (league.name == "РФПЛ"){
							var leagueObj = angular.extend({}, league);

							if (!selected.club && selected.league && selected.sport &&
								selected.sport.id == sportObj.id && selected.league.id == leagueObj.id )
								leagueObj.selectedInAnalytics = true;

							//leagueObj.disableSelectionInAnalytics = true;
							leagues.push(leagueObj);
						}
					});
					sportObj.leagues = leagues;

					sportObj.disableSelectionInAnalytics = true;
					$scope.sports.push(sportObj);*/
					$scope.sports.push(sport);

				}
			}); 
			
			
			//$scope.prepareLegends();
		});

		$scope.checkSelected = function(){
			var selected = analyticsSrv.getSelected();
			return !!(selected.sport || selected.league || selected.club);
		};


		$scope.clearSelection = function(){
			// $scope.parameters.sport.lists.forEach(function(sport){
			$scope.sports.forEach(function(sport){
				//sport.selectedInAnalytics = false;
				sport.leagues && sport.leagues.forEach(function(league){
					//league.selectedInAnalytics = false;
				});
				sport.clubs && sport.clubs.forEach(function(club){
					//club.selectedInAnalytics = false;
				});
			});
			analyticsSrv.setSelected({
				sport: null,
				league: null,
				club: null
			});
		};

		$scope.selectSport = function(sport){
			if (sport.disableSelectionInAnalytics) return;
			var val = (sport != $scope.selected.sport || ($scope.selected.league || $scope.selected.club));

			//var val = !sport.selectedInAnalytics;
			$scope.clearSelection();
			//sport.selectedInAnalytics = val;
			analyticsSrv.setSelected({
				sport: val ? sport: null,
				league: null,
				club: null
			});
		};

		$scope.selectLeague = function(league, sport){
			if (league.disableSelectionInAnalytics) return;
			var val = (league != $scope.selected.league || ($scope.selected.club));
			//var val = !league.selectedInAnalytics;
			$scope.clearSelection();
			//league.selectedInAnalytics = val;
			//sport.selectedInAnalytics = false;
			analyticsSrv.setSelected({
				sport: val ? sport : null,
				league: val ? league : null,
				club: null
			});
		};

		$scope.selectClub = function(club, league, sport){
			var val = (club != $scope.selected.club);
			//var val = !club.selectedInAnalytics;
			$scope.clearSelection();
			//club.selectedInAnalytics = val;
			//league.selectedInAnalytics = false;
			//sport.selectedInAnalytics = false;
			analyticsSrv.setSelected({
				sport: val ? sport : null,
				league: val ? league : null,
				club: val ? club : null
			});
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
        '$q',
        'ParamsSrv',
        'ApiSrv',
        'graphHelpersSrv'
    ];

    function rootingGraphCrtl(
        $scope,
        $controller,
        $q,
        ParamsSrv,
        ApiSrv,
        graphHelpersSrv
    ) {

        $controller('baseGraphCtrl', {$scope: $scope});

        $scope.dataBySport = {};
        //$scope.chartDatas = {sportId: chartData}
        //$scope.chartDatas = {};

        ParamsSrv.getParams().then(function (params) {
            $scope.parameters = params;
            $scope.prepareLegends();
            //requestGraph();


            // $scope.$watch(function(){
            //     return [$scope.sportLegend, $scope.rootingLegend]
            // }, $scope.requestGraph, true);

            $scope.$watch('sportLegend', $scope.requestGraph, true);
            $scope.$watch('rootingLegend', $scope.updateGraph, true);
            //$scope.$watch('', $scope.requestGraph, true);

            //$scope.$watch('involveLegend', $scope.updateGraph, true);
        });

        $scope.prepareLegends = function () {
            //$scope.sportLegend = $scope.getSportLegend({color:'#555555', clubs:true, selectAll:false})
            //    .filter(function(sport){return !!sport.clubs;});

            $scope.sportLegend = graphHelpersSrv.getLegend($scope.parameters.sport.lists, {color:'#555555', selectAll:false, depth:1})
                .filter(function(sport){return sport.clubs && sport.clubs.length;});

            $scope.rootingLegend = graphHelpersSrv.getLegend($scope.parameters.rooting.lists, {depth:1});
            $scope.watchLegend = $scope.rootingLegend.filter(function(child){return child.key == 'watch';})[0].lists;
            $scope.walkLegend = $scope.rootingLegend.filter(function(child){return child.key == 'walk';})[0].lists;


            //getInvolveLegend();
            //$scope.watchLegend = $scope.getLegend($scope.parameters.watch);
            //$scope.walkLegend = $scope.getLegend($scope.parameters.walk);

            //$scope.$watch('sportLegend', $scope.updateGraph, true);
            //$scope.$watch('involveLegend', $scope.updateGraph, true);
        };

        //$scope.showCharts = false;

        // запрашиваем для выбранного в легенде спорта/клуба, но со всеми rooting, watch и walk
        $scope.requestGraph = function(sportId) {
            var audience = ParamsSrv.getSelectedAudience();
            var sports = {};

            $scope.sportLegend.forEach(function (list) {
                if (!list.selected) return;
                var sportObj = {interested: true};
                sportObj.clubs = list.clubs ? list.clubs.filter(function(club){return club.selected;}).map(function(club){return club.id; }) : [];
                if (!sportObj.clubs.length) return;
                sports[list.key] = sportObj;
            });

            var rooting = $scope.parameters.rooting.lists.map(function (list) {return list.id;});
            var rootingWatch = $scope.parameters.watch.lists.map(function (list) {return list.id;});// [1, 2, 3, 4];
            var rootingWalk = $scope.parameters.walk.lists.map(function (list) {return list.id;}); //[1, 2, 3, 4];

            // var sportrooting = {
            //     sport: sports,
            //     rooting: [1,2,3,4], //rooting, //[1,2],
            //     rooting_watch: [31, 32, 33, 34],
            //     rooting_walk: [41, 42, 43, 44]
            // };
            
            $q.all({
                rooting: ApiSrv.getRootingGraph(audience, sports, rooting),
                watch: ApiSrv.getRootingWatchGraph(audience, sports, rootingWatch),
                walk: ApiSrv.getRootingWalkGraph(audience, sports, rootingWalk)
            }).then(function(obj){
                $scope.prepareData(obj);
                $scope.updateGraph();
            });

            // ApiSrv.getRootingGraph(audience, sports, rooting).then(function (graphData) {
            //     $scope.prepareData(graphData);
            //     $scope.updateGraph();
            // }, function () {
            // });
        };

        


        $scope.checkSport = function(item){
            item.selected = !item.selected;
        };


        $scope.prepareData = function (data) {

            var rootingData = data.rooting ? $scope.prepareChartData(data.rooting, {
                'rooting':$scope.parameters.rooting,
                'sport':$scope.parameters.sport,
                'club':$scope.parameters.sport
                //sportId: sport.id
                //'sport': $scope.parameters.sport
            }) : null;

            var watchData = data.watch ? $scope.prepareChartData(data.watch, {
                'rooting':$scope.parameters.watch,
                'sport':$scope.parameters.sport,
                'club':$scope.parameters.sport
                //sportId: sport.id
                //'sport': $scope.parameters.sport
            }) : null;

            var walkData = data.walk ? $scope.prepareChartData(data.walk, {
                'rooting':$scope.parameters.walk,
                'sport':$scope.parameters.sport,
                'club':$scope.parameters.sport
                //sportId: sport.id
                //'sport': $scope.parameters.sport
            }) : null;

            $scope.chartsData = {
                rooting: rootingData,
                watch: watchData,
                walk: walkData
            };

            $scope.updateGraph();


            /*

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
                sports[list.id] = angular.merge({
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
        */

        };

        $scope.updateGraph = function () {
            if (!$scope.chartsData) return;

            var sports = $scope.sportLegend.filter(function(item) {
                return item.selected;
            });

            var rootings = $scope.rootingLegend.filter(function(item) {
                return item.selected;
            });

            // var watches = $scope.watchLegend.filter(function(item) {
            //     return item.selected;
            // });
			//
            // var walks = $scope.walkLegend.filter(function(item) {
            //     return item.selected;
            // });

            //$scope.watchCharts = [];
            //$scope.walkCharts = [];
            $scope.rootingCharts = [];
            rootings.map(function(rooting){
                var rootingData = {name: rooting.name, subItems: []};
                $scope.rootingCharts.push(rootingData);

                var walkWatchItems = null;
                if (rooting.key == 'walk' || rooting.key == 'watch'){
                    walkWatchItems = $scope[rooting.key+'Legend'].filter(function(item) {
                        return item.selected;
                    });
                    if (!walkWatchItems.length) {
                        walkWatchItems = null;
                    }
                }

                var dataDs = { label:[], fillColor:[], data:[] };
                var chartData = {labels:[],datasets:[dataDs]};

                rootingData.chart = {
                    data:chartData,
                    options:{
                        showLabels: false, // : $scope.formatValue,
                        barHeight: 600,
                        scaleLabel: function(obj){return $scope.formatValue(obj.value)}
                    }
                };


                sports.forEach(function(sport) {
                    sport.clubs.forEach(function (club) {
                        if (!club.selected) return;

                        var count = $scope.chartsData.rooting.getCount({
                                'sport': sport.id,
                                'club': club.id,
                                'rooting': rooting.id
                            }) || 0;
                        dataDs.label.push(club.name + ' (' + sport.name + '): ' + count.toLocaleString('en-US'));
                        dataDs.fillColor.push(rooting.color);
                        dataDs.data.push(count);
                        chartData.labels.push(club.name + ' (' + sport.name + ')');

                        if (walkWatchItems){
                            var clubData = {name: club.name};
                            clubData.chart = {
                                text: club.name + ' (' + sport.name + ')',
                                chartData: [],
                                options: {
                                    percentageInnerCutout: 70
                                }
                            };
                            //$scope[rooting.key+'Charts'].push(clubData);
                            rootingData.subItems.push(clubData);

                            walkWatchItems.forEach(function(item){
                                //var options = {'sport': sport.id, 'club': club.id, 'rooting':item.id};
                                //options[rooting.key] = item.id;
                                var count = $scope.chartsData[rooting.key].getCount({'sport': sport.id, 'club': club.id, 'rooting':item.id}) || 0;
                                clubData.chart.chartData.push({
                                    label: (item.name) + ': ' + count.toLocaleString('en-US'),
                                    color: item.color,
                                    value: count || 0
                                });
                            });
                        }
                    })
                })


            });


            return;

            $scope.dataBySport = {};
            sports.forEach(function(sport){
                var sportData = {};
                $scope.dataBySport[sport.id] = sportData;

                sportData.rootingCharts = rootings.map(function(rooting){
                    var rootingData = {name: rooting.name};
                    var walkWatchItems = null;
                    if (rooting.key == 'walk' || rooting.key == 'watch'){
                        walkWatchItems = $scope[rooting.key+'Legend'].filter(function(item) {
                            return item.selected;
                        });
                        if (!walkWatchItems.length) {
                            walkWatchItems = null;
                        } else {
                            sportData[rooting.key+'Charts'] = [];
                        }
                    }

                    var dataDs = { label:[], fillColor:[], data:[] };
                    var chartData = {labels:[],datasets:[dataDs]}; //, emptyDs]};

                    rootingData.chart = {
                        data:chartData,
                        options:{
                            showLabels: false, // : $scope.formatValue,
                            //stacked: false,
                            barHeight: 600,
                            scaleLabel: function(obj){return $scope.formatValue(obj.value)}
                        }
                    };

                    var clubs = sport.clubs.filter(function(item) {
                        return item.selected;
                    });

                    clubs.forEach(function(club){
                        var count = $scope.chartsData.rooting.getCount({'sport': sport.id, 'club': club.id, 'rooting': rooting.id}) || 0;
                        dataDs.label.push(club.name + ' (' + sport.name + '): ' + count.toLocaleString('en-US'));
                        dataDs.fillColor.push(rooting.color);
                        dataDs.data.push(count);
                        chartData.labels.push(club.name + ' (' + sport.name + ')');

                        if (walkWatchItems){
                            var clubData = {name: club.name};
                            clubData.chart = {
                                //text: item.name,
                                chartData: [],
                                options: {
                                    percentageInnerCutout: 70
                                }
                            };
                            walkWatchItems.forEach(function(item){
                                var options = {'sport': sport.id, 'club': club.id};
                                options[rooting.key] = item.id;
                                var count = $scope.chartsData[rooting.key].getCount(options) || 0;
                                clubData.chart.chartData.push({
                                    label: (item.name) + ': ' + count.toLocaleString('en-US'),
                                    color: item.chartColor,
                                    value: count || 0
                                });
                            });
                        }


                    });

                    //data.careerLegend = careerData.legends.career;




                    if (rooting.key == 'walk' || rooting.key == 'watch'){
                        var items = rooting.key == 'walk' ? walks : watches;
                        if (items.length){
                            sportData[rooting.key+'Chart'] = {
                                //text: item.name,
                                chartData: [],
                                options: {
                                    percentageInnerCutout: 70
                                }
                            };

                            items.forEach(function(item){
                                var options = {'sport': sport.id, 'club': club.id, 'rooting': rooting.id};
                                options[rooting.key] = item.id;
                                var count = $scope.chartsData[rooting.key].getCount(options) || 0;
                                sportData[rooting.key+'Chart'].chartData.push({
                                    label: (item.name) + ': ' + count.toLocaleString('en-US'),
                                    color: item.chartColor,
                                    value: count || 0
                                });
                            })
                        }

                    }

                    return rootingData;
                });

            });

            return;
            
            $scope.rootingCharts = rootings.map(function(rooting){

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
                    var value = $scope.chartsData.sports[sport.id].data[involve.id].count;
                    if (value == 0) return;

                    dataDs.label.push(involve.name);
                    dataDs.fillColor.push(involve.color);
                    dataDs.data.push($scope.chartsData.sports[sport.id].data[involve.id].count);

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
                    ds.data.push($scope.chartsData.sports[sport.id].data[involve.id].count);

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
	 * @example
	 */
	angular.module('SportsensusApp')
		.directive('advertisingDir', advertisingDir);

	advertisingDir.$inject = [
		'$rootScope'
	];

	function advertisingDir(
		$rootScope
	)    {
		return {
			restrict: 'E',
			scope: {
				options: '=',
				type: '@'
			},
			templateUrl: '/views/widgets/infobox/panels/analytics/advertising/advertising.html',
			link: function ($scope, $el, attrs) {
				//if (angular.isUndefined($scope.selectable))
				//   $scope.selectable = true;
			},

			controller: [
				'$scope',
				'$routeParams',
				'$location',
				'$window',
				'ApiSrv',
				function(
					$scope
				){


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
		.controller('footballFieldCtrl', footballFieldCtrl);

	footballFieldCtrl.$inject = [
		'$scope',
		'$controller',
		'$q',
		'ParamsSrv',
		'ApiSrv'
	];

	function footballFieldCtrl(
		$scope,
		$controller,
		$q,
		ParamsSrv,
		ApiSrv
	) {
		$controller('hockeyBoxBaseCtrl', {$scope: $scope});
		
		var promises = [];
		promises.push(ApiSrv.getStatic('football').then(function(hockeyData){
			hockeyData.forEach(function(item) {
				if (item.type == 'championship') {
					$scope.championship = item;
				} else if (item.type == 'footballField') {
					$scope.playgroundData = item;
				} /*else if (item.type == 'hockeyUniform') {
					$scope.uniformData = item;
				} else if (item.type == 'hockeyVideoOffline') {
					$scope.videoOfflineData = item;
				} else if (item.type == 'hockeyVideoOnline') {
					$scope.videoOnlineData = item;
				}*/
			});
		}));

		promises.push(ParamsSrv.getParams().then(function(params){
			$scope.parameters = params;
		}));


		// все данные загружены
		$q.all(promises).then(function(){
			$scope.prepare();

			function preparePlaces(data){
				if (data.placesSelection) return;
				data.placesSelection = {};
				data.places.forEach(function(place){
					data.placesSelection[place] = {key: place, selected: false};
				});
			}

			preparePlaces($scope.playgroundData);
			// preparePlaces($scope.uniformData);
			// preparePlaces($scope.videoOfflineData);
			// preparePlaces($scope.videoOnlineData);


			$scope.playgroundPlacesA = [];
			var columnsCount = 4;
			//var places = Object.keys($scope.playgroundData.places).map(function(key){return {key: key, place: $scope.playgroundData.places[key]}; });
			var count = $scope.playgroundData.places.length;
			for (var col=1; col <= columnsCount; col++){
				var arr = $scope.playgroundData.places.slice(Math.ceil(count/columnsCount*(col-1)),Math.ceil(count/columnsCount*col));
				$scope.playgroundPlacesA.push(arr.map(function(key){ return $scope.playgroundData.placesSelection[key]; }));
			}

			$scope.$on('ApiSrv.countLoaded', readCount);
			readCount();

			function readCount(){
				var result = ApiSrv.getLastCountResult();
				$scope.audiencePercent = result.audiencePercent / 100;
				$scope.calc();
			}

			$scope.$watch('totalCost', $scope.calc);

			$scope.$watch('playgroundData.placesSelection', $scope.calc, true);
			// $scope.$watch('uniformData.placesSelection', $scope.calc, true);
			// $scope.$watch('videoOfflineData.placesSelection', $scope.calc, true);
			// $scope.$watch('videoOnlineData.placesSelection', $scope.calc, true);
		});
		
		$scope.audiencePercent = 0;


// расчет видимости выбранных рекламных конструкций на площадке (0.0 - 1.0)
		$scope.calcVisibility = function(){
			
			var data =  {
				playgroundOnline: 		$scope.calcSectors($scope.playgroundData, 'Online'),
				playgroundOffline:		$scope.calcSectors($scope.playgroundData, 'Offline'),
				// uniformOnline:	 		$scope.calcSectors($scope.uniformData, 'Online'),
				// uniformOffline: 		$scope.calcSectors($scope.uniformData, 'Offline'),
				// videoOfflineOnline: 	$scope.calcSectors($scope.videoOfflineData, 'Online'),
				// videoOfflineOffline: 	$scope.calcSectors($scope.videoOfflineData, 'Offline'),
				// videoOnlineOnline: 		$scope.calcSectors($scope.videoOnlineData, 'Online'),
				// videoOnlineOffline: 	$scope.calcSectors($scope.videoOnlineData, 'Offline')
			};
			var dataEff = {
				playgroundOnline: 		$scope.calcSectors($scope.playgroundData, 'Online', true),
				playgroundOffline:		$scope.calcSectors($scope.playgroundData, 'Offline', true),
				// uniformOnline:	 		$scope.calcSectors($scope.uniformData, 'Online', true),
				// uniformOffline: 		$scope.calcSectors($scope.uniformData, 'Offline', true),
				// videoOfflineOnline: 	$scope.calcSectors($scope.videoOfflineData, 'Online', true),
				// videoOfflineOffline: 	$scope.calcSectors($scope.videoOfflineData, 'Offline', true),
				// videoOnlineOnline: 		$scope.calcSectors($scope.videoOnlineData, 'Online', true),
				// videoOnlineOffline: 	$scope.calcSectors($scope.videoOnlineData, 'Offline', true)
			};
			
			
			var result = {
				online: Math.max(data.playgroundOnline),
				offline: Math.max(data.playgroundOffline),
				
				// дома учитывается площадка, форма и видео, в гостях - форма
				offlineHome: Math.max(data.playgroundOffline),
				offlineGuest: Math.max(0),
				
				
				onlineEff: Math.max(dataEff.playgroundOnline),
				offlineEff: Math.max(dataEff.playgroundOffline),
				
				// дома учитывается площадка, форма и видео, в гостях - форма
				offlineEffHome: Math.max(dataEff.playgroundOffline),
				offlineEffGuest: Math.max(0)
			};
			return result;
			
			

		};
		
	}

}());

(function () {
	"use strict";
	/**
	 * @desc
	 */
	angular.module('SportsensusApp')
		.controller('hockeyBox32Ctrl', hockeyBox32Ctrl);

	hockeyBox32Ctrl.$inject = [
		'$scope',
		'$controller',
		'$q',
		'ParamsSrv',
		'ApiSrv',
		'analyticsSrv',
		'graphHelpersSrv'
	];

	function hockeyBox32Ctrl(
		$scope,
		$controller,
		$q,
		ParamsSrv,
		ApiSrv,
		analyticsSrv,
		graphHelpersSrv
	) {
		$controller('hockeyBoxBaseCtrl', {$scope: $scope});

		
		var promises = [];
		promises.push(ApiSrv.getStatic('hockey').then(function(hockeyData){
			hockeyData.forEach(function(item){
				if (item.type == 'championship'){
					$scope.championship = item;
				} else if (item.type == 'hockeyBox32'){
					$scope.playgroundData = item;
				} else if (item.type == 'hockeyUniform'){
					$scope.uniformData = item;
				}
			});
		}));

		promises.push(ParamsSrv.getParams().then(function(params){
			$scope.parameters = params;
		}));


		// все данные загружены
		$q.all(promises).then(function(){
			$scope.prepare();

			
			$scope.playgroundPlaces = Object.keys($scope.playgroundData.visibilityOffline).map(function(key){
				return {name:key, selected: false};
			});

			$scope.playgroundPlacesA = [];
			var columnsCount = 4;
			var count = $scope.playgroundPlaces.length;
			for (var col=1; col <= columnsCount; col++){
				$scope.playgroundPlacesA.push($scope.playgroundPlaces.slice(Math.ceil(count/columnsCount*(col-1)),Math.ceil(count/columnsCount*col)));
			}
			
			$scope.uniformPlaces = Object.keys($scope.uniformData.visibilityOffline).map(function(key){
				return {name:key, selected: false};
			});


			$scope.$on('ApiSrv.countLoaded', readCount);
			readCount();
			
			function readCount(){
				var result = ApiSrv.getLastCountResult();
				$scope.audiencePercent = result.audiencePercent / 100;
				$scope.calc();
			}

			$scope.$watch('totalCost', $scope.calc);
			$scope.$watch('playgroundPlaces', $scope.calc, true);
			$scope.$watch('uniformPlaces', $scope.calc, true);
		});


		$scope.audiencePercent = 0;
		$scope.percentWatch = {};
		$scope.percentWalk = {};


		/*
		function calc(){

			var visibility = calcVisibility();
			var audiencePercent = $scope.audiencePercent || 1;

			var data = {};
			// Аудитория клуба
			data.peopleAllOnline = $scope.clubInfo.onlineTotalAll * visibility.online * audiencePercent;
			data.peopleAllOffline = $scope.clubInfo.offlineTotalAll * visibility.offline * audiencePercent;

			// кол-во уникальных онлайн, тысяч шт
			var uniqueOnline = $scope.clubInfo.onlineUniqueAll * visibility.online * audiencePercent;
			var uniqueOffline = $scope.clubInfo.offlineUniqueAll * visibility.offline * audiencePercent;

			data.CPTUniqueOnline = $scope.totalCost && uniqueOnline ? Math.round($scope.totalCost / uniqueOnline) : '-';
			data.CPTUniqueOffline = $scope.totalCost && uniqueOffline ? Math.round($scope.totalCost / uniqueOffline) : '-';

			// OTS, штук
			var OTSOnline = $scope.clubInfo.OTSOnline * visibility.online * audiencePercent;
			var OTSOffline = $scope.clubInfo.OTSOffline * visibility.offline * audiencePercent;

			data.CPTOTSOnline = $scope.totalCost && OTSOnline ? Math.round($scope.totalCost / OTSOnline) : '-';
			data.CPTOTSOffline = $scope.totalCost && OTSOffline ? Math.round($scope.totalCost / OTSOffline) : '-';

			
			data.audienceSelected = ParamsSrv.isAudienceSelected();



			//$scope.places;
			//$scope.playgroundData.statistics
			$scope.results = data;
		}
		*/
		/*
		// расчет видимости выбранных рекламных конструкций на площадке (0.0 - 1.0)
		function calcVisibility(){
			var result = {
				playgroundOnline: Math.min(calcPlaygroundOnline(), 1),
				playgroundOffline: Math.min(calcPlaygroundOffline(), 1),
				uniformOnline: Math.min(calcUniformOnline(), 1),
				uniformOffline: Math.min(calcUniformOffline(), 1)
			};
			result.online = Math.max(result.playgroundOnline, result.uniformOnline);
			result.offline = Math.max(result.playgroundOffline, result.uniformOffline);

			return result;

			function calcPlaygroundOnline(){
				var result = 0;
				$scope.playgroundPlaces.forEach(function(place){
					if (!place.selected) return;
					if ($scope.playgroundData.visibilityOnline[place.name])
						result = Math.max(result, $scope.playgroundData.visibilityOnline[place.name]);
				});
				return result;
			}

			function calcPlaygroundOffline(){
				var sectors = {};
				$scope.playgroundPlaces.forEach(function(place){
					if (!place.selected) return;
					var placeA = $scope.playgroundData.visibilityOffline[place.name];
					//if (!placeA) return;
					placeA.forEach(function(val, index){
						sectors[index] = Math.max(sectors[index] || 0, val || 0);
					});
				});
				var sum = 0;
				Object.keys(sectors).forEach(function(index){
					sum += sectors[index];
				});
				return sum;
			}

			function calcUniformOnline(){
				var result = 0;
				$scope.uniformPlaces.forEach(function(place){
					if (!place.selected) return;
					if ($scope.uniformData.visibilityOnline[place.name])
						result = Math.max(result,$scope.uniformData.visibilityOnline[place.name]);
				});
				return result;
			}

			function calcUniformOffline(){
				var result = 0;
				$scope.uniformPlaces.forEach(function(place){
					if (!place.selected) return;
					if ($scope.uniformData.visibilityOffline[place.name])
						result = Math.max(result, $scope.uniformData.visibilityOffline[place.name]);
				});
				return result;
			}

		}
		*/

		/*
		function loadWalkWatch(){

			//var audience = ParamsSrv.getSelectedAudience();

			var selected = analyticsSrv.getSelected();
			var sports = {};
			sports[selected.sport.key] = {interested: true};

			if (selected.club)
				sports[selected.sport.key].clubs = [selected.club.id]


			var rootingWatch = $scope.parameters.watch.lists.map(function (list) {return list.id;}); // [1, 2, 3, 4];
			var rootingWalk = $scope.parameters.walk.lists.map(function (list) {return list.id;}); //[1, 2, 3, 4];

			$q.all({
				//rooting: ApiSrv.getRootingGraph(audience, sports, rooting),
				watch: ApiSrv.getRootingWatchGraph({}, sports, rootingWatch),
				walk: ApiSrv.getRootingWalkGraph({}, sports, rootingWalk)
			}).then(function(data){
				var watchData = data.watch ? graphHelpersSrv.prepareChartData(data.watch, {
					'rooting':$scope.parameters.watch,
					'sport':$scope.parameters.sport,
					'club':$scope.parameters.sport
				}) : null;

				var walkData = data.walk ? graphHelpersSrv.prepareChartData(data.walk, {
					'rooting':$scope.parameters.walk,
					'sport':$scope.parameters.sport,
					'club':$scope.parameters.sport
				}) : null;

				var allWatch = watchData.getCount({ }) || 1;
				var allWalk = walkData.getCount({ }) || 1;

				rootingWatch.forEach(function(id){
					$scope.percentWatch[id] =(watchData.getCount({
						//'sport': sport.id,
						//'club': club.id,
						'rooting': id
					}) || 0) / allWatch;
				});
				rootingWalk.forEach(function(id){
					$scope.percentWalk[id] = (walkData.getCount({
						//'sport': sport.id,
						//'club': club.id,
						'rooting': id
					}) || 0) / allWalk;
				});

				calc();
			});

		}
		*/


	}

}());

(function () {
	"use strict";
	/**
	 * @desc
	 */
	angular.module('SportsensusApp')
		.controller('hockeyBox40Ctrl', hockeyBox40Ctrl);

	hockeyBox40Ctrl.$inject = [
		'$scope',
		'$controller',
		'$q',
		'ParamsSrv',
		'ApiSrv',
		'analyticsSrv',
		'graphHelpersSrv'
	];

	function hockeyBox40Ctrl(
		$scope,
		$controller,
		$q,
		ParamsSrv,
		ApiSrv,
		analyticsSrv,
		graphHelpersSrv
	) {
		$controller('hockeyBoxBaseCtrl', {$scope: $scope});

		
		var promises = [];
		promises.push(ApiSrv.getStatic('hockey').then(function(hockeyData){
			hockeyData.forEach(function(item) {
				if (item.type == 'championship') {
					$scope.championship = item;
				} else if (item.type == 'hockeyBox40') {
					$scope.playgroundData = item;
				} else if (item.type == 'hockeyUniform') {
					$scope.uniformData = item;
				} else if (item.type == 'hockeyVideoOffline') {
					$scope.videoOfflineData = item;
				} else if (item.type == 'hockeyVideoOnline') {
					$scope.videoOnlineData = item;
				}
			});
		}));

		promises.push(ParamsSrv.getParams().then(function(params){
			$scope.parameters = params;
		}));


		// все данные загружены
		$q.all(promises).then(function(){
			$scope.prepare(); 

			function preparePlaces(data){
				if (data.placesSelection) return;
				data.placesSelection = {};
				data.places.forEach(function(place){
					data.placesSelection[place] = {key: place, selected: false};
				});
			}
			
			preparePlaces($scope.playgroundData);
			preparePlaces($scope.uniformData);
			preparePlaces($scope.videoOfflineData);
			preparePlaces($scope.videoOnlineData);
			

			$scope.playgroundPlacesA = [];
			var columnsCount = 4;
			//var places = Object.keys($scope.playgroundData.places).map(function(key){return {key: key, place: $scope.playgroundData.places[key]}; });
			var count = $scope.playgroundData.places.length;
			for (var col=1; col <= columnsCount; col++){
				var arr = $scope.playgroundData.places.slice(Math.ceil(count/columnsCount*(col-1)),Math.ceil(count/columnsCount*col));
				$scope.playgroundPlacesA.push(arr.map(function(key){ return $scope.playgroundData.placesSelection[key]; }));
				//$scope.playgroundPlacesA.push(places.slice(Math.ceil(count/columnsCount*(col-1)),Math.ceil(count/columnsCount*col)));
			}
			
			$scope.$on('ApiSrv.countLoaded', readCount);
			readCount();

			function readCount(){
				var result = ApiSrv.getLastCountResult();
				$scope.audiencePercent = result.audiencePercent / 100;
				$scope.calc();
			}

			$scope.$watch('totalCost', $scope.calc);
			
			$scope.$watch('playgroundData.placesSelection', $scope.calc, true);
			$scope.$watch('uniformData.placesSelection', $scope.calc, true);
			$scope.$watch('videoOfflineData.placesSelection', $scope.calc, true);
			$scope.$watch('videoOnlineData.placesSelection', $scope.calc, true);
		});


		$scope.audiencePercent = 0;
		$scope.percentWatch = {};
		$scope.percentWalk = {};
		
	}

}());

(function () {
	"use strict";
	/**
	 * @desc
	 */
	angular.module('SportsensusApp')
		.controller('hockeyBoxBaseCtrl', hockeyBoxBaseCtrl);

	hockeyBoxBaseCtrl.$inject = [
		'$scope',
		'$controller',
		'$q',
		'ParamsSrv',
		'ApiSrv',
		'analyticsSrv',
		'graphHelpersSrv'
	];

	function hockeyBoxBaseCtrl(
		$scope,
		$controller,
		$q,
		ParamsSrv,
		ApiSrv,
		analyticsSrv,
		graphHelpersSrv
	) {
		
		$scope.audiencePercent = 0;

		$scope.prepare = function(){
			var selected = analyticsSrv.getSelected();
			var club = selected.club;
			var league = selected.league;
			//if (!club) return;
			if (club)
				$scope.prepareClubInfo();
			else if (league)
				$scope.prepareLeagueInfo();
		};

		$scope.prepareLeagueInfo = function(){
			var selected = analyticsSrv.getSelected();
			//var club = selected.club;
			var league = selected.league;
			if (!league) return;

			var allTmp = {
				onlineTotal: 0,
				onlineRatings: 0,
				onlineTotalFederal: 0,
				onlineTotalLocal: 0,
				playgrounds:{},
				occupancy: 0,
				offlineTotal: 0  // += (game.offlineCount || 0);
			};

			$scope.championship.data.championship.forEach(function(game){
				allTmp.onlineTotal += (game.federalTVAudience || 0) + (game.regionalTVAudience || 0);
				allTmp.offlineTotal += (game.offlineCount || 0);
				allTmp.onlineRatings += (game.federalTVRating || 0);
				allTmp.onlineTotalFederal += (game.federalTVAudience || 0);
				allTmp.onlineTotalLocal += (game.regionalTVAudience || 0);
				allTmp.occupancy += (game.offlineCount / game.stadiumCapacity || 0);

				if (game.stadiumId >= 0){
					allTmp.playgrounds[game.stadiumId] = allTmp.playgrounds[game.stadiumId] || {gamesCount:0};
					allTmp.playgrounds[game.stadiumId].stadiumId = game.stadiumId;
					allTmp.playgrounds[game.stadiumId].stadiumName = game.stadiumName;
					allTmp.playgrounds[game.stadiumId].stadiumCapacity = game.stadiumCapacity || 0;
					allTmp.playgrounds[game.stadiumId].gamesCount++;
				}
			});

			var walkAvg = 0; // Среднее количество посещений хоккейных матчей на 1 зрителя данного клуба
			var watchAvg = 0; // Среднее количество ТВ-просмотров хоккейных матчей на 1 зрителя данного клуба
			if ($scope.championship.data.clubInfo){
				$scope.championship.data.clubInfo.forEach(function(_club){
					walkAvg += _club.walkAVG;
					watchAvg += _club.watchAVG;
				});
				walkAvg = walkAvg / $scope.championship.data.clubInfo.length;
				watchAvg = watchAvg / $scope.championship.data.clubInfo.length;
			} else {
				walkAvg = 1;
				watchAvg = 1;
			}

			var avgEffFreqOnline = $scope.championship.data.avgEffFreqOnline;
			var avgEffFreqOffline = $scope.championship.data.avgEffFreqOffline;

			var gamesCount = $scope.championship.data.championship.length;



			$scope.calcParams = {
				/***** OFFLINE *****/
				
				offlineTotalHome: allTmp.offlineTotal/1000, // в тысячах, полная аудитория дома
				offlineTotalGuest: 0,
				offlineTotalAll: allTmp.offlineTotal/1000, // в тысячах
				
				
				offlineUniqueHome: allTmp.offlineTotal/1000/walkAvg, // в тысячах, уникальная аудитория дома
				offlineUniqueGuest: 0,
				offlineUniqueAll:  allTmp.offlineTotal/1000/walkAvg,  // в тысячах
				
				
				/***** ONLINE *****/
				
				onlineTotalFederal: allTmp.onlineTotalFederal, // в тысячах
				onlineTotalLocal: allTmp.onlineTotalLocal, // в тысячах
				//onlineTotalAll: allTmp.onlineTotalFederal + allTmp.onlineTotalLocal, // в тысячах
				onlineTotalAll: allTmp.onlineTotalFederal + allTmp.onlineTotalLocal, // в тысячах
				
				
				
				onlineUniqueFederal: allTmp.onlineTotalFederal/watchAvg, // в тысячах
				onlineUniqueLocal: allTmp.onlineTotalLocal/watchAvg, // в тысячах
				onlineUniqueAll: (allTmp.onlineTotalFederal + allTmp.onlineTotalLocal)/watchAvg, // в тысячах
				
				
				
				// OTSOffline: (homeTmp.offlineTotal + guestTmp.offlineTotal)*avgEffFreqOffline/1000, // в тысячах
				// OTSOnline:  (allTmp.onlineTotalFederal + allTmp.onlineTotalLocal)*avgEffFreqOnline // в тысячах
				
				OTSOfflineHome: (allTmp.offlineTotal)/1000, // в тысячах без коэфф.
				OTSOfflineGuest: 0, // в тысячах без коэфф.
				OTSOfflineAll: (allTmp.offlineTotal)/1000, // в тысячах без коэфф. 
				
				OTSOnlineAll:  (allTmp.onlineTotalFederal + allTmp.onlineTotalLocal) // в тысячах без коэфф.
			}	


			$scope.leagueInfo = {
				name: league.name,
				//playgrounds: ['playground1', 'playground2'],
				playgroundsCount: Object.keys(allTmp.playgrounds).length,
				playgroundsCapacity: Object.keys(allTmp.playgrounds)
					.map(function(key){return allTmp.playgrounds[key].stadiumCapacity})
					.reduce(function(pv, cv) { return pv + cv; }, 0),


				//playground: playground.stadiumName,
				//playgroundCapacity: playground.stadiumCapacity,
				//gamesCount: homeGames.length + guestGames.length,

				gamesCount: gamesCount,


				offlineAVGAll: Math.round(allTmp.occupancy / gamesCount * 100),
				
				//offlineTotalAll: Math.round((allTmp.offlineTotal)/100)/10,
				
				//offlineUniqueAll: Math.round((allTmp.offlineTotal)/100/walkAvg)/10,
				
				onlineRatings: Math.round(allTmp.onlineRatings*10)/10,
				
				//onlineTotalAll: Math.round((allTmp.onlineTotalFederal + allTmp.onlineTotalLocal)*10)/10, // в тысячах
				
				//onlineUniqueAll: Math.round((allTmp.onlineTotalFederal + allTmp.onlineTotalLocal)*10/watchAvg)/10, // в тысячах
				//
				reachOffline: Math.round((allTmp.offlineTotal)/100/walkAvg)/10, // offlineUniqueAll
				reachOnline: Math.round((allTmp.onlineTotalFederal + allTmp.onlineTotalLocal)*10/watchAvg)/10, // onlineUniqueAll
				
				OTSOffline: Math.round($scope.calcParams.OTSOfflineAll*avgEffFreqOffline*10)/10, // // offlineTotalAll * onlineFreq * 3
				OTSOnline:  Math.round($scope.calcParams.OTSOnlineAll*avgEffFreqOnline*10)/10 // onlineTotalAll * onlineFreq
			};


			[
				//'offlineTotalHome',
				//'offlineTotalGuest',
				'offlineTotalAll',
				
				//'offlineUniqueHome',
				//'offlineUniqueGuest',
				'offlineUniqueAll',
				
				//'onlineTotalFederal',
				//'onlineTotalLocal',
				'onlineTotalAll',
				
				//'onlineUniqueFederal',
				//'onlineUniqueLocal',
				'onlineUniqueAll'
			].forEach(function(param){
				$scope.leagueInfo[param] = Math.round($scope.calcParams[param]*10)/10
			});

		

		};

		$scope.prepareClubInfo = function(){

			var selected = analyticsSrv.getSelected();
			var club = selected.club;
			if (!club) return;

			// var playgrounds = получить все площадки для спорта

			var homeGames = [];
			var guestGames = [];
			var homeTmp = {
				occupancy: 0,
				offlineTotal: 0,
				playgrounds:{}
			};
			var guestTmp = {
				occupancy: 0,
				offlineTotal: 0
			};
			var allTmp = {
				onlineRatings: 0,
				onlineTotalFederal: 0,
				onlineTotalLocal: 0
			};

			$scope.championship.data.championship.forEach(function(game){
				if (game.hostClubId == club.id){
					homeGames.push(game);
					homeTmp.occupancy += game.offlineCount / game.stadiumCapacity;
					homeTmp.offlineTotal += game.offlineCount;
					if (game.stadiumId >= 0){
						homeTmp.playgrounds[game.stadiumId] = homeTmp.playgrounds[game.stadiumId] || {gamesCount:0};
						homeTmp.playgrounds[game.stadiumId].stadiumId = game.stadiumId;
						homeTmp.playgrounds[game.stadiumId].stadiumName = game.stadiumName;
						homeTmp.playgrounds[game.stadiumId].stadiumCapacity = game.stadiumCapacity;
						homeTmp.playgrounds[game.stadiumId].gamesCount++;
					}
					allTmp.onlineRatings += (game.federalTVRating || 0);
					allTmp.onlineTotalFederal += (game.federalTVAudience || 0);
					allTmp.onlineTotalLocal += (game.regionalTVAudience || 0);
				}
				if (game.guestClubId == club.id){
					guestGames.push(game);
					guestTmp.occupancy += game.offlineCount / game.stadiumCapacity;
					guestTmp.offlineTotal += (game.offlineCount || 0);
					allTmp.onlineRatings += (game.federalTVRating || 0);
					allTmp.onlineTotalFederal += (game.federalTVAudience || 0);
					allTmp.onlineTotalLocal += (game.regionalTVAudience || 0);
				}
			});


			var walkAvg = 0; // Среднее количество посещений хоккейных матчей на 1 зрителя данного клуба
			var watchAvg = 0; // Среднее количество ТВ-просмотров хоккейных матчей на 1 зрителя данного клуба
			if ($scope.championship.data.clubInfo){
				var finded = false;
				$scope.championship.data.clubInfo.forEach(function(_club){
					if (_club.id == club.id){
						finded = true;
						walkAvg = _club.walkAVG;
						watchAvg = _club.watchAVG;
					} else if (!finded){ // суммируем, чтобы потом найти среднее
						walkAvg += _club.walkAVG;
						watchAvg += _club.watchAVG;
					}
				});
				if (!finded){
					walkAvg = walkAvg / $scope.championship.data.clubInfo.length;
					watchAvg = watchAvg / $scope.championship.data.clubInfo.length;
				}
			} else {
				walkAvg = 1;
				watchAvg = 1;
			}

			var avgEffFreqOnline = $scope.championship.data.avgEffFreqOnline;
			var avgEffFreqOffline = $scope.championship.data.avgEffFreqOffline;

			var playgrounds = Object.keys(homeTmp.playgrounds).map(function(id){
				return homeTmp.playgrounds[id];
			}).sort(function(a,b){
				return b.gamesCount - a.gamesCount;
			});
			var playground = playgrounds[0];

			var playgroundGamesCount = 0;
			playground && $scope.championship.data.championship.forEach(function(game) {
				if (game.stadiumId == playground.stadiumId)
					playgroundGamesCount++;
			});


			$scope.calcParams = {
				/***** OFFLINE *****/
				
				offlineTotalHome: homeTmp.offlineTotal/1000, // в тысячах, полная аудитория дома
				offlineTotalGuest: guestTmp.offlineTotal/1000,
				offlineTotalAll: (homeTmp.offlineTotal + guestTmp.offlineTotal)/1000, // в тысячах, полная аудитория дома и в гостях
				
				
				offlineUniqueHome: homeTmp.offlineTotal/walkAvg/1000, // в тысячах, уникальная аудитория дома
				offlineUniqueGuest: guestTmp.offlineTotal/1000/walkAvg,
				offlineUniqueAll: (homeTmp.offlineTotal + guestTmp.offlineTotal)/1000/walkAvg,  // в тысячах
				
				
				/***** ONLINE *****/
				
				onlineTotalFederal: allTmp.onlineTotalFederal, // в тысячах
				onlineTotalLocal: allTmp.onlineTotalLocal, // в тысячах
				onlineTotalAll: allTmp.onlineTotalFederal + allTmp.onlineTotalLocal, // в тысячах
				
				
				onlineUniqueFederal: allTmp.onlineTotalFederal/watchAvg, // в тысячах
				onlineUniqueLocal: allTmp.onlineTotalLocal/watchAvg, // в тысячах
				onlineUniqueAll: (allTmp.onlineTotalFederal + allTmp.onlineTotalLocal)/watchAvg, // в тысячах

				
				
				// OTSOffline: (homeTmp.offlineTotal + guestTmp.offlineTotal)*avgEffFreqOffline/1000, // в тысячах
				// OTSOnline:  (allTmp.onlineTotalFederal + allTmp.onlineTotalLocal)*avgEffFreqOnline // в тысячах
				
				OTSOfflineHome: (homeTmp.offlineTotal)/1000, // в тысячах без коэфф.
				OTSOfflineGuest: (guestTmp.offlineTotal)/1000, // в тысячах без коэфф.
				OTSOfflineAll: (homeTmp.offlineTotal + guestTmp.offlineTotal)/1000, // в тысячах без коэфф.
				
				OTSOnlineAll:  (allTmp.onlineTotalFederal + allTmp.onlineTotalLocal) // в тысячах без коэфф.
			}


			

			$scope.clubInfo = {
				name: club.name,
				//playgrounds: ['playground1', 'playground2'],
				playground: playground.stadiumName,
				playgroundCapacity: playground.stadiumCapacity,
				//gamesCount: homeGames.length + guestGames.length,
				gamesCount: playgroundGamesCount,
				offlineAVGHome: Math.round(homeTmp.occupancy / homeGames.length * 100),
				offlineAVGGuest: Math.round(guestTmp.occupancy / guestGames.length * 100),

				
				// offlineTotalHome: Math.round($scope.calcParams.offlineTotalHome*10)/10,
				// offlineTotalGuest: Math.round($scope.calcParams.offlineTotalGuest*10)/10,
				// offlineTotalAll: Math.round($scope.calcParams.offlineTotalAll*10)/10,


				// offlineUniqueHome: Math.round($scope.calcParams.offlineUniqueHome*10)/10,
				// offlineUniqueGuest: Math.round($scope.calcParams.offlineUniqueGuest*10)/10,
				// offlineUniqueAll: Math.round($scope.calcParams.offlineUniqueAll*10)/10,


				onlineRatings: Math.round(allTmp.onlineRatings*10)/10,


				// onlineTotalFederal: Math.round($scope.calcParams.onlineTotalFederal*10)/10, // в тысячах
				// onlineTotalLocal: Math.round($scope.calcParams.onlineTotalLocal*10)/10, // в тысячах
				// onlineTotalAll: Math.round($scope.calcParams.onlineTotalAll*10)/10, // в тысячах

				// onlineUniqueFederal: Math.round($scope.calcParams.onlineUniqueFederal*10)/10, // в тысячах
				// onlineUniqueLocal: Math.round($scope.calcParams.onlineUniqueLocal*10)/10, // в тысячах
				// onlineUniqueAll: Math.round($scope.calcParams.onlineUniqueAll*10)/10, // в тысячах


				reachOffline: Math.round((homeTmp.offlineTotal + guestTmp.offlineTotal)/100/walkAvg)/10, // offlineUniqueAll
				reachOnline: Math.round((allTmp.onlineTotalFederal + allTmp.onlineTotalLocal)*10/watchAvg)/10, // onlineUniqueAll
				
				
				// OTSOffline: Math.round((homeTmp.offlineTotal + guestTmp.offlineTotal)/100*avgEffFreqOffline)/10, // // offlineTotalAll * onlineFreq * 3
				OTSOffline: Math.round($scope.calcParams.OTSOfflineAll*avgEffFreqOffline*10)/10, // // offlineTotalAll * onlineFreq * 3
				// OTSOnline:  Math.round((allTmp.onlineTotalFederal + allTmp.onlineTotalLocal)*10*avgEffFreqOnline)/10 // onlineTotalAll * onlineFreq
				OTSOnline:  Math.round($scope.calcParams.OTSOnlineAll*avgEffFreqOnline*10)/10 // onlineTotalAll * onlineFreq
			};
			
			[
				'offlineTotalHome',
				'offlineTotalGuest',
				'offlineTotalAll',
				
				'offlineUniqueHome',
				'offlineUniqueGuest',
				'offlineUniqueAll',
				
				'onlineTotalFederal',
				'onlineTotalLocal',
				'onlineTotalAll',
				
				'onlineUniqueFederal',
				'onlineUniqueLocal',
				'onlineUniqueAll'
			].forEach(function(param){
				$scope.clubInfo[param] = Math.round($scope.calcParams[param]*10)/10
			})

						
		};



		/*
			Для Offline (ходили):	
				Если выбрана только площадка - значит учитывается только домашняя аудитория
				Если выбрана только форма - учитывается и домашняя и гостевая аудитория
				Если выбрано только видео на площадке - учитывается только домашняя аудитория 
				Видео по ТВ не учитывается
			Для Online (смотрели):
				хз)
			
		*/
		$scope.calc = function(){

			var visibility = $scope.calcVisibility();
			var audiencePercent = $scope.audiencePercent || 1;

			var data = {};
			// Аудитория клуба
			//data.people
			
			
			/***** ВСЕ ЛЮДИ *****/
			
			/***** OFFLINE *****/
			
			var peopleHomeOffline = $scope.calcParams.offlineTotalHome * visibility.offlineHome * audiencePercent;
			var peopleGuestOffline= $scope.calcParams.offlineTotalGuest * visibility.offlineGuest * audiencePercent;
			// data.peopleAllOffline = Math.round($scope.calcParams.offlineTotalHome * visibility.offline * audiencePercent);
			data.peopleAllOffline = Math.round(peopleHomeOffline + peopleGuestOffline);
			
			/***** ONLINE *****/
			
			data.peopleAllOnline = Math.round($scope.calcParams.onlineTotalAll * visibility.online * audiencePercent);
			//data.peopleAllOffline = Math.round($scope.calcParams.offlineTotalAll * visibility.offline * audiencePercent);
			
			
			/***** УНИКАЛЬНЫЕ *****/
		
			/***** OFFLINE *****/
			var peopleUniqueHomeOffline = $scope.calcParams.offlineUniqueHome * visibility.offlineHome * audiencePercent;
			var peopleUniqueGuestOffline = $scope.calcParams.offlineUniqueGuest * visibility.offlineGuest * audiencePercent;
			// var uniqueOffline = $scope.calcParams.offlineUniqueAll * visibility.offline * audiencePercent;
			var uniqueOffline = peopleUniqueHomeOffline + peopleUniqueGuestOffline;
			
			
			/***** ONLINE *****/
			var uniqueOnline = $scope.calcParams.onlineUniqueAll * visibility.online * audiencePercent;
			
			/***** CPT от УНИКАЛЬНЫХ *****/
			
			data.CPTUniqueOnline = $scope.totalCost && uniqueOnline ? Math.round($scope.totalCost / uniqueOnline * 10)/10 : '';
			data.CPTUniqueOffline = $scope.totalCost && uniqueOffline ? Math.round($scope.totalCost / uniqueOffline * 10)/10 : '';


			/***** OTS *****/
			var peopleOTSHomeOffline = $scope.calcParams.OTSOfflineHome * visibility.offlineEffHome * audiencePercent;
			var peopleOTSGuestOffline = $scope.calcParams.OTSOfflineGuest * visibility.offlineEffGuest * audiencePercent;

			// var OTSOffline = $scope.calcParams.OTSOffline * visibility.offlineEff * audiencePercent;
			var OTSOffline = peopleOTSHomeOffline + peopleOTSGuestOffline;


			// OTS, штук
			var OTSOnline = $scope.calcParams.OTSOnlineAll * visibility.onlineEff * audiencePercent;


			// (onlineTotalFederal + onlineTotalLocal) * avgEffFreqOnline * visibility.online * audiencePercent;
			// audiencePercent - процент выбранной аудитории (0..1)
			// visibility.online - процент видимости выбранных рекламных конструкций (0..1)

			

			data.CPTOTSOnline = $scope.totalCost && OTSOnline ? Math.round($scope.totalCost / OTSOnline * 10)/10 : '';
			data.CPTOTSOffline = $scope.totalCost && OTSOffline ? Math.round($scope.totalCost / OTSOffline * 10)/10 : '';


			data.audienceSelected = ParamsSrv.isAudienceSelected();


			$scope.results = data;
		};



		// расчет видимости выбранных рекламных конструкций на площадке (0.0 - 1.0)
		$scope.calcVisibility = function(){

			var data =  {
				playgroundOnline: 		$scope.calcSectors($scope.playgroundData, 'Online'),
				playgroundOffline:		$scope.calcSectors($scope.playgroundData, 'Offline'),
				uniformOnline:	 		$scope.calcSectors($scope.uniformData, 'Online'),
				uniformOffline: 		$scope.calcSectors($scope.uniformData, 'Offline'),
				videoOfflineOnline: 	$scope.calcSectors($scope.videoOfflineData, 'Online'),
				videoOfflineOffline: 	$scope.calcSectors($scope.videoOfflineData, 'Offline'),
				videoOnlineOnline: 		$scope.calcSectors($scope.videoOnlineData, 'Online'),
				videoOnlineOffline: 	$scope.calcSectors($scope.videoOnlineData, 'Offline')
			};
			var dataEff = {
				playgroundOnline: 		$scope.calcSectors($scope.playgroundData, 'Online', true),
				playgroundOffline:		$scope.calcSectors($scope.playgroundData, 'Offline', true),
				uniformOnline:	 		$scope.calcSectors($scope.uniformData, 'Online', true),
				uniformOffline: 		$scope.calcSectors($scope.uniformData, 'Offline', true),
				videoOfflineOnline: 	$scope.calcSectors($scope.videoOfflineData, 'Online', true),
				videoOfflineOffline: 	$scope.calcSectors($scope.videoOfflineData, 'Offline', true),
				videoOnlineOnline: 		$scope.calcSectors($scope.videoOnlineData, 'Online', true),
				videoOnlineOffline: 	$scope.calcSectors($scope.videoOnlineData, 'Offline', true)
			};

		
			var result = {
				online: Math.max(data.playgroundOnline, data.uniformOnline, data.videoOfflineOnline, data.videoOnlineOnline),
				offline: Math.max(data.playgroundOffline, data.uniformOffline, data.videoOfflineOffline, data.videoOnlineOffline),
				
				// дома учитывается площадка, форма и видео, в гостях - форма
				offlineHome: Math.max(data.playgroundOffline, data.uniformOffline, data.videoOfflineOffline),
				offlineGuest: Math.max(data.uniformOffline),
				
				onlineEff: Math.max(dataEff.playgroundOnline, dataEff.uniformOnline, dataEff.videoOfflineOnline, dataEff.videoOnlineOnline),
				offlineEff: Math.max(dataEff.playgroundOffline, dataEff.uniformOffline, dataEff.videoOfflineOffline, dataEff.videoOnlineOffline),
				
				// дома учитывается площадка, форма и видео, в гостях - форма
				offlineEffHome: Math.max(dataEff.playgroundOffline, dataEff.uniformOffline, dataEff.videoOfflineOffline),
				offlineEffGuest: Math.max(dataEff.uniformOffline)
			};
			return result;

			

		};
		
		$scope.calcSectors = function(data, type, useFreq){ //} dataKey, freqKey){
				var sectors = {};
				var sectorsEff = {};
				var effFreq = 0;
				var dataKey = 'visibility' + type;
				if (useFreq) {
					var freqKey = 'exposure' + type;
					var defaultFreq = $scope.championship.data['avgEffFreq' + type];
				}

				Object.keys(data.placesSelection).forEach(function(key){
					if (!data.placesSelection[key].selected) return;
					var placeA = data[dataKey][key];
					if (!placeA) return;
					if (useFreq) {
						if (data[freqKey] && data[freqKey][key])
							effFreq = data[freqKey][key];
						else
							effFreq = defaultFreq;
					}
					placeA.forEach(function(val, index){
						sectors[index] = Math.max(sectors[index] || 0, val || 0);
						if (useFreq)
							sectorsEff[index] = Math.max(sectorsEff[index] || 0, val * effFreq || 0);
					});
				});

				var sum = 0;
				var sumEff = 0;
				Object.keys(sectors).forEach(function(index){
					sum += sectors[index];
					if (useFreq)
						sumEff += sectorsEff[index];
				});
				//return Math.min(sum, 1);
				return useFreq ? sumEff : sum;
			}
		

	}

}());

(function () {
	"use strict";
	/**
	 * @desc
	 * @example
	 */
	angular.module('SportsensusApp')
		.directive('clubInfoTableDir', clubInfoTableDir);

	clubInfoTableDir.$inject = [
		'$rootScope'
	];

	function clubInfoTableDir(
		$rootScope
	)    {
		return {
			restrict: 'E',
			scope: {
				//results: '=',
				//price: '='
				clubInfo: '='
			},
			templateUrl: '/views/widgets/infobox/panels/analytics/clubInfoTable/clubInfoTable.html',
			link: function ($scope, $el, attrs) {

			},

			controller: [
				'$scope',
				function(
					$scope
				){
					$scope.showed = true;
				}
			]

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
		.directive('leagueInfoTableDir', leagueInfoTableDir);

	leagueInfoTableDir.$inject = [
		'$rootScope'
	];

	function leagueInfoTableDir(
		$rootScope
	)    {
		return {
			restrict: 'E',
			scope: {
				leagueInfo: '='
			},
			templateUrl: '/views/widgets/infobox/panels/analytics/clubInfoTable/leagueInfoTable.html',
			link: function ($scope, $el, attrs) {

			},

			controller: [
				'$scope',
				function(
					$scope
				){
					$scope.showed = true;
				}
			]

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
		.directive('analyticsResultsDir', analyticsResultsDir);

	analyticsResultsDir.$inject = [
		'$rootScope'
	];

	function analyticsResultsDir(
		$rootScope
	)    {
		return {
			restrict: 'E',
			scope: {
				results: '=',
				price: '='
			},
			templateUrl: '/views/widgets/infobox/panels/analytics/analyticsResults/analyticsResults.html',
			link: function ($scope, $el, attrs) {
				
			},

			controller: [
				'$scope',
				function(
					$scope
				){
					$scope.currency = '₽';


				}
			]
			
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
		.directive('playgroundParamsTableDir', playgroundParamsTableDir);

	playgroundParamsTableDir.$inject = [
		'$rootScope'
	];

	function playgroundParamsTableDir(
		$rootScope
	)    {
		return {
			restrict: 'E',
			scope: {
				params: '='
			},
			templateUrl: '/views/widgets/infobox/panels/analytics/playgroundParamsTable/playgroundParamsTable.html',
			link: function ($scope, $el, attrs) {

			},

			controller: [
				'$scope',
				function(
					$scope
				){
					$scope.showed = true;
					$scope.showHide = function(){
						$scope.showed = !$scope.showed;
					}
				}
			]

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
		.directive('hockeyBoxInfoTableDir', hockeyBoxInfoTableDir);

	hockeyBoxInfoTableDir.$inject = [
		'$rootScope'
	];

	function hockeyBoxInfoTableDir(
		$rootScope
	)    {
		return {
			restrict: 'E',
			scope: {
				//results: '=',
				//price: '='
				//hockeyBoxInfo: '='
			},
			templateUrl: '/views/widgets/infobox/panels/analytics/hockeyBoxInfoTable/hockeyBoxInfoTable.html',
			link: function ($scope, $el, attrs) {

			},

			controller: [
				'$scope',
				function(
					$scope
				){
					$scope.hockeyBoxInfo = {
						name: 'name',
						//playgrounds: ['playground1','playground2'],
						clubName: 'clubName',
						city: 'city',
						gamesCount: 1234560,
						capacity: 'capacity',

						reachOffline: 1234561,
						reachOnline: 1234562,
						OTSOffline: 1234563,
						OTSOnline: 1234564,

						//offlineAVGHome: 1234565,
						//offlineAVGGuest: 1234566,
						offlineAVGAll: 1234566,

						//offlineTotalHome: 1234567,
						//offlineTotalGuest: 1234568,
						offlineTotalAll: 1234569,

						//offlineUniqueHome: 1234560,
						//offlineUniqueGuest: 1234561,
						offlineUniqueAll: 1234562,

						
						onlineRatings: 1234563,

						onlineTotalFederal: 1234564,
						onlineTotalLocal: 1234565,
						onlineTotalAll: 1234566,

						
						onlineUniqueFederal: 1234567,
						onlineUniqueLocal: 1234568,
						onlineUniqueAll: 1234569
					}


				}
			]

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
        .directive('parameterWidgetDir', parameterWidgetDir);

    parameterWidgetDir.$inject = [
        '$rootScope'
    ];

    function parameterWidgetDir(
        $rootScope
    )    {
        return {
            restrict: 'E',
            scope: {
                header: '@',
                text: '@',
                footer: '@'
                // header: '&',
                // text: '&',
                // footer: '&'
            },
            templateUrl: '/views/widgets/infobox/panels/expressSport/parameterWidget/parameterWidget.html',
            link: function ($scope, $el, attrs) {
                $scope.el = $el;
                //$scope.draw();
                $scope.$watch('chart', $scope.redrawChart);
            },
            replace: true,
            controller: [
                '$scope',
                function(
                    $scope
                ){

                }]
        };
    }
}());