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
	
	function getUserAuthResolver(options) {
		return {
			userAuthResolver: ['ApiSrv', '$location', '$q', function(ApiSrv, $location, $q) {
				return ApiSrv.getUserAuthPromise().then(function(){
					var userRights = ApiSrv.getUser().userRights || {};
					if (!userRights) {
						$location.path('/');
						return $q.reject();
					}
					
					if (options.type == 'admin' && !userRights.admin) {
						$location.path('/');
						return $q.reject();
					}
					
					if (options.type == 'infobox') {
						if (!userRights.tariff || !userRights.tariff.accessInfoblock) {
							$location.path('/');
							return $q.reject();
						}
					}
					if (options.type == 'analytics') {
						if (!userRights.tariff || !userRights.tariff.accessAnalytics) {
							$location.path('/');
							return $q.reject();
						}
					}
					if (options.type == 'cases') {
						if (!userRights.tariff || !userRights.tariff.accessCases) {
							$location.path('/');
							return $q.reject();
						}
					}
					if (options.type == 'scheduler') {
						if (!userRights.tariff || !userRights.tariff.accessScheduler) {
							$location.path('/');
							return $q.reject();
						}
					}
					
				})
			}]
		};
	}
	
	
	
	function configRoutes($routeProvider) {
			

			$routeProvider
			
			.when('/', {
				template: '<home-dir></home-dir>'
			})
			
			.when('/infobox/', { 
				template: '<infobox-dir type="infobox"></infobox-dir>',
				resolve: getUserAuthResolver({type: 'infobox'}),
				controller: function($scope, $location, ApiSrv) {
					if (!ApiSrv.getUser().sid || ApiSrv.getUser().userRights.admin)
						$location.path('/');
				}
			})
			.when('/analytics/', {
				//template: '<infobox-dir type="analytics"></infobox-dir>',
				template: '<analytics-dir></analytics-dir>',
				resolve: getUserAuthResolver({type: 'analytics'}),
				controller: function($scope, $location, ApiSrv) {
					if (!ApiSrv.getUser().sid || ApiSrv.getUser().userRights.admin)
						$location.path('/');
				}
			})
			.when('/articles/', { 
				template: '<articles-dir></articles-dir>',
				resolve: getUserAuthResolver({type: 'cases'}),
				controller: function($scope, $location, ApiSrv) {
					if (!ApiSrv.getUser().sid || ApiSrv.getUser().userRights.admin)
						$location.path('/');
				}
			})
			.when('/articles/:articleId', { 
				template: '<article-dir></article-dir>',
				resolve: getUserAuthResolver({type: 'cases'}),
				controller: function($scope, $location, ApiSrv) {
					if (!ApiSrv.getUser().sid || ApiSrv.getUser().userRights.admin)
						$location.path('/');
				}
			})
			.when('/login/', { 
				template: '<login-dir></login-dir>'
			})
			.when('/activate/', {
				template: ' ',
				controller: function($scope, $location, $mdDialog, ApiSrv) {
					var code = $location.search().code;
					if (code){
						ApiSrv.activate(code).then(function(){
							showAlert('Учётная запись успешно активирована');
							$location.search('code', undefined);
							$location.path('/');
						}, function(){
							showAlert('Ошибка активации учётной записи');
							$location.search('code', undefined);
							$location.path('/');
						})
					} else {
						$location.path('/');
					}

					function showAlert(text) {
						$mdDialog.show(
							$mdDialog.alert()
								.title('Активация учетной записи')
								.textContent(text)
								.ok('OK')
						);
					}
				}
			})
			
			
			.when('/account/', {
				template: '<account-dir></account-dir>',
				resolve: getUserAuthResolver({type: 'auth'}),
				controller: function($scope, $location, ApiSrv) {
					if (!ApiSrv.getUser().userRights)
						$location.path('/');
				}
			})
			
			
			/** ADMIN **/
			
			.when('/admin/', {
				template: '<admin-dir></admin-dir>',
				resolve: getUserAuthResolver({type: 'admin'})
				//controller: AdminCtrl
				// controller: function($scope, $location, ApiSrv) {
				// 	if (!ApiSrv.getUser().userRights || !ApiSrv.getUser().userRights.admin)
				// 		$location.path('/');
				// }
			})
			
			.when('/admin/articles/', {
				template: '<admin-articles-dir></admin-articles-dir>',
				resolve: getUserAuthResolver({type: 'admin'})
				//controller: AdminCtrl
				// controller: function($scope, $location, ApiSrv) {
				// 	if (!ApiSrv.getUser().userRights || !ApiSrv.getUser().userRights.admin)
				// 		$location.path('/');
				// }
			})
			
			.when('/admin/profiles/', {
				template: '<admin-profiles-dir></admin-profiles-dir>',
				resolve: getUserAuthResolver({type: 'admin'})
				//controller: AdminCtrl
				// controller: function($scope, $location, ApiSrv) {
				// 	if (!ApiSrv.getUser().userRights || !ApiSrv.getUser().userRights.admin)
				// 		$location.path('/');
				// }
			})
			
			.when('/admin/profiles/:userId', {
				template: '<admin-profile-dir></admin-profile-dir>',
				resolve: getUserAuthResolver({type: 'admin'})
				//controller: AdminCtrl
				// controller: function($scope, $location, ApiSrv) {
				// 	if (!ApiSrv.getUser().userRights || !ApiSrv.getUser().userRights.admin)
				// 		$location.path('/');
				// }
			})
			
			.when('/admin/cases/', {
				template: '<admin-cases-dir></admin-cases-dir>',
				resolve: getUserAuthResolver({type: 'admin'})
				//controller: AdminCtrl
				// controller: function($scope, $location, ApiSrv) {
				// 	if (!ApiSrv.getUser().userRights || !ApiSrv.getUser().userRights.admin)
				// 		$location.path('/');
				// }
			})
			
			.when('/admin/cases/:caseId', {
				template: '<admin-case-dir></admin-case-dir>',
				resolve: getUserAuthResolver({type: 'admin'})
				// controller: AdminCtrl
				// controller: function($scope, $location, ApiSrv) {
				// 	if (!ApiSrv.getUser().userRights || !ApiSrv.getUser().userRights.admin)
				// 		$location.path('/');
				// }
			})
			
			
			//.otherwise('/');
			
		}
	// .config(function($mdIconProvider) {
	// });

	
}());