(function () {
	"use strict";
	angular.module('SportsensusApp')
		.controller('baseInfoboxCtrl', baseInfoboxCtrl);

	baseInfoboxCtrl.$inject = [
		'$scope',
		'$controller',
		'ParamsSrv',
		'ApiSrv'
	];

	function baseInfoboxCtrl(
		$scope,
		$controller,
		ParamsSrv,
		ApiSrv
	) {
		
		//$scope.showPreloader = true;
		
		// ParamsSrv.getParams().then(
		// 	$scope.setParams,  
		// 	function(){}, 
		// 	function(msg){
		// 		if (msg == 'reset'){
		// 			$scope.showPreloader = true;
		// 		}
		// 	}
		// ).finally(function(){
		// 	$scope.showPreloader = false;
		// });
		
		
		
		$scope.$on('ParamsSrv.radarChanged', function(){
			updateParams();
		})
		updateParams();
		
		function updateParams() {
			$scope.showPreloader = true;
			ParamsSrv
				.getParams()
				.then(setParams)
				.finally(function(){
					$scope.showPreloader = false;
				});
		}
		
		function setParams(params){
			$scope.parameters = params;
			if ($scope.onParamsUpdated){
				$scope.onParamsUpdated();
			}
		}
		

		// ParamsSrv.getParams().then(function(params){
		// 	$scope.parameters = params;
		// });
		
		$scope.checkSelected = function(type){
			return !!ParamsSrv.getSelectedParams(type);
		};

		$scope.clearSelection = function(type){
			ParamsSrv.clearSelection(type);
		};

		$scope.selectAll = function(type){
			ParamsSrv.selectAll(type);
		};

		// снимает выделение с соседний radio
		$scope.selectCheckbox = function(collection, item){
			ParamsSrv.getParams().then(function(params){
				var a = params;
			});

			if (collection.type != 'radio') return;
			angular.forEach(collection.items, function(_item) {
				if (item != _item) {
					_item.selected = false;
				}
			});
		};
		
		
		// удалить это после полного редизайна
		
		
		
		$scope.activePage = null;
		$scope.activeMenuItem = null;
		$scope.setActiveMenuItem = function(item){
			$scope.activeMenuItem = item;
			$scope.setActivePage(item);
		};



		$scope.setActivePage = function(item){
			$scope.activePage = item;
			$scope.activeFooter = item.footer + 'Footer';
		};


		$scope.setActiveMenuItemById = function(id){
			var item = $scope.pages[id];
			$scope.setActiveMenuItem(item);
		};
		
		$scope.setActivePageById = function(id){
			var item = $scope.pages[id];
			$scope.setActivePage(item);
		};

		

	}

}());
