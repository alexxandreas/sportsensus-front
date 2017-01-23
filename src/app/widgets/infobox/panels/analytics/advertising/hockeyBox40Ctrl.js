(function () {
	"use strict";
	/**
	 * @desc
	 */
	angular.module('SportsensusApp')
		.controller('hockeyBox40Ctrl', hockeyBox40Ctrl);

	hockeyBox40Ctrl.$inject = [
		'$scope',
		'$controller',
		'$q',
		'ParamsSrv',
		'ApiSrv',
		'analyticsSrv',
		'graphHelpersSrv'
	];

	function hockeyBox40Ctrl(
		$scope,
		$controller,
		$q,
		ParamsSrv,
		ApiSrv,
		analyticsSrv,
		graphHelpersSrv
	) {
		$controller('hockeyBoxBaseCtrl', {$scope: $scope});

		
		var promises = [];
		promises.push(ApiSrv.getStatic('hockey').then(function(hockeyData){
			hockeyData.forEach(function(item) {
				if (item.type == 'championship') {
					$scope.championship = item;
				} else if (item.type == 'hockeyBox40') {
					$scope.playgroundData = item;
				} else if (item.type == 'hockeyUniform') {
					$scope.uniformData = item;
				} else if (item.type == 'hockeyVideoOffline') {
					$scope.videoOfflineData = item;
				} else if (item.type == 'hockeyVideoOnline') {
					$scope.videoOnlineData = item;
				}
			});
		}));

		promises.push(ParamsSrv.getParams().then(function(params){
			$scope.parameters = params;
		}));


		// все данные загружены
		$q.all(promises).then(function(){
			$scope.prepare(); 

			function preparePlaces(data){
				if (data.placesSelection) return;
				data.placesSelection = {};
				data.places.forEach(function(place){
					data.placesSelection[place] = {key: place, selected: false};
				});
			}
			
			preparePlaces($scope.playgroundData);
			preparePlaces($scope.uniformData);
			preparePlaces($scope.videoOfflineData);
			preparePlaces($scope.videoOnlineData);
			

			$scope.playgroundPlacesA = [];
			var columnsCount = 4;
			//var places = Object.keys($scope.playgroundData.places).map(function(key){return {key: key, place: $scope.playgroundData.places[key]}; });
			var count = $scope.playgroundData.places.length;
			for (var col=1; col <= columnsCount; col++){
				var arr = $scope.playgroundData.places.slice(Math.ceil(count/columnsCount*(col-1)),Math.ceil(count/columnsCount*col));
				$scope.playgroundPlacesA.push(arr.map(function(key){ return $scope.playgroundData.placesSelection[key]; }));
				//$scope.playgroundPlacesA.push(places.slice(Math.ceil(count/columnsCount*(col-1)),Math.ceil(count/columnsCount*col)));
			}
			
			$scope.$on('ApiSrv.countLoaded', readCount);
			readCount();

			function readCount(){
				var result = ApiSrv.getLastCountResult();
				$scope.audiencePercent = result.audiencePercent / 100;
				$scope.calc();
			}

			$scope.$watch('totalCost', $scope.calc);
			
			$scope.$watch('playgroundData.placesSelection', $scope.calc, true);
			$scope.$watch('uniformData.placesSelection', $scope.calc, true);
			$scope.$watch('videoOfflineData.placesSelection', $scope.calc, true);
			$scope.$watch('videoOnlineData.placesSelection', $scope.calc, true);
		});


		$scope.audiencePercent = 0;
		$scope.percentWatch = {};
		$scope.percentWalk = {};
		
	}

}());
