(function () {
	"use strict";
	/**
	 * @desc
	 * @example
	 */
	angular.module('SportsensusApp')
		.directive('adminDir', adminDir);

	adminDir.$inject = [
		'$rootScope'
	];

	function adminDir(
		$rootScope
	)    {
		return {
			restrict: 'E',
			scope: {
				type: '@'
			},
			templateUrl: '/views/widgets/admin/admin.html',
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

					

					$scope.menu = [{
						id:'profiles',
						text:'Пользователи',
						visible: function(){return $scope.loggedIn && $scope.isAdmin;},
                        onClick: function(){$scope.setPath('/account/');}
					},{
						id:'leagues',
						text:'Лиги',
						visible: function(){return $scope.loggedIn && $scope.isAdmin;},
                        onClick: function(){$scope.setPath('/account/');}
					},{
						id:'email',
						text:'Шаблоны писем',
						visible: function(){return $scope.loggedIn && $scope.isAdmin;},
                        onClick: function(){$scope.setPath('/account/');}
					},{
						id:'other',
						text:'Другое',
						visible: function(){return $scope.loggedIn && $scope.isAdmin;},
                        onClick: function(){$scope.setPath('/account/');}
					},{
					    
					}];

                    $scope.selectMenuItem = function(item) {
                        
                    }
					

					ApiSrv.getProfilesList().then(function(profiles){
						$scope.profiles = profiles;
					}, function(){});

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
				

					$scope.activePage = null;
					$scope.activeMenuItem = null;
					$scope.setActiveMenuItem = function(item){
						$scope.activeMenuItem = item;
						$scope.activePage = item;
					};


					$scope.setActiveMenuItem($scope.menu[0]);


				}]
		};
	}
}());
