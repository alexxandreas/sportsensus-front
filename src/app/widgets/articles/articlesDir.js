(function () {
	"use strict";
	/**
	 * @desc
	 * @example
	 */
	angular.module('SportsensusApp')
		.directive('articlesDir', articlesDir);

	articlesDir.$inject = [
		'$rootScope'
	];

	function articlesDir(
		$rootScope
	)    {
		return {
			restrict: 'E',
			scope: {
				type: '@'
				//articleId: $routeParams.articleId
			},
			templateUrl: '/views/widgets/articles/articles.html',
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
					
					$scope.showPreloader = true;
					ArticlesSrv.getArticles().then(function(articles){
						$scope.showPreloader = false;
                        $scope.articles = articles;
                        $scope.filteredArticles = articles;
                        $scope.tags = ArticlesSrv.getTags();
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
                    
                    $scope.openArticle = function(article) {
                    	$location.path('/articles/' + article.id);
                    };

					

				}]
		};
	}
}());
