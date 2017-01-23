(function () {
	"use strict";
	/**
	 * @desc
	 */
	angular.module('SportsensusApp')
		.controller('hockeyBoxBaseCtrl', hockeyBoxBaseCtrl);

	hockeyBoxBaseCtrl.$inject = [
		'$scope',
		'$controller',
		'$q',
		'ParamsSrv',
		'ApiSrv',
		'analyticsSrv',
		'graphHelpersSrv'
	];

	function hockeyBoxBaseCtrl(
		$scope,
		$controller,
		$q,
		ParamsSrv,
		ApiSrv,
		analyticsSrv,
		graphHelpersSrv
	) {
		
		$scope.audiencePercent = 0;

		$scope.prepare = function(){
			var selected = analyticsSrv.getSelected();
			var club = selected.club;
			var league = selected.league;
			//if (!club) return;
			if (club)
				$scope.prepareClubInfo();
			else if (league)
				$scope.prepareLeagueInfo();
		};

		$scope.prepareLeagueInfo = function(){
			var selected = analyticsSrv.getSelected();
			//var club = selected.club;
			var league = selected.league;
			if (!league) return;


			var allTmp = {
				onlineTotal: 0,
				//onlineTotalFederal: 0,
				//onlineTotalLocal: 0,
				offlineTotal: 0  // += (game.offlineCount || 0);
			};

			$scope.championship.data.championship.forEach(function(game){
				allTmp.onlineTotal += (game.federalTVAudience || 0) + (game.regionalTVAudience || 0);
				allTmp.offlineTotal += (game.offlineCount || 0);
			});

			var walkAvg = 0; // Среднее количество посещений хоккейных матчей на 1 зрителя данного клуба
			var watchAvg = 0; // Среднее количество ТВ-просмотров хоккейных матчей на 1 зрителя данного клуба
			if ($scope.championship.data.clubInfo){
				$scope.championship.data.clubInfo.forEach(function(_club){
					walkAvg += _club.walkAVG;
					watchAvg += _club.watchAVG;
				});
				walkAvg = walkAvg / $scope.championship.data.clubInfo.length;
				watchAvg = watchAvg / $scope.championship.data.clubInfo.length;
			} else {
				walkAvg = 1;
				watchAvg = 1;
			}

			var avgEffFreqOnline = $scope.championship.data.avgEffFreqOnline;
			var avgEffFreqOffline = $scope.championship.data.avgEffFreqOffline;

			$scope.calcParams = {
				onlineTotalAll: allTmp.onlineTotal, // в тысячах
				offlineTotalAll: allTmp.offlineTotal/1000, // в тысячах
				onlineUniqueAll: allTmp.onlineTotal/watchAvg, // в тысячах
				offlineUniqueAll:  allTmp.offlineTotal/1000/walkAvg,  // в тысячах
				OTSOnline:  allTmp.onlineTotal*avgEffFreqOnline, // в тысячах
				OTSOffline: allTmp.offlineTotal*avgEffFreqOffline/1000 // в тысячах
			}

		};

		$scope.prepareClubInfo = function(){

			var selected = analyticsSrv.getSelected();
			var club = selected.club;
			if (!club) return;

			// var playgrounds = получить все площадки для спорта

			var homeGames = [];
			var guestGames = [];
			var homeTmp = {
				occupancy: 0,
				offlineTotal: 0,
				playgrounds:{}
			};
			var guestTmp = {
				occupancy: 0,
				offlineTotal: 0
			};
			var allTmp = {
				onlineRatings: 0,
				onlineTotalFederal: 0,
				onlineTotalLocal: 0
			};

			$scope.championship.data.championship.forEach(function(game){
				if (game.hostClubId == club.id){
					homeGames.push(game);
					homeTmp.occupancy += game.offlineCount / game.stadiumCapacity;
					homeTmp.offlineTotal += game.offlineCount;
					if (game.stadiumId >= 0){
						homeTmp.playgrounds[game.stadiumId] = homeTmp.playgrounds[game.stadiumId] || {gamesCount:0};
						homeTmp.playgrounds[game.stadiumId].stadiumId = game.stadiumId;
						homeTmp.playgrounds[game.stadiumId].stadiumName = game.stadiumName;
						homeTmp.playgrounds[game.stadiumId].stadiumCapacity = game.stadiumCapacity;
						homeTmp.playgrounds[game.stadiumId].gamesCount++;
					}
					allTmp.onlineRatings += (game.federalTVRating || 0);
					allTmp.onlineTotalFederal += (game.federalTVAudience || 0);
					allTmp.onlineTotalLocal += (game.regionalTVAudience || 0);
				}
				if (game.guestClubId == club.id){
					guestGames.push(game);
					guestTmp.occupancy += game.offlineCount / game.stadiumCapacity;
					guestTmp.offlineTotal += (game.offlineCount || 0);
					allTmp.onlineRatings += (game.federalTVRating || 0);
					allTmp.onlineTotalFederal += (game.federalTVAudience || 0);
					allTmp.onlineTotalLocal += (game.regionalTVAudience || 0);
				}
			});


			var walkAvg = 0; // Среднее количество посещений хоккейных матчей на 1 зрителя данного клуба
			var watchAvg = 0; // Среднее количество ТВ-просмотров хоккейных матчей на 1 зрителя данного клуба
			if ($scope.championship.data.clubInfo){
				var finded = false;
				$scope.championship.data.clubInfo.forEach(function(_club){
					if (_club.id == club.id){
						finded = true;
						walkAvg = _club.walkAVG;
						watchAvg = _club.watchAVG;
					} else if (!finded){ // суммируем, чтобы потом найти среднее
						walkAvg += _club.walkAVG;
						watchAvg += _club.watchAVG;
					}
				});
				if (!finded){
					walkAvg = walkAvg / $scope.championship.data.clubInfo.length;
					watchAvg = watchAvg / $scope.championship.data.clubInfo.length;
				}
			} else {
				walkAvg = 1;
				watchAvg = 1;
			}

			var avgEffFreqOnline = $scope.championship.data.avgEffFreqOnline;
			var avgEffFreqOffline = $scope.championship.data.avgEffFreqOffline;

			var playgrounds = Object.keys(homeTmp.playgrounds).map(function(id){
				return homeTmp.playgrounds[id];
			}).sort(function(a,b){
				return b.gamesCount - a.gamesCount;
			});
			var playground = playgrounds[0];

			var playgroundGamesCount = 0;
			playground && $scope.championship.data.championship.forEach(function(game) {
				if (game.stadiumId == playground.stadiumId)
					playgroundGamesCount++;
			});


			$scope.clubInfo = {
				name: club.name,
				//playgrounds: ['playground1', 'playground2'],
				playground: playground.stadiumName,
				playgroundCapacity: playground.stadiumCapacity,
				//gamesCount: homeGames.length + guestGames.length,
				gamesCount: playgroundGamesCount,
				offlineAVGHome: Math.round(homeTmp.occupancy / homeGames.length * 100),
				offlineAVGGuest: Math.round(guestTmp.occupancy / guestGames.length * 100),

				offlineTotalHome: Math.round(homeTmp.offlineTotal/100)/10,
				offlineTotalGuest: Math.round(guestTmp.offlineTotal/100)/10,
				offlineTotalAll: Math.round((homeTmp.offlineTotal + guestTmp.offlineTotal)/100)/10,

				offlineUniqueHome: Math.round(homeTmp.offlineTotal/100/walkAvg)/10,
				offlineUniqueGuest: Math.round(guestTmp.offlineTotal/100/walkAvg)/10,
				offlineUniqueAll: Math.round((homeTmp.offlineTotal + guestTmp.offlineTotal)/100/walkAvg)/10,

				onlineRatings: Math.round(allTmp.onlineRatings*10)/10,

				onlineTotalFederal: Math.round(allTmp.onlineTotalFederal*10)/10, // в тысячах
				onlineTotalLocal: Math.round(allTmp.onlineTotalLocal*10)/10, // в тысячах
				onlineTotalAll: Math.round((allTmp.onlineTotalFederal + allTmp.onlineTotalLocal)*10)/10, // в тысячах

				onlineUniqueFederal: Math.round(allTmp.onlineTotalFederal*10/watchAvg)/10, // в тысячах
				onlineUniqueLocal: Math.round(allTmp.onlineTotalLocal*10/watchAvg)/10, // в тысячах
				onlineUniqueAll: Math.round((allTmp.onlineTotalFederal + allTmp.onlineTotalLocal)*10/watchAvg)/10, // в тысячах

				reachOffline: Math.round((homeTmp.offlineTotal + guestTmp.offlineTotal)/100/walkAvg)/10, // offlineUniqueAll
				reachOnline: Math.round((allTmp.onlineTotalFederal + allTmp.onlineTotalLocal)*10/watchAvg)/10, // onlineUniqueAll
				OTSOffline: Math.round((homeTmp.offlineTotal + guestTmp.offlineTotal)/100*avgEffFreqOffline)/10, // // offlineTotalAll * onlineFreq * 3
				OTSOnline:  Math.round((allTmp.onlineTotalFederal + allTmp.onlineTotalLocal)*10*avgEffFreqOnline)/10 // onlineTotalAll * onlineFreq
			};

			$scope.calcParams = {
				onlineTotalAll: allTmp.onlineTotalFederal + allTmp.onlineTotalLocal, // в тысячах
				offlineTotalAll: (homeTmp.offlineTotal + guestTmp.offlineTotal)/1000, // в тысячах
				onlineUniqueAll: (allTmp.onlineTotalFederal + allTmp.onlineTotalLocal)/watchAvg, // в тысячах
				offlineUniqueAll: (homeTmp.offlineTotal + guestTmp.offlineTotal)/1000/walkAvg,  // в тысячах
				OTSOffline: (homeTmp.offlineTotal + guestTmp.offlineTotal)*avgEffFreqOffline/1000, // в тысячах
				OTSOnline:  (allTmp.onlineTotalFederal + allTmp.onlineTotalLocal)*avgEffFreqOnline // в тысячах
			}
			
		};




		$scope.calc = function(){

			var visibility = $scope.calcVisibility();
			var audiencePercent = $scope.audiencePercent || 1;

			var data = {};
			// Аудитория клуба
			//data.peopleAllOnline = Math.round($scope.clubInfo.onlineTotalAll * visibility.online * audiencePercent);
			//data.peopleAllOffline = Math.round($scope.clubInfo.offlineTotalAll * visibility.offline * audiencePercent);
			data.peopleAllOnline = Math.round($scope.calcParams.onlineTotalAll * visibility.online * audiencePercent);
			data.peopleAllOffline = Math.round($scope.calcParams.offlineTotalAll * visibility.offline * audiencePercent);

			// кол-во уникальных онлайн, тысяч шт
			// var uniqueOnline = $scope.clubInfo.onlineUniqueAll * visibility.online * audiencePercent;
			// var uniqueOffline = $scope.clubInfo.offlineUniqueAll * visibility.offline * audiencePercent;
			var uniqueOnline = $scope.calcParams.onlineUniqueAll * visibility.online * audiencePercent;
			var uniqueOffline = $scope.calcParams.offlineUniqueAll * visibility.offline * audiencePercent;

			data.CPTUniqueOnline = $scope.totalCost && uniqueOnline ? Math.round($scope.totalCost / uniqueOnline * 10)/10 : '-';
			data.CPTUniqueOffline = $scope.totalCost && uniqueOffline ? Math.round($scope.totalCost / uniqueOffline * 10)/10 : '-';

			// OTS, штук
			// var OTSOnline = $scope.clubInfo.OTSOnline * visibility.online * audiencePercent;
			// var OTSOffline = $scope.clubInfo.OTSOffline * visibility.offline * audiencePercent;
			var OTSOnline = $scope.calcParams.OTSOnline * visibility.online * audiencePercent;
			var OTSOffline = $scope.calcParams.OTSOffline * visibility.offline * audiencePercent;

			data.CPTOTSOnline = $scope.totalCost && OTSOnline ? Math.round($scope.totalCost / OTSOnline * 10)/10 : '-';
			data.CPTOTSOffline = $scope.totalCost && OTSOffline ? Math.round($scope.totalCost / OTSOffline * 10)/10 : '-';


			data.audienceSelected = ParamsSrv.isAudienceSelected();


			$scope.results = data;
		};



		// расчет видимости выбранных рекламных конструкций на площадке (0.0 - 1.0)
		$scope.calcVisibility = function(){
			var result = {
				playgroundOnline: 		calcSectors($scope.playgroundData, 'visibilityOnline'),
				playgroundOffline:		calcSectors($scope.playgroundData, 'visibilityOffline'),
				uniformOnline: 			calcSectors($scope.uniformData, 'visibilityOnline'),
				uniformOffline: 		calcSectors($scope.uniformData, 'visibilityOffline'),
				videoOfflineOnline: 	calcSectors($scope.videoOfflineData, 'visibilityOnline'),
				videoOfflineOffline: 	calcSectors($scope.videoOfflineData, 'visibilityOffline'),
				videoOnlineOnline: 		calcSectors($scope.videoOnlineData, 'visibilityOnline'),
				videoOnlineOffline: 	calcSectors($scope.videoOnlineData, 'visibilityOffline')
			};
			result.online = Math.max(result.playgroundOnline, result.uniformOnline, result.videoOfflineOnline, result.videoOnlineOnline);
			result.offline = Math.max(result.playgroundOffline, result.uniformOffline, result.videoOfflineOffline, result.videoOnlineOffline);

			return result;

			function calcSectors(data, dataKey){
				var sectors = {};
				Object.keys(data.placesSelection).forEach(function(key){
					if (!data.placesSelection[key].selected) return;
					var placeA = data[dataKey][key];
					if (!placeA) return;
					placeA.forEach(function(val, index){
						sectors[index] = Math.max(sectors[index] || 0, val || 0);
					});
				});

				var sum = 0;
				Object.keys(sectors).forEach(function(index){
					sum += sectors[index];
				});
				return Math.min(sum, 1);
			}

		};
		

	}

}());
