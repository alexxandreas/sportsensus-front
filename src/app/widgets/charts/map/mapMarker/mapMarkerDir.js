(function () {
    "use strict";
    /**
     * @desc
     * @example
     */
    angular.module('SportsensusApp')
        .directive('mapMarkerDir', mapMarkerDir);

    mapMarkerDir.$inject = [
        '$rootScope',
        '$timeout'
    ];

    function mapMarkerDir(
        $rootScope,
        $timeout
    )    {
        return {
            restrict: 'E',
            scope: {
                //legend: '=',
                //columnsCount: '@',
                //selectable: '=?'
                color: '@',
                progress: '@',
                region: '@',
                count: '@',
                
                footer: '@',
                header: '@'
            },
            templateUrl: '/views/widgets/charts/map/mapMarker/mapMarker.html',
            link: function ($scope, $el, attrs) {
                //if (angular.isUndefined($scope.selectable))
                //   $scope.selectable = true;
                $scope.el = $el;

                //$scope.redrawChart();


                $scope.$watch('header', $scope.redrawTO);

                $scope.$watch('progress', function(){
                    if (typeof $scope.progress != "number" && $scope.progress != '' && $scope.progress != '0'){
                        $scope.realProgress = Number.parseFloat($scope.progress) || 0;
                        $scope.header = Math.round($scope.progress * 10)/10 + '%';
                        $scope.progress = 0;

                        // if (!$scope.redrawWatcher)
                        //     $scope.redrawWatcher = $scope.$watch('realProgress', $scope.redrawTO);
                    }
                    //$scope.redrawChart();
                });


                
                
                //$scope.progress = 30;

                $scope.$watch('color', function(value){
                    if ($scope.color != 'green') {
                        $scope.color = 'blue';
                    }
                });

                $scope.$watch('count', function(value){
                    var count = Number.parseFloat($scope.count) || 0;
                    $scope.countText = count.toLocaleString();
                });

            },

            controller: [
                '$scope',
                '$routeParams',
                '$location',
                '$interval',
                '$timeout',
                '$window',
                'ApiSrv',
                function(
                $scope,
                $routeParams,
                $location,
                $interval,
                $timeout,
                $window,
                ApiSrv
                ){


                    $scope.redrawTO = function(){
                        $timeout($scope.redrawChart, 200);
                    };

                    $scope.redrawChart = function() {
                        //return;
                        var canvas = $scope.el.find('canvas')[0];
                        // if ($scope.chartObj) {
                        //     $scope.chartObj.clear();
                        //     $scope.chartObj.destroy();
                        //     $scope.chartObj = null;
						//
                        //     canvas.width = 105;
                        //     canvas.height = 105;
                        // }
                        if (!$scope.realProgress) return;

                        var ctx = canvas.getContext("2d");

                        var chartOptions = {
                            percentageInnerCutout: 92,
                            segmentShowStroke: false
                        };
                        var chartData = [{
                            label: '1 ',
                            //legend: 'Владеют',
                            color: "#ffffff",
                            value: $scope.realProgress
                        },{
                            label: '2 ',
                            //legend: 'Не владеют',
                            color: "#4CB7AE",
                            value: 50//100 - $scope.realProgress
                        }];

                        if (!$scope.chartObj)
                            $scope.chartObj = new Chart(ctx).Doughnut(chartData, chartOptions);
                        else {
                            $scope.chartObj.segments[0].value = $scope.realProgress;
                            $scope.chartObj.segments[1].value = 100 - $scope.realProgress;
                            $scope.chartObj.update();
                        }

                    };


                    
                    // $interval(function() {
                    //     $scope.progress = ($scope.progress < 100 ? $scope.progress+1 : 0);
                    // }, 100);
                    
                    //$scope.$watch('legend', function(){
                    //});

                    $scope.toggleColor = function(){
                        if ($scope.color == 'blue')
                            $scope.color = 'green';
                        else $scope.color = 'blue';
                    }
                    
                }]
        };
    }
}());