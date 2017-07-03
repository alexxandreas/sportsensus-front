(function () {
    "use strict";
    /**
     * @desc
     */
    angular.module('SportsensusApp')
        .controller('articlesCtrl', articlesCtrl);

    articlesCtrl.$inject = [
        '$scope',
        '$controller',
        'ParamsSrv',
        'ArticlesSrv'
    ];

    function articlesCtrl(
        $scope,
        $controller,
        ParamsSrv,
        ArticlesSrv
    ) {


        // Editor options.
        $scope.options = {
            language: 'ru',
            //uiColor: '#9AB8F3',
            customConfig: false,
            stylesSet: false
        };
  
        ArticlesSrv.getArticles().then(function(articles){
            $scope.articles = articles;
        }, function(){
            // показать ошибку
        })
        
        
        
        // редактируемая статья - оригинал
        $scope.selectedArticle = null;
        // редактируемая статья - с правками
        $scope.editingArticle = null;
        
  
        // $scope.article = {
        //     title: 'Заголовок',
        //     tags: ['tag1', 'tag2', 'tag3'],
        //     content: 'Текс статьи'
        // };
        
        $scope.allTags = ArticlesSrv.getTags(); 
        // [
        //     'wer',
        //     'cas',
        //     'bearg',
        //     'vawe',
        //     'geqra',
        //     'ikuy'
        // ];
        //$controller('baseGraphCtrl', {$scope: $scope});
        
        $scope.creareArticle = function(){
            $scope.selectedArticle = {
                title: 'Новая статья',
                tags: []
            };
            $scope.editingArticle = $scope.selectedArticle;
        };

        $scope.removeArticle = function(article){
            if (article == $scope.selectedArticle){
                $scope.selectedArticle = null;
            }
            ArticlesSrv.removeArticle(article);
        };
        
        $scope.editArticle = function(article){
            ArticlesSrv.getArticle(article.id).then(function(fullArticle){
                fullArticle.groupedTags.sport = fullArticle.groupedTags.sport || [];
                fullArticle.groupedTags.category = fullArticle.groupedTags.category || [];
                $scope.selectedArticle = article;
                $scope.editingArticle = fullArticle;    
            })
        };
        
        $scope.saveArticle = function(){
            angular.extend($scope.selectedArticle, $scope.editingArticle);
            
            // if ($scope.selectedArticle.id !== undefined) {
            //     ArticlesSrv.createArticle
            // }
            ArticlesSrv.setArticle($scope.selectedArticle);
            $scope.selectedArticle = null;
            $scope.editingArticle = null;
        };
        
        $scope.cancelEdit = function(){
            $scope.selectedArticle = null;
            $scope.editingArticle = null;
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
                        $scope.editingArticle.image = dataurl;
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

    }

}());
