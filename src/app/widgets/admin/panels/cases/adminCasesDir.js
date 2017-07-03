(function () {
	"use strict";
	/**
	 * @desc
	 * @example
	 */
	angular.module('SportsensusApp')
		.directive('adminCasesDir', adminCasesDir);

	adminCasesDir.$inject = [
		'$rootScope'
	];

	function adminCasesDir(
		$rootScope
	)    {
		return {
			restrict: 'E',
			scope: {
				type: '@'
			},
			templateUrl: '/views/widgets/admin/panels/cases/cases.html',
			link: function ($scope, $el, attrs) {
				//$scope.init();
			},

			controller: [
				'$scope',
				'$routeParams',
				'$location',
				'$window',
				'$mdDialog',
				'$interval',
				'ParamsSrv',
				'ArticlesSrv',
				'ApiSrv',
				function(
					$scope,
					$routeParams,
					$location,
					$window,
					$mdDialog,
					$interval,
					ParamsSrv,
					ArticlesSrv,
					ApiSrv
				) {
	
					$scope.showPreloader = true;
                    ArticlesSrv.getArticles().then(function(articles){
                        $scope.articles = articles;
                        $scope.showPreloader = false;
                    }, function(){
                        // показать ошибку
                        $scope.showPreloader = false;
                    })
                    
                    ArticlesSrv.getTags().then(function(tags){
                        $scope.allTags = tags;
                    }); 
        
                    $scope.creareArticle = function(){
                        $location.path('/admin/cases/new');
                    };
            
                    $scope.removeArticle = function(article){
                        $scope.showPreloader = true;
                        ArticlesSrv.removeArticle(article).then(function(){
                            // $location.path('/admin/cases/');
                            $scope.showPreloader = false;
                        }, function(){
                        	$scope.showPreloader = false;
                            $mdDialog.show(
                              $mdDialog.alert()
                                .clickOutsideToClose(false)
                                .title('Ошибка')
                                .textContent('Ошибка удаления')
                                .ok('OK')
                            );
                        });
                    };
                    
                    $scope.editArticle = function(article){
                    	$location.path('/admin/cases/' + article.id);
                    };
			
				}]
		};
	}
}());
