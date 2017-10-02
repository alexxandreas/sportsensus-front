(function () {
    "use strict";
    /**
     * @desc
     * @example
     */
    angular.module('SportsensusApp')
        .directive('infoboxRegionsDir', infoboxRegionsDir);

    infoboxRegionsDir.$inject = [
        '$rootScope'
    ];

    function infoboxRegionsDir(
        $rootScope
    )    {
        return {
            restrict: 'E',
            // transclude: true,
            // scope: {
            //     type: '@'
            // },
            templateUrl: '/views/widgets/infobox/panels/regions/infoboxRegions.html',
            // templateUrl: '/views/widgets/articles/articles.html',
            // link: function ($scope, $el, attrs) {
            // //   $scope.contentEl = $el[0].querySelector('div.infobox-content');
            // },

            controller: [
                '$scope',
                '$controller',
                '$compile',
                '$routeParams',
                '$location',
                '$window',
                'ParamsSrv',
                'ApiSrv',
                function(
                    $scope,
                    $controller,
                    $compile,
                    $routeParams,
                    $location,
                    $window,
                    ParamsSrv,
                    ApiSrv
                ) {

                    $controller('baseInfoboxCtrl', {$scope: $scope});


                    // $scope.articleId = Number.parseInt($routeParams.articleId);
                    
                   
                    
                   
                    
                }]
        };
    }
}());
