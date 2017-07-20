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
		'StaticSrv',
		'AudienceCountSrv',
		'analyticsSrv',
		'graphHelpersSrv'
	];

	function hockeyBox32Ctrl(
		$scope,
		$controller,
		$q,
		ParamsSrv,
		ApiSrv,
		StaticSrv,
		AudienceCountSrv,
		analyticsSrv,
		graphHelpersSrv
	) {
		$controller('hockeyBoxBaseCtrl', {$scope: $scope});

		
		var promises = [];
		promises.push(StaticSrv.getStatic('hockey').then(function(hockeyData){
			hockeyData.forEach(function(item){
				if (item.type == 'championship'){
					$scope.championship = item;
				} else if (item.type == 'hockeyBox32'){
					$scope.playgroundData = item;
				} else if (item.type == 'hockeyUniform'){
					$scope.uniformData = item;
				}
			});
		}));

		promises.push(ParamsSrv.getParams().then(function(params){
			$scope.parameters = params;
		}));


		// все данные загружены
		$q.all(promises).then(function(){
			$scope.prepare();

			
			$scope.playgroundPlaces = Object.keys($scope.playgroundData.visibilityOffline).map(function(key){
				return {name:key, selected: false};
			});

			$scope.playgroundPlacesA = [];
			var columnsCount = 4;
			var count = $scope.playgroundPlaces.length;
			for (var col=1; col <= columnsCount; col++){
				$scope.playgroundPlacesA.push($scope.playgroundPlaces.slice(Math.ceil(count/columnsCount*(col-1)),Math.ceil(count/columnsCount*col)));
			}
			
			$scope.uniformPlaces = Object.keys($scope.uniformData.visibilityOffline).map(function(key){
				return {name:key, selected: false};
			});


			$scope.$on('AudienceCountSrv.countLoaded', readCount);
			readCount();
			
			function readCount(){
				var result = AudienceCountSrv.getLastCountResult();
				$scope.audiencePercent = result.audiencePercent / 100;
				$scope.calc();
			}

			$scope.$watch('totalCost', $scope.calc);
			$scope.$watch('playgroundPlaces', $scope.calc, true);
			$scope.$watch('uniformPlaces', $scope.calc, true);
		});


		$scope.audiencePercent = 0;
		$scope.percentWatch = {};
		$scope.percentWalk = {};


		/*
		function calc(){

			var visibility = calcVisibility();
			var audiencePercent = $scope.audiencePercent || 1;

			var data = {};
			// Аудитория клуба
			data.peopleAllOnline = $scope.clubInfo.onlineTotalAll * visibility.online * audiencePercent;
			data.peopleAllOffline = $scope.clubInfo.offlineTotalAll * visibility.offline * audiencePercent;

			// кол-во уникальных онлайн, тысяч шт
			var uniqueOnline = $scope.clubInfo.onlineUniqueAll * visibility.online * audiencePercent;
			var uniqueOffline = $scope.clubInfo.offlineUniqueAll * visibility.offline * audiencePercent;

			data.CPTUniqueOnline = $scope.totalCost && uniqueOnline ? Math.round($scope.totalCost / uniqueOnline) : '-';
			data.CPTUniqueOffline = $scope.totalCost && uniqueOffline ? Math.round($scope.totalCost / uniqueOffline) : '-';

			// OTS, штук
			var OTSOnline = $scope.clubInfo.OTSOnline * visibility.online * audiencePercent;
			var OTSOffline = $scope.clubInfo.OTSOffline * visibility.offline * audiencePercent;

			data.CPTOTSOnline = $scope.totalCost && OTSOnline ? Math.round($scope.totalCost / OTSOnline) : '-';
			data.CPTOTSOffline = $scope.totalCost && OTSOffline ? Math.round($scope.totalCost / OTSOffline) : '-';

			
			data.audienceSelected = ParamsSrv.isAudienceSelected();



			//$scope.places;
			//$scope.playgroundData.statistics
			$scope.results = data;
		}
		*/
		/*
		// расчет видимости выбранных рекламных конструкций на площадке (0.0 - 1.0)
		function calcVisibility(){
			var result = {
				playgroundOnline: Math.min(calcPlaygroundOnline(), 1),
				playgroundOffline: Math.min(calcPlaygroundOffline(), 1),
				uniformOnline: Math.min(calcUniformOnline(), 1),
				uniformOffline: Math.min(calcUniformOffline(), 1)
			};
			result.online = Math.max(result.playgroundOnline, result.uniformOnline);
			result.offline = Math.max(result.playgroundOffline, result.uniformOffline);

			return result;

			function calcPlaygroundOnline(){
				var result = 0;
				$scope.playgroundPlaces.forEach(function(place){
					if (!place.selected) return;
					if ($scope.playgroundData.visibilityOnline[place.name])
						result = Math.max(result, $scope.playgroundData.visibilityOnline[place.name]);
				});
				return result;
			}

			function calcPlaygroundOffline(){
				var sectors = {};
				$scope.playgroundPlaces.forEach(function(place){
					if (!place.selected) return;
					var placeA = $scope.playgroundData.visibilityOffline[place.name];
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

			function calcUniformOnline(){
				var result = 0;
				$scope.uniformPlaces.forEach(function(place){
					if (!place.selected) return;
					if ($scope.uniformData.visibilityOnline[place.name])
						result = Math.max(result,$scope.uniformData.visibilityOnline[place.name]);
				});
				return result;
			}

			function calcUniformOffline(){
				var result = 0;
				$scope.uniformPlaces.forEach(function(place){
					if (!place.selected) return;
					if ($scope.uniformData.visibilityOffline[place.name])
						result = Math.max(result, $scope.uniformData.visibilityOffline[place.name]);
				});
				return result;
			}

		}
		*/

		/*
		function loadWalkWatch(){

			//var audience = ParamsSrv.getSelectedAudience();

			var selected = analyticsSrv.getSelected();
			var sports = {};
			sports[selected.sport.key] = {interested: true};

			if (selected.club)
				sports[selected.sport.key].clubs = [selected.club.id]


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
		*/


	}

}());
