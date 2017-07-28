(function () {
	"use strict";
	/**
	 * @desc
	 * @example
	 */
	angular.module('SportsensusApp')
		.directive('adminProfilesDir', adminProfilesDir);

	adminProfilesDir.$inject = [
		'$rootScope'
	];

	function adminProfilesDir(
		$rootScope
	)    {
		return {
			restrict: 'E',
			scope: {
				type: '@'
			},
			templateUrl: '/views/widgets/admin/panels/profiles/profiles.html',
			link: function ($scope, $el, attrs) {
				//$scope.init();
			},

			controller: [
				'$scope',
				'$routeParams',
				'$location',
				'$window',
				'$q',
				'$mdDialog',
				'ParamsSrv',
				'ApiSrv',
				'AdminProfilesSrv',
				'TariffsSrv',
				function(
					$scope,
					$routeParams,
					$location,
					$window,
					$q,
					$mdDialog,
					ParamsSrv,
					ApiSrv,
					AdminProfilesSrv,
					TariffsSrv
				) {
	
					// $scope.showPreloader = true;
					// AdminProfilesSrv.getProfiles().then(function(profiles){
					// 		$scope.showPreloader = false;	
					// 		$scope.profiles = profiles;
					// 	}, function(){
					// 		$scope.showPreloader = false;
     //                       $mdDialog.show(
     //                         $mdDialog.alert()
     //                           .clickOutsideToClose(false)
     //                           .title('Ошибка')
     //                           .textContent('Ошибка загрузки данных')
     //                           .ok('OK')
     //                       );
					// 	}
					// );
					
					$scope.showPreloader = true;
                    $q.all({
                    	profiles: AdminProfilesSrv.getProfiles(),
                    	tariffs: TariffsSrv.getTariffs()
                    }).then(function(result){
                    	$scope.profiles = result.profiles;
                    	$scope.tariffs = result.tariffs;
                        $scope.showPreloader = false;
                    }, function(){
                    	$scope.showPreloader = false;
                        $mdDialog.show(
                          $mdDialog.alert()
                            .clickOutsideToClose(false)
                            .title('Ошибка')
                            .textContent('Ошибка загрузки данных с сервера')
                            .ok('OK')
                        ).then(function(){
                            //$location.path('/admin/profiles/');
                        });
                    });
                    
                    $scope.getTariff = function(id){
                    	return TariffsSrv.getTariff(id);
                    }

					
					$scope.openProfile = function(profile){
						$location.path('/admin/profiles/' + profile.user_id);
					};
					
				}]
		};
	}
}());
