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
                var result = {
                    id: list.id,
                    name: list.name,
                    key: list.key,
                    color: options.color ? options.color : list.chartColor,
                    selected: list.interested
                };
                if (options.clubs){
                    var clubsObj = list.lists.filter(function(child){return child.id == 'clubs';});
                    if (clubsObj.length){
                        var clubs = clubsObj[0].lists.map(function(list){
                            return {
                                id: list.id,
                                name: list.name,
                                color: options.color ? options.color : list.chartColor,
                                selected: list.selected
                            }
                        });
                        result.clubs = clubs;
                    }

                }
                return result;
            });
            if (!selected && options.selectAll !== false) legend.forEach(function(item){item.selected = true;});
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
        
        $scope.getImageLegend = function(options){
            options = options || {};
            var selected = false;
            var legend = $scope.parameters.image.lists.map(function (list) {
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


        
    }
}());
