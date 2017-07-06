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
				'$mdDialog',
				'ParamsSrv',
				'ApiSrv',
				'AdminProfilesSrv',
				function(
					$scope,
					$routeParams,
					$location,
					$window,
					$mdDialog,
					ParamsSrv,
					ApiSrv,
					AdminProfilesSrv
				) {
	
					$scope.showPreloader = true;
					AdminProfilesSrv.getProfiles().then(function(profiles){
							$scope.showPreloader = false;	
							$scope.profiles = profiles;
						}, function(){
							$scope.showPreloader = false;
                            $mdDialog.show(
                              $mdDialog.alert()
                                .clickOutsideToClose(false)
                                .title('Ошибка')
                                .textContent('Ошибка загрузки данных')
                                .ok('OK')
                            );
						}
					);

					$scope.saveProfile = function(profile){
						var acl = {
							"admin": profile.admin_role,
							"sponsor":  profile.sponsor_role,
							"rightholder":  profile.rightholder_role,
							"demo":  profile.demo_role
						};
						ApiSrv.addRole(profile.user_id, acl).then(function(acl){
							profile.admin_role = acl.admin;
							profile.sponsor_role = acl.sponsor;
							profile.rightholder_role = acl.rightholder;
							profile.demo_role = acl.demo;
							profile.dirty = false;
						}, function(){
							$mdDialog.show($mdDialog.alert()
								.title('Ошибка')
								.textContent('Невозможно применить изменения')
								.ok('OK'));
						});
					};
					
					$scope.openProfile = function(profile){
						$location.path('/admin/profiles/' + profile.user_id);
					};
					
				}]
		};
	}
}());
