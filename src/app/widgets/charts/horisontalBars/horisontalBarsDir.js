(function () {
    "use strict";
    /**
     * @desc
     * @example
     */
    angular.module('SportsensusApp')
        .directive('horisontalBarsDir', horisontalBarsDir);

    horisontalBarsDir.$inject = [
        '$rootScope'
    ];

    function horisontalBarsDir(
        $rootScope
    )    {
        return {
            restrict: 'E',
            scope: {
                // columnsLayout: '=',
                // selectable: '=?'
                data: '=', 
                align: '=?', // выравнивание начала графиков (left | right). Def = left
                showAsLegend: '=?', // показывать график как легенду (все бары одинаковой ширины). Def = false
                maxBarWidth: '=?', // максимальная ширина бара. Def = 200
                barHeight: '=?', // высота бара. Def = 17
                barsHorisontalGap: '=?', // вертикальный зазор между барами
                barsVerticalGap: '=?', // вертикальный зазор между барами
                leftTextClass: '=?', // класс для текста слева от бара
                rightTextClass: '=?', // класс для текста справа от бара
                
            },
            templateUrl: '/views/widgets/charts/horisontalBars/horisontalBars.html',
            link: function ($scope, $el, attrs) {
                
            },

            controller: [
                '$scope',
                function(
                    $scope
                ) {
                    $scope.$watch('data', function(){
                        if (!$scope.data) return;
                        
                        if (['left', 'right'].indexOf($scope.align) < 0){
                            $scope.align = 'left';
                        }
                        
                        if (!($scope.showAsLegend instanceof Boolean)) {
                            $scope.showAsLegend = false;
                        }
                        
                        $scope.maxBarWidth = $scope.maxBarWidth || 200;
                        $scope.barHeight = $scope.barHeight || 17;
                        // $scope.barHeight = $scope.barHeight || 35;
                        
                        $scope.barsHorisontalGap = angular.isDefined($scope.barsHorisontalGap) ? $scope.barsHorisontalGap : 1;
                        $scope.barsVerticalGap = angular.isDefined($scope.barsVerticalGap) ? $scope.barsVerticalGap : 14;
                        
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
                                'margin-top': groupIndex == 0 ? 0 : ($scope.barsVerticalGap + 'px'),
                                'height': $scope.barHeight + 'px',
                                'line-height': $scope.barHeight + 'px'
                            };
                            group.bars.forEach(function(bar, barIndex){
                                bar.style = {
                                    width: bar.value / maxGroupValue * $scope.maxBarWidth + 'px',
                                    height: $scope.barHeight + 'px',
                                    backgroundColor: bar.color
                                }
                                bar.style['margin-' + $scope.align] = barIndex == 0 ? 0 : ($scope.barsHorisontalGap + 'px');
                            });
                            
                            if ($scope.align == 'right'){
                                group.bars.reverse();
                            }
                        });
                        
                        $scope.dataForRender = {
                            groups: drawedGroups
                        }
                    }
                    
                    

                    // $scope.data = {
                    //     groups: [{ // одна группа блоков, расположенных в стек
                    //         leftText: 'left1',
                    //         rightText: 'right1',
                    //         bars: [{
                    //             value: 100,
                    //             color: '#fc4a1a',
                    //             text: 'text100'
                    //         }]
                    //         // text: 'обший text'
                    //     },{ // одна группа блоков, расположенных в стек
                    //         leftText: 'left2',
                    //         rightText: 'right2',
                    //         bars: [{
                    //             value: 150,
                    //             color: '#4b78bf',
                    //             text: 'text150'
                    //         }]
                    //         // text: 'обший text'
                    //     },{ // одна группа блоков, расположенных в стек
                    //         leftText: 'left3',
                    //         rightText: 'right3',
                    //         bars: [{
                    //             value: 30,
                    //             color: '#ff9750',
                    //             text: 'text30'
                    //         }]
                    //         // text: 'обший text'
                    //     },{ // одна группа блоков, расположенных в стек
                    //         leftText: 'left4',
                    //         rightText: 'right4',
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
