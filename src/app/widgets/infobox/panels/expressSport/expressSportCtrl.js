(function () {
    "use strict";
    /**
     * @desc
     */
    angular.module('SportsensusApp')
        .controller('expressSportCtrl', expressSportCtrl);

    expressSportCtrl.$inject = [
        '$scope',
        '$controller',
        'ParamsSrv',
        'ApiSrv'
    ];

    function expressSportCtrl(
        $scope,
        $controller,
        ParamsSrv,
        ApiSrv
    ) {

        $controller('baseGraphCtrl', {$scope: $scope});
        
        ParamsSrv.getParams().then(function (params) {
            $scope.parameters = params;
            $scope.prepareLegends();
            // requestData();
            //requestData($scope.sportLegend[0]);
        });

        $scope.sportDatas = {};
        
        function requestData(sport) { // sport from legend
            var audience = ParamsSrv.getSelectedAudience();
            var clubs = sport.clubs ? sport.clubs.filter(function(club){return club.selected;}).map(function(club){return club.id; }) : [];
            


            //
            // var sports = {};
            // $scope.parameters.sport.lists.forEach(function (list) {
            //     sports[list.id] = {interested: true}
            // });
            // var images = $scope.parameters.image.lists.map(function (list) {
            //     return list.id;
            // });
            // var sportimage = { // все спорты и все интересы
            //     sport: sports, // ParamsSrv.getParams().sport //ParamsSrv.getSelectedParams('sport'),
            //     image: images // [1, 2, 3, 4, 5, 6, 7] // ParamsSrv.getSelectedParams('image')
            // };
            ApiSrv.getExpressSport(audience, sport.key, clubs).then(function (data) {

                $scope.sportDatas[sport.key] = data;
                var a = data;
                //$scope.prepareData(graphData);
                //$scope.updateGraph();
            }, function () {
            });
        }

        $scope.prepareLegends = function () {
            $scope.sportLegend = $scope.getSportLegend({color:'#555555', clubs:true, selectAll:false});
            //    .filter(function(sport){return !!sport.clubs;});

            $scope.sportLegend.forEach(function(sport){
                $scope.$watch(function(){return sport;}, function(sport, oldValue){
                    if (sport.selected){
                        requestData(sport);
                    } else {
                        $scope.sportDatas[sport.key] = null;
                    }
                }, true);
            });

            //$scope.$watch('sportLegend', $scope.updateGraph, true);
        };

        $scope.checkSport = function(item){
            item.selected = !item.selected;
        };

/*

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




            /!*Object.keys(sports).forEach(function (sportId) { // цикл по спортам
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
             *!/

            var chartData = [];
            var localColors = [];
            var maxValue = 0;
            //$scope.sportLegend.forEach(function (item) {
            //if (!item.selected) return;
            sports.forEach(function(sport){
                //var maxValue = 0;
                var axisData = [];
                var data = $scope.chartsData.sports[sport.key].data;
                images.forEach(function(image){
                    //Object.keys(images).forEach(function (imageId) { // цикл по восприятиям
                    // var value = sport.data[imageId].count / 1000 / 1000;
                    var value = $scope.chartsData.sports[sport.key].data[image.id].count;
                    //var value = sport.data[imageId].count;
                    //value = Math.round(value * 10) / 10;
                    //axisData.push({axis: images[imageId].name, value: value});
                    axisData.push({axis: image.name, value: value});
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
*/

    }

}());
