(function () {
    "use strict";
    /**
     * @desc
     */
    angular.module('SportsensusApp')
        .controller('imageGraphCrtl', imageGraphCrtl);

    imageGraphCrtl.$inject = [
        '$scope',
        '$controller',
        'ParamsSrv',
        'ApiSrv'
    ];

    function imageGraphCrtl(
        $scope,
        $controller,
        ParamsSrv,
        ApiSrv
    ) {

        $controller('baseGraphCtrl', {$scope: $scope});
        
        ParamsSrv.getParams().then(function (params) {
            $scope.parameters = params;
            $scope.prepareLegends();
            requestGraph();
        });

        function requestGraph() {
            var audience = ParamsSrv.getSelectedAudience();
            var sports = {};
            $scope.parameters.sport.lists.forEach(function (list) {
                sports[list.id] = {interested: true}
            });
            var images = $scope.parameters.image.lists.map(function (list) {
                return list.id;
            });
            var sportimage = { // все спорты и все интересы
                sport: sports, // ParamsSrv.getParams().sport //ParamsSrv.getSelectedParams('sport'),
                image: images // [1, 2, 3, 4, 5, 6, 7] // ParamsSrv.getSelectedParams('image')
            };
            ApiSrv.getImageGraph(audience, sportimage).then(function (graphData) {
                $scope.prepareData(graphData);
                $scope.updateGraph();
            }, function () {
            });
        }

        $scope.prepareLegends = function () {
            $scope.sportLegend = $scope.getSportLegend();
            $scope.$watch('sportLegend', $scope.updateGraph, true);
        };


        // $scope.legend = [];
        // $scope.prepareLegend = function () {
        //     var selected = false;
        //     var legend = $scope.parameters.sport.lists.map(function (list) {
        //         selected = selected || list.interested;
        //         return {
        //             id: list.id,
        //             name: list.name,
        //             color: list.chartColor,
        //             selected: list.interested
        //         };
        //     });
        //     if (!selected) legend.forEach(function(item){item.selected = true;});
        //     $scope.legend = legend;
        //     $scope.$watch('legend', $scope.updateGraph, true);
        // };

        $scope.prepareData = function (data) {
            var images = {};
            $scope.parameters.image.lists.forEach(function (list) {
                images[list.id] = {
                    id: list.id,
                    name: list.name,
                    count: 0
                }
            });

            var sports = {};
            $scope.parameters.sport.lists.forEach(function (list) {
                sports[list.key] = angular.merge({
                    data: angular.merge({}, images)
                }, list);
            });

            var legendIndexes = {};
            data.legends.forEach(function(item, index){
                legendIndexes[item.name] = index;
            });
            data.data.forEach(function (item) {
                var sportId = item.legend[legendIndexes['sport']];
                var imageId = item.legend[legendIndexes['image']];
                sports[sportId].data[imageId].count += item.count;
            }, this);


            $scope.sportDatas = {};

            Object.keys(sports).forEach(function (sportId) { // цикл по спортам
                var sport = sports[sportId];
                var maxValue = 0;
                var axisData = [];
                Object.keys(sport.data).forEach(function (imageId) { // цикл по восприятиям
                    var value = sport.data[imageId].count / 1000 / 1000;
                    value = Math.round(value * 10) / 10;
                    axisData.push({axis: images[imageId].name, value: value});
                    maxValue = Math.max(maxValue, value);
                }, this);
                //graph.push(axisData);
                //localColors.push(sport.chartColor);

                var sportData = {
                    axisData: axisData,
                    maxValue: maxValue
                };
                $scope.sportDatas[sport.id] = sportData;
            }, this);

        };

        $scope.updateGraph = function () {
            if (!$scope.sportDatas) return;
            
            var chartData = [];
            var localColors = [];
            var maxValue = 0;
            $scope.sportLegend.forEach(function (item) {
                if (!item.selected) return;
                chartData.push($scope.sportDatas[item.id].axisData);
                localColors.push(item.color);
                maxValue = Math.max(maxValue, $scope.sportDatas[item.id].maxValue);
            });

            // округляем до 5 в большую сторону
            maxValue = Math.ceil(maxValue / 5) * 5;

            var radarChartOptions = {
                //w: width,
                //h: height,
                //margin: margin,
                maxValue: maxValue,
                levels: 5,
                wrapWidth: 100,
                labelFactor: 1.32,
                roundStrokes: true,
                //color: color
                color: function (i) {
                    return localColors[i];
                }
            };

            if (chartData && chartData.length)
                $scope.chart = {data: chartData, options: radarChartOptions};
            else $scope.chart = null;
        };

    }

}());
