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



				}
			]
			
		};
	}
}());