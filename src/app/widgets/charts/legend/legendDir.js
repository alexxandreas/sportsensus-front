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
                columnsCount: '@'
            },
            templateUrl: '/views/widgets/charts/legend/legend.html',
            link: function ($scope, $el, attrs) {},

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
                    // $scope.legend = [{
                    //     name: 'text1',
                    //     color: "#ffcc00"
                    // },{
                    //     name: 'text2',
                    //     color: "#66ff33"
                    // },{
                    //     name: 'text3',
                    //     color: "#cc33ff"
                    // }];
                    
                    $scope.itemClick = function(item){
                        item.selected = !item.selected;
                    }
                }]
        };
    }
}());