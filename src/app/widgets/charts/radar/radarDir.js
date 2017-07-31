(function () {
    "use strict";
    /**
     * @desc
     * @example
     */
    angular.module('SportsensusApp')
        .directive('radarDir', radarDir);

    radarDir.$inject = [
        '$rootScope'
    ];

    function radarDir(
        $rootScope
    )    {
        return {
            restrict: 'E',
            scope: {
                chart: '='
            },
            templateUrl: '/views/widgets/charts/radar/radar.html',
            link: function ($scope, $el, attrs) {
                $scope.el = $el;
                $scope.$watch('chart', $scope.redrawChart);
            },

            controller: [
                '$scope',
                function(
                    $scope
                ){

                    
                    $scope.redrawChart = function(){
                        if (!$scope.chart || !$scope.chart.data || !$scope.chart.options) {
                            $scope.el.empty();
                            return;
                        }

                        var margin = {top: 50, right: 120, bottom: 100, left: 120};
                        var width = 700 - margin.left - margin.right;
                        var height = 700 - margin.top - margin.bottom;

                        
                        var options = {
                            w: width,
                            h: height,
                            margin: margin
                        };
                        options = angular.extend({},$scope.chart.options, options);
                        
                        RadarChart($scope.el[0], $scope.chart.data, options);
                    }
                    
                }]
        };
    }
}());