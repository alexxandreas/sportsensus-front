(function () {
	"use strict";
	/**
	 * @desc
	 * @example
	 */
	angular.module('SportsensusApp')
		.directive('accountDir', accountDir);

	accountDir.$inject = [
		'$rootScope',
		'analyticsSrv'
	];

	function accountDir(
		$rootScope,
		analyticsSrv
	)    {
		return {
			restrict: 'E',
			scope: {
				type: '@'
			},
			templateUrl: '/views/widgets/account/account.html',
			link: function ($scope, $el, attrs) {

			},

			controller: [
				'$scope',
				'$controller',
				'$routeParams',
				'$location',
				'$window',
				'$mdDialog',
				'ParamsSrv',
				'ApiSrv',
				function(
					$scope,
					$controller,
					$routeParams,
					$location,
					$window,
					$mdDialog,
					ParamsSrv,
					ApiSrv
				) {

					$controller('baseInfoboxCtrl', {$scope: $scope});

					$scope.topMenu = [{
						id:'personalData',
						tpl:'personalData',
						text:'Личные данные'
						// isSelected: $scope.checkSelected.bind(null, 'consume'),
						//footer: 'analytics'
					},{
						id:'address',
						tpl:'address',
						text:'Адрес'
						// isSelected: $scope.checkSelected.bind(null, 'consume'),
						//footer: 'analytics'
					},{
						id:'bank',
						tpl:'bank',
						text:'Банковские реквизиты'
						// isSelected: $scope.checkSelected.bind(null, 'consume'),
						//footer: 'analytics'
					},{
						id:'password',
						tpl:'password',
						text:'Смена пароля'
						// isSelected: $scope.checkSelected.bind(null, 'consume'),
						//footer: 'analytics'
					}];


					$scope.pages = {};

					[$scope.topMenu/*, $scope.bottomMenu, $scope.extPages*/].forEach(function(collection) {
						collection.forEach(function (item) {
							$scope.pages[item.id] = item;
						});
					});

					$scope.setActiveMenuItem($scope.topMenu[0]);


					// Личные данные
					// Адрес
					// Банковские реквизиты
					// Смена пароля

					$scope.params1 = {
						'first_name': {title: 'Имя'},
						'last_name': {title: 'Фамилия'},
						'phone': {title: 'Телефон'},
						'company_name': {title: 'Название компании'},
						'legal_status': {
							title: 'Юридический статус',
							type: 'combo',
							items: [
								{value: 0, name: 'Физическое лицо'},
								{value: 1, name: 'Юридическое лицо'}
							]
						},
						'company_type': {
							title: 'Тип компании',
							type: 'combo',
							items: [
								{value: 0, name: 'Спонсор'},
								{value: 1, name: 'Правообладатель'},
								{value: 2, name: 'Агенство'}
							]
						}
					};

					$scope.params2 = {
						'city_address': {title: 'Город'},
						'street_address': {title: 'Улица'},
						'house_address': {title: 'Дом'},
						'address_type': {
							title: 'Тип адреса',
							type: 'combo',
							items: [
								{value: 0, name: 'Офис'},
								{value: 1, name: 'Дом'}
							]
						}
					};

					$scope.params3 = {
						'legal_address': 	{title: 'Юридический адрес'},
						'inn': 				{title: 'Инн'},
						'kpp':	 			{title: 'Кпп'},
						'okpo': 			{title: 'Код окпо'},
						'okonh': 			{title: 'Код оконх'},
						'bank_account': 	{title: 'Банковский счет'},
						'corr_account': 	{title: 'Корр. счет'},
						'bic': 				{title: 'Бик'}
					};


					getProfile();

					function getProfile(){
						ApiSrv.getProfile().then(function(data){
							$scope.profile = data;
							$scope.originalProfile = angular.extend({}, data);
						}, function(){});
					}


					$scope.isProfileChanged = function(){
						return !angular.equals($scope.profile, $scope.originalProfile);
					};

					$scope.saveProfile = function(){
						ApiSrv.editProfile($scope.profile).then(function(){
							$scope.originalProfile = angular.extend({}, $scope.profile);	
						}, function(){
							$mdDialog.show($mdDialog.alert()
								.title('Ошибка сохранения')
								.textContent('Невозможно сохранить изменения')
								.ok('OK'));
						});
						
					};

					$scope._newPassword = null;
					$scope.newPassword = function(pass){
						if (arguments.length)
							$scope._newPassword = pass;
						return $scope._newPassword;
					};
					
					$scope.savePassword = function(){
						ApiSrv.changePassword($scope.newPassword()).then(function(){
							$scope.newPassword(null);
						}, function(){
							$mdDialog.show($mdDialog.alert()
								.title('Ошибка сохранения')
								.textContent('Невозможно сохранить новый пароль')
								.ok('OK'));
						})

					}

				}]
		};
	}
}());
