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