(function () {
	"use strict";
	/**
	 * Директива, проверяющая права пользователя для доступа к указанной странице
	 */
	angular.module('SportsensusApp')
		.directive('checkAccessDir', checkAccessDir);

	checkAccessDir.$inject = [
		'$rootScope'
	];

	function checkAccessDir(
		$rootScope
	)    {
		return {
			restrict: 'E',
			transclude: true,
			scope: {
				type: '@'
				//articleId: $routeParams.articleId
			},
			templateUrl: '/views/widgets/checkAccess/checkAccess.html',
			//template: '<div>'+
			//	'<div ng-if="access">'
			link: function ($scope, $el, attrs) {

			},

			controller: [
				'$scope',
				'UserSrv',
				function(
					$scope,
					UserSrv
				) {
				    
				 //   if (!$scope.type) {
				 //   	showContent();
				 //   } else {
					//     UserSrv.getUserCheckPromise().then(function(){
					//         if (UserSrv.hasAccess($scope.type)){
					// 	        showContent();
					//         } else {
					//             showAccessDenied();        
					//         }
					//     }, function(){
					//         showAccessDenied();
					//     })
					// }
						// showAccessDenied();
						
					
					if (checkAccess($scope.type)){
						showContent();
					} else {
						showAccessDenied();
					}
					
					function checkAccess(types){
						if (!types) return true;
						var typesArray = types.split(',');
						//if (!angular.isArray(types)) types = [types];
						
						return typesArray.some(function(type){
							return UserSrv.hasAccess(type)
						})
					}
					
					
					function showContent(){
						$scope.showAccessDenied = false;
						$scope.showContent = true;
						
						$scope.$on('UserSrv.logout', onUserLogout);
					}
					
					function showAccessDenied(){
						$scope.showContent = false;
						$scope.showAccessDenied = true;
					}
					
					function onUserLogout(){
						showAccessDenied();
					}
					
					
				}]
		};
	}
}());
