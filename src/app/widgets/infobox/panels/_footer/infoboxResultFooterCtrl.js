(function () {
	"use strict";
	angular.module('SportsensusApp')
		.controller('infoboxResultFooterCtrl', infoboxResultFooterCtrl);

	infoboxResultFooterCtrl.$inject = [
		'$scope',
		'$controller',
		'ParamsSrv',
		'ApiSrv',
		'analyticsSrv'
	];

	function infoboxResultFooterCtrl(
		$scope,
		$controller,
		ParamsSrv,
		ApiSrv,
		analyticsSrv
	) {
		$controller('baseFooterCtrl', {$scope: $scope});

		$scope.checkButtonText = 'Сбросить';
		//$scope.checkButtonPage = null;
		$scope.checkButtonClick = function(){
			//$scope.activePage = $scope.pages[$scope.checkButtonPage];
			//$scope.setActivePage($scope.pages[$scope.checkButtonPage]);
			['demography', 'consume', 'regions',
				'sport','interest','rooting','involve','image'].forEach(function(type){
				ParamsSrv.clearSelection(type);
			});
			
			analyticsSrv.setSelected({
				sport: null,
				league: null,
				club: null
			});
			
			$scope.setActiveMenuItemById('demography');

		};

	}

}());



