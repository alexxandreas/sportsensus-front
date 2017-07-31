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
