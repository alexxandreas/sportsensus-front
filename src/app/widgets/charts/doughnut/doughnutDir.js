(function () {
    "use strict";
    /**
     * @desc
     * @example
     */
    angular.module('SportsensusApp')
        .directive('doughnutDir', doughnutDir);

    doughnutDir.$inject = [
        '$rootScope'
    ];

    function doughnutDir(
        $rootScope
    )    {
        return {
            restrict: 'E',
            scope: {
                chart: '='
            },
            templateUrl: '/views/widgets/charts/doughnut/doughnut.html',
            link: function ($scope, $el, attrs) {
                $scope.el = $el;
                $scope.tooltipEl = $el.find('div');
                //$scope.draw();
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
                        if (!$scope.chart || !$scope.chart.chartData){//} || !$scope.chart.options) {
                            //$scope.el.empty();
                            return;
                        }
                        

                        var chartData = $scope.chart.chartData;
                        var chartOptions = $scope.chart.options || {};



                        var ctx = $scope.el.find('canvas')[0].getContext("2d");

                       
                        $scope.chartObj = new Chart(ctx).Doughnut(chartData, angular.extend({
                            /*showLabels: false,
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
                            
                            //customTooltips:customTooltips,
                            tooltipHideZero: true,
                            maintainAspectRatio: false
                            //responsive: true
                            //barStrokeWidth: 40
                            //barValueSpacing: 40*/
                            customTooltips:customTooltips,
                            tooltipTemplate: function(bar){
                                //return bar;
                                //return '<div class="line"><div class="color" style="background-color:'+ bar.fillColor+';"></div><b>'+bar.label + ': </b>' + bar.value.toLocaleString('en-US')+'</div>';
                                return '<div class="line"><div class="color" style="background-color:'+ bar.fillColor+';"></div><span>'+bar.label + '</span></div>';
                            }
                        }, chartOptions));

                        function customTooltips(tooltip) {
                            $scope.$apply(function () {
                                var tooltipEl = $scope.tooltipEl;

                                if (!tooltip) {
                                    //tooltipEl.css({ opacity: 0});
                                    $scope.tooltipVisible = false;
                                    return;
                                }
                                $scope.tooltipVisible = true;

                                //tooltipEl.removeClass('above below');
                                //tooltipEl.addClass(tooltip.yAlign);

                                var innerHtml = tooltip.text;
                                tooltipEl.html(innerHtml);

                                tooltipEl.css({
                                    //opacity: 1,
                                    left: tooltip.chart.canvas.offsetLeft + tooltip.x + 'px',
                                    top: tooltip.chart.canvas.offsetTop + tooltip.y + 'px',
                                    fontFamily: tooltip.fontFamily,
                                    fontSize: tooltip.fontSize,
                                    fontStyle: tooltip.fontStyle
                                });
                            });
                        }
                    }

                }]
        };
    }
}());