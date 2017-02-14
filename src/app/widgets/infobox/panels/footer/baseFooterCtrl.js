(function () {
	"use strict";
	angular.module('SportsensusApp')
		.controller('baseFooterCtrl', baseFooterCtrl);

	baseFooterCtrl.$inject = [
		'$scope',
		'$controller',
		'ParamsSrv',
		'ApiSrv'
	];

	function baseFooterCtrl(
		$scope,
		$controller,
		ParamsSrv,
		ApiSrv
	) {
		

		$scope.$on('ApiSrv.countError', function(){
			setAudienceCount(0);
		});
		$scope.$on('ApiSrv.countLoaded', readCount);

		function readCount(){
			var result = ApiSrv.getLastCountResult();
			if (result && result.is_valid_count)
				setAudienceCount(result.audience_count);
			else
				setAudienceCount(0);
		}
		readCount();

		function setAudienceCount(audienceCount) {
			$scope.audienceCount = audienceCount;
			if (audienceCount == null)
				$scope.audienceCountText = '' ;
			else if (audienceCount != 0)
				$scope.audienceCountText = 'Болельщики: ' + audienceCount.toLocaleString();
			else
				$scope.audienceCountText = 'Болельщики: недостаточно данных';
		}


		$scope.checkButtonText = '';
		//$scope.checkButtonPage = null;
		$scope.checkButtonClick = function(){
			//$scope.activePage = $scope.pages[$scope.checkButtonPage];
			$scope.setActivePage($scope.pages[$scope.checkButtonPage]);
		};

		$scope.$on('ParamsSrv.paramsChanged', paramsChanged);
		paramsChanged();

		function paramsChanged(){
			var selected = ParamsSrv.getSelectedParams();
			var audienceSelected = !!(selected.demography || selected.regions || selected.consume);
			$scope.sportSelected = !!selected.sport;
			var filtersSelected = !!(selected.interest || selected.rooting || selected.involve || selected.image);

			if ($scope.type == 'infobox') {
				if (audienceSelected && !$scope.sportSelected) {
					$scope.checkButtonText = 'Экспресс-результат';
					$scope.checkButtonPage = 'expressAudience/expressAudience';
				} else if ($scope.sportSelected && !audienceSelected && !filtersSelected) {
					$scope.checkButtonText = 'Экспресс-результат';
					$scope.checkButtonPage = 'expressSport/expressSport';
				} else {
					$scope.checkButtonText = 'Показать результат';
					$scope.checkButtonPage = 'allGraphs';
				}
			} /*else if ($scope.type == 'analytics'){
			 $scope.checkButtonText = 'Анализ пакета';
			 $scope.checkButtonPage = 'analytics/analytics';
			 }*/
		}



	}

}());
