(function () {
    "use strict";
    /**
     * @desc
     */
    angular.module('SportsensusApp')
        .controller('involveGraphCrtl', involveGraphCrtl);

    involveGraphCrtl.$inject = [
        '$scope',
        '$controller',
        'ParamsSrv',
        'ApiSrv'
    ];

    function involveGraphCrtl(
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

        $scope.showCharts = false;

        function requestGraph() {
            var audience = ParamsSrv.getSelectedAudience();
            var sports = {};
            $scope.parameters.sport.lists.forEach(function (list) {
                sports[list.id] = {interested: true}
            });
            var involve = $scope.parameters.involve.lists.map(function (list) {
                return list.id;
            });
            var sportInvolve = { // все спорты и все интересы
                sport: sports, // ParamsSrv.getParams().sport //ParamsSrv.getSelectedParams('sport'),
                involve: involve // [1, 2, 3, 4, 5, 6, 7] // ParamsSrv.getSelectedParams('image')
            };
            ApiSrv.getInvolveGraph(audience, sportInvolve).then(function (graphData) {
                $scope.prepareData(graphData);
                $scope.updateGraph();
            }, function () {
            });
        }

        $scope.prepareLegends = function () {
            $scope.sportLegend = $scope.getSportLegend({color:'#555555'});
            $scope.involveLegend = $scope.getInvolveLegend();

            $scope.$watch('sportLegend', $scope.updateGraph, true);
            $scope.$watch('involveLegend', $scope.updateGraph, true);
        };



        $scope.prepareData = function (data) {

            var involves = {};
            $scope.parameters.involve.lists.forEach(function (list) {
                involves[list.id] = {
                    id: list.id,
                    name: list.name,
                    count: 0
                }
            });

            var sports = {};
            $scope.parameters.sport.lists.forEach(function (list) {
                sports[list.key] = angular.merge({
                    data: angular.merge({}, involves)
                }, list);
            });


            var legendIndexes = {};
            data.legends.forEach(function(item, index){
                legendIndexes[item.name] = index;
            });

            data.data.forEach(function (item) {
                var sportId = item.legend[legendIndexes['sport']];
                var involveId = item.legend[legendIndexes['involve']];
                sports[sportId].data[involveId].count += item.count;
            }, this);


            Object.keys(sports).forEach(function (sportId) { // цикл по спортам
                var sport = sports[sportId];

                Object.keys(sport.data).forEach(function (involveId) { // цикл по восприятиям
                    var value = sport.data[involveId].count / 1000 / 1000;
                    value = Math.round(value * 10) / 10;
                    sport.data[involveId].count = value;
                }, this);

            }, this);

            $scope.sportDatas = sports;

        };

        $scope.updateGraph = function () {
            if (!$scope.sportDatas) return;

            var sports = []; // selected sports
            $scope.sportLegend.forEach(function(sport) {
                if (!sport.selected) return;
                sports.push(sport);
            });

            //var useBars = true;
            //var showInterest = false;
            //var showNotInterest = false;
            var involves = [];
            //var interestsO = {};
            $scope.involveLegend.forEach(function(involve){
                if (!involve.selected) return;
                involves.push(involve);
                // interestsO[interest.id] = interest;
                // if (interest.id == 3) useBars = false;
                // if (interest.id < 3) showInterest = true;
                // if (interest.id > 3) showNotInterest = true;
            });



            var charts = [];
            sports.forEach(function(sport){
                // if (!sport.selected) return;
                //charts.push(sport);
                var chartData = {labels:[],datasets:[]};
                //useBars = true;
                // if (useBars){
                //     var twoCols = showInterest && showNotInterest;
                //     var interestDs = { label:[], fillColor:[], data:[] };
                //     var notInterestDs = { label:[], fillColor:[], data:[] };
                //
                //     [[interestsO[5],interestDs],[interestsO[1],interestDs],
                //         [interestsO[4],notInterestDs],[interestsO[2],notInterestDs]].forEach(function(item){
                //         if(item[0]){
                //             item[1].label.push(item[0].name);
                //             item[1].fillColor.push(item[0].color);
                //             item[1].data.push($scope.sportDatas[sport.key].data[item[0].id].count);
                //         } else if (twoCols){
                //             item[1].label.push('');
                //             item[1].fillColor.push('');
                //             item[1].data.push(0);
                //         }
                //     });
                //
                //     chartData.labels.push('');
                //     if (twoCols) chartData.labels.push('');
                //
                //     //chartData.datasets.push(interestDs);
                //     //chartData.datasets.push(notInterestDs);
                //
                //     if (interestDs.label.length) {
                //         //chartData.labels.push('');
                //         chartData.datasets.push(interestDs)
                //     }
                //     if (notInterestDs.label.length) {
                //         //chartData.labels.push('');
                //         chartData.datasets.push(notInterestDs)
                //     }
                // } else { // not use bars
                    var dataDs = { label:[], fillColor:[], data:[] };
                    var emptyDs = { label:[], fillColor:[], data:[] };

                    involves.forEach(function(involve){
                        dataDs.label.push(involve.name);
                        dataDs.fillColor.push(involve.color);
                        dataDs.data.push($scope.sportDatas[sport.key].data[involve.id].count);

                        emptyDs.label.push(involve.name);
                        emptyDs.fillColor.push(involve.color);
                        emptyDs.data.push(0);

                        chartData.labels.push('');
                    });

                    chartData.datasets.push(dataDs);
                    chartData.datasets.push(emptyDs);
                // }

                charts.push({
                    sport:sport,
                    chartData:{data:chartData, options:{showLabels:true}}
                })
            });

            $scope.showCharts = charts.length && involves.length;
            $scope.charts = charts;

            // Combine all sports in one graph
            var combineChart = {data:{labels:[], datasets:[]}, options:{}};
            combineChart.data.labels = sports.map(function(item){return item.name;});
            involves.forEach(function(involve){
                var ds = { label:[], fillColor:[], data:[] };
                sports.forEach(function(sport) {
                    ds.label.push(involve.name);//item[0].name);
                    ds.fillColor.push(involve.color);
                    ds.data.push($scope.sportDatas[sport.key].data[involve.id].count);

                });
                combineChart.data.datasets.push(ds);
            });
            $scope.combineChart = (combineChart.data.labels.length > 1 ? combineChart : null);


        };

    }

}());
