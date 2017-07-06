(function () {
	"use strict";
	/**
	 * @desc
	 * @example
	 */
	angular.module('SportsensusApp')
		.directive('adminMenuDir', adminMenuDir);

	adminMenuDir.$inject = [
		'$rootScope'
	];

	function adminMenuDir(
		$rootScope
	)    {
		return {
			restrict: 'E',
			scope: {
				type: '@'
			},
			templateUrl: '/views/widgets/admin/panels/menu/menu.html',
			link: function ($scope, $el, attrs) {
				//$scope.init();
			},

			controller: [
				'$scope',
				'$routeParams',
				'$location',
				'$window',
				'$mdDialog',
				'ParamsSrv',
				'ApiSrv',
				function(
					$scope,
					$routeParams,
					$location,
					$window,
					$mdDialog,
					ParamsSrv,
					ApiSrv
				) {

                    $scope.loggedIn = false;
                    $scope.isAdmin = false;
                    
                    
                    
                    $scope.$watch( function () { return ApiSrv.getUser().sid; }, function (sid) {
                        $scope.loggedIn = !!sid;
                        $scope.isAdmin = ApiSrv.getUser().userRights && !!ApiSrv.getUser().userRights.admin;

                    }, true);

                    $scope.selectItem = function(item){
                        $scope.activeMenuItem = item;
                        if (item.path)
                            $scope.setPath(item.path);
                    }		
                    
                    $scope.setPath = function(path){
                        $location.path(path);
                    };

					$scope.menu = [{
						id:'profiles',
						text:'Пользователи',
						path: '/admin/profiles/',
						visible: function(){return $scope.loggedIn && $scope.isAdmin;}
					},{
						id:'leagues',
						text:'Лиги',
						path: '/leagues/',
						visible: function(){return $scope.loggedIn && $scope.isAdmin;}
					},{
						id:'email',
						text:'Шаблоны писем',
						path: '/mail_templates/',
						visible: function(){return $scope.loggedIn && $scope.isAdmin;}
					},{
						id:'other',
						text:'Другое',
						path: '/other/',
						visible: function(){return $scope.loggedIn && $scope.isAdmin;}
					},{
					    id:'other',
						text:'Редактор кейсов',
						path: '/admin/cases/',
						visible: function(){return $scope.loggedIn && $scope.isAdmin;}
					}];


                    var path = $location.path();
                    angular.forEach($scope.menu, function(item){
                        if (item.path && path.indexOf(item.path) >= 0)
                            $scope.activeMenuItem = item;
                    })
                    // if (!$scope.activeMenuItem)
                        // $scope.selectItem($scope.menu[0]);
                        
                    
				}]
		};
	}
}());
