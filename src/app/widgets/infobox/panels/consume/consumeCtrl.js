(function () {
	"use strict";
	/**
	 * @desc
	 */
	angular.module('SportsensusApp')
		.controller('consumeCtrl', consumeCtrl);

	consumeCtrl.$inject = [
		'$scope',
		'$controller',
		'ParamsSrv',
		'ApiSrv'
	];

	function consumeCtrl(
		$scope,
		$controller,
		ParamsSrv,
		ApiSrv
	) {
		//$controller('baseGraphCtrl', {$scope: $scope});
		ParamsSrv.getParams().then(function (params) {
			$scope.parameters = params;
			// $scope.parameters.tvcable.visible = {
			// 	tvhome:2
			// };
			// $scope.parameters.net.visible = {
			// 	time_week:'net'
			// };

			// $scope.parameters.gamingplatform.visible = {
			// 	gamingtime: [1,2,3]
			// };

			$scope.prepareConsume(params.consume);
			//$scope.prepareLegends();
			//requestData();
			//requestData($scope.sportLegend[0]);
			//updateCaption();
		});



		// возвращает все наборы параметров, включая вложенные в виде линейной структуры
		$scope.getAllSubchildren2 = function(item){
			if (!item) return;
			var finalItems = [];
			if (!item.lists || item.lists.every(function(subitem){ return !subitem.lists; }))
				finalItems.push(item);
			else item.lists.forEach(function(subitem){
				finalItems = finalItems.concat($scope.getAllSubchildren(subitem));
			});
			return finalItems;
		};

		$scope.getAllSubchildren = function(item){
			if (!item) return;
			var finalItems = [];
			if (item.lists){
				//finalItems.push(item);

				item.lists.forEach(function (subitem) {
					if (subitem.lists){
						finalItems.push(subitem);
						if (subitem.visible !== undefined){
							subitem.visibleFn = function(){
								if (subitem.visible === false)
									return false;
								if (subitem.visible instanceof Object){
									return Object.keys(subitem.visible).some(function(key){
										var params = $scope.parameters[key];
										return params.lists.some(function(child){
											var value = subitem.visible[key];
											if (value instanceof Array)
												return child.selected && value.indexOf(child.id) >= 0;
											else
												return child.selected && child.id == value;
										})
									});
								}
							}
						}
					}

					finalItems = finalItems.concat($scope.getAllSubchildren(subitem));
				});
			}

			return finalItems;
		};

		//function

		$scope.blocks = [];
		$scope.prepareConsume = function(consume){
			$scope.blocks = consume.lists.map(function(list){ return {name: list.name, lists: list.lists}; });
			$scope.blocks.forEach(function(block){
				if (block.lists.every(function(list){ return !list.lists })){ // terminate list (like antivirus)
					block.lists = [{
						lists: block.lists
					}]
				} else {
					block.lists = $scope.getAllSubchildren(block);
				}
			});
		}


		

	}

}());
