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
				template: '<infobox-dir type="infobox"></infobox-dir>',
				controller: function($scope, $location, ApiSrv) {
					if (!ApiSrv.getUser().sid || ApiSrv.getUser().userRights.admin)
						$location.path('/');
				}
			})
			.when('/analytics/', {
				template: '<infobox-dir type="analytics"></infobox-dir>',
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
				controller: function($scope, $location, ApiSrv) {
					if (!ApiSrv.getUser().userRights || !ApiSrv.getUser().userRights.admin)
						$location.path('/');
				}
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
			.accentPalette('blue');
	})
	.run(['ConfigSrv', function (ConfigSrv) {
		var config = window.appConfig;
		ConfigSrv.set(config);
	}]);
	
	// .config(function($mdIconProvider) {
	// });
	
	