(function () {

    "use strict";
    
    angular
	.module('SportsensusApp', [
		'ngMaterial',
		'ngRoute',
		'ngCookies',
		'Views',
		//'ckeditor',
		'ui.tinymce'
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
	// .config(function($mdIconProvider) {
	// 	$mdIconProvider.defaultIconSet('static/core-icons.svg', 24);
	// })
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
			userAuthResolver: ['ApiSrv', 'UserSrv', '$location', '$q', function(ApiSrv, UserSrv, $location, $q) {
				return UserSrv.getUserCheckPromise().then(function(user){
					return;
					
					// return UserSrv.getUserAuthPromise().then(function(user){
					// if (!options) return;
					
					// var userRights = user.userRights || {};
					
					// if (options.type == 'admin' && !userRights.admin) {
					// 	$location.path('/');
					// 	return $q.reject();
					// }

					
					// return;
					
					
					// var hasAccess = UserSrv.hasAccess(options.type);
					// if (!hasAccess){
					// 	$location.path('/');
					// 	return $q.reject();
					// }
					
					
					// if (options.type == 'infobox') {
					// 	if (!userRights.tariff || !userRights.tariff.accessInfoblock) {
					// 		$location.path('/');
					// 		return $q.reject();
					// 	}
					// }
					// if (options.type == 'analytics') {
					// 	if (!userRights.tariff || !userRights.tariff.accessAnalytics) {
					// 		$location.path('/');
					// 		return $q.reject();
					// 	}
					// }
					// if (options.type == 'cases') {
					// 	if (!userRights.tariff || !userRights.tariff.accessCases) {
					// 		$location.path('/');
					// 		return $q.reject();
					// 	}
					// }
					// if (options.type == 'scheduler') {
					// 	if (!userRights.tariff || !userRights.tariff.accessScheduler) {
					// 		$location.path('/');
					// 		return $q.reject();
					// 	}
					// }
					
				}, function(){
					$location.path('/');
					return $q.reject();
				})
			}]
		};
	}
	
	
	function getCheckAccessTemplate(type, defaultTemplate){
		return '<check-access-dir type="' + (type || '') + '">' + defaultTemplate + '</check-access-dir>'
	}
	
	
	function activateController($scope, $location, $mdDialog, ApiSrv) {
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
	activateController.$inject = ['$scope', '$location', '$mdDialog', 'ApiSrv'];
	
	
	
	
	
	function configRoutes($routeProvider) {
			

			$routeProvider
			
			.when('/', {
				template: '<home-dir></home-dir>'
			})
			
			.when('/login/', { 
				template: '<login-dir></login-dir>'
			})
			
			.when('/activate/', {
				template: ' ',
				controller: activateController
			})
			
			
			// можно без getCheckAccessTemplate, т.к. доступ открыт всем залогиненным
			.when('/infobox/', { 
				// template: '<infobox-dir type="infobox"></infobox-dir>',
				template: getCheckAccessTemplate('infoblock', '<infobox-dir type="infobox"></infobox-dir>'),
				resolve: getUserAuthResolver()
				
			})
			
			.when('/analytics/', {
				// template: '<analytics-dir></analytics-dir>',
				template: getCheckAccessTemplate('rightholder,sponsor', '<analytics-dir></analytics-dir>'),
				resolve: getUserAuthResolver()
			})
			
			.when('/articles/', { 
				// template: '<articles-dir></articles-dir>',
				template: getCheckAccessTemplate('cases', '<articles-dir></articles-dir>'),
				resolve: getUserAuthResolver()
			})
			
			.when('/articles/:articleId', { 
				// template: '<article-dir></article-dir>',
				template: getCheckAccessTemplate('cases', '<article-dir></article-dir>'),
				resolve: getUserAuthResolver()
			})
			
			
			
			
			.when('/account/', {
				// template: '<account-dir></account-dir>',
				template: getCheckAccessTemplate(null, '<account-dir></account-dir>'),
				resolve: getUserAuthResolver()
			})
			
			
			/** ADMIN **/
			
			.when('/admin/', {
				//template: '<admin-dir></admin-dir>',
				template: getCheckAccessTemplate('admin', '<admin-dir></admin-dir>'),
				resolve: getUserAuthResolver()
			})
			
			.when('/admin/articles/', {
				// template: '<admin-articles-dir></admin-articles-dir>',
				template: getCheckAccessTemplate('admin', '<admin-articles-dir></admin-articles-dir>'),
				resolve: getUserAuthResolver()
			})
			
			.when('/admin/profiles/', {
				//template: '<admin-profiles-dir></admin-profiles-dir>',
				template: getCheckAccessTemplate('admin', '<admin-profiles-dir></admin-profiles-dir>'),
				resolve: getUserAuthResolver()
			})
			
			.when('/admin/profiles/:userId', {
				// template: '<admin-profile-dir></admin-profile-dir>',
				template: getCheckAccessTemplate('admin', '<admin-profile-dir></admin-profile-dir>'),
				resolve: getUserAuthResolver()
			})
			
			.when('/admin/sendMail/:userId?', {
				// template: '<admin-send-mail-dir></admin-send-mail-dir>',
				template: getCheckAccessTemplate('admin', '<admin-send-mail-dir></admin-send-mail-dir>'),
				resolve: getUserAuthResolver()
			})
			
			.when('/admin/cases/', {
				// template: '<admin-cases-dir></admin-cases-dir>',
				template: getCheckAccessTemplate('admin', '<admin-cases-dir></admin-cases-dir>'),
				resolve: getUserAuthResolver()
			})
			
			.when('/admin/cases/:caseId', {
				// template: '<admin-case-dir></admin-case-dir>',
				template: getCheckAccessTemplate('admin', '<admin-case-dir></admin-case-dir>'),
				resolve: getUserAuthResolver()
			})
			
			
			//.otherwise('/');
			
		}
	// .config(function($mdIconProvider) {
	// });




	
	
	
	
	
	





	
}());