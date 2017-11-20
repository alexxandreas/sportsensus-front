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

                    $scope.onParamsUpdated = function(){
                        prepareRegions($scope.parameters);
                    }
                    // $scope.articleId = Number.parseInt($routeParams.articleId);
                    
                    function prepareRegions(params){
                        var regions = params && params.region && params.region.lists;
                        if(!regions) return;
                        
                        var blocks = [];
                        
                        // 15: 'Москва',
                        // 30: 'Санкт-Петербург',
                        // 16: 'Московская обл',
                        // 14: 'Ленинградская обл.'
                        var priorityRegions = [15, 30, 16, 14];
                        var priorityBlock = {
                            regions: []
                        }
                        angular.forEach(priorityRegions, function(prId){
                            var region = regions.find(function(region){
                                return region.id == prId;
                            });
                            if (region){
                                priorityBlock.regions.push(region);
                            }
                        })
                        blocks.push(priorityBlock);
                        
                        
                        var start = 'а'.charCodeAt(0);
                        var end = 'я'.charCodeAt(0);
                        
                        for (var charCode = start; charCode <= end; charCode++) {
                            var block = getBlock(String.fromCharCode(charCode).toUpperCase());
                            if (block.regions.length){
                                blocks.push(block);
                            }
                        }
                        
                        // $scope.columns = prepareColumns(2);
                        var regionsCount = regions.length;
                        var currentColumn = [];
                        var currentCount = 0;
                        $scope.columns = [currentColumn];
                        angular.forEach(blocks, function(block){
                            currentColumn.push(block);
                            currentCount += block.regions.length;
                            
                            // if (currentCount > regionsCount / 2 && $scope.columns.length == 1) {
                            if ((currentCount > regionsCount / 3 && $scope.columns.length == 1) || 
                                (currentCount > regionsCount / 3 * 2 && $scope.columns.length == 2)){
                                currentColumn = [];
                                $scope.columns.push(currentColumn);
                            }
                        })
                        
                        // $scope.columns = [
                        //     blocks.slice(0, 7),
                        //     blocks.slice(7, blocks.length)
                        // ]
                        
                        // function prepareColumns(columnsCount) {
                        //     var count = blocks.length;
                        //     var columns = [];
                        //     for (var col=1; col <= columnsCount; col++){
                        //         columns.push(blocks.slice(Math.ceil(count/columnsCount*(col-1)), Math.ceil(count/columnsCount*col)));
                        //     }
                        //     return columns;
                        // }
                        
                        function getBlock(char) {
                            var filtered = regions.filter(function(region){
                                return region.name.charAt(0).toUpperCase() == char &&
                                    priorityRegions.indexOf(region.id) < 0;
                            }).sort(function(region1, region2){
                                return region1.name > region2.name;
                            });
                            
                            var block = {
                                char: char,
                                regions: filtered
                            }
                            
                            return block;
                        }
                    }
                   
                    
                   // переопределяем setParams
            // 		var parentSetParams = $scope.setParams;
            // 		$scope.setParams = function(params){
            // 			parentSetParams(params);
            // 			$scope.prepareRegions();
            // 		}
                    
                }]
        };
    }
}());
