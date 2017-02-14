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

/**
 * events:
 * analyticsSrv.selectionChanged
 */
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
	
		function getSelected(){
			return selected; 
		}
	

		function setSelected(val){ 
			selected = val || {};
			$rootScope.$broadcast('analyticsSrv.selectionChanged', selected);
		}
		
	
	
		var me = {
			getSelected: getSelected,
			setSelected: setSelected
		};
		return me;
	}
}());