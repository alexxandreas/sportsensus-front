(function () {
	"use strict";
	/**
	 * @desc
	 * @example
	 */
	angular.module('SportsensusApp')
		.directive('oldAdminDir', adminDir);

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
						text:'Пользователи'
					},{
						id:'leagues',
						text:'Лиги'
					},{
						id:'email',
						text:'Шаблоны писем'
					},{
						id:'other',
						text:'Другое'
					}];


					// $scope.pages = {};
					// [
					// 	'profiles',
					// 	'leagues',
					// 	'email',
					// 	'other'
					// ].forEach(function(page){
					// 	$scope.pages[page] = {id:page};
					// });
					
					

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
					// ParamsSrv.getParams().then(function(params){
					// 	$scope.parameters = params;
					// 	//$scope.regionsLegend = {};
					// });


					$scope.activePage = null;
					$scope.activeMenuItem = null;
					$scope.setActiveMenuItem = function(item){
						$scope.activeMenuItem = item;
						$scope.activePage = item;
					};


					$scope.setActiveMenuItem($scope.menu[0]);


					// $scope.checkButtonClick = function(){
					// 	$scope.activePage = $scope.pages[$scope.checkButtonPage];
					// };


					/*$scope.init = function(){
						if ($scope.type == 'infobox'){
							$scope.bottomMenu = $scope.sportinfoMenu;
						} else if ($scope.type == 'analytics'){
							$scope.bottomMenu = $scope.analyticsMenu;
						}
					}*/

				}]
		};
	}
}());
