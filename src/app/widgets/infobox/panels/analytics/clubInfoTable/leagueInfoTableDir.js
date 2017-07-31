(function () {
	"use strict";
	/**
	 * @desc
	 * @example
	 */
	angular.module('SportsensusApp')
		.directive('leagueInfoTableDir', leagueInfoTableDir);

	leagueInfoTableDir.$inject = [
		'$rootScope'
	];

	function leagueInfoTableDir(
		$rootScope
	)    {
		return {
			restrict: 'E',
			scope: {
				leagueInfo: '='
			},
			templateUrl: '/views/widgets/infobox/panels/analytics/clubInfoTable/leagueInfoTable.html',
			link: function ($scope, $el, attrs) {

			},

			controller: [
				'$scope',
				function(
					$scope
				){
					$scope.showed = true;
				}
			]

		};
	}
}());