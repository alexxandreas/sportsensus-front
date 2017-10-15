(function () {
    "use strict";
    /**
     * @desc
     * @example
     */
    angular.module('SportsensusApp')
        .directive('infoboxSelectableListDir', infoboxSelectableList);

    infoboxSelectableList.$inject = [
        '$rootScope',
        '$mdMedia'
    ];

    function infoboxSelectableList(
        $rootScope,
        $mdMedia
    )    {
        return {
            restrict: 'E',
            scope: {
                //legend: '=',
                items: '=',
                //columnsCount: '@',
                /**
                 * xs	(max-width: 599px)
                 * gt-xs	(min-width: 600px)
                 * sm	(min-width: 600px) and (max-width: 959px)
                 * gt-sm	(min-width: 960px)
                 * md	(min-width: 960px) and (max-width: 1279px)
                 * gt-md	(min-width: 1280px)
                 * lg	(min-width: 1280px) and (max-width: 1919px)
                 * gt-lg	(min-width: 1920px)
                 * xl	(min-width: 1920px)
                 */
                columnsLayout: '=?',
                selectable: '=?',
                highlightable: '=?',
                selectedColor: '=?',
                highlightedColor: '=?',
                disabled: '=?',
                singleSelection: '=?',
                allSelected: '=?'
            },
            templateUrl: '/views/widgets/infobox/panels/selectableList/infoboxSelectableList.html',
            link: function ($scope, $el, attrs) {
                //if (angular.isUndefined($scope.selectable))
                //   $scope.selectable = true;
            },

            controller: [
                '$scope',
                '$routeParams',
                '$location',
                '$window',
                'ApiSrv',
                function(
                    $scope
                ){

                    
                    //$scope.legends = [];
                    
                    $scope.$watch('items', function(){
                        if (!$scope.items || !$scope.items.length) return;
                        //$scope.columnsCount = Number.parseInt($scope.columnsCount) || 1;
                        
                        var columnsLayout = $scope.columnsLayout || {'def':1};
                        
                        $scope.prepareLayouts(columnsLayout);
                    });
                    
                    $scope.$watch(updateLayoutsVisibility);
                    
                    function updateLayoutsVisibility(){
                        if (!$scope.layouts) return;
                        var defLayout = null;
                        var someLayoutVisible = false;
                        angular.forEach($scope.layouts, function(layout){
                            if (someLayoutVisible){
                                layout.visible = false;
                                return;
                            }
                            if (layout.layout == 'def'){
                                defLayout = layout;
                                defLayout.visible = false;
                                return;
                            }
                            layout.visible = $mdMedia(layout.layout);
                            someLayoutVisible = someLayoutVisible || layout.visible;
                        });
                        if (!someLayoutVisible && defLayout){
                            defLayout.visible = true;
                        }
                    }
                    /**
                     * columnsLayout={'xs':2, 'md':2, 'lg':4, 'gt-lg':5}
                     */
                    $scope.prepareLayouts = function(columnsLayout){
                        $scope.layouts = [];
                        angular.forEach(columnsLayout, function(count, layout){
                            $scope.layouts.push({
                                style: {maxWidth:Math.trunc(100/count)+'%'},
                                //maxWidth: Math.trunc(100/count)+'%',
                                columns: prepareColumns(count),
                                layout: layout,
                                visible: false
                                //isVisible: function(){return layout == 'any' ? true : $mdMedia(layout);}
                            })
                        });
                    
                        
                        function prepareColumns(columnsCount) {
                            var count = $scope.items.length;
                            var columns = [];
                            for (var col=1; col <= columnsCount; col++){
                                columns.push($scope.items.slice(Math.ceil(count/columnsCount*(col-1)),Math.ceil(count/columnsCount*col)));
                            }
                            return columns;
                        }
                        
                    }

                    // $scope.getPointStyles = function(item){
                    //     var selectedColor = item.selected || !$scope.selectable ? ($scope.selectedColor || item.color || item.chartColor) : null;
                    //     var highlightedColor = item.highlighted && $scope.highlightable ? ($scope.highlightedColor || item.color || item.chartColor) : null;
                      
                    //     if (selectedColor)
                    //         return  {'background-color': selectedColor};
                    //     else if (highlightedColor)
                    //         return  {'background-color': highlightedColor};
                    //     else 
                    //         return {'background-color': 'none'};
                    // };

                    $scope.getParam = function(param){
                      return $scope[param];
                    };


                    
                    $scope.itemClick = function(item){
                        //item.selected = !item.selected;
                        var newSelection = !item.selected;
                        if (newSelection && $scope.singleSelection){
                            angular.forEach($scope.items, function(item){
                                item.selected = false;
                            })
                        }
                        item.selected = newSelection;
                    };

                    $scope.highlightItem = function(item){
                        item.highlighted = true;
                    };
                    $scope.unhighlightItem = function(item){
                        item.highlighted = false;
                    };

                }]
        };
    }
}());