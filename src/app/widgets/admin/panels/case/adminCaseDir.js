(function () {
	"use strict";
	/**
	 * @desc
	 * @example
	 */
	angular.module('SportsensusApp')
		.directive('adminCaseDir', adminCaseDir);

	adminCaseDir.$inject = [
		'$rootScope'
	];

	function adminCaseDir(
		$rootScope
	)    {
		return {
			restrict: 'E',
			scope: {
				// type: '@'
			},
			templateUrl: '/views/widgets/admin/panels/case/case.html',
			link: function ($scope, $el, attrs) {
				//$scope.init();
				$scope.el = $el;
			},

			controller: [
				'$scope',
				'$routeParams',
				'$location',
				'$window',
				'$mdDialog',
				'ParamsSrv',
				'ArticlesSrv',
				function(
					$scope,
					$routeParams,
					$location,
					$window,
					$mdDialog,
					ParamsSrv,
					ArticlesSrv
				) {
	
                    // Editor options.
                    $scope.options = {
                        language: 'ru',
                        uiColor: '#1e88e5',
                        customConfig: false,
                        stylesSet: false
                    };
              
                    $scope.caseId = Number.parseInt($routeParams.caseId);
                    if (Number.isNaN($scope.caseId)){
                        setArticle({
                            title: 'Заголовок', 
                            content: 'Текс статьи'
                        });
                    } else {
                        $scope.showPreloader = true;
                        ArticlesSrv.getArticle($scope.caseId).then(function(article){
                            setArticle(article);
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
                                $location.path('/admin/cases/');
                            });
                        })
                    }
                    
                    function setArticle(article){
                        article.tags = article.tags || [];
                        article.groupedTags = article.groupedTags || {};
                        article.groupedTags.sport = article.groupedTags.sport || [];
                        article.groupedTags.category = article.groupedTags.category || [];
                        
                        $scope.article = article;   
                    }
             
                    ArticlesSrv.getTags().then(function(tags){
                        $scope.allTags = tags;
                    }); 

            
                    $scope.removeArticle = function(article){
                        $scope.showPreloader = true;
                        ArticlesSrv.removeArticle(article).then(function(){
                            $location.path('/admin/cases/');
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
                    
                    
                    $scope.saveArticle = function(){
                        $scope.showPreloader = true;
                        ArticlesSrv.setArticle($scope.article).then(function(){
                            $scope.showPreloader = false;
                        }, function(){
                            $scope.showPreloader = false;
                            $mdDialog.show(
                              $mdDialog.alert()
                                .clickOutsideToClose(false)
                                .title('Ошибка')
                                .textContent('Ошибка сохранения')
                                .ok('OK')
                            );
                        });
                    };
                    
                    $scope.cancelEdit = function(){
                        $location.path('/admin/cases/');
                    };
                    
                    
                    
                    
                    
                    
                    
                    
                    $scope.removeImage = function(){
                        $scope.article.image = null;
                    };
                    
                    $scope.setFile = function(file){
                        var reader = new FileReader();  
                        reader.onload = function(e) {
                            var img = document.createElement("img");
                            img.onload = function () {
                                var canvas = document.createElement("canvas");
                                var ctx = canvas.getContext("2d");
                                ctx.drawImage(img, 0, 0);
                                
                                var MAX_WIDTH = 300;
                                var MAX_HEIGHT = 300;
                                var width = img.width;
                                var height = img.height;
                                
                                var k = Math.max(width / MAX_WIDTH, height / MAX_HEIGHT, 1);
                                
                                // if (width > height) {
                                //   if (width > MAX_WIDTH) {
                                //     height *= MAX_WIDTH / width;
                                //     width = MAX_WIDTH;
                                //   }
                                // } else {
                                //   if (height > MAX_HEIGHT) {
                                //     width *= MAX_HEIGHT / height;
                                //     height = MAX_HEIGHT;
                                //   }
                                // }
                                height /= k;
                                width /= k;
                                
                                canvas.width = width;
                                canvas.height = height;
                                var ctx = canvas.getContext("2d");
                                ctx.drawImage(img, 0, 0, width, height);
                                
                                var dataurl = canvas.toDataURL("image/png");
                                
                                $scope.$apply(function(){
                                    $scope.article.image = dataurl;
                                })
                                
                            }
                            img.src = e.target.result;
                        }
                        reader.readAsDataURL(file);
                    };
                    
                    
                    $scope.transformSportTag = function(tag) {
                      // If it is an object, it's already a known chip
                      if (angular.isString(tag)) {
                        //   if (tag.indexOf('sport::') == 0)
                            return tag;
                      }
                
                      // Otherwise, create a new one
                      return null;
                    };
                    
                    $scope.onSportTagAdd = function(tag) {
                        var a = tag;
                    }
                    
                    $scope.transformCategoryTag = function(tag) {
                      // If it is an object, it's already a known chip
                      if (angular.isString(tag)) {
                          if (tag.indexOf('category::') == 0)
                            return tag;
                      }
                
                      // Otherwise, create a new one
                      return null;
                    };
            
                    $scope.querySportTagSearch = function(query) {
                        return querySportTagSearch('sport', query);
                    };
                    
                    $scope.queryCategoryTagSearch = function(query) {
                        return querySportTagSearch('category', query);
                    };
                    
                    function querySportTagSearch(group, query) {
                        var lowercaseQuery = angular.lowercase(query);
                        
                        if (!$scope.allTags[group]) return [];
                        
                        var results = query ? $scope.allTags[group].filter(function(tag){
                            return tag.toLowerCase().indexOf(lowercaseQuery) === 0;
                        }) : [];
                        
                        return results;
                    }
				

				}]
		};
	}
}());
