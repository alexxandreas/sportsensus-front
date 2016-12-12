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
        'ApiSrv',
        'graphHelpersSrv'
    ];

    function imageGraphCrtl(
        $scope,
        $controller,
        ParamsSrv,
        ApiSrv,
        graphHelpersSrv
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
                sports[list.key] = {interested: true}
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
            $scope.sportLegend = graphHelpersSrv.getSportLegend();
            $scope.imageLegend = graphHelpersSrv.getImageLegend();
            $scope.$watch('sportLegend', $scope.updateGraph, true);
        };


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
                sports[list.id] = angular.merge({
                    data: angular.merge({}, images)
                }, list);
            });

            var legendIndexes = {};
            data.legends.forEach(function(item, index){
                legendIndexes[item.name] = index;
            });
            var maxValue = 0;
            data.data.forEach(function (item) {
                var sportId = item.legend[legendIndexes['sport']];
                var imageId = item.legend[legendIndexes['image']];
                sports[sportId].data[imageId].count += item.count;
                maxValue = Math.max(maxValue, sports[sportId].data[imageId].count);
            }, this);
            var multiplier = maxValue > 1000*1000 ? 1000*1000 : maxValue > 1000 ? 1000 : 1;

            // $scope.sportDatas = {};
            $scope.chartsData = {
                multiplier: multiplier,
                maxValue: maxValue,
                sports: sports
            };



        };

        $scope.updateGraph = function () {
            if (!$scope.chartsData) return;

            var sports = $scope.sportLegend.filter(function(item) {
                return item.selected;
            });

            var images = $scope.imageLegend;
            // var image = $scope.imageLegend.filter(function(item) {
            //     return item.selected;
            // });




            
            var chartData = [];
            var localColors = [];
            var maxValue = 0;
            //$scope.sportLegend.forEach(function (item) {
                //if (!item.selected) return;
            sports.forEach(function(sport){
                //var maxValue = 0;
                var axisData = [];
                var data = $scope.chartsData.sports[sport.id].data;
                images.forEach(function(image){
                //Object.keys(images).forEach(function (imageId) { // цикл по восприятиям
                    // var value = sport.data[imageId].count / 1000 / 1000;
                    var value = $scope.chartsData.sports[sport.id].data[image.id].count;
                    //var value = sport.data[imageId].count;
                    //value = Math.round(value * 10) / 10;
                    //axisData.push({axis: images[imageId].name, value: value});
                    axisData.push({
                        axis: image.name, 
                        value: value, 
                        tooltip: sport.name + ': ' + image.name + ': ' + value.toLocaleString('en-US'),
                        tooltipColor: sport.color
                    });
                    maxValue = Math.max(maxValue, value);
                }, this);
                //graph.push(axisData);
                //localColors.push(sport.chartColor);

                // var sportData = {
                //     axisData: axisData,
                //     maxValue: maxValue
                // };
                // $scope.sportDatas[sport.id] = sportData;

                //chartData.push($scope.sportDatas[item.id].axisData);
                chartData.push(axisData);
                localColors.push(sport.color);
                //maxValue = Math.max(maxValue, $scope.sportDatas[item.id].maxValue);
            });

            // округляем до 5 в большую сторону
            //maxValue = Math.ceil(maxValue / 5) * 5;
            var multiplier = 1;
            while (maxValue > 100){
                multiplier *= 10;
                maxValue /= 10;
            }
            maxValue = Math.ceil(maxValue / 5) * 5 * multiplier;

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
                format: $scope.formatValue,
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
