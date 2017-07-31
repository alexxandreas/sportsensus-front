(function () {

    "use strict";
    angular.module('SportsensusApp')
        .factory('ArticlesSrv', ArticlesSrv);

    // инициализируем сервис
    // angular.module('SportsensusApp').run(['ArticlesSrv', function(ArticlesSrv) { }]);

    ArticlesSrv.$inject = [
        '$rootScope',
        '$q',
        'ApiSrv',
        'UserSrv'
    ];


    function ArticlesSrv(
        $rootScope,
        $q,
        ApiSrv,
        UserSrv
    ) {
        
        var tags = {
            // ungrouped: []
        };
        
        function decodeTag(tag){
            var parts = tag.split('::');
            var group = null;
            
            if (parts.length > 1) {
                tag = parts.slice(1).join('::');
                group = parts[0];
            } else {
                group = 'ungrouped'
            }
            
            return {
                tag: tag,
                group: group
            }
        }
        
        function encodeTag(group, tag) {
            return group + '::' + tag;
        }
        
        function addTags(newTags, allTags){
            angular.forEach(newTags, function(tag){
                var decoded = decodeTag(tag);
                
                allTags[decoded.group] = allTags[decoded.group] || [];
                
                if (allTags[decoded.group].indexOf(decoded.tag) < 0)
                    allTags[decoded.group].push(decoded.tag);
            });
        }
    
        
        function getTags() {
            return getArticles().then(function(articles){
                return tags;
            });
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
    
            return getArticles().then(function(articles){
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
        
  
        var getArticles = UserSrv.loadWhenAuth(function(resolve, reject){
            ApiSrv.getArticles().then(function(articles){
                tags = {}; // очищаем каждый раз, когда загружаем заново статьи
                angular.forEach(articles, loadArticleTags);
                resolve(articles);
            }, reject);
        });
        
        
        
        var me = {
            getArticles: getArticles,
            getArticle: getArticle,
            setArticle: setArticle,
            removeArticle: removeArticle,
            getTags: getTags,
            decodeTag: decodeTag,
            encodeTag: encodeTag
        };


        return me;
    }
}());