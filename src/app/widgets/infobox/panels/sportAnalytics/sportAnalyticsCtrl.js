(function () {
	"use strict";
	/**
	 * @desc
	 */
	angular.module('SportsensusApp')
		.controller('sportAnalyticsCtrl', sportAnalyticsCtrl);

	sportAnalyticsCtrl.$inject = [
		'$scope',
		'$controller',
		'$q',
		'ParamsSrv',
		'ApiSrv',
		'analyticsSrv'
	];

	function sportAnalyticsCtrl(
		$scope,
		$controller,
		$q,
		ParamsSrv,
		ApiSrv,
		analyticsSrv
	) {
		//$controller('baseGraphCtrl', {$scope: $scope});

		ParamsSrv.getParams().then(function (params) {
			$scope.parameters = params;

			//$scope.prepareLegends();
		});


		function clearSelection(){
			$scope.parameters.sport.lists.forEach(function(sport){
				sport.selectedInAnalytics = false;
				sport.leagues && sport.leagues.forEach(function(league){
					league.selectedInAnalytics = false;
				});
				sport.clubs && sport.clubs.forEach(function(club){
					club.selectedInAnalytics = false;
				});
			})
		}

		$scope.selectSport = function(sport){
			var val = !sport.selectedInAnalytics;
			clearSelection();
			sport.selectedInAnalytics = val;
			analyticsSrv.setSelected({
				sport: val ? sport: null,
				league: null,
				club: null
			});
		};

		$scope.selectLeague = function(league, sport){
			var val = !league.selectedInAnalytics;
			clearSelection();
			league.selectedInAnalytics = val;
			//sport.selectedInAnalytics = false;
			analyticsSrv.setSelected({
				sport: val ? sport : null,
				league: val ? league : null,
				club: null
			});
		};

		$scope.selectClub = function(club, league, sport){
			var val = !club.selectedInAnalytics;
			clearSelection();
			club.selectedInAnalytics = val;
			//league.selectedInAnalytics = false;
			//sport.selectedInAnalytics = false;
			analyticsSrv.setSelected({
				sport: val ? sport : null,
				league: val ? league : null,
				club: val ? club : null
			});
		};



	}

}());
