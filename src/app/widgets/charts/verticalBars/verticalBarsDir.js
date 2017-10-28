(function () {
    "use strict";
    /**
     * @desc
     * @example
     */
    angular.module('SportsensusApp')
        .directive('verticalBarsDir', verticalBarsDir);

    verticalBarsDir.$inject = [
        '$rootScope'
    ];

    function verticalBarsDir(
        $rootScope
    )    {
        return {
            restrict: 'E',
            scope: {
                // columnsLayout: '=',
                // selectable: '=?'
                data: '=?', 
                //align: '=?', // выравнивание начала графиков (left | right). Def = left
                //showAsLegend: '=?', // показывать график как легенду (все бары одинаковой ширины). Def = false
                maxBarHeight: '=?', // максимальная ширина бара. Def = 200
                barWidth: '=?', // высота бара. Def = 17
                barsHorisontalGap: '=?', // вертикальный зазор между барами
                barsVerticalGap: '=?', // вертикальный зазор между барами
                topTextClass: '=?', // класс для текста слева от бара
                bottomTextClass: '=?', // класс для текста справа от бара
                
            },
            templateUrl: '/views/widgets/charts/verticalBars/verticalBars.html',
            link: function ($scope, $el, attrs) {
                
            },

            controller: [
                '$scope',
                function(
                    $scope
                ) {
                    $scope.$watch('data', function(){
                        if (!$scope.data) return;
                        
                        // if (['left', 'right'].indexOf($scope.align) < 0){
                        //     $scope.align = 'left';
                        // }
                        
                        // if (!($scope.showAsLegend instanceof Boolean)) {
                        //     $scope.showAsLegend = false;
                        // }
                        
                        $scope.maxBarHeight = $scope.maxBarHeight || 200;
                        $scope.barWidth = $scope.barWidth || 17;
                        // $scope.barWidth = $scope.barWidth || 35;
                        
                        $scope.barsHorisontalGap = angular.isDefined($scope.barsHorisontalGap) ? $scope.barsHorisontalGap : 14;
                        $scope.barsVerticalGap = angular.isDefined($scope.barsVerticalGap) ? $scope.barsVerticalGap : 1;
                        
                        prepareData();
                    });
                    
                    
                    function prepareData(){
                        var maxGroupValue = 0;
                        
                        // пришли единичные айтемы, групп нет
                        if ($scope.data.items && !$scope.data.groups){
                            var groups = $scope.data.items.map(function(item){
                                var group = angular.copy(item);
                                group.bars = [{
                                    value: item.value,
                                    color: item.color
                                }]
                                return group;
                            })
                        } else {
                            var groups = $scope.data.groups;
                        }
                        // клонируем группы, находим самую большую
                        var drawedGroups = groups.map(function(gr){
                            var group = angular.copy(gr);
                            group.value = group.bars.reduce(function(summ, bar){ return summ + bar.value; }, 0);
                            maxGroupValue = Math.max(maxGroupValue, group.value);
                            
                            return group;
                        });
                        
                        // рассчитываем размеры для каждого бара
                        drawedGroups.forEach(function(group, groupIndex){
                            group.style = {
                                'margin-left': groupIndex == 0 ? 0 : ($scope.barsHorisontalGap + 'px'),
                                'width': $scope.barWidth + 'px',
                                'line-height': $scope.barWidth + 'px'
                            };
                            group.bars.forEach(function(bar, barIndex){
                                bar.style = {
                                    'height': bar.value / maxGroupValue * $scope.maxBarHeight + 'px',
                                    'width': $scope.barWidth + 'px',
                                    'backgroundColor': bar.color,
                                    'margin-top': barIndex == 0 ? 0 : ($scope.barsVerticalGap + 'px')
                                }
                                // bar.style['margin-' + $scope.align] = barIndex == 0 ? 0 : ($scope.barsHorisontalGap + 'px');
                            });
                            
                            // if ($scope.align == 'right'){
                            //     group.bars.reverse();
                            // }
                        });
                        
                        $scope.dataForRender = {
                            groups: drawedGroups
                        }
                    }
                    
                    

                    // $scope.data = {
                    //     groups: [{ // одна группа блоков, расположенных в стек
                    //         topText: 'left1',
                    //         bottomText: 'right1',
                    //         bars: [{
                    //             value: 100,
                    //             color: '#fc4a1a',
                    //             text: 'text100'
                    //         }]
                    //         // text: 'обший text'
                    //     },{ // одна группа блоков, расположенных в стек
                    //         topText: 'left2',
                    //         bottomText: 'right2right2',
                    //         bars: [{
                    //             value: 150,
                    //             color: '#4b78bf',
                    //             text: 'text150'
                    //         }]
                    //         // text: 'обший text'
                    //     },{ // одна группа блоков, расположенных в стек
                    //         topText: 'left3',
                    //         bottomText: 'ri',
                    //         bars: [{
                    //             value: 30,
                    //             color: '#ff9750',
                    //             text: 'text30'
                    //         }]
                    //         // text: 'обший text'
                    //     },{ // одна группа блоков, расположенных в стек
                    //         topText: 'left4',
                    //         bottomText: 'right4right4right4',
                    //         bars: [{
                    //             value: 56,
                    //             color: '#af9d94',
                    //             text: 'text56'
                    //         }, {
                    //             value: 83,
                    //             color: '#86cfe2',
                    //             text: 'text83'
                    //         }]
                    //         // text: 'обший text'
                    //     }
                    //     ]
                    // };
                    
                    
                } // end of controller
            ]
        };
    }
}());
