(function () {
    "use strict";
    /**
     * @desc
     * @example
     */
    angular.module('SportsensusApp')
        .directive('horisontalBarDir', horisontalBarDir);

    horisontalBarDir.$inject = [
        '$rootScope'
    ];

    function horisontalBarDir(
        $rootScope
    )    {
        return {
            restrict: 'E',
            scope: {
                chart: '='
            },
            templateUrl: '/views/widgets/charts/horisontalBar/horisontalBar.html',
            link: function ($scope, $el, attrs) {
                $scope.el = $el;
                $scope.tooltipEl = $el.find('div');
                // $scope.draw1();
                // $scope.draw2();
                // $scope.draw3();
                // $scope.draw4();
                $scope.$watch('chart', $scope.redrawChart);
            },
            replace: true,
            controller: [
                '$scope',
                function(
                    $scope
                ){








                    var randomScalingFactor = function(invert, max){
                        return Math.round(Math.random()*(max || 1000000)) * (invert ? -1 : 1);
                    };

                    var colorGenerator = d3.scale.category10();
                    var colors = [0,1,2,3,4,5,6].map(function(item){
                        return colorGenerator(item);
                    });

                    var data1 = [randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor()];
                    var data3 = [randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor()];
                    // var data2 = [randomScalingFactor(true, 4000),randomScalingFactor(true, 4000),randomScalingFactor(true, 4000),randomScalingFactor(true),randomScalingFactor(true),randomScalingFactor(true),randomScalingFactor(true)];
                    var data2 = [randomScalingFactor(true),randomScalingFactor(true),randomScalingFactor(true),randomScalingFactor(true),randomScalingFactor(true),randomScalingFactor(true),randomScalingFactor(true)];

                    var label1 = data1.map(function(item){return '!'+item + '%'});
                    var label2 = data2.map(function(item){return '!'+item + '%'});

                    $scope.draw1 = function(){

                        var barChartData = {
                            labels : ["January","February","March","April","May","June","July"],
                            datasets : [
                                {
                                    //fillColor : "rgba(220,220,220,0.5)",
                                    fillColor : colors,
                                    //strokeColor : "rgba(220,220,220,0.8)",
                                    //highlightFill: "rgba(220,220,220,0.75)",
                                    //highlightStroke: "rgba(220,220,220,1)",
                                    data : data1
                                },
                                {
                                    //fillColor : "rgba(151,187,205,0.5)",
                                    fillColor : colors,
                                    //strokeColor : "rgba(151,187,205,0.8)",
                                    //highlightFill : "rgba(151,187,205,0.75)",
                                    //highlightStroke : "rgba(151,187,205,1)",
                                    data : data3
                                    // data : [
                                    //     randomScalingFactor(true),
                                    //     randomScalingFactor(true),
                                    //     randomScalingFactor(true),
                                    //     randomScalingFactor(true),
                                    //     randomScalingFactor(true),
                                    //     randomScalingFactor(true),
                                    //     randomScalingFactor(true)
                                    //     ]
                                }
                            ]
                        };

                        var ctx = $scope.el.find('canvas')[0].getContext("2d");
                        var chart = new Chart(ctx).HorizontalBar(barChartData, {
                            responsive: false,
                            barShowStroke: true,
                            scaleBeginAtZero: true,
                            //scaleShowGridLines : false,
                            //scaleShowHorizontalLines: false,
                            barWidth: 30,
                            barHeight: 300,
                            barValueSpacing: 20,
                            barDatasetSpacing: 10,
                            //padding: 10
                            //Boolean - Whether to show vertical lines (except Y axis)
                            //scaleShowVerticalLines: false,
                            //barValueSpacing : -10,
                            //barDatasetSpacing : -10
                        });

                    };

                    $scope.draw2 = function(){
                        var barChartData = {
                            //labels : ["January","February","March","April","May","June","July"],
                            labels : ["","","","","","",""],
                            datasets : [
                                {
                                    //fillColor : "rgba(220,220,220,0.5)",
                                    fillColor : colors,
                                    label: label1,
                                    //strokeColor : "rgba(220,220,220,0.8)",
                                    //highlightFill: "rgba(220,220,220,0.75)",
                                    //highlightStroke: "rgba(220,220,220,1)",
                                    data : data1
                                }
                            ]
                        };

                        var ctx = $scope.el.find('canvas')[2].getContext("2d");
                        var chart = new Chart(ctx).HorizontalBar(barChartData, {
                            responsive: false,
                            barShowStroke: true,
                            scaleBeginAtZero: true,
                            scaleShowGridLines : false,
                            scaleShowHorizontalLines: false,
                            barWidth: 30,
                            barHeight: 300,
                            barValueSpacing: 20,
                            //Boolean - Whether to show vertical lines (except Y axis)
                            scaleShowVerticalLines: false,
                            //barValueSpacing : -10,
                            //barDatasetSpacing : -10
                        });

                    };

                    $scope.draw3 = function(){
                        var barChartData = {
                            labels : ["January","February","March","April","May","June","July"],
                            datasets : [
                                {
                                    //fillColor : "rgba(220,220,220,0.5)",
                                    fillColor : colors,
                                    //strokeColor : "rgba(220,220,220,0.8)",
                                    //highlightFill: "rgba(220,220,220,0.75)",
                                    //highlightStroke: "rgba(220,220,220,1)",
                                    data : data1
                                }
                            ]
                        };

                        var ctx = $scope.el.find('canvas')[3].getContext("2d");
                        var chart = new Chart(ctx).HorizontalBar(barChartData, {
                            responsive: false,
                            barShowStroke: true,
                            scaleBeginAtZero: true,
                            scaleShowGridLines : false,
                            scaleShowHorizontalLines: false,
                            barWidth: 30,
                            barHeight: 300,
                            barValueSpacing: 20,
                            //Boolean - Whether to show vertical lines (except Y axis)
                            scaleShowVerticalLines: false,
                            //barValueSpacing : -10,
                            //barDatasetSpacing : -10
                        });

                    };

                    $scope.draw4 = function(){
                        var barChartData = {
                            //labels : ["Januaryyyyyyyyyy","February","March","April","May","June","July"],
                            labels : ["","","","","","",""],
                            datasets : [
                                {
                                    //fillColor : "rgba(220,220,220,0.5)",
                                    fillColor : colors,
                                    label: label1,
                                    //strokeColor : "rgba(220,220,220,0.8)",
                                    //highlightFill: "rgba(220,220,220,0.75)",
                                    //highlightStroke: "rgba(220,220,220,1)",
                                    data : data1
                                },
                                {
                                    //fillColor : "rgba(220,220,220,0.5)",
                                    fillColor : colors,
                                    label: label2,
                                    //strokeColor : "rgba(220,220,220,0.8)",
                                    //highlightFill: "rgba(220,220,220,0.75)",
                                    //highlightStroke: "rgba(220,220,220,1)",
                                    data : data2
                                }
                            ]
                        };

                        var ctx = $scope.el.find('canvas')[4].getContext("2d");
                        var chart = new Chart(ctx).HorizontalBar(barChartData, {
                            responsive: false,
                            barShowStroke: true,
                            scaleBeginAtZero: false,
                            //scaleShowGridLines : false,
                            //scaleShowHorizontalLines: false,
                            barWidth: 30,
                            barHeight: 500,
                            barValueSpacing: 20,
                            showHorisontalSerifs: false,
                            barsInOneLine: true,
                            scaleLabel: function(obj){
                                var value = Math.abs(obj.value);
                                return value > 1000*1000 ? value/1000/1000+'M' : value > 1000 ? value/1000+'K' : value;
                            },
                            showLabels: $scope.formatValue,
                            //padding: 40,
                            //Boolean - Whether to show vertical lines (except Y axis)
                            scaleShowVerticalLines: false,
                            //barValueSpacing : -10,
                            //barDatasetSpacing : -10
                        });

                    };


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
                        $scope.chartObj = new Chart(ctx).HorizontalBar(chartData, angular.extend({
                            showLabels: false,
                            showTooltips: true,
                            stacked: true,
                            barWidth: 30,
                            barHeight: 400,
                            padding: 20,
                            barValueSpacing: 20,
                            //scaleLabel: "<%=value%>M",

                            customTooltips:customTooltips,
                            multiTooltipTemplate: function(bar){
                                //return '<div class="line"><div class="color" style="background-color:'+ bar.fillColor+';"></div><b>'+bar.label + ': </b>' + bar.value.toLocaleString('en-US')+'</div>';
                                return '<div class="line"><div class="color" style="background-color:'+ bar.fillColor+';"></div><span>' + bar.label + '</span></div>';
                            },
                            tooltipHideZero: true,
                            maintainAspectRatio: false,


                            responsive: false,
                            barShowStroke: true,
                            scaleBeginAtZero: true,
                            //scaleShowGridLines : false,
                            //scaleShowHorizontalLines: false,
                            showHorisontalSerifs: false,
                            barsInOneLine: true,
                            //stacked:true,
                            scaleLabel: function(obj){
                                var value = Math.abs(obj.value);
                                return value > 1000*1000 ? value/1000/1000+'M' : value > 1000 ? value/1000+'K' : value;
                            },
                            //showLabels: $scope.formatValue,
                            //padding: 40,
                            //Boolean - Whether to show vertical lines (except Y axis)
                            scaleShowVerticalLines: false
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

                    };

                    $scope.formatValue = function(value){
                        //value = value * 1000*1000;
                        var multiplier = value > 1000*1000 ? 1000*1000 : value > 1000 ? 1000 : 1;
                        //if (value > 1000*1000) multiplier = 1000*1000;
                        //else if (value > 1000) multiplier = 1000;
                        value = value / multiplier;
                        value = value >= 100 ? Math.round(value) : value > 10 ? Math.round(value * 10) / 10 : Math.round(value * 100) / 100;
                        //if (value >= 100) value = Math.round(value);
                        //else if (value > 10) value = Math.round(value * 10) / 10;
                        //else value = Math.round(value * 100) / 100;
                        return value + (multiplier == 1000*1000 ? 'M' : multiplier == 1000 ? 'K' : '');
                    }
                }]
        };
    }
}());