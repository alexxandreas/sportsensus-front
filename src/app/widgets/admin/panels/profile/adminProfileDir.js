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
	
                    $scope.userId = Number.parseInt($routeParams.userId);
                
                    $scope.showPreloader = true;
                    
                    $q.all({
                    	profile: AdminProfilesSrv.getProfile($scope.userId),
                    	tariffs: TariffsSrv.getTariffs()
                    }).then(function(result){
                    	$scope.profile = result.profile;
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
                            $location.path('/admin/profiles/');
                        });
                    });
                    
                    
                    // $scope.getTariffTitle = function(){
                    // 	if (!$scope.profile) return;
                    	
                    // 	var tariffId = $scope.profile.tariffId;
                    // 	if (tariffId == null) return;
                    	
                    // 	var selectedTariff = $scope.tariffs.find(function(tariff){
                    // 		return tariff.id == tariffId;
                    // 	});
                    // 	if (!selectedTariff) return;
                    	
                    // 	return selectedTariff.name;
                    // }
                   
	                
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
	
				

					$scope.onTariffChanged = function(){
						$scope.profile.dirty = true;
						$scope.profile.setTariff = true;
					};
					
					$scope.saveProfile = function(){
						var acl = {
							"admin": $scope.profile.admin_role,
							"sponsor":  $scope.profile.sponsor_role,
							"rightholder":  $scope.profile.rightholder_role,
							"demo":  $scope.profile.demo_role
						};
						if ($scope.profile.setTariff){
							var tariffId = $scope.profile.tariffId;
							acl.tariff_id = tariffId;
						}
						
						ApiSrv.addRole($scope.profile.user_id, acl).then(function(acl){
							$scope.profile.admin_role = acl.admin;
							$scope.profile.sponsor_role = acl.sponsor;
							$scope.profile.rightholder_role = acl.rightholder;
							$scope.profile.demo_role = acl.demo;
							$scope.profile.dirty = false;
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
