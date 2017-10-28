(function () {
    "use strict";
    /**
     * @desc
     * @example
     */
    angular.module('SportsensusApp')
        .directive('doughnutChartDir', doughnutChartDir);

    doughnutChartDir.$inject = [
        '$rootScope'
    ];

    function doughnutChartDir(
        $rootScope
    )    {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                // columnsLayout: '=',
                // selectable: '=?'
                data: '=', 
                //size: '=?', // внешний диаметр бублика. Def = 200
                percentageInnerCutout: '=?', // размер внутреннего выреза, в процентах
                // align: '=?', // выравнивание начала графиков (left | right). Def = left
                // showAsLegend: '=?', // показывать график как легенду (все бары одинаковой ширины). Def = false
                // maxBarWidth: '=?', // максимальная ширина бара. Def = 300
                // barHeight: '=?', // высота бара. Def =
                segmentsGap: '=?' // зазор между сегментами, рад
                // barsHorisontalGap: '=?', // вертикальный зазор между барами
                // barsVerticalGap: '=?', // вертикальный зазор между барами
                // leftTextClass: '=?', // класс для текста слева от бара
                // rightTextClass: '=?', // класс для текста справа от бара
                
            },
            templateUrl: '/views/widgets/charts/doughnutChart/doughnutChart.html',
            link: function ($scope, $el, attrs) {
                
            },

            controller: [
                '$scope',
                function(
                    $scope
                ) {
                    $scope.$watch('data', function(){
                        if (!$scope.data) return;
                        
                        $scope.size = 450; //angular.isDefined($scope.size) ? $scope.size : 450;
                        $scope.percentageInnerCutout = angular.isDefined($scope.percentageInnerCutout) ? $scope.percentageInnerCutout : 75;
                        $scope.segmentsGap = angular.isDefined($scope.segmentsGap) ? $scope.percentageInnerCutout : 0.04;
                        
                        prepareData();
                    });
                    
                    
                    function prepareData(){
                        var maxGroupValue = 0;
                        var itemsCount = $scope.data.items.length;
                        var segmentsGap =  itemsCount > 1 ? $scope.segmentsGap : 0;
                        var allSegmentsGap = segmentsGap * itemsCount;
                        var summValue = $scope.data.items.reduce(function(summ, item){ return summ + item.value; }, 0.0001);
                        
                        var size = $scope.size;
                        var doughnutRadius = size / 2;
                        var startRadius = -Math.PI / 2;
                        var percentageInnerCutout = 75;
                        var cutoutRadius = doughnutRadius * ($scope.percentageInnerCutout / 100)
                        
                        
                        // клонируем группы, находим самую большую
                        var drawedItems = $scope.data.items.map(function(_item){
                            var item = angular.copy(_item);
                            
                            var segmentAngle = (item.value / summValue) * (Math.PI * 2 - allSegmentsGap),
                                endRadius = startRadius + segmentAngle,
                                largeArc = ((endRadius - startRadius) % (Math.PI * 2)) > Math.PI ? 1 : 0,
                                startX = doughnutRadius + Math.cos(startRadius) * doughnutRadius,
                                startY = doughnutRadius + Math.sin(startRadius) * doughnutRadius,
                                endX2 = doughnutRadius + Math.cos(startRadius) * cutoutRadius,
                                endY2 = doughnutRadius + Math.sin(startRadius) * cutoutRadius,
                                endX = doughnutRadius + Math.cos(endRadius) * doughnutRadius,
                                endY = doughnutRadius + Math.sin(endRadius) * doughnutRadius,
                                startX2 = doughnutRadius + Math.cos(endRadius) * cutoutRadius,
                                startY2 = doughnutRadius + Math.sin(endRadius) * cutoutRadius;
                            var cmd = [
                              'M', startX, startY,//Move pointer
                              'A', doughnutRadius, doughnutRadius, 0, largeArc, 1, endX, endY,//Draw outer arc path
                              'L', startX2, startY2,//Draw line path(this line connects outer and innner arc paths)
                              'A', cutoutRadius, cutoutRadius, 0, largeArc, 0, endX2, endY2,//Draw inner arc path
                              'Z'//Cloth path
                            ];
                            item.d = cmd.join(' ');
                            startRadius += segmentAngle + segmentsGap;
                            
                            return item;
                        });
                        
                        $scope.dataForRender = {
                            items: drawedItems
                        }
                    }
                    
                    

                    // $scope.data = {
                    //     items: [{
                    //         value: 100,
                    //         color: '#fc4a1a',
                    //         text: 'text100'
                    //     },{
                    //         value: 150,
                    //         color: '#4b78bf',
                    //         text: 'text150'
                    //     },{
                    //         value: 30,
                    //         color: '#ff9750',
                    //         text: 'text30'
                    //     },{
                    //         value: 56,
                    //         color: '#af9d94',
                    //         text: 'text56'
                    //     }, {
                    //         value: 83,
                    //         color: '#86cfe2',
                    //         text: 'text83'
                    //     }]
                    // };
                    
                    // $scope.data = {
                    //     items: [{
                    //         value: 100,
                    //         color: '#fc4a1a',
                    //         text: 'text100'
                    //     }]
                    // };
                    
                } // end of controller
            ]
        };
    }
}());
