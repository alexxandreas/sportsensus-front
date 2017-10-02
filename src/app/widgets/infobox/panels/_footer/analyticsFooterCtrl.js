(function () {
	"use strict";
	angular.module('SportsensusApp')
		.controller('analyticsFooterCtrl', analyticsFooterCtrl);

	analyticsFooterCtrl.$inject = [
		'$scope',
		'$controller',
		'ParamsSrv',
		'ApiSrv'
	];

	function analyticsFooterCtrl(
		$scope,
		$controller,
		ParamsSrv,
		ApiSrv
	) {
		$controller('baseFooterCtrl', {$scope: $scope});

		$scope.checkButtonText = 'Анализ пакета';
		//$scope.checkButtonPage = null;
		$scope.checkButtonClick = function(){
			//$scope.activePage = $scope.pages[$scope.checkButtonPage];
			$scope.setActivePageById('analytics/analytics');
		};
		
	}

}());


