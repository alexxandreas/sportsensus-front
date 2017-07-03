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