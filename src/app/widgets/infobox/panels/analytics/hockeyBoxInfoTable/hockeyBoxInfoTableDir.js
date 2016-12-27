(function () {
	"use strict";
	/**
	 * @desc
	 * @example
	 */
	angular.module('SportsensusApp')
		.directive('hockeyBoxInfoTableDir', hockeyBoxInfoTableDir);

	hockeyBoxInfoTableDir.$inject = [
		'$rootScope'
	];

	function hockeyBoxInfoTableDir(
		$rootScope
	)    {
		return {
			restrict: 'E',
			scope: {
				//results: '=',
				//price: '='
				//hockeyBoxInfo: '='
			},
			templateUrl: '/views/widgets/infobox/panels/analytics/hockeyBoxInfoTable/hockeyBoxInfoTable.html',
			link: function ($scope, $el, attrs) {

			},

			controller: [
				'$scope',
				function(
					$scope
				){
					$scope.hockeyBoxInfo = {
						name: 'name',
						//playgrounds: ['playground1','playground2'],
						clubName: 'clubName',
						city: 'city',
						gamesCount: 1234560,
						capacity: 'capacity',

						reachOffline: 1234561,
						reachOnline: 1234562,
						OTSOffline: 1234563,
						OTSOnline: 1234564,

						//offlineAVGHome: 1234565,
						//offlineAVGGuest: 1234566,
						offlineAVGAll: 1234566,

						//offlineTotalHome: 1234567,
						//offlineTotalGuest: 1234568,
						offlineTotalAll: 1234569,

						//offlineUniqueHome: 1234560,
						//offlineUniqueGuest: 1234561,
						offlineUniqueAll: 1234562,

						
						onlineRatings: 1234563,

						onlineTotalFederal: 1234564,
						onlineTotalLocal: 1234565,
						onlineTotalAll: 1234566,

						
						onlineUniqueFederal: 1234567,
						onlineUniqueLocal: 1234568,
						onlineUniqueAll: 1234569
					}


				}
			]

		};
	}
}());