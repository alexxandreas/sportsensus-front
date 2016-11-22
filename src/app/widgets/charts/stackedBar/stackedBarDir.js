(function () {
    "use strict";
    /**
     * @desc
     * @example
     */
    angular.module('SportsensusApp')
        .directive('stackedBarDir', stackedBarDir);

    stackedBarDir.$inject = [
        '$rootScope'
    ];

    function stackedBarDir(
        $rootScope
    )    {
        return {
            restrict: 'E',
            scope: {
                chart: '='
            },
            templateUrl: '/views/widgets/charts/stackedBar/stackedBar.html',
            link: function ($scope, $el, attrs) {
                $scope.el = $el;
                $scope.tooltipEl = $el.find('div');
                $scope.$watch('chart', $scope.redrawChart);
            },
            replace: true,
            controller: [
                '$scope',
                function(
                    $scope
                ){


                    $scope.redrawChart = function(){
                        if ($scope.chartObj){
                            $scope.chartObj.clear();
                            $scope.chartObj.destroy();
                        }
                        if (!$scope.chart || !$scope.chart.data || !$scope.chart.options) {
                            return;
                        }

                        var chartData = $scope.chart.data;
                        var chartOptions = $scope.chart.options || {};
                        
                        
                        var ctx = $scope.el.find('canvas')[0].getContext("2d");
                        $scope.chartObj = new Chart(ctx).StackedBar(chartData, angular.extend({
                            showLabels: false,
                            showTooltips: true,
                            stacked: true,
                            barWidth: 30,
                            barHeight: 100,
                            padding: 20,
                            barValueSpacing: 20,
                            //scaleLabel: "<%=value%>M",
                            scaleLabel: function(obj){
                                return obj.value > 1000*1000 ? obj.value/1000/1000+'M' : obj.value > 1000 ? obj.value/1000+'K' : obj.value;
                            },
                            customTooltips:customTooltips,
                            multiTooltipTemplate: function(bar){
                                //return '<div class="line"><div class="color" style="background-color:'+ bar.fillColor+';"></div><b>'+bar.label + ': </b>' + bar.value.toLocaleString('en-US')+'</div>';
                                return '<div class="line"><div class="color" style="background-color:'+ bar.fillColor+';"></div><span>' + bar.label + '</span></div>';
                            },
                            //customTooltips:customTooltips,
                            tooltipHideZero: true,
                            maintainAspectRatio: false
                            //responsive: true
                            //barStrokeWidth: 40
                            //barValueSpacing: 40
                        }, chartOptions));


                        function customTooltips(tooltip) {
                            $scope.$apply(function(){
                                var tooltipEl = $scope.tooltipEl;

                                if (!tooltip) {
                                    $scope.tooltipVisible = false;
                                    return;
                                }
                                $scope.tooltipVisible = true;

                                var innerHtml = tooltip.labels.join('');
                                tooltipEl.html(innerHtml);

                                tooltipEl.css({
                                    //opacity: 1,
                                    left: tooltip.chart.canvas.offsetLeft + tooltip.x + 'px',
                                    top: tooltip.chart.canvas.offsetTop + tooltip.y + 'px',
                                    fontFamily: tooltip.fontFamily,
                                    fontSize: tooltip.fontSize,
                                    fontStyle: tooltip.fontStyle
                                });
                            })
                        }
                        
                    }

                }]
        };
    }
}());