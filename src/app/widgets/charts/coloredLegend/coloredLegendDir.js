(function () {
    "use strict";
    /**
     * @desc
     * @example
     */
    angular.module('SportsensusApp')
        .directive('coloredLegendDir', coloredLegendDir);

    coloredLegendDir.$inject = [
        '$rootScope'
    ];

    function coloredLegendDir(
        $rootScope
    )    {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                // columnsLayout: '=',
                // selectable: '=?'
                items: '=', 
                //size: '=?', // внешний диаметр бублика. Def = 200
                //percentageInnerCutout: '=?', // размер внутреннего выреза, в процентах
                // align: '=?', // выравнивание начала графиков (left | right). Def = left
                // showAsLegend: '=?', // показывать график как легенду (все бары одинаковой ширины). Def = false
                // maxBarWidth: '=?', // максимальная ширина бара. Def = 300
                // barHeight: '=?', // высота бара. Def =
                //segmentsGap: '=?' // зазор между сегментами, рад
                // barsHorisontalGap: '=?', // вертикальный зазор между барами
                // barsVerticalGap: '=?', // вертикальный зазор между барами
                // leftTextClass: '=?', // класс для текста слева от бара
                // rightTextClass: '=?', // класс для текста справа от бара
                
            },
            templateUrl: '/views/widgets/charts/coloredLegend/coloredLegend.html',
            link: function ($scope, $el, attrs) {
                
            },

            controller: [
                '$scope',
                function(
                    $scope
                ) {
                    $scope.$watch('items', function(){
                        if (!$scope.items) return;
                        
                        // $scope.size = 450; //angular.isDefined($scope.size) ? $scope.size : 450;
                        // $scope.percentageInnerCutout = angular.isDefined($scope.percentageInnerCutout) ? $scope.percentageInnerCutout : 75;
                        // $scope.segmentsGap = angular.isDefined($scope.segmentsGap) ? $scope.percentageInnerCutout : 0.02;
                        
                        prepareData();
                    });
                    
                    
                    function prepareData(){
                        
                        
                        
                        // клонируем группы, находим самую большую
                        var drawedItems = $scope.items.map(function(_item){
                            var item = angular.copy(_item);
                            //item.value = group.bars.reduce(function(summ, bar){ return summ + bar.value; }, 0);
                            // maxGroupValue = Math.max(maxGroupValue, group.value);
                            item.caption = item.text; 
                            // item.value = item.valueText;
                            item.pointStyle = {
                                backgroundColor: item.color
                            }
                            return item;
                        });
                        
                        $scope.drawedItems = drawedItems;
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
