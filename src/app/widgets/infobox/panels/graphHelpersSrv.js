(function () {

	"use strict";
	angular.module('SportsensusApp')
		.factory('graphHelpersSrv', graphHelpersSrv);




	// инициализируем сервис
	// angular.module('SportsensusApp').run(['graphHelpersSrv', function(graphHelpersSrv) {}]);

	graphHelpersSrv.$inject = [
		'$rootScope',
		'ParamsSrv'
	];


	/**
	 * events:
	 * graphHelpersSrv.highlightItem
	 */
	function graphHelpersSrv(
		$rootScope,
		ParamsSrv
	) {


		function getLegend(objects, options){
			options = options || {};
			var selected = false;
			// var legend = obj.lists.map(function (list) {
			var legend = objects.map(function (list) {
				selected = selected || list.selected || list.interested;
				var result =  {
					id: list.id,
					key: list.key,
					name: list.name,
					color: options.color ? options.color : list.chartColor,
					selected: list.selected || list.interested
				};
				if (options.depth && options.depth > 0){
					if (list.lists) {
						result.lists = getLegend(list.lists, angular.extend({}, options, {depth: options.depth - 1}));
					}
					if (list.clubs){
						result.clubs = getLegend(list.clubs, angular.extend({}, options, {depth: options.depth - 1}));
					}
				}
				return result;
			});//.reverse();
			if (!selected && options.selectAll) legend.forEach(function(item){item.selected = true;});
			return legend;
		}

		function getSportLegend (options) {
			options = options || {};
			var selected = false;
			//var legend = parameters.sport.lists.map(function (list) {
			var legend = options.sport.lists.map(function (list) {
				selected = selected || list.interested;
				var result = {
					id: list.id,
					name: list.name,
					key: list.key,
					color: options.color ? options.color : list.chartColor,
					selected: list.interested
				};
				if (options.clubs){

					//var clubsObj = list.lists.filter(function(child){return child.key == 'clubs';});
					//if (clubsObj.length){
					var clubs = list.clubs.map(function(list){
						return {
							id: list.id,
							name: list.name,
							color: options.color ? options.color : list.chartColor,
							selected: list.selected
						}
					});
					result.clubs = clubs;
					//}
				}
				return result;
			});
			if (!selected && options.selectAll !== false) legend.forEach(function(item){item.selected = true;});
			return legend;
		}

		function getInterestLegend(options){
			options = options || {};
			var selected = false;
			// var legend = parameters.interest.lists.map(function (list) {
			var legend = options.interest.lists.map(function (list) {
				selected = selected || list.selected;
				return {
					id: list.id,
					name: list.name,
					color: options.color ? options.color : list.chartColor,
					selected: list.selected
				};
			}).reverse();
			if (!selected) legend.forEach(function(item){item.selected = true;});
			return legend;
		}

		function getImageLegend(options){
			options = options || {};
			var selected = false;
			// var legend = parameters.image.lists.map(function (list) {
			var legend = options.image.lists.map(function (list) {
				selected = selected || list.selected;
				return {
					id: list.id,
					name: list.name,
					color: options.color ? options.color : list.chartColor,
					selected: list.selected
				};
			}).reverse();
			if (!selected) legend.forEach(function(item){item.selected = true;});
			return legend;
		}

		function getInvolveLegend(options){
			options = options || {};
			var selected = false;
			// var legend = parameters.involve.lists.map(function (list) {
			var legend = options.involve.lists.map(function (list) {
				selected = selected || list.selected;
				return {
					id: list.id,
					name: list.name,
					color: options.color ? options.color : list.chartColor,
					selected: list.selected
				};
			});//.reverse();
			if (!selected) legend.forEach(function(item){item.selected = true;});
			return legend;
		}

		function formatValue(value){
			var multiplier = value > 1000*1000 ? 1000*1000 : value > 1000 ? 1000 : 1;
			value = value / multiplier;
			value = value >= 100 ? Math.round(value) : value > 10 ? Math.round(value * 10) / 10 : Math.round(value * 100) / 100;
			return value + (multiplier == 1000*1000 ? 'M' : multiplier == 1000 ? 'K' : '');
		}

		function prepareChartData(data, legendMapping) {
			var legends = {};
			var legendsByName = {};

			var legendsA = data.legends.map(function (legend, index) {
				// legends[legend.name] = {index:index, values:{}};
				legends[index] = {index: index, name: legend.name, values: {}, sports: []};
				legendsByName[legend.name] = legends[index];
				return legend.name;
			});

			var maxValue = 0;
			data.data && data.data.forEach(function (item) {
				item.legend.forEach(function (value, index) {
					legends[index].values[value] = true;
					
					if (legends[index].name == 'club') {
						if (legendsByName['sport']) {
							var sportId = item.legend[legendsByName['sport'].index];
						} else if (legendMapping.sportId != undefined) {
							var sportId = legendMapping.sportId;
						}
						if (sportId)
							legends[index].sports.push({clubId: value, sportId: sportId});
					}
					
					if (legends[index].name == 'tournament') {
						if (legendsByName['sport']) {
							var sportId = item.legend[legendsByName['sport'].index];
						} else if (legendMapping.sportId != undefined) {
							var sportId = legendMapping.sportId;
						}
						if (sportId)
							legends[index].sports.push({tournamentId: value, sportId: sportId});
					}
					
					
				});
				maxValue = Math.max(maxValue, item.count);
			});

			var legendsO = {};

			Object.keys(legends).forEach(function (index) {
				var legend = legends[index];
				
				if (legend.name == 'club') {
					legendsO[legend.name] = [];
					legendMapping[legend.name].lists.filter(function (list) { // list - sport. Отфильтровываем спорты
						var id = list.id;
						return Object.keys(legend.sports).some(function (index) {
							return legend.sports[index].sportId == id;
						});
					}).forEach(function (sport) {
						sport.clubs.forEach(function (club) {
							if (Object.keys(legend.sports).some(function (index) {
									return legend.sports[index].sportId == sport.id && legend.sports[index].clubId == club.id;
								})) {
								legendsO[legend.name].push({
									id: club.id,
									name: club.name,
									color: club.chartColor,
									sport: {
										id: sport.id,
										name: sport.name,
										key: sport.key,
										color: sport.chartColor
									}
								})
							}
						});
						//}
					})
				
				} else if (legend.name == 'tournament') {
					legendsO[legend.name] = [];
					legendMapping[legend.name].lists.filter(function (list) { // list - sport. Отфильтровываем спорты
						var id = list.id;
						return Object.keys(legend.sports).some(function (index) {
							return legend.sports[index].sportId == id;
						});
					}).forEach(function (sport) {
						sport.tournaments.forEach(function (tournament) {
							if (Object.keys(legend.sports).some(function (index) {
									return legend.sports[index].sportId == sport.id && legend.sports[index].tournamentId == tournament.id;
								})) {
								legendsO[legend.name].push({
									id: tournament.id,
									name: tournament.name,
									color: tournament.chartColor,
									sport: {
										id: sport.id,
										name: sport.name,
										key: sport.key,
										color: sport.chartColor
									}
								})
							}
						});
					})
				} else {
					if (!legendMapping[legend.name]) return;
					legendsO[legend.name] = legendMapping[legend.name].lists.filter(function (list) {
						var id = list.id;
						return legend.values[id];
					}).map(function (list) {
						return {
							id: list.id,
							name: list.name,
							key: list.key,
							color: list.chartColor
						}
					})
				}
			});
			// keys: {sport:1, image:2}
			function getCount(keys){
				var count;
				keys = keys || {};
				data.data && data.data.forEach(function(item){
					if (item.legend.every(function(value, index){
							var legend = legends[index];
							return keys[legend.name] == value || keys[legend.name] == undefined
						})){
						count = (count || 0) + item.count;
					}
				});
				return count;
			}

			return {
				legends:legendsO,
				maxValue: maxValue,
				multiplier:  maxValue > 1000*1000 ? 1000*1000 : maxValue > 1000 ? 1000 : 1,
				getCount:getCount
			}
		}
		
		

		var me = {
			getLegend: getLegend,
			getSportLegend: getSportLegend,
			getInterestLegend: getInterestLegend,
			getImageLegend: getImageLegend,
			getInvolveLegend: getInvolveLegend,
			formatValue: formatValue,
			prepareChartData: prepareChartData
			
			
			
		};


		return me;
	}
}());