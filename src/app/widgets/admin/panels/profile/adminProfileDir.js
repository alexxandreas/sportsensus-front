(function () {
	"use strict";
	/**
	 * @desc
	 * @example
	 */
	angular.module('SportsensusApp')
		.directive('adminProfileDir', adminProfileDir);

	adminProfileDir.$inject = [
		'$rootScope'
	];

	function adminProfileDir(
		$rootScope
	)    {
		return {
			restrict: 'E',
			scope: {
				type: '@'
			},
			templateUrl: '/views/widgets/admin/panels/profile/profile.html', 
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
	
	                    $scope.userId = Number.parseInt($routeParams.userId);
                    
                        $scope.showPreloader = true;
                        AdminProfilesSrv.getProfile($scope.userId).then(function(profile){
                            $scope.profile = profile;
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
                                $location.path('/admin/profiles/');
                            });
                        })
                    
	                
	                $scope.fieldsMap = [
	                    {field: "login", title: "Логин"},
                        {field: "first_name", title: "Имя"},
                        {field: "last_name", title: "Фамилия"},
                        {field: "company_name", title: "Название компании"},
                        {field: "phone", title: "Телефон"},
                        {field: "company_type", title: "Тип компании", values:{ 0: "Спонсор", 1: "Правообладатель", 2: "Агенство"}},
                        {field: "legal_status", title: "Юридический статус", values:{ 0: "Физическое лицо", 1: "Юридическое лицо"}},
                        {field: "city_address", title: "Город"},
                        {field: "street_address", title: "Улица"},
                        {field: "house_address", title: "Дом"},
                        {field: "address_type", title: "Тип адреса", values:{ 0: "Рабочий", 1: "Домашний"}},
                        {field: "inn", title: "Инн"},
                        {field: "kpp", title: "Кпп"},
                        {field: "legal_address", title: "Юридический адрес"},
                        {field: "okpo", title: "ОКПО"},
                        {field: "okonh", title: "ОКОНХ"},
                        {field: "bank_account", title: "Банковский счет"},
                        {field: "corr_account", title: "Корреспондентский счет"},
                        {field: "bic", title: "БИК"}
	                ];
	                
	                angular.forEach($scope.fieldsMap, function(field){
	                    field.value = function(){
	                        if (!$scope.profile) return undefined;
	                        var val = $scope.profile[field.field];
	                        return field.values ? field.values[val] : val;
	                    }
	                });
	
				

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
					
				}]
		};
	}
}());
