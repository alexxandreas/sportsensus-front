(function () {
	"use strict";
	/**
	 * @desc
	 * @example
	 */
	angular.module('SportsensusApp')
		.directive('clubInfoTableDir', clubInfoTableDir);

	clubInfoTableDir.$inject = [
		'$rootScope'
	];

	function clubInfoTableDir(
		$rootScope
	)    {
		return {
			restrict: 'E',
			scope: {
				//results: '=',
				//price: '='
				clubInfo: '='
			},
			templateUrl: '/views/widgets/infobox/panels/analytics/clubInfoTable/clubInfoTable.html',
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