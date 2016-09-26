(function () {
    "use strict";
    /**
     * @desc
     */
    angular.module('SportsensusApp')
        .controller('baseGraphCtrl', baseGraphCtrl);

    baseGraphCtrl.$inject = [
        '$scope',
        '$rootScope'
    ];

    function baseGraphCtrl($scope,
                          $rootScope)
    {
        
        $scope.getSportLegend = function (options) {
            options = options || {};
            var selected = false;
            var legend = $scope.parameters.sport.lists.map(function (list) {
                selected = selected || list.interested;
                return {
                    id: list.id,
                    name: list.name,
                    key: list.key,
                    color: options.color ? options.color : list.chartColor,
                    selected: list.interested
                };
            });
            if (!selected) legend.forEach(function(item){item.selected = true;});
            return legend;
        };
        
        $scope.getInterestLegend = function(options){
            options = options || {};
            var selected = false;
            var legend = $scope.parameters.interest.lists.map(function (list) {
                selected = selected || list.selected;
                return {
                    id: list.id,
                    name: list.name,
                    color: options.color ? options.color : list.chartColor,
                    selected: list.selected
                };
            }).reverse();
            if (!selected) legend.forEach(function(item){item.selected = true;});
            return legend;
        };
        
        $scope.getInvolveLegend = function(options){
            options = options || {};
            var selected = false;
            var legend = $scope.parameters.involve.lists.map(function (list) {
                selected = selected || list.selected;
                return {
                    id: list.id,
                    name: list.name,
                    color: options.color ? options.color : list.chartColor,
                    selected: list.selected
                };
            });//.reverse();
            if (!selected) legend.forEach(function(item){item.selected = true;});
            return legend;
        }


        
    }
}());
