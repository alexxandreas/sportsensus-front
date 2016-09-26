(function () {
    "use strict";
    /**
     * @desc
     */
    angular.module('SportsensusApp')
        .controller('interestGraphCrtl', interestGraphCrtl);

    interestGraphCrtl.$inject = [
        '$scope',
        '$controller',
        'ParamsSrv',
        'ApiSrv'
    ];

    function interestGraphCrtl(
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
            var interests = $scope.parameters.interest.lists.map(function (list) {
                return list.id;
            });
            var sportinterest = { // все спорты и все интересы
                sport: sports, // ParamsSrv.getParams().sport //ParamsSrv.getSelectedParams('sport'),
                interest: interests // [1, 2, 3, 4, 5, 6, 7] // ParamsSrv.getSelectedParams('image')
            };
            ApiSrv.getInterestGraph(audience, sportinterest).then(function (graphData) {
                $scope.prepareData(graphData);
                $scope.updateGraph();
            }, function () {
            });
        }

        $scope.prepareLegends = function () {
            $scope.sportLegend = $scope.getSportLegend({color:'#555555'});
            $scope.interestLegend = $scope.getInterestLegend();
            
            $scope.$watch('sportLegend', $scope.updateGraph, true);
            $scope.$watch('interestLegend', $scope.updateGraph, true);
        };
        
        // $scope.legend = [];
        // $scope.prepareLegends = function () {
        //     var selected = false;
        //     var sportLegend = $scope.parameters.sport.lists.map(function (list) {
        //         selected = selected || list.interested;
        //         return {
        //             id: list.id,
        //             key: list.key,
        //             name: list.name,
        //             color: '#555555',//list.chartColor,
        //             selected: list.interested
        //         };
        //     });
        //     if (!selected) sportLegend.forEach(function(item){item.selected = true;});
        //
        //     var interestLegend = $scope.parameters.interest.lists.map(function (list) {
        //         selected = selected || list.selected;
        //         return {
        //             id: list.id,
        //             name: list.name,
        //             color: list.chartColor,
        //             selected: list.selected
        //         };
        //     }).reverse();
        //     if (!selected) interestLegend.forEach(function(item){item.selected = true;});
        //
        //     $scope.sportLegend = sportLegend;
        //     $scope.$watch('sportLegend', $scope.updateGraph, true);
        //
        //     $scope.interestLegend = interestLegend;
        //     $scope.$watch('interestLegend', $scope.updateGraph, true);
        //
        //
        // };

        $scope.prepareData = function (data) {

            var interests = {};
            $scope.parameters.interest.lists.forEach(function (list) {
                interests[list.id] = {
                    id: list.id,
                    name: list.name,
                    count: 0
                }
            });
            
            var sports = {};
            $scope.parameters.sport.lists.forEach(function (list) {
                sports[list.key] = angular.merge({
                    data: angular.merge({}, interests)
                }, list);
            });


            var legendIndexes = {};
            data.legends.forEach(function(item, index){
                legendIndexes[item.name] = index;
            });

            data.data.forEach(function (item) {
                var sportId = item.legend[legendIndexes['sport']];
                var interestId = item.legend[legendIndexes['sportinterest']];
                sports[sportId].data[interestId].count += item.count;
            }, this);

            
            Object.keys(sports).forEach(function (sportId) { // цикл по спортам
                var sport = sports[sportId];
                
                Object.keys(sport.data).forEach(function (imageId) { // цикл по восприятиям
                    var value = sport.data[imageId].count / 1000 / 1000;
                    value = Math.round(value * 10) / 10;
                    sport.data[imageId].count = value;
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
            
            
            var useBars = true;
            var showInterest = false;
            var showNotInterest = false;
            var interests = []; // selected interests
            var interestsO = {};
            $scope.interestLegend.forEach(function(interest){
                if (!interest.selected) return;
                interests.push(interest);
                interestsO[interest.id] = interest;
                if (interest.id == 3) useBars = false;
                if (interest.id < 3) showInterest = true;
                if (interest.id > 3) showNotInterest = true;
            });



            var charts = [];
            sports.forEach(function(sport){
                //charts.push(sport);
                var chartData = {labels:[],datasets:[]};
                //useBars = true;
                if (useBars){
                    var twoCols = showInterest && showNotInterest;
                    var interestDs = { label:[], fillColor:[], data:[] };
                    var notInterestDs = { label:[], fillColor:[], data:[] };

                    [[interestsO[5],interestDs],[interestsO[1],interestDs],
                     [interestsO[4],notInterestDs],[interestsO[2],notInterestDs]].forEach(function(item){
                        if(item[0]){
                            item[1].label.push(item[0].name);
                            item[1].fillColor.push(item[0].color);
                            item[1].data.push($scope.sportDatas[sport.key].data[item[0].id].count);
                        } else if (twoCols){
                            item[1].label.push('');
                            item[1].fillColor.push('');
                            item[1].data.push(0);
                        }
                    });

                    chartData.labels.push('');
                    if (twoCols) chartData.labels.push('');

                    //chartData.datasets.push(interestDs);
                    //chartData.datasets.push(notInterestDs);

                    if (interestDs.label.length) {
                        //chartData.labels.push('');
                        chartData.datasets.push(interestDs)
                    }
                    if (notInterestDs.label.length) {
                        //chartData.labels.push('');
                        chartData.datasets.push(notInterestDs)
                    }
                } else { // not use bars
                    var dataDs = { label:[], fillColor:[], data:[] };
                    var emptyDs = { label:[], fillColor:[], data:[] };

                    interests.forEach(function(interest){
                        dataDs.label.push(interest.name);
                        dataDs.fillColor.push(interest.color);
                        dataDs.data.push($scope.sportDatas[sport.key].data[interest.id].count);

                        emptyDs.label.push(interest.name);
                        emptyDs.fillColor.push(interest.color);
                        emptyDs.data.push(0);

                        chartData.labels.push('');
                    });

                    chartData.datasets.push(dataDs);
                    chartData.datasets.push(emptyDs);
                }

                charts.push({
                    sport:sport,
                    chartData:{data:chartData, options:{showLabels: !useBars}},
                })
            });

            $scope.showCharts = charts.length && interests.length;
            $scope.charts = charts;


            // Combine all sports in one graph
            var combineChart = {data:{labels:[], datasets:[]}, options:{}};
            combineChart.data.labels = sports.map(function(item){return item.name.replace(' ','\n');});
            
            interests.forEach(function(interest){
                var ds = { label:[], fillColor:[], data:[] };

                sports.forEach(function(sport) {
                    ds.label.push(interest.name);//item[0].name);
                    ds.fillColor.push(interest.color);
                    ds.data.push($scope.sportDatas[sport.key].data[interest.id].count);
                });
                combineChart.data.datasets.push(ds);
            });
            $scope.combineChart = (combineChart.data.labels.length > 1 ? combineChart : null);


        };

    }

}());
