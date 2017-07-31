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
