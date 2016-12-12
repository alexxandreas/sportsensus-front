(function () {

	"use strict";
	angular.module('SportsensusApp')
		.factory('analyticsSrv', analyticsSrv);

	// инициализируем сервис
	angular.module('SportsensusApp').run(['analyticsSrv', function(analyticsSrv) {

	}]);
	
	analyticsSrv.$inject = [
		'$rootScope',
		'ApiSrv',
		'ParamsSrv'
	];

	function analyticsSrv(
		$rootScope,
		ApiSrv,
		ParamsSrv
	) {

		var selected = {
			sport: null,
			league: null,
			club: null
		};

		var me = {
			getSelected: function(){return selected; },
			setSelected: function(val){ selected = val; }
		};
		return me;
	}
}());