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
					var selectedTag = $location.search().tag;
					if (selectedTag) {
						$scope.selectedTag = ArticlesSrv.decodeTag(selectedTag);
					}
					
					$location.search('code', undefined);
					
					
					$scope.showPreloader = true;
					ArticlesSrv.getArticles().then(function(articles){
						$scope.showPreloader = false;
                        $scope.articles = articles;
                        filterArticles();
                        
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
                    
                    ArticlesSrv.getTags().then(function(tags){
                    	$scope.tags = [{
                    		title: 'Виды спорта',
                    		group: 'sport',
                    		tags: tags.sport
                    	},{
                    		title: 'Категории',
                    		group: 'category',
                    		tags: tags.category
                    	}];
                    	
                    })
                    
                    function filterArticles() {
                    	if (!$scope.selectedTag) {
                    		$scope.filteredArticles = $scope.articles;
                    		return;
                    	}
                    	$scope.filteredArticles = $scope.articles.filter(function(article){
                    		return (article.groupedTags[$scope.selectedTag.group] &&
                    			article.groupedTags[$scope.selectedTag.group].indexOf($scope.selectedTag.tag) >= 0)
                    	});
                    }
                        
                    $scope.getTagClass = function(group, tag) {
                    	if (!$scope.selectedTag) {
                    		if (!group && !tag) return 'selected-tag';
                    		return;
                    	}
                    	if (group != $scope.selectedTag.group || tag != $scope.selectedTag.tag) return;
                    	return 'selected-tag';
                    }
                    
                    $scope.openArticle = function(article) {
                    	$location.path('/articles/' + article.id);
                    	$location.search('tag', undefined);
                    };

					$scope.onTagClick = function(group, tag) {
						//console.log(JSON.stringify(tag));
						var fullTag = ArticlesSrv.encodeTag(group, tag);
						$location.search('tag', fullTag);
						
						$scope.selectedTag = {
							group: group,
							tag: tag
						}
						filterArticles();
					}
					
					$scope.clearSelectedTags = function() {
						$scope.selectedTag = null;
						$location.search('tag', undefined);
						filterArticles();
					}
					

				}]
		};
	}
}());
