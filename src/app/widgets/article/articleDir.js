(function () {
	"use strict";
	/**
	 * @desc
	 * @example
	 */
	angular.module('SportsensusApp')
		.directive('articleDir', articleDir);

	articleDir.$inject = [
		'$rootScope'
	];

	function articleDir(
		$rootScope
	)    {
		return {
			restrict: 'E',
			scope: {
				type: '@'
				//articleId: $routeParams.articleId
			},
			templateUrl: '/views/widgets/article/article.html',
			link: function ($scope, $el, attrs) {

			},

			controller: [
				'$scope',
				'$controller',
				'$location',
				'$window',
				'$mdDialog',
				'$routeParams',
				'ParamsSrv',
				'ArticlesSrv',
				function(
					$scope,
					$controller,
					$location,
					$window,
					$mdDialog,
					$routeParams,
					ParamsSrv,
					ArticlesSrv
				) {
					//$scope.articleId = $routeParams.articleId;
					$scope.articleId = Number.parseInt($routeParams.articleId);
                    //if (Number.isNaN($scope.articleId)){
					
					$scope.showPreloader = true;
                    ArticlesSrv.getArticle($scope.articleId).then(function(article){
                        // $location.path('/admin/cases/');
                        $scope.showPreloader = false;
                        $scope.article = article;
                    }, function(){
                    	$scope.showPreloader = false;
                        $mdDialog.show(
                          $mdDialog.alert()
                            .clickOutsideToClose(false)
                            .title('Ошибка')
                            .textContent('Ошибка загрузки')
                            .ok('OK')
                        );
                    });
                    

				}]
		};
	}
}());
