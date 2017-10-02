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
	
	.config(['$routeProvider', 'RouteSrvProvider', function ($routeProvider, RouteSrvProvider) {
			
		var config = RouteSrvProvider.$get().getRoutes();
		
		angular.forEach(config, function(route){
			$routeProvider.when(route.path, {
				template: route.template,
				controller: route.controller,
				resolve: route.resolve
			})
		})
	}])

	
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
	
	
}());