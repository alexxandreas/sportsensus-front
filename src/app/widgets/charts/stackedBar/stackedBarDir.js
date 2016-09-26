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
                $scope.$watch('chart', $scope.redrawChart);
            },
            replace: true,
            controller: [
                '$scope',
                function(
                    $scope
                ){


                    $scope.redrawChart = function(){
                        //$scope.el.empty();
                        if ($scope.chartObj){
                            $scope.chartObj.clear();
                            $scope.chartObj.destroy();
                            //delete $scope.chartObj;
                        }
                        if (!$scope.chart || !$scope.chart.data || !$scope.chart.options) {
                            //$scope.el.empty();
                            return;
                        }

                        var chartData = $scope.chart.data;
                        var chartOptions = $scope.chart.options || {};
                        // var chartData = {
                        //     labels: ["Не интересен", "Интересен"],
                        //     //labels: ["", ""],
                        //     datasets: [
                        //         {
                        //             //label: "Совершенно неинтересен",
                        //             label: ["Совершенно неинтересен", "Скорее неинтересен"],
                        //             fillColor: ["#FF6384", "#FFCE56"],
                        //             data: [60, 80]
                        //         },
                        //         {
                        //             //label: "Скорее неинтересен",
                        //             label: ["Скорее интересен", "Очень интересен"],
                        //             fillColor: ["#37E9ED","#4BC0C0"],
                        //             data: [56, 31]
                        //         }
                        //     ]
                        // };
                        //var ctx = document.getElementById("myChart1").getContext("2d");
                        var ctx = $scope.el.find('canvas')[0].getContext("2d");
                        $scope.chartObj = new Chart(ctx).StackedBar(chartData, angular.extend({
                            showLabels: false,
                            showTooltips: true,
                            stacked: true,
                            //customTooltips:customTooltips,
                            tooltipHideZero: true,
                            maintainAspectRatio: false,
                            responsive: true
                            //barStrokeWidth: 40
                            //barValueSpacing: 40
                        }, chartOptions));

                        function customTooltips(tooltip) {
                            //var tooltipEl = $('#chartjs-tooltip');
                            var tooltipEl = angular.element(document.querySelector( '#chartjs-tooltip' ));

                            if (!tooltip) {
                                tooltipEl.css({ opacity: 0});
                                //tooltipEl.style.opacity = 0;
                                return;
                            }

                            tooltipEl.removeClass('above below');
                            tooltipEl.addClass(tooltip.yAlign);

                            // split out the label and value and make your own tooltip here
                            //var parts = tooltip.text.split(":");
                            //var innerHtml = '<span>' + parts[0].trim() + '</span> : <span><b>' + parts[1].trim() + '</b></span>';
                            var innerHtml = '12345';
                            tooltipEl.html(innerHtml);

                            tooltipEl.css({
                                opacity: 1,
                                left: tooltip.chart.canvas.offsetLeft + tooltip.x + 'px',
                                top: tooltip.chart.canvas.offsetTop + tooltip.y + 'px',
                                fontFamily: tooltip.fontFamily,
                                fontSize: tooltip.fontSize,
                                fontStyle: tooltip.fontStyle
                            });
                        }

                    }

                }]
        };
    }
}());