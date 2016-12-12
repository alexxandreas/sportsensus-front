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
				template: '<infobox-dir type="infobox"></infobox-dir>'
			})
			.when('/analytics/', {
				template: '<infobox-dir type="analytics"></infobox-dir>'
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
	
	