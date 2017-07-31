

(function () {
	"use strict";
	/**
	 * @desc
	 * @example
	 */
	angular.module('SportsensusApp')
		.directive('playgroundParamsTableDir', playgroundParamsTableDir);

	playgroundParamsTableDir.$inject = [
		'$rootScope'
	];

	function playgroundParamsTableDir(
		$rootScope
	)    {
		return {
			restrict: 'E',
			scope: {
				params: '='
			},
			templateUrl: '/views/widgets/infobox/panels/analytics/playgroundParamsTable/playgroundParamsTable.html',
			link: function ($scope, $el, attrs) {

			},

			controller: [
				'$scope',
				function(
					$scope
				){
					$scope.showed = true;
					$scope.showHide = function(){
						$scope.showed = !$scope.showed;
					}
				}
			]

		};
	}
}());