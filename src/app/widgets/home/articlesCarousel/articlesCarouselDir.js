(function () {
    "use strict";
    /**
     * @desc
     * @example
     */
    angular.module('SportsensusApp')
        .directive('articlesCarouselDir', articlesCarousel);

    articlesCarousel.$inject = [
        '$rootScope'
    ];

    function articlesCarousel(
        $rootScope
    )    {
        return {
            restrict: 'E',
            scope: {
            },
            templateUrl: '/views/widgets/home/articlesCarousel/articlesCarousel.html',
            link: function ($scope, $el, attrs) {},

            controller: [
                '$scope',
                '$routeParams',
                '$location',
                '$anchorScroll',
                '$window',
                '$timeout',
                'ArticlesSrv',
                function(
                    $scope,
                    $routeParams,
                    $location,
                    $anchorScroll,
                    $window,
                    $timeout,
                    ArticlesSrv
                ){
                    
                    $scope.carousel = null;
                    ArticlesSrv.getArticles().then(function(articles){
                        $scope.articles = articles;
                        $timeout(function(){
                            $scope.carousel = new Flickity('.articles-carousel-flickity');  
                        }, 1);
                       
                    })
                   
                   
                }
            ]
        };
    }
}());
