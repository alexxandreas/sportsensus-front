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

			$scope.parameters.sport.lists.forEach(function(sport){
				//return sport.key == 'football' || sport.key == 'hockey';
				if (sport.key == 'hockey'){
					var sportObj = angular.extend({}, sport);
					var leagues = [];
					sportObj.leagues.forEach(function(league){
						//if (league.id == 1){
						if (league.name == "КХЛ"){
							var leagueObj = angular.extend({}, league);
							leagueObj.disableSelectionInAnalytics = true;

							// var clubs = [];
							// leagueObj.clubs.forEach(function(club) {
							// 	if (club.id == 19)
							// 		clubs.push(club);
							// });
							// leagueObj.clubs = clubs;
							leagues.push(leagueObj);
						}
					});
					sportObj.leagues = leagues;
					sportObj.disableSelectionInAnalytics = true;
					$scope.sports.push(sportObj);
				} else if (sport.key == 'football'){
					var sportObj = angular.extend({}, sport);
					//var leagues = [];
					delete sportObj.leagues;
					sportObj.clubs = [{
						name: 'Тестовый клуб',
						id: 999
					}];
					sportObj.disableSelectionInAnalytics = true;
					$scope.sports.push(sportObj);
				}
			}); 
			
			
			//$scope.prepareLegends();
		});


		function clearSelection(){
			// $scope.parameters.sport.lists.forEach(function(sport){
			$scope.sports.forEach(function(sport){
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
			if (sport.disableSelectionInAnalytics) return;
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
			if (league.disableSelectionInAnalytics) return;
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
