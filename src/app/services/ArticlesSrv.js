(function () {

    "use strict";
    angular.module('SportsensusApp')
        .factory('ArticlesSrv', ArticlesSrv);

    // инициализируем сервис
    angular.module('SportsensusApp').run(['ArticlesSrv', function(ArticlesSrv) {

    }]);

    // angula
    // r.module('SportsensusApp').run(ArticlesSrv.init);

    ArticlesSrv.$inject = [
        '$rootScope',
        '$q',
        'ApiSrv'
    ];


    function ArticlesSrv(
        $rootScope,
        $q,
        ApiSrv
    ) {
        
        //var articles = [];
        //var allTags = [];
        
        var tags = {
            // ungrouped: []
        };
        
        var articlesLoaded = false;
        var articlesDefer = $q.defer();

        function addTags(newTags, allTags){
            angular.forEach(newTags, function(tag){
                var parts = tag.split('::');
                var group = null;
                
                if (parts.length > 1) {
                    tag = parts.slice(1).join('::');
                    group = parts[0];
                } else {
                    group = 'ungrouped'
                }
                
                allTags[group] = allTags[group] || [];
                
                if (allTags[group].indexOf(tag) < 0)
                    allTags[group].push(tag);
            });
        }
    
        
        function getTags() {
            return getArticles().then(function(articles){
                return tags;
            });
        }
        
        function getArticles(){
            if (!articlesLoaded){
                articlesLoaded = true;
                
                ApiSrv.getUserAuthPromise().then(function(){
                    ApiSrv.getArticles().then(function(articles){
                        //articles = newArticles;
                        angular.forEach(articles, loadArticleTags);
                        
                        articlesDefer.resolve(articles);
                        return articles;
                    }, function(){
                        articlesDefer.reject();
                    }); 
                });
            }
            
            return articlesDefer.promise;
        }
        
        // загрузка тегов из tags в groupedTags
        function loadArticleTags(article) {
            article.groupedTags = {};
            if (!article.tags) return;
            addTags(article.tags, article.groupedTags);
            addTags(article.tags, tags);
        }
        
        // сохранение тегов из groupedTags в tags
        function saveArticleTags(article) {
            article.tags = [];
            angular.forEach(article.groupedTags, function(group, groupName){
                angular.forEach(group, function(tag){
                    article.tags.push((groupName == 'ungrouped' ? '' : groupName + '::') + tag);
                })
            });
            addTags(article.tags, tags);
        }
        
        function getArticle(id) {
    
            //return ApiSrv.getArticle(id);
            
            return getArticles().then(function(articles){
                
                // var oldArticle = articles.filter(function(art){
                //     return art.id == id;
                // })[0];
                // return oldArticle;
            
               
                
                return ApiSrv.getArticle(id).then(function(article){
                    loadArticleTags(article);
                    return article;
                });
            });
        }

        function setArticle(article){
        
            return getArticles().then(function(articles){
                saveArticleTags(article);
                var method = article.id !== undefined ?  ApiSrv.editArticle : ApiSrv.createArticle;
                
                return method(article).then(function(newArticle){
                    //var newArticle = angular.extend({id: id}, article);
                    //delete newArticle.content;
                    
                    var oldArticle = articles.filter(function(art){
                        return art.id == newArticle.id;
                    })[0];
                    
                    if (oldArticle)
                        angular.extend(oldArticle, newArticle)
                    else 
                        articles.push(newArticle);
                        
                    //addTags(newArticle.tags);
                    
                    return newArticle;
                })
            });
            
        }
        
        function removeArticle(article){
            if (!article.id)
                return $q.reject();
            
            return getArticles().then(function(articles){
                return ApiSrv.removeArticle(article.id).then(function(result){
                    if (result === true)
                        articles.splice(articles.indexOf(article), 1);
                });
            });
        }

        var me = {
            getArticles: getArticles,
            getArticle: getArticle,
            setArticle: setArticle,
            removeArticle: removeArticle,
            getTags: getTags
        };


        return me;
    }
}());