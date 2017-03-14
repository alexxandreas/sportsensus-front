(function () {
	"use strict";
	/**
	 * @desc
	 */
	angular.module('SportsensusApp')
		.controller('footballFieldCtrl', footballFieldCtrl);

	footballFieldCtrl.$inject = [
		'$scope',
		'$controller',
		'$q',
		'ParamsSrv',
		'ApiSrv'
	];

	function footballFieldCtrl(
		$scope,
		$controller,
		$q,
		ParamsSrv,
		ApiSrv
	) {
		$controller('hockeyBoxBaseCtrl', {$scope: $scope});
		
		var promises = [];
		promises.push(ApiSrv.getStatic('football').then(function(hockeyData){
			hockeyData.forEach(function(item) {
				if (item.type == 'championship') {
					$scope.championship = item;
				} else if (item.type == 'footballField') {
					$scope.playgroundData = item;
				} /*else if (item.type == 'hockeyUniform') {
					$scope.uniformData = item;
				} else if (item.type == 'hockeyVideoOffline') {
					$scope.videoOfflineData = item;
				} else if (item.type == 'hockeyVideoOnline') {
					$scope.videoOnlineData = item;
				}*/
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
			// preparePlaces($scope.uniformData);
			// preparePlaces($scope.videoOfflineData);
			// preparePlaces($scope.videoOnlineData);


			$scope.playgroundPlacesA = [];
			var columnsCount = 4;
			//var places = Object.keys($scope.playgroundData.places).map(function(key){return {key: key, place: $scope.playgroundData.places[key]}; });
			var count = $scope.playgroundData.places.length;
			for (var col=1; col <= columnsCount; col++){
				var arr = $scope.playgroundData.places.slice(Math.ceil(count/columnsCount*(col-1)),Math.ceil(count/columnsCount*col));
				$scope.playgroundPlacesA.push(arr.map(function(key){ return $scope.playgroundData.placesSelection[key]; }));
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
			// $scope.$watch('uniformData.placesSelection', $scope.calc, true);
			// $scope.$watch('videoOfflineData.placesSelection', $scope.calc, true);
			// $scope.$watch('videoOnlineData.placesSelection', $scope.calc, true);
		});
		
		$scope.audiencePercent = 0;


// расчет видимости выбранных рекламных конструкций на площадке (0.0 - 1.0)
		$scope.calcVisibility = function(){
			
			var data =  {
				playgroundOnline: 		$scope.calcSectors($scope.playgroundData, 'Online'),
				playgroundOffline:		$scope.calcSectors($scope.playgroundData, 'Offline'),
				// uniformOnline:	 		$scope.calcSectors($scope.uniformData, 'Online'),
				// uniformOffline: 		$scope.calcSectors($scope.uniformData, 'Offline'),
				// videoOfflineOnline: 	$scope.calcSectors($scope.videoOfflineData, 'Online'),
				// videoOfflineOffline: 	$scope.calcSectors($scope.videoOfflineData, 'Offline'),
				// videoOnlineOnline: 		$scope.calcSectors($scope.videoOnlineData, 'Online'),
				// videoOnlineOffline: 	$scope.calcSectors($scope.videoOnlineData, 'Offline')
			};
			var dataEff = {
				playgroundOnline: 		$scope.calcSectors($scope.playgroundData, 'Online', true),
				playgroundOffline:		$scope.calcSectors($scope.playgroundData, 'Offline', true),
				// uniformOnline:	 		$scope.calcSectors($scope.uniformData, 'Online', true),
				// uniformOffline: 		$scope.calcSectors($scope.uniformData, 'Offline', true),
				// videoOfflineOnline: 	$scope.calcSectors($scope.videoOfflineData, 'Online', true),
				// videoOfflineOffline: 	$scope.calcSectors($scope.videoOfflineData, 'Offline', true),
				// videoOnlineOnline: 		$scope.calcSectors($scope.videoOnlineData, 'Online', true),
				// videoOnlineOffline: 	$scope.calcSectors($scope.videoOnlineData, 'Offline', true)
			};
			
			
			var result = {
				online: Math.max(data.playgroundOnline),
				offline: Math.max(data.playgroundOffline),
				
				// дома учитывается площадка, форма и видео, в гостях - форма
				offlineHome: Math.max(data.playgroundOffline),
				offlineGuest: Math.max(0),
				
				
				onlineEff: Math.max(dataEff.playgroundOnline),
				offlineEff: Math.max(dataEff.playgroundOffline),
				
				// дома учитывается площадка, форма и видео, в гостях - форма
				offlineEffHome: Math.max(dataEff.playgroundOffline),
				offlineEffGuest: Math.max(0)
			};
			return result;
			
			

		};
		
	}

}());
