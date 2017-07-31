(function () {
	"use strict";
	/**
	 * @desc
	 * @example
	 */
	angular.module('SportsensusApp')
		.directive('adminDir', adminDir);

	adminDir.$inject = [
		'$rootScope'
	];

	function adminDir(
		$rootScope
	)    {
		return {
			restrict: 'E',
			scope: {
				type: '@'
			},
			templateUrl: '/views/widgets/admin/admin.html',
			link: function ($scope, $el, attrs) {
				//$scope.init();
			},

			controller: [
				'$scope',
				'$routeParams',
				function(
					$scope,
					$routeParams
				) {

					
				}]
		};
	}
}());
