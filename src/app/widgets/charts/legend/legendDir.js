(function () {
    "use strict";
    /**
     * @desc
     * @example
     */
    angular.module('SportsensusApp')
        .directive('legendDir', legendDir);

    legendDir.$inject = [
        '$rootScope'
    ];

    function legendDir(
        $rootScope
    )    {
        return {
            restrict: 'E',
            scope: {
                legend: '=',
                columnsCount: '@',
                selectable: '=?',
                highlightable: '=?',
                selectedColor: '=?',
                highlightedColor: '=?',
                disabled: '=?'
            },
            templateUrl: '/views/widgets/charts/legend/legend.html',
            link: function ($scope, $el, attrs) {
                //if (angular.isUndefined($scope.selectable))
                //   $scope.selectable = true;
            },

            controller: [
                '$scope',
                '$routeParams',
                '$location',
                '$window',
                'ApiSrv',
                function(
                    $scope
                ){

                    
                    $scope.legends = [];
                    $scope.$watch('legend', function(){
                        if (!$scope.legend || !$scope.legend.length) return;
                        $scope.columnsCount = Number.parseInt($scope.columnsCount) || 1;
                        var count = $scope.legend.length;
                        for (var col=1; col <= $scope.columnsCount; col++){
                            $scope.legends.push($scope.legend.slice(Math.ceil(count/$scope.columnsCount*(col-1)),Math.ceil(count/$scope.columnsCount*col)));
                        }
                    });

                    $scope.getPointStyles = function(item){
                        var selectedColor = item.selected || !$scope.selectable ? ($scope.selectedColor || item.color || item.chartColor) : null;
                        var highlightedColor = item.highlighted && $scope.highlightable ? ($scope.highlightedColor || item.color || item.chartColor) : null;
                        
                        // if (highlightedColor)
                        //     return  {'background-color': highlightedColor};
                        // else if (selectedColor)
                        //     return  {'background-color': selectedColor};
                        if (selectedColor)
                            return  {'background-color': selectedColor};
                        else if (highlightedColor)
                            return  {'background-color': highlightedColor};
                        else 
                            return {'background-color': 'none'};
                        
                        //        return {'background-color': item.selected || !selectable ? (item.color || item.chartColor) : 'none'}
                    };

                    $scope.getParam = function(param){
                      return $scope[param];
                    };


                    
                    $scope.itemClick = function(item){
                        item.selected = !item.selected;
                    };

                    $scope.highlightItem = function(item){
                        item.highlighted = true;
                    };
                    $scope.unhighlightItem = function(item){
                        item.highlighted = false;
                    };

                }]
        };
    }
}());