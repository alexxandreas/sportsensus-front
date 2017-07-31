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

			// TODO фильтровать спорты/лиги/клубы по наличию данных для аналитики, не хардкодить
			$scope.sports = [];

			
			$scope.selected = analyticsSrv.getSelected();
			$scope.$on('analyticsSrv.selectionChanged', function(event, value){
				$scope.selected = value;
			});
			
			
			$scope.parameters.sport.lists.forEach(function(sport){

				var selected = analyticsSrv.getSelected || {};

				//return sport.key == 'football' || sport.key == 'hockey';
				if (sport.key == 'hockey'){

					/*var sportObj = angular.extend({}, sport);

					if (!selected.club && !selected.league && selected.sport && selected.sport.id == sportObj.id)
						sportObj.selectedInAnalytics = true;

					var leagues = [];
					sportObj.leagues.forEach(function(league){
						//if (league.id == 1){
						if (league.name == "КХЛ"){
							var leagueObj = angular.extend({}, league);
							//leagueObj.disableSelectionInAnalytics = true;
							if (!selected.club && selected.league && selected.sport &&
								selected.sport.id == sportObj.id && selected.league.id == leagueObj.id )
								leagueObj.selectedInAnalytics = true;

							leagues.push(leagueObj);
						}
					});
					sportObj.leagues = leagues;
					sportObj.disableSelectionInAnalytics = true;

					$scope.sports.push(sportObj);*/
					$scope.sports.push(sport);

				} else if (sport.key == 'football'){

					/*var sportObj = angular.extend({}, sport);

					if (!selected.club && !selected.league && selected.sport && selected.sport.id == sportObj.id)
						sportObj.selectedInAnalytics = true;

					var leagues = [];
					sportObj.leagues.forEach(function(league){
						//if (league.id == 1){
						if (league.name == "РФПЛ"){
							var leagueObj = angular.extend({}, league);

							if (!selected.club && selected.league && selected.sport &&
								selected.sport.id == sportObj.id && selected.league.id == leagueObj.id )
								leagueObj.selectedInAnalytics = true;

							//leagueObj.disableSelectionInAnalytics = true;
							leagues.push(leagueObj);
						}
					});
					sportObj.leagues = leagues;

					sportObj.disableSelectionInAnalytics = true;
					$scope.sports.push(sportObj);*/
					$scope.sports.push(sport);

				}
			}); 
			
			
			//$scope.prepareLegends();
		});

		$scope.checkSelected = function(){
			var selected = analyticsSrv.getSelected();
			return !!(selected.sport || selected.league || selected.club);
		};


		$scope.clearSelection = function(){
			// $scope.parameters.sport.lists.forEach(function(sport){
			$scope.sports.forEach(function(sport){
				//sport.selectedInAnalytics = false;
				sport.leagues && sport.leagues.forEach(function(league){
					//league.selectedInAnalytics = false;
				});
				sport.clubs && sport.clubs.forEach(function(club){
					//club.selectedInAnalytics = false;
				});
			});
			analyticsSrv.setSelected({
				sport: null,
				league: null,
				club: null
			});
		};

		$scope.selectSport = function(sport){
			if (sport.disableSelectionInAnalytics) return;
			var val = (sport != $scope.selected.sport || ($scope.selected.league || $scope.selected.club));

			//var val = !sport.selectedInAnalytics;
			$scope.clearSelection();
			//sport.selectedInAnalytics = val;
			analyticsSrv.setSelected({
				sport: val ? sport: null,
				league: null,
				club: null
			});
		};

		$scope.selectLeague = function(league, sport){
			if (league.disableSelectionInAnalytics) return;
			var val = (league != $scope.selected.league || ($scope.selected.club));
			//var val = !league.selectedInAnalytics;
			$scope.clearSelection();
			//league.selectedInAnalytics = val;
			//sport.selectedInAnalytics = false;
			analyticsSrv.setSelected({
				sport: val ? sport : null,
				league: val ? league : null,
				club: null
			});
		};

		$scope.selectClub = function(club, league, sport){
			var val = (club != $scope.selected.club);
			//var val = !club.selectedInAnalytics;
			$scope.clearSelection();
			//club.selectedInAnalytics = val;
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
