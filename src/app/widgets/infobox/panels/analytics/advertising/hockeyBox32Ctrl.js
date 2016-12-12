(function () {
	"use strict";
	/**
	 * @desc
	 */
	angular.module('SportsensusApp')
		.controller('hockeyBox32Ctrl', hockeyBox32Ctrl);

	hockeyBox32Ctrl.$inject = [
		'$scope',
		'$controller',
		'$q',
		'ParamsSrv',
		'ApiSrv',
		'analyticsSrv',
		'graphHelpersSrv'
	];

	function hockeyBox32Ctrl(
		$scope,
		$controller,
		$q,
		ParamsSrv,
		ApiSrv,
		analyticsSrv,
		graphHelpersSrv
	) {

		ParamsSrv.getParams().then(function(params){
			$scope.parameters = params;
			$scope.playgroundData = params.playgrounds.items.hockeyBox32;

			$scope.places = Object.keys($scope.playgroundData.visibility).map(function(key){
				return {name:key, selected: false};
			});

			$scope.formPlaces = ['А','Б','В','Г','Д'].map(function(key){
				return {name:key, selected: false};
			});
			
			/*$scope.places = {};
			Object.keys($scope.playground.visibility).forEach(function(key){
				$scope.places[key] = {selected: false};
			});*/
			//$scope.playground.params = [{'Вместимость':'12500', 'Заполняемость':'80%', 'Среднее что-то':'16.98'}];
			var a = $scope.playground;
			
			$scope.playgroundParams = {
				//"type": "hockeyBox", //(footballField, hockeyBox, basketballCourt, boxingRing, carTrack1, carTrack3...)
				"stadium": { name: "Стадион", value: $scope.playground.stadium },
				"city": { name: "Город", value: $scope.playground.city },
				"capacity": { name: "Вместимость", value: $scope.playground.capacity },
				"matchCount": { name: "Матчей в сезоне", value: $scope.playground.matchCount },
				"tvMatchCount": { name: "Телетрансляций в сезоне", value: $scope.playground.tvMatchCount },
				"occupancy": { name: "Заполняемость", value: $scope.playground.occupancy }
				//"offline": {name: 'Оффлайн (на трибунах)', value: $scope.playground.capacity * $scope.playground.occupancy * $scope.playground.tvMatchCount},
				//"online": {name: 'Онлайн (ТВ-аудитория)', value:0 }
			};

			/*$scope.watchData = $scope.parameters.watch.lists.map(function(list){
				return {
					name:list.name,
					id: list.id
				}
			});

			$scope.walkData = $scope.parameters.walk.lists.map(function(list){
				return {
					name:list.name,
					id: list.id
				}
			});
*/
			
			$scope.$on('ApiSrv.countLoaded', readCount);
			readCount();
			
			$scope.$watch('totalCost', calc);
			$scope.$watch('places', calc, true);

			loadWalkWatch();
			
			
			//recalc();
			//recalc();

		});

		$scope.audiencePercent = 0;

		$scope.percentWatch = {};
		$scope.percentWalk = {};
		
		function readCount(){
			var result = ApiSrv.getLastCountResult();
			//if (result && result.is_valid_count)
			//	$scope.audienceCount = result.audience_count;
			$scope.audiencePercent = result.audience_percent;
			calc();
			//else
			//	$scope.audienceCount = 0;
		}
		
		function calc(){
			
			var data = {};
			data.peopleOffline = getPeopleOffline();
			data.peopleOnline = getPeopleOnline();

			data.CPTOffline = data.peopleOffline && $scope.totalCost ? Math.round($scope.totalCost / data.peopleOffline * 1000) : 0;
			data.CPTOnline = data.peopleOnline && $scope.totalCost ? Math.round($scope.totalCost  / data.peopleOnline * 1000) : 0;

			data.peopleAll = data.peopleOffline + data.peopleOnline;
			data.CPTAll = data.peopleAll && $scope.totalCost ? Math.round($scope.totalCost  / data.peopleAll * 1000) : 0;

			data.peopleOfflineCA = Math.round(data.peopleOffline * $scope.audiencePercent / 100);
			data.peopleOnlineCA = Math.round(data.peopleOnline * $scope.audiencePercent / 100);

			data.CPTOfflineCA = data.peopleOfflineCA && $scope.totalCost ? Math.round($scope.totalCost / data.peopleOfflineCA * 1000) : 0;
			data.CPTOnlineCA = data.peopleOnlineCA && $scope.totalCost ? Math.round($scope.totalCost  / data.peopleOnlineCA * 1000) : 0;


			data.watchData = $scope.parameters.watch.lists.map(function(list){
				return {
					name:list.name,
					id: list.id,
					count: Math.round(data.peopleOnlineCA * ($scope.percentWatch[list.id] || 0))
				}
			});


			data.walkData = $scope.parameters.walk.lists.map(function(list){
				return {
					name:list.name,
					id: list.id,
					count: Math.round(data.peopleOfflineCA * ($scope.percentWalk[list.id] || 0))
				}
			});

			
			//$scope.places;
			//$scope.playgroundData.statistics
			$scope.results = data;
		}

		function getPeopleOffline(){
			var allPeoples = $scope.playground.capacity * $scope.playground.occupancy * $scope.playground.matchCount;

			return Math.round(allPeoples * calcVisibility());
		}

		function getPeopleOnline(){
			var stat = getStatistics();
			if (!stat) return 0;

			var max = 0;
			$scope.places.forEach(function(place){
				if (!place.selected) return;
				var data = stat.data[place.name];
				if (!data) return;
				max = Math.max(max, data["OTS"] || 0);
			});
			return Math.round(max * 1000);
		}

		function getStatistics(){
			var selected = analyticsSrv.getSelected();
			//selected.club
			//selected.league
			var leagueName = null;
			if (selected.league)
				leagueName = selected.league.name;

			var filtered = $scope.playgroundData.statistics.filter(function(stat){
				return leagueName ? stat.league == leagueName : true;
			});

			if (!filtered.length) return null;
			return filtered[0];
			//"league": "ВХЛ";
		}

		function calcVisibility(){
			var sectors = {};
			$scope.places.forEach(function(place){
				if (!place.selected) return;
				var placeA = $scope.playgroundData.visibility[place.name];
				//if (!placeA) return;
				placeA.forEach(function(val, index){
					sectors[index] = Math.max(sectors[index] || 0, val || 0);
				});
			});
			var sum = 0;
			Object.keys(sectors).forEach(function(index){
				sum += sectors[index];
			});
			return sum;
		}

		
		function loadWalkWatch(){

			//var audience = ParamsSrv.getSelectedAudience();

			var selected = analyticsSrv.getSelected();
			var sports = {};
			sports[selected.sport.key] = {interested: true};

			if (selected.club)
				sports[selected.sport.key].clubs = [selected.club.id]


			/*$scope.sportLegend.forEach(function (list) {
				if (!list.selected) return;
				var sportObj = {interested: true};
				sportObj.clubs = list.clubs ? list.clubs.filter(function(club){return club.selected;}).map(function(club){return club.id; }) : [];
				if (!sportObj.clubs.length) return;
				sports[list.key] = sportObj;
			});*/

			var rootingWatch = $scope.parameters.watch.lists.map(function (list) {return list.id;}); // [1, 2, 3, 4];
			var rootingWalk = $scope.parameters.walk.lists.map(function (list) {return list.id;}); //[1, 2, 3, 4];

			$q.all({
				//rooting: ApiSrv.getRootingGraph(audience, sports, rooting),
				watch: ApiSrv.getRootingWatchGraph({}, sports, rootingWatch),
				walk: ApiSrv.getRootingWalkGraph({}, sports, rootingWalk)
			}).then(function(data){
				var watchData = data.watch ? graphHelpersSrv.prepareChartData(data.watch, {
					'rooting':$scope.parameters.watch,
					'sport':$scope.parameters.sport,
					'club':$scope.parameters.sport
				}) : null;

				var walkData = data.walk ? graphHelpersSrv.prepareChartData(data.walk, {
					'rooting':$scope.parameters.walk,
					'sport':$scope.parameters.sport,
					'club':$scope.parameters.sport
				}) : null;

				var allWatch = watchData.getCount({ }) || 1;
				var allWalk = walkData.getCount({ }) || 1;

				rootingWatch.forEach(function(id){
					$scope.percentWatch[id] =(watchData.getCount({
						//'sport': sport.id,
						//'club': club.id,
						'rooting': id
					}) || 0) / allWatch;
				});
				rootingWalk.forEach(function(id){
					$scope.percentWalk[id] = (walkData.getCount({
						//'sport': sport.id,
						//'club': club.id,
						'rooting': id
					}) || 0) / allWalk;
				});

				calc();
			});

		}
		
	}

}());
