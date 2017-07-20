(function () {
	"use strict";
	angular.module('SportsensusApp')
		.controller('infoboxFooterCtrl', infoboxFooterCtrl);

	infoboxFooterCtrl.$inject = [
		'$scope',
		'$controller',
		'ParamsSrv',
		'ApiSrv'
	];

	function infoboxFooterCtrl(
		$scope,
		$controller,
		ParamsSrv,
		ApiSrv
	) {
		$controller('baseFooterCtrl', {$scope: $scope});


		
		// $scope.checkButtonText = '';
		
		// $scope.checkButtonClick = function(){
		// 	//$scope.activePage = $scope.pages[$scope.checkButtonPage];
		// 	$scope.setActivePage($scope.pages[$scope.checkButtonPage]);
			
		// };


		// $scope.$on('ParamsSrv.paramsChanged', paramsChanged);
		// paramsChanged();

		// function paramsChanged(){
		// 	var selected = ParamsSrv.getSelectedParams();
		// 	var audienceSelected = !!(selected.demography || selected.regions || selected.consume);
		// 	$scope.sportSelected = !!selected.sport;
		// 	var filtersSelected = !!(selected.interest || selected.rooting || selected.involve || selected.image);

		// 	if ($scope.type == 'infobox') {
		// 		if (audienceSelected && !$scope.sportSelected) {
		// 			$scope.checkButtonText = 'Экспресс-результат';
		// 			$scope.checkButtonPage = 'expressAudience/expressAudience';
		// 		} else if ($scope.sportSelected && !audienceSelected && !filtersSelected) {
		// 			$scope.checkButtonText = 'Экспресс-результат';
		// 			$scope.checkButtonPage = 'expressSport/expressSport';
		// 		} else {
		// 			$scope.checkButtonText = 'Показать результат';
		// 			$scope.checkButtonPage = 'allGraphs';
		// 		}
		// 	} /*else if ($scope.type == 'analytics'){
		// 		$scope.checkButtonText = 'Анализ пакета';
		// 		$scope.checkButtonPage = 'analytics/analytics';
		// 	}*/
		// }



	}

}());
