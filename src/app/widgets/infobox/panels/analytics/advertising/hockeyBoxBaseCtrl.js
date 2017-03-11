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
				onlineRatings: 0,
				onlineTotalFederal: 0,
				onlineTotalLocal: 0,
				playgrounds:{},
				occupancy: 0,
				offlineTotal: 0  // += (game.offlineCount || 0);
			};

			$scope.championship.data.championship.forEach(function(game){
				allTmp.onlineTotal += (game.federalTVAudience || 0) + (game.regionalTVAudience || 0);
				allTmp.offlineTotal += (game.offlineCount || 0);
				allTmp.onlineRatings += (game.federalTVRating || 0);
				allTmp.onlineTotalFederal += (game.federalTVAudience || 0);
				allTmp.onlineTotalLocal += (game.regionalTVAudience || 0);
				allTmp.occupancy += (game.offlineCount / game.stadiumCapacity || 0);

				if (game.stadiumId >= 0){
					allTmp.playgrounds[game.stadiumId] = allTmp.playgrounds[game.stadiumId] || {gamesCount:0};
					allTmp.playgrounds[game.stadiumId].stadiumId = game.stadiumId;
					allTmp.playgrounds[game.stadiumId].stadiumName = game.stadiumName;
					allTmp.playgrounds[game.stadiumId].stadiumCapacity = game.stadiumCapacity || 0;
					allTmp.playgrounds[game.stadiumId].gamesCount++;
				}
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

			var gamesCount = $scope.championship.data.championship.length;

			$scope.leagueInfo = {
				name: league.name,
				//playgrounds: ['playground1', 'playground2'],
				playgroundsCount: Object.keys(allTmp.playgrounds).length,
				playgroundsCapacity: Object.keys(allTmp.playgrounds)
					.map(function(key){return allTmp.playgrounds[key].stadiumCapacity})
					.reduce(function(pv, cv) { return pv + cv; }, 0),


				//playground: playground.stadiumName,
				//playgroundCapacity: playground.stadiumCapacity,
				//gamesCount: homeGames.length + guestGames.length,

				gamesCount: gamesCount,


				// offlineAVGHome: Math.round(homeTmp.occupancy / homeGames.length * 100),
				// offlineAVGGuest: Math.round(guestTmp.occupancy / guestGames.length * 100),
				//
				offlineAVGAll: Math.round(allTmp.occupancy / gamesCount * 100),
				//
				// offlineTotalHome: Math.round(homeTmp.offlineTotal/100)/10,
				// offlineTotalGuest: Math.round(guestTmp.offlineTotal/100)/10,
				offlineTotalAll: Math.round((allTmp.offlineTotal)/100)/10,
				//
				// offlineUniqueHome: Math.round(homeTmp.offlineTotal/100/walkAvg)/10,
				// offlineUniqueGuest: Math.round(guestTmp.offlineTotal/100/walkAvg)/10,
				offlineUniqueAll: Math.round((allTmp.offlineTotal)/100/walkAvg)/10,
				//
				onlineRatings: Math.round(allTmp.onlineRatings*10)/10,
				//
				// onlineTotalFederal: Math.round(allTmp.onlineTotalFederal*10)/10, // в тысячах
				// onlineTotalLocal: Math.round(allTmp.onlineTotalLocal*10)/10, // в тысячах
				onlineTotalAll: Math.round((allTmp.onlineTotalFederal + allTmp.onlineTotalLocal)*10)/10, // в тысячах
				//
				// onlineUniqueFederal: Math.round(allTmp.onlineTotalFederal*10/watchAvg)/10, // в тысячах
				// onlineUniqueLocal: Math.round(allTmp.onlineTotalLocal*10/watchAvg)/10, // в тысячах
				onlineUniqueAll: Math.round((allTmp.onlineTotalFederal + allTmp.onlineTotalLocal)*10/watchAvg)/10, // в тысячах
				//
				reachOffline: Math.round((allTmp.offlineTotal)/100/walkAvg)/10, // offlineUniqueAll
				reachOnline: Math.round((allTmp.onlineTotalFederal + allTmp.onlineTotalLocal)*10/watchAvg)/10, // onlineUniqueAll
				OTSOffline: Math.round((allTmp.offlineTotal)/100*avgEffFreqOffline)/10, // // offlineTotalAll * onlineFreq * 3
				OTSOnline:  Math.round((allTmp.onlineTotalFederal + allTmp.onlineTotalLocal)*10*avgEffFreqOnline)/10 // onlineTotalAll * onlineFreq
			};


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
				//onlineTotalLocal: allTmp.onlineTotalLocal, // в тысячах
				
				offlineTotalAll: (homeTmp.offlineTotal + guestTmp.offlineTotal)/1000, // в тысячах, полная аудитория дома и в гостях
				offlineTotalHome: (homeTmp.offlineTotal)/1000, // в тысячах, полная аудитория дома
				offlineUniqueHome: homeTmp.offlineTotal/walkAvg/1000, // в тысячах, уникальная аудитория дома
				
				onlineUniqueAll: (allTmp.onlineTotalFederal + allTmp.onlineTotalLocal)/watchAvg, // в тысячах
				offlineUniqueAll: (homeTmp.offlineTotal + guestTmp.offlineTotal)/1000/walkAvg,  // в тысячах
				// OTSOffline: (homeTmp.offlineTotal + guestTmp.offlineTotal)*avgEffFreqOffline/1000, // в тысячах
				// OTSOnline:  (allTmp.onlineTotalFederal + allTmp.onlineTotalLocal)*avgEffFreqOnline // в тысячах
				OTSOffline: (homeTmp.offlineTotal + guestTmp.offlineTotal)/1000, // в тысячах без коэфф.
				OTSOnline:  (allTmp.onlineTotalFederal + allTmp.onlineTotalLocal) // в тысячах без коэфф.
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
			//data.peopleAllOffline = Math.round($scope.calcParams.offlineTotalAll * visibility.offline * audiencePercent);
			data.peopleAllOffline = Math.round($scope.calcParams.offlineTotalHome * visibility.offline * audiencePercent);

			// кол-во уникальных онлайн, тысяч шт
			// var uniqueOnline = $scope.clubInfo.onlineUniqueAll * visibility.online * audiencePercent;
			// var uniqueOffline = $scope.clubInfo.offlineUniqueAll * visibility.offline * audiencePercent;
			var uniqueOnline = $scope.calcParams.onlineUniqueAll * visibility.online * audiencePercent;
			var uniqueOffline = $scope.calcParams.offlineUniqueAll * visibility.offline * audiencePercent;

			data.CPTUniqueOnline = $scope.totalCost && uniqueOnline ? Math.round($scope.totalCost / uniqueOnline * 10)/10 : '';
			data.CPTUniqueOffline = $scope.totalCost && uniqueOffline ? Math.round($scope.totalCost / uniqueOffline * 10)/10 : '';

			// OTS, штук
			var OTSOnline = $scope.calcParams.OTSOnline * visibility.onlineEff * audiencePercent;


			// (onlineTotalFederal + onlineTotalLocal) * avgEffFreqOnline * visibility.online * audiencePercent;
			// audiencePercent - процент выбранной аудитории (0..1)
			// visibility.online - процент видимости выбранных рекламных конструкций (0..1)

			var OTSOffline = $scope.calcParams.OTSOffline * visibility.offlineEff * audiencePercent;

			data.CPTOTSOnline = $scope.totalCost && OTSOnline ? Math.round($scope.totalCost / OTSOnline * 10)/10 : '';
			data.CPTOTSOffline = $scope.totalCost && OTSOffline ? Math.round($scope.totalCost / OTSOffline * 10)/10 : '';


			data.audienceSelected = ParamsSrv.isAudienceSelected();


			$scope.results = data;
		};



		// расчет видимости выбранных рекламных конструкций на площадке (0.0 - 1.0)
		$scope.calcVisibility = function(){

			var data =  {
				playgroundOnline: 		$scope.calcSectors($scope.playgroundData, 'Online'),
				playgroundOffline:		$scope.calcSectors($scope.playgroundData, 'Offline'),
				uniformOnline:	 		$scope.calcSectors($scope.uniformData, 'Online'),
				uniformOffline: 		$scope.calcSectors($scope.uniformData, 'Offline'),
				videoOfflineOnline: 	$scope.calcSectors($scope.videoOfflineData, 'Online'),
				videoOfflineOffline: 	$scope.calcSectors($scope.videoOfflineData, 'Offline'),
				videoOnlineOnline: 		$scope.calcSectors($scope.videoOnlineData, 'Online'),
				videoOnlineOffline: 	$scope.calcSectors($scope.videoOnlineData, 'Offline')
			};
			var dataEff = {
				playgroundOnline: 		$scope.calcSectors($scope.playgroundData, 'Online', true),
				playgroundOffline:		$scope.calcSectors($scope.playgroundData, 'Offline', true),
				uniformOnline:	 		$scope.calcSectors($scope.uniformData, 'Online', true),
				uniformOffline: 		$scope.calcSectors($scope.uniformData, 'Offline', true),
				videoOfflineOnline: 	$scope.calcSectors($scope.videoOfflineData, 'Online', true),
				videoOfflineOffline: 	$scope.calcSectors($scope.videoOfflineData, 'Offline', true),
				videoOnlineOnline: 		$scope.calcSectors($scope.videoOnlineData, 'Online', true),
				videoOnlineOffline: 	$scope.calcSectors($scope.videoOnlineData, 'Offline', true)
			};

			// var result = {
			// 	playgroundOnline: 		calcSectors($scope.playgroundData, 'Online'),
			// 	playgroundOffline:		calcSectors($scope.playgroundData, 'Offline'),
			// 	uniformOnline:	 		calcSectors($scope.uniformData, 'Online'),
			// 	uniformOffline: 		calcSectors($scope.uniformData, 'Offline'),
			// 	videoOfflineOnline: 	calcSectors($scope.videoOfflineData, 'Online'),
			// 	videoOfflineOffline: 	calcSectors($scope.videoOfflineData, 'Offline'),
			// 	videoOnlineOnline: 		calcSectors($scope.videoOnlineData, 'Online'),
			// 	videoOnlineOffline: 	calcSectors($scope.videoOnlineData, 'Offline')
			// };
			var result = {
				online: Math.max(data.playgroundOnline, data.uniformOnline, data.videoOfflineOnline, data.videoOnlineOnline),
				offline: Math.max(data.playgroundOffline, data.uniformOffline, data.videoOfflineOffline, data.videoOnlineOffline),
				onlineEff: Math.max(dataEff.playgroundOnline, dataEff.uniformOnline, dataEff.videoOfflineOnline, dataEff.videoOnlineOnline),
				offlineEff: Math.max(dataEff.playgroundOffline, dataEff.uniformOffline, dataEff.videoOfflineOffline, dataEff.videoOnlineOffline)
			};
			return result;

			

		};
		
		$scope.calcSectors = function(data, type, useFreq){ //} dataKey, freqKey){
				var sectors = {};
				var sectorsEff = {};
				var effFreq = 0;
				var dataKey = 'visibility' + type;
				if (useFreq) {
					var freqKey = 'exposure' + type;
					var defaultFreq = $scope.championship.data['avgEffFreq' + type];
				}

				Object.keys(data.placesSelection).forEach(function(key){
					if (!data.placesSelection[key].selected) return;
					var placeA = data[dataKey][key];
					if (!placeA) return;
					if (useFreq) {
						if (data[freqKey] && data[freqKey][key])
							effFreq = data[freqKey][key];
						else
							effFreq = defaultFreq;
					}
					placeA.forEach(function(val, index){
						sectors[index] = Math.max(sectors[index] || 0, val || 0);
						if (useFreq)
							sectorsEff[index] = Math.max(sectorsEff[index] || 0, val * effFreq || 0);
					});
				});

				var sum = 0;
				var sumEff = 0;
				Object.keys(sectors).forEach(function(index){
					sum += sectors[index];
					if (useFreq)
						sumEff += sectorsEff[index];
				});
				//return Math.min(sum, 1);
				return useFreq ? sumEff : sum;
			}
		

	}

}());
