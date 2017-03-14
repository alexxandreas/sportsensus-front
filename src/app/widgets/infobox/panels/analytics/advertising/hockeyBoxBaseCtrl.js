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



			$scope.calcParams = {
				/***** OFFLINE *****/
				
				offlineTotalHome: allTmp.offlineTotal/1000, // в тысячах, полная аудитория дома
				offlineTotalGuest: 0,
				offlineTotalAll: allTmp.offlineTotal/1000, // в тысячах
				
				
				offlineUniqueHome: allTmp.offlineTotal/1000/walkAvg, // в тысячах, уникальная аудитория дома
				offlineUniqueGuest: 0,
				offlineUniqueAll:  allTmp.offlineTotal/1000/walkAvg,  // в тысячах
				
				
				/***** ONLINE *****/
				
				onlineTotalFederal: allTmp.onlineTotalFederal, // в тысячах
				onlineTotalLocal: allTmp.onlineTotalLocal, // в тысячах
				//onlineTotalAll: allTmp.onlineTotalFederal + allTmp.onlineTotalLocal, // в тысячах
				onlineTotalAll: allTmp.onlineTotalFederal + allTmp.onlineTotalLocal, // в тысячах
				
				
				
				onlineUniqueFederal: allTmp.onlineTotalFederal/watchAvg, // в тысячах
				onlineUniqueLocal: allTmp.onlineTotalLocal/watchAvg, // в тысячах
				onlineUniqueAll: (allTmp.onlineTotalFederal + allTmp.onlineTotalLocal)/watchAvg, // в тысячах
				
				
				
				// OTSOffline: (homeTmp.offlineTotal + guestTmp.offlineTotal)*avgEffFreqOffline/1000, // в тысячах
				// OTSOnline:  (allTmp.onlineTotalFederal + allTmp.onlineTotalLocal)*avgEffFreqOnline // в тысячах
				
				OTSOfflineHome: (allTmp.offlineTotal)/1000, // в тысячах без коэфф.
				OTSOfflineGuest: 0, // в тысячах без коэфф.
				OTSOfflineAll: (allTmp.offlineTotal)/1000, // в тысячах без коэфф. 
				
				OTSOnlineAll:  (allTmp.onlineTotalFederal + allTmp.onlineTotalLocal) // в тысячах без коэфф.
			}	


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


				offlineAVGAll: Math.round(allTmp.occupancy / gamesCount * 100),
				
				//offlineTotalAll: Math.round((allTmp.offlineTotal)/100)/10,
				
				//offlineUniqueAll: Math.round((allTmp.offlineTotal)/100/walkAvg)/10,
				
				onlineRatings: Math.round(allTmp.onlineRatings*10)/10,
				
				//onlineTotalAll: Math.round((allTmp.onlineTotalFederal + allTmp.onlineTotalLocal)*10)/10, // в тысячах
				
				//onlineUniqueAll: Math.round((allTmp.onlineTotalFederal + allTmp.onlineTotalLocal)*10/watchAvg)/10, // в тысячах
				//
				reachOffline: Math.round((allTmp.offlineTotal)/100/walkAvg)/10, // offlineUniqueAll
				reachOnline: Math.round((allTmp.onlineTotalFederal + allTmp.onlineTotalLocal)*10/watchAvg)/10, // onlineUniqueAll
				
				OTSOffline: Math.round($scope.calcParams.OTSOfflineAll*avgEffFreqOffline*10)/10, // // offlineTotalAll * onlineFreq * 3
				OTSOnline:  Math.round($scope.calcParams.OTSOnlineAll*avgEffFreqOnline*10)/10 // onlineTotalAll * onlineFreq
			};


			[
				//'offlineTotalHome',
				//'offlineTotalGuest',
				'offlineTotalAll',
				
				//'offlineUniqueHome',
				//'offlineUniqueGuest',
				'offlineUniqueAll',
				
				//'onlineTotalFederal',
				//'onlineTotalLocal',
				'onlineTotalAll',
				
				//'onlineUniqueFederal',
				//'onlineUniqueLocal',
				'onlineUniqueAll'
			].forEach(function(param){
				$scope.leagueInfo[param] = Math.round($scope.calcParams[param]*10)/10
			});

		

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


			$scope.calcParams = {
				/***** OFFLINE *****/
				
				offlineTotalHome: homeTmp.offlineTotal/1000, // в тысячах, полная аудитория дома
				offlineTotalGuest: guestTmp.offlineTotal/1000,
				offlineTotalAll: (homeTmp.offlineTotal + guestTmp.offlineTotal)/1000, // в тысячах, полная аудитория дома и в гостях
				
				
				offlineUniqueHome: homeTmp.offlineTotal/walkAvg/1000, // в тысячах, уникальная аудитория дома
				offlineUniqueGuest: guestTmp.offlineTotal/1000/walkAvg,
				offlineUniqueAll: (homeTmp.offlineTotal + guestTmp.offlineTotal)/1000/walkAvg,  // в тысячах
				
				
				/***** ONLINE *****/
				
				onlineTotalFederal: allTmp.onlineTotalFederal, // в тысячах
				onlineTotalLocal: allTmp.onlineTotalLocal, // в тысячах
				onlineTotalAll: allTmp.onlineTotalFederal + allTmp.onlineTotalLocal, // в тысячах
				
				
				onlineUniqueFederal: allTmp.onlineTotalFederal/watchAvg, // в тысячах
				onlineUniqueLocal: allTmp.onlineTotalLocal/watchAvg, // в тысячах
				onlineUniqueAll: (allTmp.onlineTotalFederal + allTmp.onlineTotalLocal)/watchAvg, // в тысячах

				
				
				// OTSOffline: (homeTmp.offlineTotal + guestTmp.offlineTotal)*avgEffFreqOffline/1000, // в тысячах
				// OTSOnline:  (allTmp.onlineTotalFederal + allTmp.onlineTotalLocal)*avgEffFreqOnline // в тысячах
				
				OTSOfflineHome: (homeTmp.offlineTotal)/1000, // в тысячах без коэфф.
				OTSOfflineGuest: (guestTmp.offlineTotal)/1000, // в тысячах без коэфф.
				OTSOfflineAll: (homeTmp.offlineTotal + guestTmp.offlineTotal)/1000, // в тысячах без коэфф.
				
				OTSOnlineAll:  (allTmp.onlineTotalFederal + allTmp.onlineTotalLocal) // в тысячах без коэфф.
			}


			

			$scope.clubInfo = {
				name: club.name,
				//playgrounds: ['playground1', 'playground2'],
				playground: playground.stadiumName,
				playgroundCapacity: playground.stadiumCapacity,
				//gamesCount: homeGames.length + guestGames.length,
				gamesCount: playgroundGamesCount,
				offlineAVGHome: Math.round(homeTmp.occupancy / homeGames.length * 100),
				offlineAVGGuest: Math.round(guestTmp.occupancy / guestGames.length * 100),

				
				// offlineTotalHome: Math.round($scope.calcParams.offlineTotalHome*10)/10,
				// offlineTotalGuest: Math.round($scope.calcParams.offlineTotalGuest*10)/10,
				// offlineTotalAll: Math.round($scope.calcParams.offlineTotalAll*10)/10,


				// offlineUniqueHome: Math.round($scope.calcParams.offlineUniqueHome*10)/10,
				// offlineUniqueGuest: Math.round($scope.calcParams.offlineUniqueGuest*10)/10,
				// offlineUniqueAll: Math.round($scope.calcParams.offlineUniqueAll*10)/10,


				onlineRatings: Math.round(allTmp.onlineRatings*10)/10,


				// onlineTotalFederal: Math.round($scope.calcParams.onlineTotalFederal*10)/10, // в тысячах
				// onlineTotalLocal: Math.round($scope.calcParams.onlineTotalLocal*10)/10, // в тысячах
				// onlineTotalAll: Math.round($scope.calcParams.onlineTotalAll*10)/10, // в тысячах

				// onlineUniqueFederal: Math.round($scope.calcParams.onlineUniqueFederal*10)/10, // в тысячах
				// onlineUniqueLocal: Math.round($scope.calcParams.onlineUniqueLocal*10)/10, // в тысячах
				// onlineUniqueAll: Math.round($scope.calcParams.onlineUniqueAll*10)/10, // в тысячах


				reachOffline: Math.round((homeTmp.offlineTotal + guestTmp.offlineTotal)/100/walkAvg)/10, // offlineUniqueAll
				reachOnline: Math.round((allTmp.onlineTotalFederal + allTmp.onlineTotalLocal)*10/watchAvg)/10, // onlineUniqueAll
				
				
				// OTSOffline: Math.round((homeTmp.offlineTotal + guestTmp.offlineTotal)/100*avgEffFreqOffline)/10, // // offlineTotalAll * onlineFreq * 3
				OTSOffline: Math.round($scope.calcParams.OTSOfflineAll*avgEffFreqOffline*10)/10, // // offlineTotalAll * onlineFreq * 3
				// OTSOnline:  Math.round((allTmp.onlineTotalFederal + allTmp.onlineTotalLocal)*10*avgEffFreqOnline)/10 // onlineTotalAll * onlineFreq
				OTSOnline:  Math.round($scope.calcParams.OTSOnlineAll*avgEffFreqOnline*10)/10 // onlineTotalAll * onlineFreq
			};
			
			[
				'offlineTotalHome',
				'offlineTotalGuest',
				'offlineTotalAll',
				
				'offlineUniqueHome',
				'offlineUniqueGuest',
				'offlineUniqueAll',
				
				'onlineTotalFederal',
				'onlineTotalLocal',
				'onlineTotalAll',
				
				'onlineUniqueFederal',
				'onlineUniqueLocal',
				'onlineUniqueAll'
			].forEach(function(param){
				$scope.clubInfo[param] = Math.round($scope.calcParams[param]*10)/10
			})

						
		};



		/*
			Для Offline (ходили):	
				Если выбрана только площадка - значит учитывается только домашняя аудитория
				Если выбрана только форма - учитывается и домашняя и гостевая аудитория
				Если выбрано только видео на площадке - учитывается только домашняя аудитория 
				Видео по ТВ не учитывается
			Для Online (смотрели):
				хз)
			
		*/
		$scope.calc = function(){

			var visibility = $scope.calcVisibility();
			var audiencePercent = $scope.audiencePercent || 1;

			var data = {};
			// Аудитория клуба
			//data.people
			
			
			/***** ВСЕ ЛЮДИ *****/
			
			/***** OFFLINE *****/
			
			var peopleHomeOffline = $scope.calcParams.offlineTotalHome * visibility.offlineHome * audiencePercent;
			var peopleGuestOffline= $scope.calcParams.offlineTotalGuest * visibility.offlineGuest * audiencePercent;
			// data.peopleAllOffline = Math.round($scope.calcParams.offlineTotalHome * visibility.offline * audiencePercent);
			data.peopleAllOffline = Math.round(peopleHomeOffline + peopleGuestOffline);
			
			/***** ONLINE *****/
			
			data.peopleAllOnline = Math.round($scope.calcParams.onlineTotalAll * visibility.online * audiencePercent);
			//data.peopleAllOffline = Math.round($scope.calcParams.offlineTotalAll * visibility.offline * audiencePercent);
			
			
			/***** УНИКАЛЬНЫЕ *****/
		
			/***** OFFLINE *****/
			var peopleUniqueHomeOffline = $scope.calcParams.offlineUniqueHome * visibility.offlineHome * audiencePercent;
			var peopleUniqueGuestOffline = $scope.calcParams.offlineUniqueGuest * visibility.offlineGuest * audiencePercent;
			// var uniqueOffline = $scope.calcParams.offlineUniqueAll * visibility.offline * audiencePercent;
			var uniqueOffline = peopleUniqueHomeOffline + peopleUniqueGuestOffline;
			
			
			/***** ONLINE *****/
			var uniqueOnline = $scope.calcParams.onlineUniqueAll * visibility.online * audiencePercent;
			
			/***** CPT от УНИКАЛЬНЫХ *****/
			
			data.CPTUniqueOnline = $scope.totalCost && uniqueOnline ? Math.round($scope.totalCost / uniqueOnline * 10)/10 : '';
			data.CPTUniqueOffline = $scope.totalCost && uniqueOffline ? Math.round($scope.totalCost / uniqueOffline * 10)/10 : '';


			/***** OTS *****/
			var peopleOTSHomeOffline = $scope.calcParams.OTSOfflineHome * visibility.offlineEffHome * audiencePercent;
			var peopleOTSGuestOffline = $scope.calcParams.OTSOfflineGuest * visibility.offlineEffGuest * audiencePercent;

			// var OTSOffline = $scope.calcParams.OTSOffline * visibility.offlineEff * audiencePercent;
			var OTSOffline = peopleOTSHomeOffline + peopleOTSGuestOffline;


			// OTS, штук
			var OTSOnline = $scope.calcParams.OTSOnlineAll * visibility.onlineEff * audiencePercent;


			// (onlineTotalFederal + onlineTotalLocal) * avgEffFreqOnline * visibility.online * audiencePercent;
			// audiencePercent - процент выбранной аудитории (0..1)
			// visibility.online - процент видимости выбранных рекламных конструкций (0..1)

			

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

		
			var result = {
				online: Math.max(data.playgroundOnline, data.uniformOnline, data.videoOfflineOnline, data.videoOnlineOnline),
				offline: Math.max(data.playgroundOffline, data.uniformOffline, data.videoOfflineOffline, data.videoOnlineOffline),
				
				// дома учитывается площадка, форма и видео, в гостях - форма
				offlineHome: Math.max(data.playgroundOffline, data.uniformOffline, data.videoOfflineOffline),
				offlineGuest: Math.max(data.uniformOffline),
				
				onlineEff: Math.max(dataEff.playgroundOnline, dataEff.uniformOnline, dataEff.videoOfflineOnline, dataEff.videoOnlineOnline),
				offlineEff: Math.max(dataEff.playgroundOffline, dataEff.uniformOffline, dataEff.videoOfflineOffline, dataEff.videoOnlineOffline),
				
				// дома учитывается площадка, форма и видео, в гостях - форма
				offlineEffHome: Math.max(dataEff.playgroundOffline, dataEff.uniformOffline, dataEff.videoOfflineOffline),
				offlineEffGuest: Math.max(dataEff.uniformOffline)
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
